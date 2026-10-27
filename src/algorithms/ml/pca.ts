import type { AlgorithmStep } from '../../types/algorithm';
import type { PCAPointData } from '../../types/ml';
import { pcaSampleDatasets } from '../../utils/ml/datasets';

export interface PCAConfig {
  k?: number;
  standardize?: boolean;
  featureNames?: string[];
  maxJacobiIterations?: number;
}

// ── Pure Mathematical Functions ──────────────────────────────────────────────

/**
 * Calculates arithmetic mean of each column/feature: μⱼ = (1/n) Σᵢ xᵢⱼ
 */
export function computeFeatureMeans(matrix: number[][]): number[] {
  const n = matrix.length;
  if (n === 0) return [];
  const d = matrix[0].length;
  const means = new Array<number>(d).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) {
      means[j] += matrix[i][j];
    }
  }
  for (let j = 0; j < d; j++) {
    means[j] /= n;
  }
  return means;
}

/**
 * Calculates sample standard deviations: sⱼ = sqrt( 1/(n-1) Σ (xᵢⱼ - μⱼ)² )
 */
export function computeFeatureStdDevs(matrix: number[][], means: number[]): number[] {
  const n = matrix.length;
  if (n < 2) return means.map(() => 1);
  const d = matrix[0].length;
  const stds = new Array<number>(d).fill(0);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) {
      const diff = matrix[i][j] - means[j];
      stds[j] += diff * diff;
    }
  }
  for (let j = 0; j < d; j++) {
    stds[j] = Math.sqrt(stds[j] / (n - 1));
  }
  return stds;
}

/**
 * Centers (and optionally standardizes) data matrix: zᵢⱼ = (xᵢⱼ - μⱼ) / sⱼ
 */
export function centerMatrix(
  matrix: number[][],
  means: number[],
  stdDevs?: number[]
): number[][] {
  const n = matrix.length;
  if (n === 0) return [];
  const d = matrix[0].length;
  const centered: number[][] = [];

  for (let i = 0; i < n; i++) {
    const row = new Array<number>(d);
    for (let j = 0; j < d; j++) {
      const z = matrix[i][j] - means[j];
      if (stdDevs && stdDevs[j] > 1e-12) {
        row[j] = z / stdDevs[j];
      } else {
        row[j] = z;
      }
    }
    centered.push(row);
  }
  return centered;
}

/**
 * Calculates sample covariance matrix: Σ = (1 / (n - 1)) * ZᵀZ
 */
export function computeCovarianceMatrix(centered: number[][]): number[][] {
  const n = centered.length;
  if (n < 2) return [];
  const d = centered[0].length;
  const cov: number[][] = Array.from({ length: d }, () => new Array<number>(d).fill(0));

  for (let j = 0; j < d; j++) {
    for (let l = j; l < d; l++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += centered[i][j] * centered[i][l];
      }
      const val = sum / (n - 1);
      cov[j][l] = val;
      cov[l][j] = val; // Covariance matrix is symmetric: Σⱼₗ = Σₗⱼ
    }
  }
  return cov;
}

export interface JacobiResult {
  eigenvalues: number[];
  eigenvectors: number[][]; // column j is eigenvector j: eigenvectors[row][col]
  iterations: number;
  converged: boolean;
  history?: { iteration: number; p: number; q: number; theta: number; offDiagMax: number }[];
}

/**
 * Classical Jacobi Eigenvalue Algorithm for real symmetric d x d matrix.
 * Solves: A * v = λ * v
 */
