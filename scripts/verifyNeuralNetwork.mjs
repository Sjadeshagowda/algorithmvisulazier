import { createServer } from 'vite';

async function runNeuralNetworkVerification() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — NEURAL NETWORKS & BACKPROPAGATION AUDIT & VERIFICATION');
  console.log('='.repeat(75));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const nnMod = await vite.ssrLoadModule('/src/algorithms/ml/neuralNetwork.ts');
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

  // ── 1. ACTIVATION FUNCTIONS & DERIVATIVES ─────────────────────────────────
  console.log('\n[1] Verifying Activation Functions & Exact Analytical Derivatives:');

  // Sigmoid
  assert(Math.abs(nnMod.sigmoid(0) - 0.5) < 1e-9, 'sigmoid(0) = 0.5');
  assert(Math.abs(nnMod.sigmoid(10) - 1.0) < 1e-4, 'sigmoid(10) ≈ 1.0');
  assert(Math.abs(nnMod.sigmoid(-10) - 0.0) < 1e-4, 'sigmoid(-10) ≈ 0.0');
  assert(nnMod.sigmoid(100) === 1.0, 'sigmoid(100) clamps cleanly without overflow');
  assert(nnMod.sigmoid(-100) === 0.0, 'sigmoid(-100) clamps cleanly without underflow');

  const eps = 1e-5;
  for (const z of [-2.5, 0.0, 1.8]) {
    const analytical = nnMod.sigmoidDerivative(z);
    const numerical = (nnMod.sigmoid(z + eps) - nnMod.sigmoid(z - eps)) / (2 * eps);
    assert(Math.abs(analytical - numerical) < 1e-5, `Sigmoid derivative at z=${z} matches finite difference`, `analytical=${analytical.toFixed(6)}, numerical=${numerical.toFixed(6)}`);
  }

  // ReLU
  assert(nnMod.relu(3.5) === 3.5, 'relu(3.5) = 3.5');
  assert(nnMod.relu(-2.0) === 0.0, 'relu(-2.0) = 0.0');
  assert(nnMod.reluDerivative(2.0) === 1.0, 'reluDerivative(2.0) = 1.0');
  assert(nnMod.reluDerivative(-2.0) === 0.0, 'reluDerivative(-2.0) = 0.0');

  // Tanh
  assert(Math.abs(nnMod.tanh(0)) < 1e-9, 'tanh(0) = 0.0');
  assert(Math.abs(nnMod.tanhDerivative(0) - 1.0) < 1e-9, 'tanhDerivative(0) = 1.0');
  for (const z of [-1.5, 0.5, 2.0]) {
    const analytical = nnMod.tanhDerivative(z);
    const numerical = (nnMod.tanh(z + eps) - nnMod.tanh(z - eps)) / (2 * eps);
    assert(Math.abs(analytical - numerical) < 1e-5, `Tanh derivative at z=${z} matches finite difference`, `analytical=${analytical.toFixed(6)}, numerical=${numerical.toFixed(6)}`);
  }

  // Linear
  assert(nnMod.linear(4.2) === 4.2, 'linear(4.2) = 4.2');
  assert(nnMod.linearDerivative(4.2) === 1.0, 'linearDerivative(4.2) = 1.0');

  // ── 2. LOSS FUNCTIONS ────────────────────────────────────────────────────
  console.log('\n[2] Verifying Loss Functions (MSE & BCE):');

  // Hand-computed MSE: preds=[2, 4], targets=[1, 2] -> diffs=[1, 2] -> sq=[1, 4] -> sum/2 = 2.5
  const mseVal = nnMod.computeMSE([2, 4], [1, 2]);
  assert(Math.abs(mseVal - 2.5) < 1e-9, 'computeMSE matches hand calculation (2.5)', `got ${mseVal}`);

  // Hand-computed BCE: y=1, p=0.8 -> -ln(0.8) ≈ 0.22314
  const bceVal = nnMod.computeBCE([0.8], [1.0]);
  assert(Math.abs(bceVal - (-Math.log(0.8))) < 1e-6, 'computeBCE matches hand calculation', `got ${bceVal.toFixed(6)}`);

  // BCE Clamping stability
  const bceClampedZero = nnMod.computeBCE([0.0], [1.0]);
  const bceClampedOne = nnMod.computeBCE([1.0], [0.0]);
  assert(isFinite(bceClampedZero) && !isNaN(bceClampedZero), 'BCE handles p=0 with target=1 safely (finite clamped value)');
  assert(isFinite(bceClampedOne) && !isNaN(bceClampedOne), 'BCE handles p=1 with target=0 safely (finite clamped value)');

  // ── 3. WEIGHT INITIALIZATION & FORWARD PROPAGATION ───────────────────────
  console.log('\n[3] Verifying Deterministic Weight Initialization & Forward Pass:');

  const net1 = nnMod.initializeNetworkWeights([2, 3, 1], 'sigmoid', 123);
  const net2 = nnMod.initializeNetworkWeights([2, 3, 1], 'sigmoid', 123);
  const net3 = nnMod.initializeNetworkWeights([2, 3, 1], 'sigmoid', 999);

  assert(net1.weights.length === 2, 'Network has 2 weight matrices for 3 layers');
  assert(net1.weights[0].length === 2 && net1.weights[0][0].length === 3, 'Layer 0 weight matrix is 2x3');
  assert(net1.weights[1].length === 3 && net1.weights[1][0].length === 1, 'Layer 1 weight matrix is 3x1');
  assert(net1.biases[0].length === 3, 'Layer 0 biases has length 3');
  assert(net1.biases[1].length === 1, 'Layer 1 biases has length 1');

  // Determinism
  assert(
    JSON.stringify(net1.weights) === JSON.stringify(net2.weights),
    'Deterministic PRNG produces identical weights for identical seed'
  );
  assert(
    JSON.stringify(net1.weights) !== JSON.stringify(net3.weights),
    'Different seed produces different weights'
  );

  // Hand-constructed forward pass check
  const manualNet = {
    weights: [
      [[0.5, -0.5], [1.0, 0.0]], // 2 in -> 2 hidden
      [[0.8], [-0.4]],           // 2 hidden -> 1 out
    ],
    biases: [
      [0.1, -0.1],
      [0.2],
    ],
  };
  const manualConfigs = [
    { size: 2, activation: 'linear', name: 'Input' },
    { size: 2, activation: 'sigmoid', name: 'Hidden' },
    { size: 1, activation: 'linear', name: 'Output' },
  ];

  // Input [1, 2]
  // Hidden neuron 0: z = 1*0.5 + 2*1.0 + 0.1 = 2.6 -> a = sigmoid(2.6)
  // Hidden neuron 1: z = 1*(-0.5) + 2*0.0 - 0.1 = -0.6 -> a = sigmoid(-0.6)
  // Output neuron: z = a0*0.8 + a1*(-0.4) + 0.2
  const fwdResult = nnMod.forwardPropagate([1, 2], manualNet, manualConfigs);
  const expZ0 = 2.6;
  const expZ1 = -0.6;
  const expA0 = nnMod.sigmoid(expZ0);
  const expA1 = nnMod.sigmoid(expZ1);
  const expOutZ = expA0 * 0.8 + expA1 * (-0.4) + 0.2;

  assert(Math.abs(fwdResult.zValues[1][0] - expZ0) < 1e-6, 'Manual forward hidden z[0] matches 2.6', `got ${fwdResult.zValues[1][0]}`);
  assert(Math.abs(fwdResult.zValues[1][1] - expZ1) < 1e-6, 'Manual forward hidden z[1] matches -0.6', `got ${fwdResult.zValues[1][1]}`);
  assert(Math.abs(fwdResult.activations[1][0] - expA0) < 1e-6, 'Manual forward hidden a[0] matches sigmoid(2.6)');
  assert(Math.abs(fwdResult.activations[1][1] - expA1) < 1e-6, 'Manual forward hidden a[1] matches sigmoid(-0.6)');
  assert(Math.abs(fwdResult.output - expOutZ) < 1e-6, 'Manual forward output matches analytical formula', `got ${fwdResult.output}`);

  // ── 4. NUMERICAL GRADIENT CHECKING (FINITE DIFFERENCES) ───────────────────
  console.log('\n[4] Numerical Gradient Checking: Analytical Backprop vs Finite Differences:');

  function checkGradients(network, configs, x, y, task) {
    const analyticalGrads = nnMod.backpropagateSample(x, y, network, configs, task);
    const fdEps = 1e-5;
    let maxRelError = 0;

    function lossForNetwork(net) {
      const pred = nnMod.forwardPropagate(x, net, configs).output;
      return task === 'classification'
        ? nnMod.computeBCE([pred], [y])
        : nnMod.computeMSE([pred], [y]);
    }

    // Check weights
    for (let l = 0; l < network.weights.length; l++) {
      for (let r = 0; r < network.weights[l].length; r++) {
        for (let c = 0; c < network.weights[l][r].length; c++) {
          const origW = network.weights[l][r][c];

          network.weights[l][r][c] = origW + fdEps;
          const lossPlus = lossForNetwork(network);

          network.weights[l][r][c] = origW - fdEps;
          const lossMinus = lossForNetwork(network);

          network.weights[l][r][c] = origW; // restore

          const numGrad = (lossPlus - lossMinus) / (2 * fdEps);
          const anaGrad = analyticalGrads.weightGradients[l][r][c];
          const diff = Math.abs(anaGrad - numGrad);
          const denom = Math.max(Math.abs(anaGrad), Math.abs(numGrad), 1e-5);
          const relErr = diff / denom;
          if (relErr > maxRelError) maxRelError = relErr;
        }
      }
    }

    // Check biases
    for (let l = 0; l < network.biases.length; l++) {
      for (let bIdx = 0; bIdx < network.biases[l].length; bIdx++) {
        const origB = network.biases[l][bIdx];

        network.biases[l][bIdx] = origB + fdEps;
        const lossPlus = lossForNetwork(network);

        network.biases[l][bIdx] = origB - fdEps;
        const lossMinus = lossForNetwork(network);

        network.biases[l][bIdx] = origB; // restore

        const numGrad = (lossPlus - lossMinus) / (2 * fdEps);
        const anaGrad = analyticalGrads.biasGradients[l][bIdx];
        const diff = Math.abs(anaGrad - numGrad);
        const denom = Math.max(Math.abs(anaGrad), Math.abs(numGrad), 1e-5);
        const relErr = diff / denom;
        if (relErr > maxRelError) maxRelError = relErr;
      }
    }

    return maxRelError;
  }

  // 4a. Gradient check on Regression with Sigmoid hidden
  const testNetReg = nnMod.initializeNetworkWeights([2, 3, 1], 'sigmoid', 42);
  const regConfigs = [
    { size: 2, activation: 'linear', name: 'Input' },
    { size: 3, activation: 'sigmoid', name: 'Hidden' },
    { size: 1, activation: 'linear', name: 'Output' },
  ];
  const regMaxErr = checkGradients(testNetReg, regConfigs, [0.6, -0.4], 1.25, 'regression');
  assert(regMaxErr < 1e-4, 'Regression (MSE): Analytical gradients match finite differences across all weights/biases', `max relative error: ${regMaxErr.toExponential(4)}`);

  // 4b. Gradient check on Binary Classification with Tanh hidden
  const testNetClf = nnMod.initializeNetworkWeights([2, 4, 1], 'tanh', 101);
  const clfConfigs = [
    { size: 2, activation: 'linear', name: 'Input' },
    { size: 4, activation: 'tanh', name: 'Hidden' },
    { size: 1, activation: 'sigmoid', name: 'Output' },
  ];
  const clfMaxErr = checkGradients(testNetClf, clfConfigs, [0.3, 0.7], 1.0, 'classification');
  assert(clfMaxErr < 1e-4, 'Binary Classification (BCE): Analytical gradients match finite differences across all weights/biases', `max relative error: ${clfMaxErr.toExponential(4)}`);

  // 4c. Deep 2-hidden layer network (e.g. [2, 3, 2, 1])
  const testNetDeep = nnMod.initializeNetworkWeights([2, 3, 2, 1], 'sigmoid', 77);
  const deepConfigs = [
    { size: 2, activation: 'linear', name: 'Input' },
    { size: 3, activation: 'sigmoid', name: 'Hidden 1' },
    { size: 2, activation: 'sigmoid', name: 'Hidden 2' },
    { size: 1, activation: 'linear', name: 'Output' },
  ];
  const deepMaxErr = checkGradients(testNetDeep, deepConfigs, [-0.5, 0.8], 0.45, 'regression');
  assert(deepMaxErr < 1e-4, 'Deep 2-Hidden-Layer Network: Analytical backprop matches finite differences through all layers', `max relative error: ${deepMaxErr.toExponential(4)}`);

  // ── 5. TRAINING CONVERGENCE TESTS ─────────────────────────────────────────
  console.log('\n[5] Verifying Training Convergence on Datasets:');

  // Simple regression: y = 2x + 1
  const regSteps = nnMod.runNeuralNetwork(
    [[-1], [0], [1], [2]],
    [-1, 1, 3, 5],
    {
      task: 'regression',
      hiddenLayers: [3],
      activation: 'tanh',
      learningRate: 0.1,
      epochs: 30,
      seed: 42,
    }
  );

  const initStepReg = regSteps[0];
  const finalStepReg = regSteps[regSteps.length - 1];
  const initLossReg = initStepReg.data.currentLoss;
  const finalLossReg = finalStepReg.data.currentLoss;

  assert(regSteps.length > 5, 'Step generator returned multiple educational steps');
  assert(finalLossReg < initLossReg, `Regression training reduced loss: initial=${initLossReg.toFixed(4)} → final=${finalLossReg.toFixed(4)}`);
  assert(finalStepReg.data.converged === true, 'Final step flags model as converged');

  // XOR problem
  const xorSteps = nnMod.runNeuralNetwork(
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [0, 1, 1, 0],
    {
      task: 'classification',
      hiddenLayers: [4],
      activation: 'tanh',
      learningRate: 0.3,
      epochs: 50,
      seed: 123,
    }
  );
  const xorInitLoss = xorSteps[0].data.currentLoss;
  const xorFinalLoss = xorSteps[xorSteps.length - 1].data.currentLoss;
  assert(xorFinalLoss < xorInitLoss, `XOR classification reduced BCE loss: initial=${xorInitLoss.toFixed(4)} → final=${xorFinalLoss.toFixed(4)}`);

  // ── 6. DATASET PRESETS & VALIDATION CHECKS ────────────────────────────────
  console.log('\n[6] Verifying Neural Network Presets & Input Validation:');

  const presets = datasetsMod.neuralNetworkSampleDatasets;
  assert(Array.isArray(presets) && presets.length >= 5, 'neuralNetworkSampleDatasets contains at least 5 presets');

  const presetIds = presets.map(p => p.id);
  assert(presetIds.includes('nn-simple-regression'), 'Preset "nn-simple-regression" present');
  assert(presetIds.includes('nn-binary-classification'), 'Preset "nn-binary-classification" present');
  assert(presetIds.includes('nn-xor'), 'Preset "nn-xor" present');
  assert(presetIds.includes('nn-nonlinear-regression'), 'Preset "nn-nonlinear-regression" present');
  assert(presetIds.includes('nn-circular-classification'), 'Preset "nn-circular-classification" present');

  for (const preset of presets) {
    const matrix = preset.rawMatrix ?? preset.points.map(p => [p.x, p.y]);
    const targets = preset.targets ?? preset.points.map(p => p.label ?? 0);
    const taskType = preset.id.includes('regression') ? 'regression' : 'classification';
    const res = nnMod.runNeuralNetwork(matrix, targets, {
      task: taskType,
      epochs: 5,
    });
    assert(res.length > 0, `Preset "${preset.name}" executes cleanly and yields snapshots`);
  }

  // ── 7. EDGE CASES & DIVERGENCE GUARD ─────────────────────────────────────
  console.log('\n[7] Verifying Edge Cases and Divergence Guard:');

  // Divergence Guard with absurd learning rate
  const divSteps = nnMod.runNeuralNetwork(
    [[1, 2], [3, 4], [5, 6]],
    [10, 20, 30],
    {
      task: 'regression',
      learningRate: 1000.0,
      epochs: 50,
      seed: 42,
    }
  );
  const lastDivStep = divSteps[divSteps.length - 1];
  assert(
    lastDivStep.data.backpropStage === 'diverged' || lastDivStep.operation === 'Divergence Guard',
    'Divergence Guard caught exploding loss safely without unhandled exception'
  );

  // Single sample dataset
  const singleSampleSteps = nnMod.runNeuralNetwork(
    [[0.5, 0.5]],
    [1.0],
    { task: 'classification', epochs: 5 }
  );
  assert(singleSampleSteps.length > 0, 'Single sample dataset handled cleanly');

  // Input validation (empty dataset falls back gracefully)
  const emptyFallback = nnMod.runNeuralNetwork([], []);
  assert(emptyFallback.length > 0, 'Empty inputs fallback to default sample dataset gracefully');

  await vite.close();

  // ── SUMMARY ──────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(75));
  console.log(`   AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('='.repeat(75));

  if (failed > 0) {
    process.exit(1);
  }
}

runNeuralNetworkVerification().catch(err => {
  console.error('Fatal error during neural network verification:', err);
  process.exit(1);
});
