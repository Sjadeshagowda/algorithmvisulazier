import { createServer } from 'vite';

async function runMLCorrectness() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — MACHINE LEARNING FOUNDATIONS MATHEMATICAL AUDIT');
  console.log('='.repeat(75));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const linearRegMod = await vite.ssrLoadModule('/src/algorithms/ml/linearRegression.ts');
  const logisticRegMod = await vite.ssrLoadModule('/src/algorithms/ml/logisticRegression.ts');
  const knnMod = await vite.ssrLoadModule('/src/algorithms/ml/knn.ts');
  const kmeansMod = await vite.ssrLoadModule('/src/algorithms/ml/kmeans.ts');
  const gdMod = await vite.ssrLoadModule('/src/algorithms/ml/gradientDescent.ts');
  const metricsMod = await vite.ssrLoadModule('/src/utils/ml/metrics.ts');

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

  // 1. METRICS VERIFICATION
  console.log('\n[1] Verifying Core ML Metrics Functions:');
  const yTrue = [3, -0.5, 2, 7];
  const yPred = [2.5, 0.0, 2, 8];
  const mse = metricsMod.calculateMSE(yTrue, yPred);
  assert(Math.abs(mse - 0.375) < 1e-6, 'calculateMSE exact calculation', `expected 0.375, got ${mse}`);

  const mae = metricsMod.calculateMAE(yTrue, yPred);
  assert(Math.abs(mae - 0.5) < 1e-6, 'calculateMAE exact calculation', `expected 0.5, got ${mae}`);

  const rmse = metricsMod.calculateRMSE(yTrue, yPred);
  assert(Math.abs(rmse - Math.sqrt(0.375)) < 1e-6, 'calculateRMSE calculation', `got ${rmse.toFixed(4)}`);

  const r2 = metricsMod.calculateR2([10, 20, 30], [10, 20, 30]);
  assert(Math.abs(r2 - 1.0) < 1e-6, 'calculateR2 perfect fit = 1.0', `got ${r2}`);

  const acc = metricsMod.calculateAccuracy([1, 0, 1, 1, 0], [1, 0, 1, 0, 0]);
  assert(Math.abs(acc - 0.8) < 1e-6, 'calculateAccuracy binary score = 0.8', `got ${acc}`);

  const cm = metricsMod.calculateConfusionMatrix([1, 0, 1, 1, 0, 0], [1, 0, 0, 1, 1, 0]);
  assert(cm.tp === 2 && cm.fn === 1 && cm.tn === 2 && cm.fp === 1,
    'calculateConfusionMatrix TP, FN, TN, FP breakdown',
    `tp:${cm.tp}, fn:${cm.fn}, tn:${cm.tn}, fp:${cm.fp}`
  );

  // 2. LINEAR REGRESSION
  console.log('\n[2] Verifying Simple Linear Regression (Analytical OLS & Gradient Descent):');
  const points = [{ x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: 7 }];
  const linSteps = linearRegMod.runLinearRegression(points, 0.01, 3);
  assert(linSteps.length > 0, 'runLinearRegression returns non-empty step array');
  const finalLin = linSteps[linSteps.length - 1];
  assert(finalLin.data.type === 'regression', 'Step data type is regression');
  if (finalLin.data.type === 'regression') {
    assert(Math.abs(finalLin.data.slope - 2.0) < 1e-4, 'OLS optimal slope y = 2x + 1', `slope: ${finalLin.data.slope}`);
    assert(Math.abs(finalLin.data.intercept - 1.0) < 1e-4, 'OLS optimal intercept', `intercept: ${finalLin.data.intercept}`);
    assert(Math.abs((finalLin.data.r2 ?? 0) - 1.0) < 1e-4, 'OLS R2 on collinear points is 100%');
  }

  // Residual sum property
  const generalPoints = [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 5 }];
  const generalLin = linearRegMod.runLinearRegression(generalPoints, 0.01, 3);
  const genFinal = generalLin[generalLin.length - 1];
  if (genFinal.data.type === 'regression') {
    const resSum = generalPoints.reduce((sum, p) => sum + (p.y - (genFinal.data.slope * p.x + genFinal.data.intercept)), 0);
    assert(Math.abs(resSum) < 1e-4, 'Sum of OLS residuals Σ (y_i - ŷ_i) equals 0', `residual sum: ${resSum.toFixed(8)}`);
  }

  // 3. LOGISTIC REGRESSION
  console.log('\n[3] Verifying Logistic Regression (Sigmoid & Cross-Entropy Optimization):');
  const classPoints = [
    { x: 10, y: 10, label: 0 },
    { x: 20, y: 20, label: 0 },
    { x: 80, y: 80, label: 1 },
    { x: 90, y: 90, label: 1 },
  ];
  const logSteps = logisticRegMod.runLogisticRegression(classPoints, 0.01, 5);
  assert(logSteps.length > 1, 'runLogisticRegression returns multi-epoch steps');
  const finalLog = logSteps[logSteps.length - 1];
  assert(finalLog.data.type === 'classification', 'Step data type is classification');
  if (finalLog.data.type === 'classification') {
    assert(finalLog.data.accuracy === 100 || finalLog.data.accuracy === 1.0, 'Linearly separable data reaches 100% classification accuracy', `acc: ${finalLog.data.accuracy}%`);
    assert(finalLog.data.decisionBoundary !== undefined, 'Decision boundary line is computed');
  }

  // 4. K-NEAREST NEIGHBORS (KNN)
  console.log('\n[4] Verifying K-Nearest Neighbors (Euclidean Distance & Majority Vote):');
  const knnPoints = [
    { x: 0, y: 0, label: 0 },
    { x: 1, y: 1, label: 0 },
    { x: 10, y: 10, label: 1 },
    { x: 11, y: 11, label: 1 },
  ];
  const knnSteps = knnMod.runKNN(knnPoints, { x: 0.5, y: 0.5 }, 3);
  assert(knnSteps.length > 0, 'runKNN returns steps');
  const finalKNN = knnSteps[knnSteps.length - 1];
  if (finalKNN.data.type === 'classification') {
    assert(finalKNN.data.queryPoint?.predictedLabel === 0, 'Query (0.5, 0.5) predicted as Class 0');
    assert(finalKNN.data.queryPoint?.nearestNeighbors?.length === 3, 'Top 3 nearest neighbors isolated');
  }

  // 5. K-MEANS CLUSTERING
  console.log('\n[5] Verifying K-Means Clustering (Inertia Monotonicity & Convergence):');
  const clusterPoints = [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 },
    { x: 10, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 11 },
  ];
  const kmeansSteps = kmeansMod.runKMeans(clusterPoints, 2, 6);
  assert(kmeansSteps.length > 1, 'runKMeans produces iterative steps');

  let prevInertia = Infinity;
  let monotonic = true;
  for (const s of kmeansSteps) {
    if (s.data.type === 'clustering') {
      if (s.data.inertia > prevInertia + 1e-4) monotonic = false;
      prevInertia = s.data.inertia;
    }
  }
  assert(monotonic, 'Inertia (Within-Cluster Sum of Squares) is non-increasing at every iteration');
  const finalKM = kmeansSteps[kmeansSteps.length - 1];
  if (finalKM.data.type === 'clustering') {
    assert(finalKM.data.converged === true, 'K-Means converges to stable centroids');
    assert(finalKM.data.centroids.length === 2, 'Exactly K=2 centroids placed');
  }

  // 6. GRADIENT DESCENT OPTIMIZATION
  console.log('\n[6] Verifying Gradient Descent Optimization (Convex Paraboloid Minimization):');
  const gdSteps = gdMod.runGradientDescent({ x: 4.0, y: 3.5 }, 0.15, 12);
  assert(gdSteps.length > 5, 'runGradientDescent produces steps');
  const initGD = gdSteps[0];
  const finalGD = gdSteps[gdSteps.length - 1];
  if (initGD.data.type === 'optimization' && finalGD.data.type === 'optimization') {
    assert(finalGD.data.currentPoint.loss < initGD.data.currentPoint.loss, 'Total loss decreases dramatically');
    assert(finalGD.data.currentPoint.loss < 0.1, `Loss reaches near global minimum (0.0): ${finalGD.data.currentPoint.loss.toFixed(4)}`);
    assert(Math.abs(finalGD.data.currentPoint.x) < 0.25, `Parameter X converges near 0: ${finalGD.data.currentPoint.x.toFixed(4)}`);
    assert(Math.abs(finalGD.data.currentPoint.y) < 0.25, `Parameter Y converges near 0: ${finalGD.data.currentPoint.y.toFixed(4)}`);
  }

  // 7. NUMERICAL STABILITY & EDGE CASES
  console.log('\n[7] Verifying Numerical Stability & Edge Cases:');
  // Constant feature X (zero variance)
  const constXPoints = [{ x: 5, y: 10 }, { x: 5, y: 20 }, { x: 5, y: 30 }];
  const constXSteps = linearRegMod.runLinearRegression(constXPoints);
  assert(constXSteps.length > 0 && constXSteps[0].phase === 'Degenerate Feature', 'Linear Regression handles zero variance in X cleanly');

  // Gradient descent divergence guard
  const divSteps = gdMod.runGradientDescent({ x: 50, y: 50 }, 10.0, 10);
  const divFinal = divSteps[divSteps.length - 1];
  assert(divFinal.phase === 'Exploding Loss' || divFinal.operation === 'Divergence Guard', 'Gradient Descent catches runaway divergence with high learning rate');

  // KNN with K > sample count
  const tinyPoints = [{ x: 1, y: 1, label: 1 }, { x: 2, y: 2, label: 0 }];
  const kOverSteps = knnMod.runKNN(tinyPoints, { x: 1.5, y: 1.5 }, 99);
  const kOverFinal = kOverSteps[kOverSteps.length - 1];
  assert(kOverFinal.data.type === 'classification' && kOverFinal.data.queryPoint?.k === 2, 'KNN clamps K when exceeding sample count');

  await vite.close();

  console.log('\n' + '='.repeat(75));
  console.log(`ML AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('='.repeat(75));

  if (failed > 0) {
    process.exit(1);
  }
}

runMLCorrectness().catch(err => {
  console.error('Fatal error running ML correctness audit:', err);
  process.exit(1);
});
