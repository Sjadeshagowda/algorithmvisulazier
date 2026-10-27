import type { AlgorithmLesson } from '../../../types/algorithm';

export const pcaLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'An unsupervised linear dimensionality reduction algorithm that projects multivariate data onto orthogonal axes of maximal variance by diagonalizing the sample covariance matrix.',
  mainPurpose:
    'To compress correlated high-dimensional feature spaces into a compact set of uncorrelated principal components while minimizing information loss and reconstruction error.',
  whatIsIt: {
    overview:
      'Principal Component Analysis (PCA) is the foundational unsupervised statistical technique for linear dimensionality reduction and exploratory data analysis. Given a collection of observations with multiple continuous features, PCA finds an ordered sequence of mutually perpendicular (orthogonal) axes — called principal components — that maximize the variance of the projected data. The first principal component (PC1) points along the line of greatest spread; the second principal component (PC2) captures the largest remaining variance under the constraint of being completely orthogonal to PC1, and so on. Mathematically, PCA subtracts feature means to center data at the origin, computes the sample covariance matrix Σ = (1 / (n - 1)) ZᵀZ, and solves the symmetric eigenvalue problem Σv = λv using the Jacobi algorithm. Each eigenvalue λ represents the variance captured by its corresponding eigenvector v, providing an exact metric of retained information.',
    smallExample:
      'Consider a customer analytics dataset with 3 continuous features: Annual Income, Total Yearly Spending, and Age. Because Income and Spending are strongly correlated, plotting them in 3D creates an elongated diagonal pancake of points. PCA discovers that 88% of all variation lies along a single diagonal axis (PC1: Overall Financial Volume) and 10% lies along an orthogonal axis (PC2: Age Demographics). By retaining just these two principal components, an analyst can project customers onto a clean 2D scatter plot with 98% information retention, eliminating redundancy.',
  },
  whyUseIt: {
    problemSolved:
      'Mitigates the curse of dimensionality, eliminates multicollinearity between correlated predictors, accelerates downstream machine learning models, and enables human visualization of high-dimensional datasets in 2D or 3D.',
    whyItMatters:
      'According to the Eckart-Young-Mirsky theorem, PCA provides the mathematically optimal low-rank linear approximation of a data matrix: no other linear projection of dimension k can achieve lower mean squared reconstruction error. Furthermore, because principal components are mutually orthogonal, their pairwise covariance is strictly zero, resolving coefficient instability in linear models.',
    whenToUse: [
      'Visualizing complex high-dimensional datasets (d > 3) on 2D or 3D screens.',
      'Preprocessing data with severe multicollinearity before linear or logistic regression.',
      'Compressing high-dimensional signals (such as 1000-pixel face images or 20,000-gene expression arrays) to speed up model training.',
      'Denoising signals by discarding trailing components that capture primarily sensor noise.',
    ],
    whenToAvoid: [
      'Data resides on non-linear curved manifolds (e.g. Swiss roll, concentric spirals) where non-linear methods like Kernel PCA, t-SNE, or UMAP are required.',
      'Direct feature interpretability is legally mandatory: each principal component is a linear combination of all original inputs, obscuring individual variable effects.',
      'Supervised classification where class distinction happens to lie along a low-variance dimension (PCA is unsupervised and ignores class labels).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Eigenfaces for Facial Recognition & Biometrics',
      description:
        'Turk & Pentland (1991) pioneered facial recognition by treating pixel arrays as high-dimensional vectors and computing their principal components ("eigenfaces"). Faces can be recognized and stored using just 20 to 50 projection coefficients instead of tens of thousands of raw pixels.',
      educationalVsProductionNote:
        'A landmark historical computer vision breakthrough that remains a foundational benchmark in biometric signal processing.',
    },
    {
      title: 'Quantitative Finance Risk Factor Modeling',
      description:
        'Asset managers decompose covariance matrices of hundreds of stock returns into macroeconomic factors (Market Trend, Interest Rate Sensitivity, Momentum) using PCA to construct diversified, risk-controlled portfolios.',
      educationalVsProductionNote:
        'Standard practice in Wall Street factor models (e.g. Barra risk models and statistical arbitrage).',
    },
    {
      title: 'Genomics & Population Genetics (GWAS)',
      description:
        'Geneticists analyze matrices of hundreds of thousands of Single Nucleotide Polymorphisms (SNPs) across global populations. Projecting onto PC1 and PC2 clusters individuals geographically according to continental ancestry.',
      educationalVsProductionNote:
        'Universal standard for detecting and controlling for population stratification in genome-wide association studies.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Center Features at the Origin',
      description:
        'Compute empirical column means μⱼ = (1/n) Σᵢ xᵢⱼ and subtract them from every sample: zᵢⱼ = xᵢⱼ - μⱼ. Centering ensures that the principal axes pass directly through the spatial centroid of the data.',
    },
    {
      stepNumber: 2,
      title: 'Calculate the Sample Covariance Matrix',
      description:
        'Construct the symmetric d×d sample covariance matrix Σ = (1 / (n - 1)) ZᵀZ. Diagonal entries represent feature variances, while off-diagonal entries quantify pairwise linear correlations.',
    },
    {
      stepNumber: 3,
      title: 'Solve the Symmetric Eigenvalue Problem',
      description:
        'Diagonalize Σ by solving Σv = λv using the Jacobi eigenvalue algorithm. The eigenvalues λ₁ ≥ λ₂ ≥ ... ≥ λ_d represent the variance along each corresponding orthonormal eigenvector v_j.',
    },
    {
      stepNumber: 4,
      title: 'Project Data onto Selected Principal Components',
      description:
        'Select the top k eigenvectors V_k = [v₁, ..., v_k] and compute low-dimensional coordinates: T = Z · V_k. Optional reconstruction is achieved via X̂ = T · V_kᵀ + μ.',
    },
  ],
  workedExample: {
    datasetDescription:
      '4 samples across 2 features: (2, 4), (4, 2), (6, 8), (8, 6). Goal: compute means, sample covariance, eigenvalues, and project onto PC1.',
    initialState:
      'Matrix X with n=4, d=2. Samples exhibit positive correlation with spread along the diagonal.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Compute Feature Means & Center Data',
        stateDisplay:
          'μ₁ = (2+4+6+8)/4 = 5.0, μ₂ = (4+2+8+6)/4 = 5.0. Centered Z = X - μ: [(-3, -1), (-1, -3), (1, 3), (3, 1)].',
        explanation: 'Subtracting 5.0 from each column shifts the data centroid to (0, 0).',
        whyNecessary: 'Ensures the first principal component passes through the center of mass.',
        beforeState: 'Uncentered data with centroid at (5.0, 5.0)',
        afterState: 'Centered matrix Z with centroid at (0.0, 0.0)',
        nextAction: 'Compute 2×2 sample covariance matrix.',
        intermediateResult: 'μ = [5.0, 5.0]',
      },
      {
        stepNumber: 2,
        operation: 'Calculate Sample Covariance Matrix Σ',
        stateDisplay:
          'Var(Z₁) = [(-3)²+(-1)²+1²+3²]/3 = 20/3 ≈ 6.667. Var(Z₂) = [(-1)²+(-3)²+3²+1²]/3 = 20/3 ≈ 6.667. Cov(Z₁, Z₂) = [(-3)(-1) + (-1)(-3) + (1)(3) + (3)(1)]/3 = 12/3 = 4.0. Covariance Matrix Σ = [[6.667, 4.0], [4.0, 6.667]].',
        explanation: 'Off-diagonal entry 4.0 confirms strong positive correlation between features.',
        whyNecessary: 'Covariance captures the complete second-order linear relationship.',
        beforeState: 'Covariance unknown',
        afterState: 'Σ = [[6.667, 4.0], [4.0, 6.667]]',
        nextAction: 'Solve characteristic equation det(Σ - λI) = 0.',
        intermediateResult: 'Total Variance = 6.667 + 6.667 = 13.333',
      },
      {
        stepNumber: 3,
        operation: 'Compute Eigenvalues and Explained Variance',
        stateDisplay:
          'det(Σ - λI) = (6.667 - λ)² - 4.0² = 0 => (6.667 - λ) = ±4.0. λ₁ = 6.667 + 4.0 = 10.667. λ₂ = 6.667 - 4.0 = 2.667. Explained variance ratio for PC1: 10.667 / 13.333 = 80.0%. PC2: 2.667 / 13.333 = 20.0%.',
        explanation: 'The first principal component captures exactly 80% of total system variance.',
        whyNecessary: 'Quantifies information retention when reducing from 2D to 1D.',
        beforeState: 'Eigenvalues unknown',
        afterState: 'λ₁ = 10.667 (80%), λ₂ = 2.667 (20%)',
        nextAction: 'Derive normalized eigenvectors.',
        intermediateResult: 'λ₁ = 10.667, λ₂ = 2.667',
      },
      {
        stepNumber: 4,
        operation: 'Derive Eigenvectors & Project Sample 1',
        stateDisplay:
          '(Σ - 10.667 I)v₁ = 0 => [[-4, 4], [4, -4]][v₁₁, v₁₂]ᵀ = 0 => v₁₁ = v₁₂. Normalized: v₁ = [1/√2, 1/√2]ᵀ ≈ [0.7071, 0.7071]ᵀ. For Sample 1 with centered coords (-3, -1): t₁ = (-3)(0.7071) + (-1)(0.7071) = -2.8284. Reconstructed centered coords: t₁ · v₁ᵀ = -2.8284 · [0.7071, 0.7071] = [-2.0, -2.0]. Adding μ: X̂₁ = [-2, -2] + [5, 5] = (3.0, 3.0).',
        explanation: 'Projecting onto PC1 compresses 2 coordinates into 1 number with minimal residual error.',
        whyNecessary: 'Demonstrates projection and reconstruction mechanics.',
        beforeState: 'Unprojected sample',
        afterState: 'Projected coordinate t₁ = -2.8284, Reconstructed = (3.0, 3.0)',
        nextAction: 'Evaluation complete.',
        intermediateResult: 'Reconstruction error for Sample 1: (2-3)² + (4-3)² = 2.0',
      },
    ],
    finalState:
      'Full PCA decomposition: λ₁ = 10.667 (80% variance), v₁ = [0.7071, 0.7071]ᵀ. Reducing from 2D to 1D retains 80% of data variance.',
  },
  advantages: [
    'Optimal Linear Reconstruction: Minimizes mean squared reconstruction error across all possible rank-k linear subspaces (Eckart-Young Theorem).',
    'Orthogonal Decorrelation: Eliminates multicollinearity by producing mutually perpendicular principal components.',
    'Scalable Dimension Reduction: Compresses high-dimensional datasets while preserving global variance structure.',
    'Unsupervised & Objective: Discovers intrinsic geometric data variance without requiring labeled training annotations.',
  ],
  limitations: [
    'Linearity Assumption: Cannot capture non-linear manifold geometry (e.g. concentric circles or spirals) without kernel extensions.',
    'Sensitivity to Feature Scale: Features with artificially large numerical ranges dominate variance unless standardized.',
    'Loss of Interpretability: Principal components are linear mixtures of all original features, making individual factor attribution challenging.',
    'Unsupervised Blindness: Preserving maximal variance does not guarantee preserving discriminatory class separation for supervised tasks.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(n · d² + d³) when feature dimension d is small (d ≪ n), dominated by sample covariance matrix accumulation.',
    averageCaseMeaning:
      'O(n · d² + sweeps · d³) for sample covariance computation plus Jacobi eigenvalue diagonalization sweeps.',
    worstCaseMeaning:
      'O(n · d² + d³) when Jacobi iterations reach the maximum convergence bound for ill-conditioned covariance matrices.',
    spaceComplexityMeaning:
      'O(d²) auxiliary memory to store the d×d sample covariance matrix and eigenvector matrix.',
  },
  relatedAlgorithms: [
    {
      name: 'Feature Selection (Lasso / Filter Methods)',
      comparison:
        'Feature selection chooses a discrete subset of original features preserving raw interpretability, whereas PCA blends all features into dense orthogonal combinations.',
    },
    {
      name: 'Linear Regression',
      comparison:
        'Linear regression minimizes vertical prediction errors of a designated dependent target y, whereas PCA minimizes perpendicular geometric orthogonal distances across all variables symmetrically.',
    },
    {
      name: 'Support Vector Machine (SVM)',
      comparison:
        'SVM is a supervised classifier that finds a maximum-margin boundary using class labels; PCA is unsupervised and completely ignores class targets.',
    },
  ],
  quiz: [
    {
      question: 'Why is feature centering (subtracting column means) strictly required before computing PCA?',
      options: [
        'To ensure the first principal component passes through the center of mass of the data, so that variance is measured about the mean',
        'To force all numbers to be strictly positive',
        'To prevent division by zero in the Jacobi eigensolver',
        'To convert categorical labels into numeric integers',
      ],
      correctIndex: 0,
      explanation:
        'Variance is defined as E[(X - μ)²]. If data is not centered, the first principal component will point from the origin (0, 0) to the mean of the data rather than along the direction of true internal variation.',
      optionExplanations: [
        'Correct! Centering ensures that principal axes represent internal variance around the spatial centroid.',
        'Centering shifts points around zero, producing negative coordinates on one side.',
        'Division by zero in eigensolvers is prevented by numerical tolerances, not centering.',
        'PCA requires continuous numeric data, not categorical conversion.',
      ],
    },
    {
      question: 'What does each eigenvalue λⱼ of the sample covariance matrix represent?',
      options: [
        'The amount of variance captured by the corresponding principal component eigenvector vⱼ',
        'The classification accuracy percentage of the model',
        'The number of samples required to train the model',
        'The slope of the linear regression line',
      ],
      correctIndex: 0,
      explanation:
        'For an eigenvector vⱼ with ||vⱼ|| = 1, the variance of projected data z · vⱼ is vⱼᵀ Σ vⱼ = vⱼᵀ (λⱼ vⱼ) = λⱼ ||vⱼ||² = λⱼ. Thus, the eigenvalue directly measures projected variance.',
      optionExplanations: [
        'Correct! The eigenvalue equals the statistical variance along that principal component axis.',
        'PCA is unsupervised; eigenvalues are not classification accuracy rates.',
        'Sample size n is independent of eigenvalue magnitudes.',
        'Eigenvalues measure variance, not regression slope coefficients.',
      ],
    },
    {
      question: 'What is "eigenvector sign ambiguity" in Principal Component Analysis?',
      options: [
        'If v is an eigenvector of Σ, then -v is also a valid eigenvector spanning the exact same principal axis line',
        'Eigenvectors can only contain positive numbers',
        'Negative eigenvalues indicate an invalid dataset',
        'The sign of the eigenvalue changes every iteration',
      ],
      correctIndex: 0,
      explanation:
        'Because Σ(-v) = -Σv = -λv = λ(-v), both v and -v describe the identical line in space. Reversing an eigenvector simply flips the projected coordinate axis without changing variance or information.',
      optionExplanations: [
        'Correct! Multiplying an eigenvector by -1 defines the exact same geometric subspace.',
        'Eigenvectors frequently contain negative components.',
        'Covariance matrices are positive semi-definite; valid eigenvalues are non-negative.',
        'Eigenvalues are fixed invariants of the matrix.',
      ],
    },
    {
      question: 'When should you choose Standardized PCA (correlation matrix) over Centered PCA (covariance matrix)?',
      options: [
        'When features have vastly different measurement units or wildly different variances (e.g. Income in dollars vs Age in years)',
        'Only when the sample size n is less than 5',
        'When the dataset contains text strings',
        'Standardization is never recommended in PCA',
      ],
      correctIndex: 0,
      explanation:
        'Because PCA maximizes variance, a feature measured in large numbers (e.g. Income: variance = 10,000,000) will artificially monopolize the first principal component over a feature with small variance (e.g. Age: variance = 100), regardless of true information content. Standardizing features gives every dimension unit variance.',
      optionExplanations: [
        'Correct! Standardizing prevents high-magnitude features from dominating the principal components unfairly.',
        'Standardization is beneficial regardless of sample size n.',
        'PCA cannot process raw text strings directly.',
        'Standardized PCA is the standard recommendation for multi-unit tabular datasets.',
      ],
    },
    {
      question: 'Why does dimensionality reduction from d features to k < d components result in reconstruction error?',
      options: [
        'Because discarded principal components (k+1 to d) with nonzero eigenvalues contain real variance that cannot be recovered after projection',
        'Because the computer runs out of memory during matrix multiplication',
        'Because eigenvectors are rounded to integers',
        'Because centering loses the mean values permanently',
      ],
      correctIndex: 0,
      explanation:
        'Reconstruction MSE equals the sum of the discarded eigenvalues: MSE = Σ_{j=k+1}^d λⱼ / d. Unless all discarded eigenvalues are exactly zero, truncating components discards real geometric variation.',
      optionExplanations: [
        'Correct! Truncating components with nonzero eigenvalues permanently discards that portion of total variance.',
        'Memory limits do not cause mathematical reconstruction loss.',
        'Eigenvectors are real double-precision floats, not integers.',
        'Feature means are preserved and added back during reconstruction.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Introduced by Karl Pearson in 1901 as an analogue of the principal axis theorem in classical mechanics, and independently expanded by Harold Hotelling in 1933 who coined the term "Principal Components". Named for its discovery of the primary, dominant orthogonal components of multivariate variation.',
    problemSolved:
      'Finds the optimal lower-dimensional linear subspace that captures the maximum variance of a dataset while minimizing mean squared reconstruction loss.',
    problemNotSolved:
      'Does not capture non-linear topological manifolds (e.g. spirals) and does not take supervised target labels into account.',
    whyLearn:
      'PCA is the universal gateway to matrix factorizations, unsupervised learning, spectral graph theory, and latent space embeddings across modern data science and deep learning.',
    prerequisites: ['Matrix Multiplication & Transpose', 'Sample Mean & Covariance', 'Eigenvalues & Orthogonal Vectors'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can we analyze, compress, and visualize tabular datasets with dozens or hundreds of continuous features without being blinded by multicollinearity and the curse of dimensionality?',
    naiveApproachInefficiency:
      'Selecting a few arbitrary features by hand discards the information in all omitted columns and ignores correlation patterns. Pairwise scatterplot matrices grow quadratically (d(d-1)/2 plots), becoming unreadable for d > 5.',
    coreIdeaUsed:
      'Orthogonal Coordinate Rotation: rotate the coordinate axes to align with the natural eigenvectors of the data\'s covariance ellipsoid, ranking axes by eigenvalue variance magnitude.',
    utilityExplanation:
      'Enables high-fidelity compression where a tiny fraction of components (e.g. 2 or 3) often captures >90% of all information in the original dataset.',
    workingConditions: [
      'Continuous numerical features.',
      'At least 2 samples (n ≥ 2) to compute unbiased sample covariance.',
      'Features measured on comparable scales, or standardized beforehand.',
    ],
    whenAnotherIsBetter:
      'For complex non-linear clustering visualization, use t-SNE or UMAP. For supervised dimensionality reduction where class discrimination is priority, use Linear Discriminant Analysis (LDA).',
    analogyOrRealLifeExample:
      'Photographing a running athlete: a side-profile 2D photo captures maximum body length and stride motion (PC1), whereas a bird\'s-eye view from directly above misses most information. PCA automatically finds the best camera angle that captures the widest spread.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Rectangular numeric matrix X of dimensions n × d where n ≥ 2 samples and d ≥ 1 features.',
    expectedOutput: 'Eigenvalues λ, orthogonal eigenvector matrix V, projected coordinates T (n × k), and reconstructed matrix X̂.',
    constraints: ['k must satisfy 1 ≤ k ≤ d', 'All matrix entries must be finite real numbers', 'No ragged rows'],
    preconditions: ['Features should be continuous numerical values', 'Features should be standardized if measurement units differ'],
    specialCases: ['Zero-variance constant feature', 'Identical duplicate samples (rank-deficient covariance)', '100% spherical variance'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Unscaled features produce components dominated by the single column with highest raw numeric variance. Degenerate zero-variance matrices return safe diagnostic steps.',
  },
  coreIntuition: {
    simpleExplanation:
      'Imagine a swarm of fireflies hovering in an elongated cloud in a dark room. You want to place a rod through the cloud that passes through the longest stretch of fireflies. That rod is the first principal component (PC1). A second rod placed perpendicular to the first through the widest remaining spread is PC2.',
    keyDrivingDecision:
      'Finding the direction vector v that maximizes projected sample variance Var(Zv) = vᵀ Σ v subject to the unit-norm constraint ||v|| = 1.',
    whyRepeatedOperationWorks:
      'Because symmetric covariance matrices have real eigenvalues and orthogonal eigenvectors (Spectral Theorem), diagonalizing Σ decomposes the total variance into completely independent, additive components.',
    paradigmSpecificDetail:
      'Unsupervised Spectral Decomposition: uses orthogonal similarity transformations (Jacobi Givens rotations) to achieve exact diagonalization without local minima.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function computePCA(X, k, standardize):',
      '  n := rowCount(X), d := colCount(X)',
      '  mu := computeMeans(X)',
      '  if standardize then Z := (X - mu) / stdDevs(X) else Z := X - mu',
      '  Sigma := (1 / (n - 1)) * matmul(transpose(Z), Z)',
      '  { eigenvalues, eigenvectors } := jacobiEigensolver(Sigma)',
      '  sortDescendingByEigenvalues(eigenvalues, eigenvectors)',
      '  V_k := eigenvectors[:, 0:k]  // select top k columns',
      '  T := matmul(Z, V_k)          // project into k dimensions',
      '  X_hat := matmul(T, transpose(V_k)) + mu  // reconstruct',
      '  mse := meanSquaredError(X, X_hat)',
      '  return { T, X_hat, eigenvalues, V_k, mse }',
    ],
    lineExplanations: [
      { lineIndex: 2, lineText: 'mu := computeMeans(X)', explanation: 'Compute arithmetic mean of each feature.' },
      { lineIndex: 3, lineText: 'if standardize then Z := ...', explanation: 'Center data at origin (and scale to unit variance if requested).' },
      { lineIndex: 4, lineText: 'Sigma := (1 / (n - 1)) * matmul(transpose(Z), Z)', explanation: 'Compute unbiased d×d sample covariance matrix.' },
      { lineIndex: 5, lineText: '{ eigenvalues, eigenvectors } := jacobiEigensolver(Sigma)', explanation: 'Diagonalize symmetric covariance matrix into principal axes.' },
      { lineIndex: 7, lineText: 'V_k := eigenvectors[:, 0:k]', explanation: 'Select the first k eigenvectors corresponding to the largest eigenvalues.' },
      { lineIndex: 8, lineText: 'T := matmul(Z, V_k)', explanation: 'Project centered data into low-dimensional principal component coordinates.' },
      { lineIndex: 9, lineText: 'X_hat := matmul(T, transpose(V_k)) + mu', explanation: 'Reconstruct samples back into original feature space.' },
    ],
    terminationCondition: 'Jacobi eigensolver terminates when the maximum off-diagonal covariance element drops below 1e-10.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function runPCA(customMatrix?: number[][], config?: PCAConfig): AlgorithmStep[]',
    code: `export function computeCovarianceMatrix(centered: number[][]): number[][] {
  const n = centered.length;
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
      cov[l][j] = val; // Symmetric: Σ_jl = Σ_lj
    }
  }
  return cov;
}

export function projectMatrix(
  centered: number[][],
  eigenvectors: number[][],
  k: number
): number[][] {
  const n = centered.length;
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
}`,
    inputValidation: 'Rejects empty matrices, enforces n >= 2 for sample covariance, catches ragged rows, non-finite values, and bounds k to [1, d].',
    variables: [
      { name: 'means', type: 'number[]', purpose: 'Empirical column centroids used for centering' },
      { name: 'cov', type: 'number[][]', purpose: 'Sample covariance matrix Σ of size d×d' },
      { name: 'eigenvalues', type: 'number[]', purpose: 'Sorted variance values associated with each principal component' },
      { name: 'eigenvectors', type: 'number[][]', purpose: 'Orthonormal transformation matrix V where each column is an eigenvector' },
      { name: 'projected', type: 'number[][]', purpose: 'Low-dimensional coordinates T = Z · V_k' },
    ],
    lineByLine: [
      { line: 1, code: 'computeCovarianceMatrix(...)', explanation: 'Calculates unbiased sample covariance with n - 1 denominator.' },
      { line: 12, code: 'cov[l][j] = val;', explanation: 'Enforces exact matrix symmetry across the diagonal.' },
      { line: 18, code: 'projectMatrix(...)', explanation: 'Linearly projects centered data into k principal component dimensions.' },
      { line: 30, code: 'sum += centered[i][j] * eigenvectors[j][comp];', explanation: 'Inner product of sample vector with j-th principal eigenvector.' },
    ],
    returnExplanation: 'Returns detailed sequential step snapshots for centering, covariance, eigensolver, projection, and reconstruction.',
    commonBugs: [
      'Using n instead of n - 1 in the sample covariance formula, underestimating sample variance.',
      'Forgetting to center the data before covariance computation, distorting principal axes toward the origin.',
      'Not sorting eigenvalues and eigenvectors in descending order, selecting weak components.',
    ],
    edgeCaseHandling: [
      'Clamps floating point negative eigenvalues (< 1e-9) to 0.0 to handle positive semi-definite numerical noise.',
      'Gracefully handles zero-variance constant features without division-by-zero crashes.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Because the sample covariance matrix Σ is real and symmetric by construction (Σ = Σᵀ), the Spectral Theorem guarantees that it has real eigenvalues and an orthonormal basis of eigenvectors. The Jacobi eigenvalue algorithm applies a sequence of orthogonal Givens rotations that strictly decreases the off-diagonal Frobenius norm to zero, mathematically guaranteeing convergence to the exact principal axes.',
    formalProof: {
      method: 'Convex Loss Minimization',
      invariantOrClaim: 'The first principal component eigenvector v₁ maximizes the projected empirical variance Var(Zv) = vᵀΣv subject to ||v|| = 1.',
      initialization: 'Let Σ be the symmetric positive semi-definite sample covariance matrix with eigenvalues λ₁ ≥ λ₂ ≥ ... ≥ λ_d ≥ 0 and orthonormal eigenvectors v₁, ..., v_d.',
      maintenance: 'Form the Lagrangian L(v, λ) = vᵀΣv - λ(vᵀv - 1). Taking the gradient with respect to v and setting to zero yields ∇_v L = 2Σv - 2λv = 0, which simplifies to the standard eigenvalue equation Σv = λv. Multiplying by vᵀ gives vᵀΣv = λvᵀv = λ.',
      termination: 'The maximum of vᵀΣv on the unit sphere ||v|| = 1 is achieved when λ is the maximum eigenvalue λ₁, with maximizer v = v₁. Subsequent components v_k maximize variance subject to mutual orthogonality v_kᵀ v_j = 0 for j < k.',
      conclusion: 'The eigenvectors of the sample covariance matrix strictly define the optimal orthogonal axes of maximal variance.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(n · d² + d³)', explanation: 'Sample covariance accumulation O(n·d²) followed by small Jacobi sweeps.', condition: 'Small feature count d ≪ n with well-conditioned covariance.' },
    averageCase: { complexity: 'O(n · d² + sweeps · d³)', explanation: 'Covariance accumulation and Jacobi rotations converging in modest sweeps.', condition: 'General rectangular numeric matrix.' },
    worstCase: { complexity: 'O(n · d² + maxIter · d³)', explanation: 'Covariance computation followed by maximum allowed Jacobi rotations.', condition: 'Highly degenerate near-multiple eigenvalues.' },
    auxiliarySpace: { complexity: 'O(d²)', explanation: 'Memory required to store the d×d sample covariance and eigenvector matrices.' },
    totalMemory: 'O(n · d) to store centered data + O(d²) for covariance and eigenvectors + O(n · k) for projected coordinates.',
    bigOExplanation: 'Projection runtime is O(k · d) per sample, enabling real-time low-dimensional inference.',
    scalingBehavior: 'Linear in sample size n; cubic in feature count d due to matrix diagonalization.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Mathematically optimal linear dimensionality reduction (Eckart-Young theorem).',
      'Produces completely uncorrelated latent features (diagonal covariance).',
      'Provides exact percentage metrics of preserved vs lost information.',
      'Unsupervised: requires no human labels or annotations.',
    ],
    limitations: [
      'Fails to uncover non-linear relationships or manifold curves.',
      'Highly sensitive to feature scales when unstandardized.',
      'Creates dense linear mixtures that hinder variable-level explainability.',
    ],
    memoryTradeOffs: [
      'Storing the d×d covariance matrix requires O(d²) memory, which is negligible for educational visualizers (d ≤ 5).',
    ],
    poorChoiceScenarios: [
      'High-dimensional sparse text data where retaining sparsity is critical (use Truncated SVD or NMF).',
      'Problems where categorical variables dominate without meaningful Euclidean distance.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Feature Selection (Lasso / Filter)',
      timeComplexity: 'O(n · d) vs O(n · d² + d³)',
      spaceComplexity: 'O(d) vs O(d²)',
      stabilityOrType: 'Discrete Subset Selection',
      similarities: 'Both reduce the effective number of dimensions fed into downstream models.',
      differences: 'Feature selection picks whole original features retaining interpretability; PCA creates new blended synthetic axes.',
      whenToPreferThis: 'When multicollinearity is severe and compression ratio is paramount.',
      whenToPreferAlternative: 'When domain stakeholders require keeping original variables intact.',
    },
    {
      algorithm: 'Linear Regression',
      timeComplexity: 'O(n · d² + d³)',
      spaceComplexity: 'O(d²)',
      stabilityOrType: 'Supervised Target Optimization',
      similarities: 'Both fit linear hyperplanes through feature space.',
      differences: 'Linear regression minimizes vertical distance to a target y; PCA minimizes perpendicular orthogonal distance across all features.',
      whenToPreferThis: 'When exploring variance structure without a designated target.',
      whenToPreferAlternative: 'When predicting a specific numerical outcome variable.',
    },
  ],
  commonMistakes: [
    {
      title: 'Applying PCA on Raw Unstandardized Multi-Unit Data',
      misconception: 'Assuming PCA automatically normalizes different feature scales.',
      badCodeOrApproach: 'Running PCA directly on features with vastly different scales (e.g. Salary [0, 200000] and Age [18, 70]).',
      correctApproach: 'Always apply Z-score standardization (StandardScaler) so that every feature has unit variance before PCA.',
    },
    {
      title: 'Assuming PCA Retains Class Separability',
      misconception: 'Expecting PCA to preserve discriminatory boundaries for downstream classifiers.',
      badCodeOrApproach: 'Discarding components with low variance without checking if they contain the class separation boundary.',
      correctApproach: 'Remember that PCA is unsupervised. If class discrimination is the primary goal, use Linear Discriminant Analysis (LDA).',
    },
  ],
  exercises: [
    {
      id: 'pca-ex-1',
      type: 'conceptual',
      question: 'A 2D dataset has eigenvalues λ₁ = 12.0 and λ₂ = 4.0. What percentage of total variance is captured by the first principal component?',
      options: ['75.0%', '80.0%', '66.7%', '25.0%'],
      correctIndex: 0,
      explanation:
        'Total variance = λ₁ + λ₂ = 12.0 + 4.0 = 16.0. The variance ratio for PC1 is 12.0 / 16.0 = 0.75 = 75.0%.',
    },
    {
      id: 'pca-ex-2',
      type: 'challenge',
      question: 'Why are the off-diagonal entries of the covariance matrix of projected data T = Z · V equal to zero?',
      options: [
        'Because eigenvectors of a symmetric matrix are mutually orthogonal, completely decorrelating the projected dimensions',
        'Because all coordinates are rounded to zero',
        'Because the projection matrix deletes negative numbers',
        'Because centering forces off-diagonal covariance to zero',
      ],
      correctIndex: 0,
      explanation:
        'The covariance of the projected data is (1/(n-1)) TᵀT = (1/(n-1)) VᵀZᵀZV = Vᵀ Σ V. Since V is the matrix of eigenvectors of Σ, Vᵀ Σ V = Λ, which is a diagonal matrix containing the eigenvalues. All off-diagonal covariances are strictly zero.',
    },
  ],
  summary: {
    coreIdea: 'Projects high-dimensional data onto orthogonal axes of maximal variance by diagonalizing the centered sample covariance matrix.',
    keyConditions: ['Data must be centered at origin', 'n ≥ 2 samples required', 'Standardize features if units differ'],
    complexitySummary: { time: 'O(n · d² + sweeps · d³)', space: 'O(d²)' },
    whenToUse: 'When compressing correlated continuous features for visualization, noise reduction, or multicollinearity elimination.',
    prerequisites: ['Matrix Multiplication', 'Sample Covariance', 'Eigenvalue Decomposition'],
    nextSteps: [
      { id: 'k-means', name: 'K-Means Clustering', reason: 'Cluster observations in low-dimensional PCA latent space.' },
      { id: 'linear-regression', name: 'Linear Regression', reason: 'Use uncorrelated principal components as regression predictors.' },
    ],
  },
};