export function jacobiEigenvalueAlgorithm(
  matrix: number[][],
  maxIter = 100,
  tol = 1e-10,
  recordHistory = false
): JacobiResult {
  const d = matrix.length;
  if (d === 0) {
    return { eigenvalues: [], eigenvectors: [], iterations: 0, converged: true };
  }
  if (d === 1) {
    return {
      eigenvalues: [matrix[0][0]],
      eigenvectors: [[1.0]],
      iterations: 0,
      converged: true,
    };
  }

  // Clone symmetric matrix A
  const A: number[][] = matrix.map(row => [...row]);
  // Initialize V as identity matrix I_d
  const V: number[][] = Array.from({ length: d }, (_, r) =>
    Array.from({ length: d }, (_, c) => (r === c ? 1.0 : 0.0))
  );

  const history: NonNullable<JacobiResult['history']> = [];
  let iter = 0;
  const totalMaxIter = maxIter * d * d;

  while (iter < totalMaxIter) {
    // Find off-diagonal element of largest magnitude
    let maxVal = 0;
    let p = 0;
    let q = 1;

    for (let i = 0; i < d; i++) {
      for (let j = i + 1; j < d; j++) {
        const absVal = Math.abs(A[i][j]);
        if (absVal > maxVal) {
          maxVal = absVal;
          p = i;
          q = j;
        }
      }
    }

    if (maxVal < tol) {
      break; // Converged
    }

    iter++;

    // Compute Jacobi rotation parameters
    const app = A[p][p];
    const aqq = A[q][q];
    const apq = A[p][q];

    const tau = (aqq - app) / (2.0 * apq);
    let t: number;
    if (tau >= 0) {
      t = 1.0 / (tau + Math.sqrt(1.0 + tau * tau));
    } else {
      t = -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
    }

    const c = 1.0 / Math.sqrt(1.0 + t * t);
    const s = t * c;
    const theta = Math.atan2(s, c);

    if (recordHistory && iter <= 20) {
      history.push({ iteration: iter, p, q, theta, offDiagMax: maxVal });
    }

    // Apply Jacobi orthogonal similarity transformation: A' = Jᵀ * A * J
    A[p][p] = c * c * app - 2.0 * s * c * apq + s * s * aqq;
    A[q][q] = s * s * app + 2.0 * s * c * apq + c * c * aqq;
    A[p][q] = 0.0;
    A[q][p] = 0.0;

    for (let k = 0; k < d; k++) {
      if (k !== p && k !== q) {
        const akp = A[k][p];
        const akq = A[k][q];
        A[k][p] = c * akp - s * akq;
        A[p][k] = A[k][p];
        A[k][q] = s * akp + c * akq;
        A[q][k] = A[k][q];
      }
    }

    // Accumulate orthogonal transformations in eigenvector matrix V: V' = V * J
    for (let k = 0; k < d; k++) {
      const vkp = V[k][p];
      const vkq = V[k][q];
      V[k][p] = c * vkp - s * vkq;
      V[k][q] = s * vkp + c * vkq;
    }
  }

  const converged = iter < totalMaxIter;

  // Extract eigenvalues from diagonal and clamp tiny negative values within tolerance
  const rawEigenvalues = new Array<number>(d);
  for (let i = 0; i < d; i++) {
    let val = A[i][i];
    // Clamp tiny numerical roundoff errors: -1e-9 < val < 0 => 0
    if (val < 0 && val > -1e-9) {
      val = 0.0;
    }
    rawEigenvalues[i] = val;
  }

  // Create indexed components for sorting in descending eigenvalue order
  const indices = Array.from({ length: d }, (_, i) => i);
  indices.sort((a, b) => rawEigenvalues[b] - rawEigenvalues[a]);

  const sortedEigenvalues = new Array<number>(d);
  const sortedEigenvectors = Array.from({ length: d }, () => new Array<number>(d).fill(0));

  for (let newCol = 0; newCol < d; newCol++) {
    const origCol = indices[newCol];
    sortedEigenvalues[newCol] = rawEigenvalues[origCol];

    // Copy eigenvector column
    for (let row = 0; row < d; row++) {
      sortedEigenvectors[row][newCol] = V[row][origCol];
    }

    // Deterministic sign convention: make the largest magnitude entry positive
    let maxIdx = 0;
    let maxAbs = 0;
    for (let row = 0; row < d; row++) {
      const absVal = Math.abs(sortedEigenvectors[row][newCol]);
      if (absVal > maxAbs) {
        maxAbs = absVal;
        maxIdx = row;
      }
    }
    if (sortedEigenvectors[maxIdx][newCol] < 0) {
      for (let row = 0; row < d; row++) {
        sortedEigenvectors[row][newCol] = -sortedEigenvectors[row][newCol];
      }
    }
  }

  return {
    eigenvalues: sortedEigenvalues,
    eigenvectors: sortedEigenvectors,
    iterations: iter,
    converged,
    history: recordHistory ? history : undefined,
  };
}

