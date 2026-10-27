import { createServer } from 'vite';

async function runSVMVerification() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — SUPPORT VECTOR MACHINE (SVM) AUDIT & VERIFICATION');
  console.log('='.repeat(75));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const svmMod = await vite.ssrLoadModule('/src/algorithms/ml/svm.ts');
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

  // 1. PURE MATHEMATICAL FUNCTIONS
  console.log('\n[1] Verifying Hinge Loss Calculation: max(0, 1 - y * score)');

  // Positive class tests
  const h1 = svmMod.computeHingeLoss(1, 1.5);
  assert(Math.abs(h1 - 0.0) < 1e-6, 'Hinge loss is 0.0 when y=+1 and score >= 1.0 (safely outside margin)', `got ${h1}`);

  const h2 = svmMod.computeHingeLoss(1, 1.0);
  assert(Math.abs(h2 - 0.0) < 1e-6, 'Hinge loss is 0.0 when y=+1 directly on margin boundary (score = 1.0)', `got ${h2}`);

  const h3 = svmMod.computeHingeLoss(1, 0.4);
  assert(Math.abs(h3 - 0.6) < 1e-6, 'Hinge loss is 0.6 when y=+1 and score = 0.4 (within margin street)', `got ${h3}`);

  const h4 = svmMod.computeHingeLoss(1, 0.0);
  assert(Math.abs(h4 - 1.0) < 1e-6, 'Hinge loss is 1.0 when point lies on decision boundary (score = 0.0)', `got ${h4}`);

  const h5 = svmMod.computeHingeLoss(1, -0.5);
  assert(Math.abs(h5 - 1.5) < 1e-6, 'Hinge loss is 1.5 when y=+1 is misclassified with score = -0.5', `got ${h5}`);

  // Negative class tests
  const h6 = svmMod.computeHingeLoss(-1, -1.8);
  assert(Math.abs(h6 - 0.0) < 1e-6, 'Hinge loss is 0.0 when y=-1 and score <= -1.0', `got ${h6}`);

  const h7 = svmMod.computeHingeLoss(-1, 0.3);
  assert(Math.abs(h7 - 1.3) < 1e-6, 'Hinge loss is 1.3 when y=-1 is misclassified with score = 0.3', `got ${h7}`);

  // 2. PRIMAL OBJECTIVE FUNCTION
  console.log('\n[2] Verifying Primal Objective: J(w,b) = ½||w||² + C * Σ hinge');
  const samplePts = [
    { x: 1, y: 1, label: 1 },
    { x: -1, y: -1, label: -1 },
  ];
  const wTest = [0.6, 0.8]; // ||w||^2 = 0.36 + 0.64 = 1.0, 0.5 * ||w||^2 = 0.5
  const bTest = 0;
  const cTest = 2.0;

  // score(pt1) = 0.6(1) + 0.8(1) = 1.4 -> y=1, score=1.4 -> hinge = 0
  // score(pt2) = 0.6(-1) + 0.8(-1) = -1.4 -> y=-1, score=-1.4 -> hinge = 0
  const obj1 = svmMod.computeSVMObjective(wTest, bTest, samplePts, cTest);
  assert(Math.abs(obj1.regLoss - 0.5) < 1e-6, 'Regularization loss is exactly 0.5 * ||w||² = 0.5', `got ${obj1.regLoss}`);
  assert(Math.abs(obj1.totalHingeLoss - 0.0) < 1e-6, 'Hinge loss is 0.0 on separable points outside margin', `got ${obj1.totalHingeLoss}`);
  assert(Math.abs(obj1.totalObjective - 0.5) < 1e-6, 'Total objective matches 0.5 + 2.0 * 0 = 0.5', `got ${obj1.totalObjective}`);

  // With margin violation
  const violatingPts = [
    { x: 0.5, y: 0.5, label: 1 }, // score = 0.3 + 0.4 = 0.7 -> hinge = 1 - 0.7 = 0.3
    { x: -0.5, y: -0.5, label: -1 }, // score = -0.7 -> hinge = 1 - 0.7 = 0.3
  ];
  const obj2 = svmMod.computeSVMObjective(wTest, bTest, violatingPts, cTest);
  assert(Math.abs(obj2.totalHingeLoss - 0.6) < 1e-6, 'Total hinge loss on margin encroachers is 0.3 + 0.3 = 0.6', `got ${obj2.totalHingeLoss}`);
  assert(Math.abs(obj2.totalObjective - (0.5 + 2.0 * 0.6)) < 1e-6, 'Total objective is 0.5 + 2*(0.6) = 1.7', `got ${obj2.totalObjective}`);

  // 3. INFERENCE PREDICTION & GEOMETRIC DISTANCE
  console.log('\n[3] Verifying SVM Prediction & Perpendicular Margin Distance:');
  const pred1 = svmMod.predictSVM([3, 4], -10, { x: 4, y: 2 });
  // w·x + b = 3(4) + 4(2) - 10 = 12 + 8 - 10 = 10
  // ||w|| = sqrt(9 + 16) = 5
  // marginDistance = 10 / 5 = 2.0
  assert(Math.abs(pred1.decisionScore - 10) < 1e-6, 'Decision score f(x) = 10', `got ${pred1.decisionScore}`);
  assert(pred1.predictedClass === 1, 'Predicted class is +1 for positive score');
  assert(Math.abs(pred1.marginDistance - 2.0) < 1e-6, 'Geometric margin distance is score / ||w|| = 2.0', `got ${pred1.marginDistance}`);

  const pred2 = svmMod.predictSVM([3, 4], -10, { x: 0, y: 0 });
  // score = -10, class = -1, distance = -10 / 5 = -2.0
  assert(pred2.predictedClass === -1, 'Predicted class is -1 for negative score');
  assert(Math.abs(pred2.marginDistance - (-2.0)) < 1e-6, 'Signed margin distance reflects negative side of hyperplane', `got ${pred2.marginDistance}`);

  // 4. EDGE CASES AND INPUT VALIDATION
  console.log('\n[4] Verifying Input Validation and Edge Cases:');
  const emptySteps = svmMod.runSVM([]);
  assert(emptySteps.length > 0 && emptySteps[0].phase === 'Dataset Error', 'Empty dataset returns dataset error step');

  const singleStep = svmMod.runSVM([{ x: 20, y: 20, label: 1 }]);
  assert(singleStep.length > 0 && singleStep[0].phase === 'Dataset Error', 'Single sample returns error step (requires at least 2 samples)');

  const nanSteps = svmMod.runSVM([
    { x: 10, y: NaN, label: 1 },
    { x: 20, y: 20, label: -1 },
  ]);
  assert(nanSteps.length > 0 && nanSteps[0].operation === 'Invalid Coordinates', 'Catches NaN or non-finite coordinates');

  const singleClassSteps = svmMod.runSVM([
    { x: 10, y: 10, label: 1 },
    { x: 20, y: 20, label: 1 },
    { x: 30, y: 30, label: 1 },
  ]);
  assert(singleClassSteps.length > 0 && singleClassSteps[0].operation === 'Single Class Error', 'Single-class dataset returns explicit dual-class requirement error');

  // 5. TRAINING RUN & CONVERGENCE ON SEPARABLE DATA
  console.log('\n[5] Verifying Training Run & Convergence on Separable Data:');
  const separableDataset = datasetsMod.svmSampleDatasets[0].points;
  const steps = svmMod.runSVM(separableDataset, { c: 1.0, learningRate: 0.05, epochs: 15 });

  assert(steps.length >= 3, 'Training produces multiple sequential visualization steps');
  const initStep = steps[0];
  const finalStep = steps[steps.length - 2]; // step before query
  const queryStep = steps[steps.length - 1];

  assert(initStep.phase === 'Setup', 'First step is initialization');
  assert(finalStep.operation === 'Training Complete', 'Final training step completes training');
  assert(queryStep.operation === 'Query Inference', 'Includes query inference step');

  // Verify weight norm and margin width
  if (finalStep.data.type === 'svm') {
    const w = finalStep.data.weights;
    const norm = Math.sqrt(w[0] * w[0] + w[1] * w[1]);
    assert(norm > 0, 'Learned weights have non-zero magnitude', `||w|| = ${norm.toFixed(4)}`);
    assert(finalStep.data.marginWidth > 0, 'Margin width 2/||w|| is strictly positive', `margin = ${finalStep.data.marginWidth}`);
    assert(finalStep.data.supportVectorCount > 0, 'Support vectors are detected on or violating margin', `count = ${finalStep.data.supportVectorCount}`);

    // Verify boundary geometry
    const db = finalStep.data.decisionBoundary;
    const pmb = finalStep.data.positiveMarginBoundary;
    const nmb = finalStep.data.negativeMarginBoundary;

    assert(db !== undefined, 'Decision boundary geometry is computed');
    assert(pmb !== undefined && nmb !== undefined, 'Positive and negative margin boundaries are computed');

    if (db && pmb && nmb && !db.isVertical && !pmb.isVertical && !nmb.isVertical) {
      assert(
        Math.abs(db.slope - pmb.slope) < 1e-4 && Math.abs(db.slope - nmb.slope) < 1e-4,
        'Separating hyperplane and margin boundary lines are parallel',
        `slopes: db=${db.slope.toFixed(3)}, pmb=${pmb.slope.toFixed(3)}, nmb=${nmb.slope.toFixed(3)}`
      );
    }
  }

  // 6. VERTICAL BOUNDARY ROBUSTNESS
  console.log('\n[6] Verifying Vertical Boundary Robustness (w2 ≈ 0):');
  // Pure left-right vertical separation: x < 40 is -1, x > 60 is +1
  const verticalData = [
    { x: 10, y: 10, label: -1 },
    { x: 10, y: 90, label: -1 },
    { x: 20, y: 50, label: -1 },
    { x: 80, y: 10, label: 1 },
    { x: 80, y: 90, label: 1 },
    { x: 90, y: 50, label: 1 },
  ];
  const vertSteps = svmMod.runSVM(verticalData, { c: 1.0, learningRate: 0.05, epochs: 10 });
  const vertFinal = vertSteps[vertSteps.length - 2];
  if (vertFinal.data.type === 'svm') {
    assert(
      isFinite(vertFinal.data.weights[0]) && isFinite(vertFinal.data.weights[1]) && isFinite(vertFinal.data.bias),
      'Vertical dataset produces finite weights and bias without NaN'
    );
  }

  // 7. DETERMINISTIC REPRODUCIBILITY
  console.log('\n[7] Verifying Deterministic Reproducibility:');
  const runA = svmMod.runSVM(separableDataset, { c: 2.0, learningRate: 0.01, epochs: 8 });
  const runB = svmMod.runSVM(separableDataset, { c: 2.0, learningRate: 0.01, epochs: 8 });

  assert(runA.length === runB.length, 'Two identical runs produce exact same number of steps');
  const lastA = runA[runA.length - 1];
  const lastB = runB[runB.length - 1];
  assert(
    JSON.stringify(lastA.data) === JSON.stringify(lastB.data),
    'Snapshot states are 100% bitwise identical across repeat executions'
  );

  // 8. REGULARIZATION C IMPACT
  console.log('\n[8] Verifying Soft-Margin Regularization C Trade-off:');
  // Overlapping dataset
  const overlappingPts = datasetsMod.svmSampleDatasets[1].points;
  const smallCSteps = svmMod.runSVM(overlappingPts, { c: 0.05, learningRate: 0.01, epochs: 12 });
  const largeCSteps = svmMod.runSVM(overlappingPts, { c: 10.0, learningRate: 0.01, epochs: 12 });

  const finalSmallC = smallCSteps.find(s => s.operation === 'Training Complete');
  const finalLargeC = largeCSteps.find(s => s.operation === 'Training Complete');

  if (finalSmallC?.data.type === 'svm' && finalLargeC?.data.type === 'svm') {
    assert(
      finalSmallC.data.c === 0.05 && finalLargeC.data.c === 10.0,
      'C parameters correctly recorded in snapshot metadata'
    );
  }

  console.log('\n' + '='.repeat(75));
  console.log(`SVM VERIFICATION COMPLETE: ${passed} passed, ${failed} failed.`);
  console.log('='.repeat(75));

  await vite.close();

  if (failed > 0) {
    process.exit(1);
  }
}

runSVMVerification().catch(err => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
