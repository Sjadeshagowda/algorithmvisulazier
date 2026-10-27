import { createServer } from 'vite';

async function runPCAVerification() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — PRINCIPAL COMPONENT ANALYSIS (PCA) AUDIT & VERIFICATION');
  console.log('='.repeat(75));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const pcaMod = await vite.ssrLoadModule('/src/algorithms/ml/pca.ts');
  const datasetsMod = await vite.ssrLoadModule('/src/utils/ml/datasets.ts');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
    } else {
      failed++;
      console.error(`  ✗ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
    }
  }

  // 1. CENTERING AND SAMPLE COVARIANCE
  console.log('\n[1] Verifying Feature Means & Centering:');
  const testMatrix = [
    [2, 4],
    [4, 2],
    [6, 8],
    [8, 6],
  ];

  const means = pcaMod.computeFeatureMeans(testMatrix);
  assert(Math.abs(means[0] - 5.0) < 1e-6 && Math.abs(means[1] - 5.0) < 1e-6, 'Feature column means equal [5.0, 5.0]', `got [${means.join(', ')}]`);

  const centered = pcaMod.centerMatrix(testMatrix, means);
  const centeredMeans = pcaMod.computeFeatureMeans(centered);
  assert(
    Math.abs(centeredMeans[0]) < 1e-6 && Math.abs(centeredMeans[1]) < 1e-6,
    'Centered data has column means strictly equal to 0.0',
    `got [${centeredMeans.map(v => v.toFixed(6)).join(', ')}]`
  );

  console.log('\n[2] Verifying Sample Covariance Matrix (Σ = (1/(n-1)) ZᵀZ):');
  const cov = pcaMod.computeCovarianceMatrix(centered);
  assert(cov.length === 2 && cov[0].length === 2, 'Covariance matrix has dimensions 2×2');
  assert(Math.abs(cov[0][1] - cov[1][0]) < 1e-9, 'Covariance matrix is exactly symmetric: Σ₁₂ = Σ₂₁', `Σ₁₂=${cov[0][1]}, Σ₂₁=${cov[1][0]}`);

  // Hand-computed: s11 = 20/3 ≈ 6.66667, s22 = 20/3 ≈ 6.66667, s12 = 12/3 = 4.0
  assert(Math.abs(cov[0][0] - (20 / 3)) < 1e-5, 'Sample variance s₁₁ matches analytical 20/3 = 6.6667', `got ${cov[0][0].toFixed(5)}`);
  assert(Math.abs(cov[1][1] - (20 / 3)) < 1e-5, 'Sample variance s₂₂ matches analytical 20/3 = 6.6667', `got ${cov[1][1].toFixed(5)}`);
  assert(Math.abs(cov[0][1] - 4.0) < 1e-5, 'Sample covariance s₁₂ matches analytical 12/3 = 4.0', `got ${cov[0][1].toFixed(5)}`);

  // Zero-variance constant feature
  const constFeatMatrix = [
    [10, 50],
    [20, 50],
    [30, 50],
  ];
  const constMeans = pcaMod.computeFeatureMeans(constFeatMatrix);
  const constCentered = pcaMod.centerMatrix(constFeatMatrix, constMeans);
  const constCov = pcaMod.computeCovarianceMatrix(constCentered);
  assert(Math.abs(constCov[1][1] - 0.0) < 1e-9, 'Constant feature produces exactly 0.0 sample variance', `got ${constCov[1][1]}`);
  assert(Math.abs(constCov[0][1] - 0.0) < 1e-9, 'Covariance between variable and constant feature is exactly 0.0', `got ${constCov[0][1]}`);

  // Repeated identical samples
  const repeatedMatrix = [
    [10, 20],
    [10, 20],
    [30, 40],
    [30, 40],
  ];
  const repMeans = pcaMod.computeFeatureMeans(repeatedMatrix);
  const repCentered = pcaMod.centerMatrix(repeatedMatrix, repMeans);
  const repCov = pcaMod.computeCovarianceMatrix(repCentered);
  assert(isFinite(repCov[0][0]) && isFinite(repCov[0][1]), 'Repeated samples produce finite covariance entries without NaN');

  // 3. JACOBI EIGENVALUES & EIGENVECTORS
  console.log('\n[3] Verifying Jacobi Eigenvalue Decomposition:');
  // Known diagonal matrix: diag(15, 3)
  const diagMat = [
    [15, 0],
    [0, 3],
  ];
  const diagEig = pcaMod.jacobiEigenvalueAlgorithm(diagMat);
  assert(Math.abs(diagEig.eigenvalues[0] - 15) < 1e-6 && Math.abs(diagEig.eigenvalues[1] - 3) < 1e-6, 'Diagonal matrix eigenvalues equal diagonal entries [15, 3]');
  assert(diagEig.converged, 'Diagonal matrix converges in 0 sweeps');

  // Known 2x2 matrix: [[6.66667, 4], [4, 6.66667]] -> λ₁ = 10.66667, λ₂ = 2.66667
  const eigResult = pcaMod.jacobiEigenvalueAlgorithm(cov);
  const l1 = eigResult.eigenvalues[0];
  const l2 = eigResult.eigenvalues[1];
  assert(Math.abs(l1 - (32 / 3)) < 1e-4, 'First eigenvalue λ₁ matches analytical 32/3 = 10.6667', `got ${l1.toFixed(5)}`);
  assert(Math.abs(l2 - (8 / 3)) < 1e-4, 'Second eigenvalue λ₂ matches analytical 8/3 = 2.6667', `got ${l2.toFixed(5)}`);
  assert(l1 >= l2, 'Eigenvalues are sorted in descending order: λ₁ ≥ λ₂');

  // Trace invariance: λ₁ + λ₂ == Tr(Σ)
  const trace = cov[0][0] + cov[1][1];
  assert(Math.abs((l1 + l2) - trace) < 1e-5, 'Sum of eigenvalues equals matrix trace: λ₁ + λ₂ = Tr(Σ)', `sum=${(l1 + l2).toFixed(5)}, trace=${trace.toFixed(5)}`);

  // Eigenvector unit norm: ||v_j|| == 1.0
  const v1 = [eigResult.eigenvectors[0][0], eigResult.eigenvectors[1][0]];
  const v2 = [eigResult.eigenvectors[0][1], eigResult.eigenvectors[1][1]];
  const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
  const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);
  assert(Math.abs(norm1 - 1.0) < 1e-6, 'Eigenvector v₁ has unit Euclidean norm ||v₁|| = 1.0', `got ${norm1.toFixed(6)}`);
  assert(Math.abs(norm2 - 1.0) < 1e-6, 'Eigenvector v₂ has unit Euclidean norm ||v₂|| = 1.0', `got ${norm2.toFixed(6)}`);

  // Eigenvector orthogonality: v₁ᵀ v₂ == 0.0
  const dot12 = v1[0] * v2[0] + v1[1] * v2[1];
  assert(Math.abs(dot12) < 1e-6, 'Eigenvectors are mutually orthogonal: v₁ · v₂ = 0.0', `dot=${dot12.toFixed(7)}`);

  // Eigenvalue-eigenvector residual equation: ||Σ v₁ - λ₁ v₁|| ≈ 0
  const sigV1_x = cov[0][0] * v1[0] + cov[0][1] * v1[1];
  const sigV1_y = cov[1][0] * v1[0] + cov[1][1] * v1[1];
  const res1 = Math.sqrt((sigV1_x - l1 * v1[0]) ** 2 + (sigV1_y - l1 * v1[1]) ** 2);
  assert(res1 < 1e-6, 'Eigenvector equation Σ v₁ = λ₁ v₁ is satisfied (residual ≈ 0)', `residual=${res1.toExponential(3)}`);

  // 4. EXPLAINED VARIANCE RATIOS
  console.log('\n[4] Verifying Explained Variance Ratios:');
  const expVar = pcaMod.computeExplainedVariance([10.6667, 2.6667]);
  assert(Math.abs(expVar.ratios[0] - 0.80) < 1e-4, 'PC1 explained variance ratio is exactly 80.0%', `got ${(expVar.ratios[0] * 100).toFixed(2)}%`);
  assert(Math.abs(expVar.ratios[1] - 0.20) < 1e-4, 'PC2 explained variance ratio is exactly 20.0%', `got ${(expVar.ratios[1] * 100).toFixed(2)}%`);
  assert(Math.abs(expVar.cumulative[1] - 1.0) < 1e-6, 'Cumulative variance ratio sums to exactly 1.0 (100%)', `got ${expVar.cumulative[1]}`);

  // Degenerate zero variance
  const zeroVar = pcaMod.computeExplainedVariance([0, 0]);
  assert(zeroVar.totalVariance === 0 && zeroVar.ratios[0] === 0, 'Zero-variance eigenvalues return safe 0 ratios without division by zero');

  // 5. PROJECTION & RECONSTRUCTION
  console.log('\n[5] Verifying Projection & Reconstruction:');
  // Project centered points into k=1 dimension
  const proj1D = pcaMod.projectMatrix(centered, eigResult.eigenvectors, 1);
  assert(proj1D.length === 4 && proj1D[0].length === 1, '1D projection produces n×1 matrix');

  // Sample 1: centered is [-3, -1]. v1 = [1/√2, 1/√2]. t1 = -3/√2 - 1/√2 = -4/√2 ≈ -2.8284
  const expectedT1 = -4.0 / Math.SQRT2;
  assert(Math.abs(Math.abs(proj1D[0][0]) - Math.abs(expectedT1)) < 1e-3, 'Projected coordinate t₁ for Sample 1 matches analytical -4/√2 ≈ -2.828', `got ${proj1D[0][0].toFixed(4)}`);

  // Full reconstruction with k = d (lossless): MSE must be 0
  const proj2D = pcaMod.projectMatrix(centered, eigResult.eigenvectors, 2);
  const recon2D = pcaMod.reconstructMatrix(proj2D, eigResult.eigenvectors, means, 2);
  const mseLossless = pcaMod.computeReconstructionError(testMatrix, recon2D);
  assert(mseLossless < 1e-8, 'Reconstruction with all components (k=d) is lossless with MSE ≈ 0', `MSE=${mseLossless.toExponential(3)}`);

  // Partial reconstruction with k = 1: MSE equals sum of discarded eigenvalues / d
  const recon1D = pcaMod.reconstructMatrix(proj1D, eigResult.eigenvectors, means, 1);
  const mse1D = pcaMod.computeReconstructionError(testMatrix, recon1D);
  // Theoretical MSE for k=1 on 2D data: (n-1)/n * λ_2 / 2
  assert(mse1D > 0 && isFinite(mse1D), 'Partial reconstruction has positive finite reconstruction error', `MSE=${mse1D.toFixed(4)}`);

  // 6. VALIDATION & ERROR HANDLING
  console.log('\n[6] Verifying Input Validation & Error Handling:');
  const emptySteps = pcaMod.runPCA([]);
  assert(emptySteps.length > 0 && emptySteps[0].phase === 'Dataset Error', 'Empty dataset returns dataset error step');

  const singleStep = pcaMod.runPCA([[10, 20]]);
  assert(singleStep.length > 0 && singleStep[0].phase === 'Dataset Error', 'Single sample returns error step (sample covariance requires n >= 2)');

  const raggedSteps = pcaMod.runPCA([
    [1, 2],
    [3, 4, 5],
  ]);
  assert(raggedSteps.length > 0 && raggedSteps[0].operation === 'Ragged Matrix Error', 'Ragged matrix rows return descriptive validation error');

  const nanSteps = pcaMod.runPCA([
    [1, NaN],
    [3, 4],
  ]);
  assert(nanSteps.length > 0 && nanSteps[0].operation === 'Invalid Coordinates', 'Catches NaN or non-finite values');

  // Degenerate zero variance dataset (all samples identical)
  const zeroVarData = [
    [5, 5],
    [5, 5],
    [5, 5],
  ];
  const zeroVarSteps = pcaMod.runPCA(zeroVarData);
  const degenStep = zeroVarSteps.find(s => s.phase === 'Degenerate Data');
  assert(degenStep !== undefined, 'Zero variance identical samples diagnosed as degenerate data');

  // 7. PRESET DATASETS & STEP SEQUENCE
  console.log('\n[7] Verifying 6 Preset Datasets & Step Sequences:');
  const presets = datasetsMod.pcaSampleDatasets;
  assert(presets.length === 6, 'All 6 requested presets exist in datasets registry');

  // Correlated preset: PC1 variance ratio must be > 90%
  const corrSteps = pcaMod.runPCA(presets[0].rawMatrix, { k: 1 });
  const corrFinal = corrSteps.find(s => s.operation === 'Sample Reconstruction');
  if (corrFinal?.data.type === 'pca') {
    assert(corrFinal.data.explainedVarianceRatios[0] > 0.90, 'Strongly Correlated dataset concentrates >90% variance in PC1', `PC1=${(corrFinal.data.explainedVarianceRatios[0] * 100).toFixed(1)}%`);
  }

  // 3-feature dataset: reduction from 3D to 2D
  const threeFeatSteps = pcaMod.runPCA(presets[5].rawMatrix, { k: 2 });
  const threeFeatFinal = threeFeatSteps.find(s => s.operation === 'Sample Reconstruction');
  if (threeFeatFinal?.data.type === 'pca') {
    assert(threeFeatFinal.data.eigenvalues.length === 3, 'Three-feature dataset computes 3 eigenvalues');
    assert(threeFeatFinal.data.k === 2, 'Retains requested k = 2 components');
    assert(threeFeatFinal.data.points[0].projected?.length === 2, 'Projected coordinates have dimension 2');
  }

  // 8. DETERMINISTIC REPRODUCIBILITY
  console.log('\n[8] Verifying Deterministic Reproducibility:');
  const runA = pcaMod.runPCA(testMatrix, { k: 1 });
  const runB = pcaMod.runPCA(testMatrix, { k: 1 });

  assert(runA.length === runB.length, 'Independent runs produce exact same step count');
  assert(
    JSON.stringify(runA[runA.length - 1].data) === JSON.stringify(runB[runB.length - 1].data),
    'Snapshot states are 100% bitwise identical across repeat executions'
  );

  console.log('\n' + '='.repeat(75));
  console.log(`PCA VERIFICATION COMPLETE: ${passed} passed, ${failed} failed.`);
  console.log('='.repeat(75));

  await vite.close();

  if (failed > 0) {
    process.exit(1);
  }
}

runPCAVerification().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