/**
 * Calculates explained variance ratios and cumulative explained variance.
 */
export function computeExplainedVariance(eigenvalues: number[]): {
  ratios: number[];
  cumulative: number[];
  totalVariance: number;
} {
  const d = eigenvalues.length;
  const totalVariance = eigenvalues.reduce((sum, v) => sum + (v > 0 ? v : 0), 0);

  if (totalVariance <= 1e-12) {
    return {
      ratios: new Array<number>(d).fill(0),
      cumulative: new Array<number>(d).fill(0),
      totalVariance: 0,
    };
  }

  const ratios = eigenvalues.map(v => (v > 0 ? v / totalVariance : 0));
  const cumulative = new Array<number>(d).fill(0);
  let running = 0;
  for (let i = 0; i < d; i++) {
    running += ratios[i];
    cumulative[i] = Math.min(1.0, running);
  }

  return { ratios, cumulative, totalVariance };
}

/**
 * Projects centered matrix into k principal component space: T = Z * V_k
 */
export function projectMatrix(
  centered: number[][],
  eigenvectors: number[][],
  k: number
): number[][] {
  const n = centered.length;
  if (n === 0) return [];
  const d = centered[0].length;
  const numComponents = Math.max(1, Math.min(d, k));

  const projected: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(numComponents);
    for (let comp = 0; comp < numComponents; comp++) {
      let sum = 0;
      for (let j = 0; j < d; j++) {
        sum += centered[i][j] * eigenvectors[j][comp];
      }
      row[comp] = sum;
    }
    projected.push(row);
  }
  return projected;
}

/**
 * Reconstructs samples using k principal components: X̂ = T * V_kᵀ + μ
 */
export function reconstructMatrix(
  projected: number[][],
  eigenvectors: number[][],
  means: number[],
  k: number,
  stdDevs?: number[]
): number[][] {
  const n = projected.length;
  if (n === 0) return [];
  const d = means.length;
  const numComponents = Math.max(1, Math.min(d, k));

  const reconstructed: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array<number>(d);
    for (let j = 0; j < d; j++) {
      let zHat = 0;
      for (let comp = 0; comp < numComponents; comp++) {
        zHat += projected[i][comp] * eigenvectors[j][comp];
      }
      // Un-standardize if applicable, and un-center
      if (stdDevs && stdDevs[j] > 1e-12) {
        row[j] = zHat * stdDevs[j] + means[j];
      } else {
        row[j] = zHat + means[j];
      }
    }
    reconstructed.push(row);
  }
  return reconstructed;
}

/**
 * Calculates Mean Squared Reconstruction Error: MSE = (1 / (n * d)) * Σ (x_ij - x̂_ij)²
 */
export function computeReconstructionError(
  original: number[][],
  reconstructed: number[][]
): number {
  const n = original.length;
  if (n === 0) return 0;
  const d = original[0].length;
  if (d === 0) return 0;

  let totalSqErr = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < d; j++) {
      const diff = original[i][j] - reconstructed[i][j];
      totalSqErr += diff * diff;
    }
  }
  return totalSqErr / (n * d);
}

// ── Main Step Generator ──────────────────────────────────────────────────────

