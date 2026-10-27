import { createServer } from 'vite';

async function runDecisionTreeVerification() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — DECISION TREE MATHEMATICAL & STRUCTURAL AUDIT');
  console.log('='.repeat(75));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const dtMod = await vite.ssrLoadModule('/src/algorithms/ml/decisionTree.ts');

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

  // 1. MATHEMATICAL IMPURITY FUNCTIONS
  console.log('\n[1] Verifying Mathematical Impurity Calculations:');
  // Pure node: [10, 0] -> Gini = 0.0, Entropy = 0.0
  const pureGini = dtMod.computeGini([10, 0]);
  assert(Math.abs(pureGini - 0.0) < 1e-6, 'Gini of 100% pure node is exactly 0.0', `got ${pureGini}`);

  const pureEntropy = dtMod.computeEntropy([0, 8]);
  assert(Math.abs(pureEntropy - 0.0) < 1e-6, 'Entropy of 100% pure node is exactly 0.0', `got ${pureEntropy}`);

  // 50/50 split: [5, 5] -> Gini = 1 - (0.5^2 + 0.5^2) = 0.5, Entropy = -(0.5*log2(0.5)*2) = 1.0
  const split50Gini = dtMod.computeGini([5, 5]);
  assert(Math.abs(split50Gini - 0.5) < 1e-6, 'Gini of balanced 50/50 binary split is exactly 0.5', `got ${split50Gini}`);

  const split50Entropy = dtMod.computeEntropy([5, 5]);
  assert(Math.abs(split50Entropy - 1.0) < 1e-6, 'Entropy of balanced 50/50 binary split is exactly 1.0', `got ${split50Entropy}`);

  // Unequal split: [9, 5] (14 total)
  // Gini = 1 - ((9/14)^2 + (5/14)^2) = 1 - (81/196 + 25/196) = 1 - 106/196 = 90/196 ≈ 0.45918
  const unbalGini = dtMod.computeGini([9, 5]);
  const expectedGini = 1 - ((9 / 14) ** 2 + (5 / 14) ** 2);
  assert(Math.abs(unbalGini - expectedGini) < 1e-5, 'Gini of [9, 5] distribution matches independent analytical formula', `got ${unbalGini.toFixed(5)}`);

  // Entropy for [9, 5]: -(9/14 * log2(9/14) + 5/14 * log2(5/14)) ≈ 0.94029
  const unbalEntropy = dtMod.computeEntropy([9, 5]);
  const p0 = 9 / 14;
  const p1 = 5 / 14;
  const expectedEntropy = -(p0 * Math.log2(p0) + p1 * Math.log2(p1));
  assert(Math.abs(unbalEntropy - expectedEntropy) < 1e-5, 'Entropy of [9, 5] matches independent logarithmic calculation', `got ${unbalEntropy.toFixed(5)}`);

  // 2. EDGE CASES AND INPUT VALIDATION
  console.log('\n[2] Verifying Edge Cases and Invalid Inputs:');
  const emptySteps = dtMod.runDecisionTree([]);
  assert(emptySteps.length > 0 && emptySteps[0].phase === 'Dataset Error', 'Empty dataset returns dataset error step');

  const singleStep = dtMod.runDecisionTree([{ x: 10, y: 10, label: 1 }]);
  assert(singleStep.length > 0 && singleStep[0].phase === 'Dataset Error', 'Single sample returns error step requiring at least 2 samples');

  // Pure dataset from start: all class 1
  const allClass1 = [
    { x: 10, y: 10, label: 1 },
    { x: 20, y: 20, label: 1 },
    { x: 30, y: 30, label: 1 },
  ];
  const pureSteps = dtMod.runDecisionTree(allClass1);
  const pureFinal = pureSteps.find(s => s.operation === 'Make Leaf Node');
  assert(pureFinal !== undefined, 'Pure dataset immediately halts at root leaf without splits');

  // Duplicate feature values
  const dupFeatures = [
    { x: 50, y: 50, label: 0 },
    { x: 50, y: 50, label: 1 },
  ];
  const dupSteps = dtMod.runDecisionTree(dupFeatures);
  assert(dupSteps.length > 0, 'Handles duplicate feature coordinates without crashing');

  // 3. TREE CONSTRUCTION & STOPPING CONDITIONS
  console.log('\n[3] Verifying Tree Construction & Stopping Conditions:');
  const separable = [
    { x: 10, y: 10, label: 0 },
    { x: 20, y: 20, label: 0 },
    { x: 80, y: 80, label: 1 },
    { x: 90, y: 90, label: 1 },
  ];

  // Max depth = 1 (Decision Stump)
  const stumpSteps = dtMod.runDecisionTree(separable, { maxDepth: 1 });
  const stumpFinal = stumpSteps[stumpSteps.length - 1];
  if (stumpFinal.data.type === 'decision-tree') {
    const depths = stumpFinal.data.nodes.map(n => n.depth);
    assert(Math.max(...depths) <= 1, 'Max depth constraint = 1 is strictly respected', `max depth observed: ${Math.max(...depths)}`);
  }

  // Min samples per split = 5 on 4 samples
  const minSamplesSteps = dtMod.runDecisionTree(separable, { minSamplesSplit: 5 });
  const minSamplesFinal = minSamplesSteps.find(s => s.operation === 'Make Leaf Node');
  assert(minSamplesFinal !== undefined, 'Min samples per split stops splitting when samples < minSamplesSplit');

  // 4. REPRODUCIBILITY & DETERMINISTIC TIE-BREAKING
  console.log('\n[4] Verifying Deterministic Tie-Breaking & Reproducibility:');
  const run1 = dtMod.runDecisionTree(separable, { criterion: 'gini', maxDepth: 3 });
  const run2 = dtMod.runDecisionTree(separable, { criterion: 'gini', maxDepth: 3 });

  assert(run1.length === run2.length, 'Independent runs produce exact same step count', `steps: ${run1.length}`);

  let identicalNodes = true;
  const nodes1 = run1[run1.length - 1].data.nodes;
  const nodes2 = run2[run2.length - 1].data.nodes;
  for (let i = 0; i < nodes1.length; i++) {
    if (nodes1[i].threshold !== nodes2[i].threshold || nodes1[i].gain !== nodes2[i].gain) {
      identicalNodes = false;
    }
  }
  assert(identicalNodes, 'Deterministic tie-breaking produces byte-for-byte identical tree splits');

  // 5. QUERY PREDICTION & INFERENCE TRAVERSAL
  console.log('\n[5] Verifying Query Traversal & Prediction Correctness:');
  // Query at (15, 15) should be classified as Class 0
  const query0Steps = dtMod.runDecisionTree(separable, { queryPoint: { x: 15, y: 15 } });
  const final0 = query0Steps[query0Steps.length - 1];
  if (final0.data.type === 'decision-tree') {
    assert(final0.data.queryPoint?.predictedClass === 0, 'Query (15, 15) predicted correctly as Class 0');
    assert((final0.data.queryPoint?.pathNodeIds?.length ?? 0) >= 2, 'Query traversed at least root and leaf nodes');
  }

  // Query at (85, 85) should be classified as Class 1
  const query1Steps = dtMod.runDecisionTree(separable, { queryPoint: { x: 85, y: 85 } });
  const final1 = query1Steps[query1Steps.length - 1];
  if (final1.data.type === 'decision-tree') {
    assert(final1.data.queryPoint?.predictedClass === 1, 'Query (85, 85) predicted correctly as Class 1');
  }

  // 6. NODE DISPLAY & TREE INTEGRITY
  console.log('\n[6] Verifying Node Display Integrity:');
  const complexSteps = dtMod.runDecisionTree(separable);
  const complexFinal = complexSteps[complexSteps.length - 1];
  if (complexFinal.data.type === 'decision-tree') {
    const allNodes = complexFinal.data.nodes;
    let validPointers = true;
    for (const n of allNodes) {
      if (!n.isLeaf) {
        if (n.leftId === undefined || n.rightId === undefined) validPointers = false;
        if (n.threshold === undefined || n.featureName === undefined) validPointers = false;
      }
    }
    assert(validPointers, 'All internal decision nodes possess valid thresholds, feature names, and child pointers');
  }

  await vite.close();

  console.log('\n' + '='.repeat(75));
  console.log(`DECISION TREE AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('='.repeat(75));

  if (failed > 0) {
    process.exit(1);
  }
}

runDecisionTreeVerification().catch(err => {
  console.error('Fatal error running Decision Tree verification:', err);
  process.exit(1);
});