export function runPCA(
  customMatrix?: number[][],
  config?: PCAConfig
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const rawData: number[][] = customMatrix !== undefined
    ? customMatrix.map(row => [...row])
    : pcaSampleDatasets[0].rawMatrix !== undefined
      ? pcaSampleDatasets[0].rawMatrix.map(row => [...row])
      : pcaSampleDatasets[0].points.map(p => [p.x, p.y]);

  const n = rawData.length;
  const d = n > 0 ? rawData[0].length : 0;
  const defaultFeatureNames = d === 2 ? ['Feature X₁', 'Feature X₂'] : Array.from({ length: d }, (_, i) => `Feature X${i + 1}`);
  const featureNames = config?.featureNames && config.featureNames.length === d ? config.featureNames : defaultFeatureNames;
  const standardize = config?.standardize ?? false;
  const requestedK = config?.k ?? Math.min(2, Math.max(1, d));

  // Validation 1: Empty dataset or empty row
  if (n === 0 || d === 0) {
    steps.push({
      data: {
        type: 'pca',
        stage: 'input',
        points: [],
        featureNames: [],
        means: [],
        standardized: false,
        eigenvalues: [],
        eigenvectors: [],
        explainedVarianceRatios: [],
        cumulativeVarianceRatios: [],
        k: 1,
      },
      description: 'PCA requires a non-empty rectangular numeric matrix with at least 2 samples and 1 feature.',
      highlightLines: [0],
      operation: 'Invalid Dataset',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Validation 2: Sample count requirement for sample covariance (n >= 2)
  if (n < 2) {
    steps.push({
      data: {
        type: 'pca',
        stage: 'input',
        points: rawData.map((row, idx) => ({ id: idx, original: row, centered: row })),
        featureNames,
        means: rawData[0],
        standardized: false,
        eigenvalues: [],
        eigenvectors: [],
        explainedVarianceRatios: [],
        cumulativeVarianceRatios: [],
        k: 1,
      },
      description: `Sample covariance requires at least 2 samples to compute an unbiased estimate with denominator (n - 1). Provided dataset contains only ${n} sample.`,
      highlightLines: [0],
      operation: 'Insufficient Samples',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Validation 3: Ragged rows check
  const isRagged = rawData.some(row => row.length !== d);
  if (isRagged) {
    steps.push({
      data: {
        type: 'pca',
        stage: 'input',
        points: [],
        featureNames,
        means: [],
        standardized: false,
        eigenvalues: [],
        eigenvectors: [],
        explainedVarianceRatios: [],
        cumulativeVarianceRatios: [],
        k: 1,
      },
      description: 'Dataset contains ragged rows: all observation samples must have the exact same number of feature dimensions.',
      highlightLines: [0],
      operation: 'Ragged Matrix Error',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Validation 4: Non-finite values check
  const hasInvalid = rawData.some(row => row.some(val => !isFinite(val) || isNaN(val)));
  if (hasInvalid) {
    steps.push({
      data: {
        type: 'pca',
        stage: 'input',
        points: [],
        featureNames,
        means: [],
        standardized: false,
        eigenvalues: [],
        eigenvectors: [],
        explainedVarianceRatios: [],
        cumulativeVarianceRatios: [],
        k: 1,
      },
      description: 'Dataset contains invalid, NaN, or non-finite numerical coordinates.',
      highlightLines: [0],
      operation: 'Invalid Coordinates',
      phase: 'Dataset Error',
    });
    return steps;
  }

  const k = Math.max(1, Math.min(d, requestedK));

  // Step 1: Input Dataset Overview
  const means = computeFeatureMeans(rawData);
  const stdDevs = computeFeatureStdDevs(rawData, means);
  const initialPoints: PCAPointData[] = rawData.map((row, idx) => ({
    id: idx,
    original: row,
    centered: row, // not centered yet
  }));

  steps.push({
    data: {
      type: 'pca',
      stage: 'input',
      points: initialPoints,
      featureNames,
      means,
      stdDevs,
      standardized: standardize,
      eigenvalues: [],
      eigenvectors: [],
      explainedVarianceRatios: [],
      cumulativeVarianceRatios: [],
      k,
    },
    description: `Loaded input dataset of ${n} observations across ${d} feature dimensions. Target components to retain: k = ${k}.`,
    highlightLines: [0, 1],
    operation: 'Dataset Ingestion',
    phase: 'Input Stage',
    auxiliary: [
      { label: 'Samples (n)', value: n },
      { label: 'Features (d)', value: d },
      { label: 'Target Components (k)', value: k },
      { label: 'Standardize', value: standardize ? 'Yes' : 'No' },
    ],
    lineExplanation: 'load_dataset(X); validate rectangular matrix of dimensions n x d',
  });

  // Step 2: Feature Centering (μ_j = 1/n Σ x_ij, Z = X - μ)
  const centeredData = centerMatrix(rawData, means, standardize ? stdDevs : undefined);
  const centeredPoints: PCAPointData[] = rawData.map((row, idx) => ({
    id: idx,
    original: row,
    centered: centeredData[idx],
  }));

  const meansFormatted = means.map(m => m.toFixed(2)).join(', ');
  steps.push({
    data: {
      type: 'pca',
      stage: 'centering',
      points: centeredPoints,
      featureNames,
      means,
      stdDevs,
      standardized: standardize,
      eigenvalues: [],
      eigenvectors: [],
      explainedVarianceRatios: [],
      cumulativeVarianceRatios: [],
      k,
    },
    description: `Computed empirical feature means: μ = [${meansFormatted}]. Subtracted means from each observation to center data at the coordinate origin (0, 0). Centering ensures principal axes pass through the centroid.`,
    highlightLines: [2, 3],
    operation: 'Feature Centering',
    phase: 'Centering Stage',
    auxiliary: [
      { label: 'Means', value: `[${meansFormatted}]` },
      { label: 'Centered Centroid', value: '[0.00, 0.00]' },
    ],
    lineExplanation: 'mu := column_means(X); Z := X - mu',
  });

  // Step 3: Sample Covariance Matrix (Σ = (1/(n-1)) ZᵀZ)
  const covMatrix = computeCovarianceMatrix(centeredData);
  const totalVarianceRaw = covMatrix.reduce((sum, row, i) => sum + row[i], 0);

  steps.push({
    data: {
      type: 'pca',
      stage: 'covariance',
      points: centeredPoints,
      featureNames,
      means,
      stdDevs,
      standardized: standardize,
      covarianceMatrix: covMatrix,
      eigenvalues: [],
      eigenvectors: [],
      explainedVarianceRatios: [],
      cumulativeVarianceRatios: [],
      k,
    },
    description: `Computed ${d}×${d} sample covariance matrix Σ = ZᵀZ / (${n} - 1). Diagonal entries represent individual feature variances; off-diagonal entries represent pairwise covariances. Total variance: ${totalVarianceRaw.toFixed(2)}.`,
    highlightLines: [4, 5],
    operation: 'Covariance Matrix',
    phase: 'Covariance Stage',
    auxiliary: [
      { label: 'Total Variance', value: Number(totalVarianceRaw.toFixed(2)) },
      { label: 'Matrix Size', value: `${d}×${d}` },
      { label: 'Symmetric', value: 'Yes (Σ_jl = Σ_lj)' },
    ],
    lineExplanation: 'Sigma := (1 / (n - 1)) * matmul(transpose(Z), Z)',
  });

  // Check for degenerate zero total variance
  if (totalVarianceRaw <= 1e-12) {
    steps.push({
      data: {
        type: 'pca',
        stage: 'components',
        points: centeredPoints,
        featureNames,
        means,
        standardized: standardize,
        covarianceMatrix: covMatrix,
        eigenvalues: new Array<number>(d).fill(0),
        eigenvectors: Array.from({ length: d }, (_, r) =>
          Array.from({ length: d }, (_, c) => (r === c ? 1 : 0))
        ),
        explainedVarianceRatios: new Array<number>(d).fill(0),
        cumulativeVarianceRatios: new Array<number>(d).fill(0),
        k,
        reconstructionError: 0,
        converged: true,
      },
      description: 'Degenerate dataset detected: Total variance across all features is zero (all samples are identical). No informative principal components exist.',
      highlightLines: [6],
      operation: 'Zero Variance Warning',
      phase: 'Degenerate Data',
      auxiliary: [{ label: 'Status', value: 'Zero Variance' }],
    });
    return steps;
  }

  // Step 4: Jacobi Eigenvalue Decomposition
  const jacobiResult = jacobiEigenvalueAlgorithm(covMatrix, config?.maxJacobiIterations ?? 60, 1e-10, true);
  const { eigenvalues, eigenvectors, iterations, converged } = jacobiResult;

  if (!converged) {
    steps.push({
      data: {
        type: 'pca',
        stage: 'eigensolver',
        points: centeredPoints,
        featureNames,
        means,
        standardized: standardize,
        covarianceMatrix: covMatrix,
        eigenvalues,
        eigenvectors,
        explainedVarianceRatios: [],
        cumulativeVarianceRatios: [],
        k,
        converged: false,
      },
      description: `Jacobi eigensolver exceeded maximum iteration limit (${iterations} iterations) without converging to tolerance. Try standardizing features.`,
      highlightLines: [7],
      operation: 'Convergence Failure',
      phase: 'Solver Diagnostics',
      auxiliary: [{ label: 'Solver Status', value: 'Did Not Converge' }],
    });
    return steps;
  }

  // Intermediate Jacobi Step: Eigensolver convergence
  steps.push({
    data: {
      type: 'pca',
      stage: 'eigensolver',
      points: centeredPoints,
      featureNames,
      means,
      stdDevs,
      standardized: standardize,
      covarianceMatrix: covMatrix,
      eigenvalues,
      eigenvectors,
      explainedVarianceRatios: [],
      cumulativeVarianceRatios: [],
      k,
      jacobiIteration: iterations,
      maxJacobiIterations: 100,
      converged: true,
    },
    description: `Jacobi symmetric eigensolver diagonalized covariance matrix in ${iterations} orthogonal Givens rotation sweeps. Found ${d} real eigenvalues and orthonormal eigenvectors.`,
    highlightLines: [6, 7],
    operation: 'Jacobi Eigensolver',
    phase: 'Eigensolver Stage',
    auxiliary: [
      { label: 'Sweeps', value: iterations },
      { label: 'Eigensolver', value: 'Jacobi (Givens Rotations)' },
      { label: 'Tolerance', value: '1e-10' },
    ],
    lineExplanation: '{ eigenvalues, eigenvectors } := jacobi_diagonalize(Sigma)',
  });

  // Step 5: Sorted Principal Components & Explained Variance
  const { ratios, cumulative } = computeExplainedVariance(eigenvalues);
  const evSummary = eigenvalues.map((v, i) => `λ${i + 1}=${v.toFixed(2)} (${(ratios[i] * 100).toFixed(1)}%)`).join(', ');

  steps.push({
    data: {
      type: 'pca',
      stage: 'components',
      points: centeredPoints,
      featureNames,
      means,
      stdDevs,
      standardized: standardize,
      covarianceMatrix: covMatrix,
      eigenvalues,
      eigenvectors,
      explainedVarianceRatios: ratios,
      cumulativeVarianceRatios: cumulative,
      k,
      converged: true,
    },
    description: `Principal Components sorted by descending eigenvalue: ${evSummary}. Retaining top k = ${k} components captures ${(cumulative[k - 1] * 100).toFixed(1)}% of total system variance.`,
    highlightLines: [8, 9],
    operation: 'Component Ranking',
    phase: 'Variance Analysis',
    auxiliary: [
      { label: 'Top Eigenvalue λ₁', value: Number(eigenvalues[0].toFixed(2)) },
      { label: 'PC1 Variance', value: `${(ratios[0] * 100).toFixed(1)}%` },
      { label: `Cumulative (k=${k})`, value: `${(cumulative[k - 1] * 100).toFixed(1)}%` },
    ],
    lineExplanation: 'sort_descending(eigenvalues, eigenvectors); compute_variance_ratios()',
  });

  // Step 6: Projection onto k Principal Components (T = Z * V_k)
  const projectedData = projectMatrix(centeredData, eigenvectors, k);
  const projectedPoints: PCAPointData[] = rawData.map((row, idx) => ({
    id: idx,
    original: row,
    centered: centeredData[idx],
    projected: projectedData[idx],
  }));

  steps.push({
    data: {
      type: 'pca',
      stage: 'projection',
      points: projectedPoints,
      featureNames,
      means,
      stdDevs,
      standardized: standardize,
      covarianceMatrix: covMatrix,
      eigenvalues,
      eigenvectors,
      explainedVarianceRatios: ratios,
      cumulativeVarianceRatios: cumulative,
      k,
      converged: true,
    },
    description: `Projected ${n} centered observations onto ${k} principal component axes using linear transformation T = Z · Vₖ. Rotates coordinate system into uncorrelated orthogonal latent dimensions.`,
    highlightLines: [10, 11],
    operation: 'Component Projection',
    phase: 'Projection Stage',
    auxiliary: [
      { label: 'Target Dimension', value: `${k}D` },
      { label: 'Transformation', value: 'T = Z · V_k' },
      { label: 'Uncorrelated Axes', value: 'Cov(T) is diagonal' },
    ],
    lineExplanation: 'T := matmul(Z, V[:, 0:k])',
  });

  // Step 7: Sample Reconstruction & Reconstruction Error (X̂ = T * V_kᵀ + μ)
  const reconstructedData = reconstructMatrix(projectedData, eigenvectors, means, k, standardize ? stdDevs : undefined);
  const mseError = computeReconstructionError(rawData, reconstructedData);

  const fullyEvaluatedPoints: PCAPointData[] = rawData.map((row, idx) => ({
    id: idx,
    original: row,
    centered: centeredData[idx],
    projected: projectedData[idx],
    reconstructed: reconstructedData[idx],
  }));

  steps.push({
    data: {
      type: 'pca',
      stage: 'reconstruction',
      points: fullyEvaluatedPoints,
      featureNames,
      means,
      stdDevs,
      standardized: standardize,
      covarianceMatrix: covMatrix,
      eigenvalues,
      eigenvectors,
      explainedVarianceRatios: ratios,
      cumulativeVarianceRatios: cumulative,
      k,
      reconstructionError: Number(mseError.toFixed(4)),
      converged: true,
    },
    description: `Reconstructed data back into original feature space: X̂ = T · Vₖᵀ + μ. Mean Squared Reconstruction Error: ${mseError.toFixed(4)}. When k < d, discarded components account for information loss; when k = d, reconstruction is lossless (MSE ≈ 0).`,
    highlightLines: [12, 13],
    operation: 'Sample Reconstruction',
    phase: 'Evaluation Stage',
    auxiliary: [
      { label: 'Reconstruction MSE', value: Number(mseError.toFixed(4)) },
      { label: 'Retained Variance', value: `${(cumulative[k - 1] * 100).toFixed(1)}%` },
      { label: 'Information Loss', value: `${((1 - cumulative[k - 1]) * 100).toFixed(1)}%` },
    ],
    lineExplanation: 'X_hat := matmul(T, transpose(V[:, 0:k])) + mu; MSE := mean((X - X_hat)^2)',
  });

  return steps;
}
