import type { AlgorithmStep } from '../../types/algorithm';
import type {
  ActivationFunctionType,
  TaskType,
  NeuralNetworkSnapshot,
  LayerVisualState,
  WeightConnectionVisualState,
  NeuronVisualState,
} from '../../types/ml';
import { neuralNetworkSampleDatasets } from '../../utils/ml/datasets';

export interface NeuralNetworkConfig {
  task?: TaskType;
  hiddenLayers?: number[]; // e.g. [3] or [4, 2]
  activation?: ActivationFunctionType; // hidden activation
  learningRate?: number;
  epochs?: number;
  seed?: number;
  queryInput?: number[];
}

// ── Pure Mathematical Functions ──────────────────────────────────────────────

/**
 * Deterministic pseudo-random number generator (Lehmer LCG).
 */
export function createPRNG(seed = 42): () => number {
  let s = Math.abs(seed) % 2147483647;
  if (s <= 0) s = 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Numerically stable Sigmoid: σ(z) = 1 / (1 + e⁻ᶻ)
 */
export function sigmoid(z: number): number {
  if (z > 40) return 1.0;
  if (z < -40) return 0.0;
  return 1.0 / (1.0 + Math.exp(-z));
}

export function sigmoidDerivative(z: number): number {
  const s = sigmoid(z);
  return s * (1.0 - s);
}

/**
 * Rectified Linear Unit: ReLU(z) = max(0, z)
 */
export function relu(z: number): number {
  return Math.max(0, z);
}

export function reluDerivative(z: number): number {
  return z > 0 ? 1.0 : 0.0;
}

/**
 * Hyperbolic Tangent: tanh(z)
 */
export function tanh(z: number): number {
  return Math.tanh(z);
}

export function tanhDerivative(z: number): number {
  const t = Math.tanh(z);
  return 1.0 - t * t;
}

/**
 * Linear Activation: f(z) = z
 */
export function linear(z: number): number {
  return z;
}

export function linearDerivative(_z: number): number {
  return 1.0;
}

export function activate(z: number, type: ActivationFunctionType): number {
  switch (type) {
    case 'sigmoid':
      return sigmoid(z);
    case 'relu':
      return relu(z);
    case 'tanh':
      return tanh(z);
    case 'linear':
    default:
      return linear(z);
  }
}

export function activateDerivative(z: number, type: ActivationFunctionType): number {
  switch (type) {
    case 'sigmoid':
      return sigmoidDerivative(z);
    case 'relu':
      return reluDerivative(z);
    case 'tanh':
      return tanhDerivative(z);
    case 'linear':
    default:
      return linearDerivative(z);
  }
}

// ── Loss Functions ───────────────────────────────────────────────────────────

/**
 * Mean Squared Error: MSE = (1/n) Σ (y_pred - y_true)²
 */
export function computeMSE(predictions: number[], targets: number[]): number {
  const n = predictions.length;
  if (n === 0) return 0;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const err = predictions[i] - targets[i];
    sum += err * err;
  }
  return sum / n;
}

/**
 * Binary Cross-Entropy: BCE = -(1/n) Σ [y ln(p) + (1-y) ln(1-p)]
 */
export function computeBCE(predictions: number[], targets: number[]): number {
  const n = predictions.length;
  if (n === 0) return 0;
  let sum = 0;
  const eps = 1e-15;

  for (let i = 0; i < n; i++) {
    const y = targets[i];
    const p = Math.min(Math.max(predictions[i], eps), 1.0 - eps);
    sum += y * Math.log(p) + (1.0 - y) * Math.log(1.0 - p);
  }
  return -sum / n;
}

// ── Internal Network Class & Weights ─────────────────────────────────────────

export interface NetworkWeights {
  // weights[l] has dimensions [n_in][n_out]
  weights: number[][][];
  // biases[l] has dimension [n_out]
  biases: number[][];
}

export interface NetworkLayerConfig {
  size: number;
  activation: ActivationFunctionType;
  name: string;
}

export function initializeNetworkWeights(
  layerSizes: number[],
  hiddenActivation: ActivationFunctionType,
  seed = 42
): NetworkWeights {
  const prng = createPRNG(seed);
  const weights: number[][][] = [];
  const biases: number[][] = [];

  for (let l = 0; l < layerSizes.length - 1; l++) {
    const nIn = layerSizes[l];
    const nOut = layerSizes[l + 1];

    // Xavier/Glorot uniform initialization: [-limit, limit]
    // where limit = sqrt(6 / (n_in + n_out))
    // For ReLU: He initialization = sqrt(2 / n_in)
    const isReLU = hiddenActivation === 'relu' && l < layerSizes.length - 2;
    const limit = isReLU
      ? Math.sqrt(2.0 / nIn)
      : Math.sqrt(6.0 / (nIn + nOut));

    const wLayer: number[][] = [];
    for (let i = 0; i < nIn; i++) {
      const wRow: number[] = [];
      for (let j = 0; j < nOut; j++) {
        // Uniform in [-limit, limit]
        const val = (prng() * 2.0 - 1.0) * limit;
        wRow.push(Number(val.toFixed(4)));
      }
      wLayer.push(wRow);
    }
    weights.push(wLayer);

    // Biases initialized to small values or zero
    const bLayer = new Array<number>(nOut).fill(0.0);
    biases.push(bLayer);
  }

  return { weights, biases };
}

export interface ForwardPassResult {
  // activations[l] is activation array of layer l
  activations: number[][];
  // zValues[l] is pre-activation array of layer l (layer 0 is empty)
  zValues: number[][];
  output: number;
}

/**
 * Propagates a single input vector x through the network.
 */
export function forwardPropagate(
  x: number[],
  network: NetworkWeights,
  layerConfigs: NetworkLayerConfig[]
): ForwardPassResult {
  const activations: number[][] = [[...x]];
  const zValues: number[][] = [[]];

  let currentA = [...x];

  for (let l = 0; l < network.weights.length; l++) {
    const W = network.weights[l];
    const b = network.biases[l];
    const actType = layerConfigs[l + 1].activation;
    const nOut = W[0].length;

    const zLayer: number[] = new Array<number>(nOut);
    const aLayer: number[] = new Array<number>(nOut);

    for (let j = 0; j < nOut; j++) {
      let sum = b[j];
      for (let i = 0; i < currentA.length; i++) {
        sum += currentA[i] * W[i][j];
      }
      zLayer[j] = sum;
      aLayer[j] = activate(sum, actType);
    }

    zValues.push(zLayer);
    activations.push(aLayer);
    currentA = aLayer;
  }

  return {
    activations,
    zValues,
    output: currentA[0],
  };
}

export interface BackwardPassGradients {
  weightGradients: number[][][];
  biasGradients: number[][];
  // deltas[l] for layer l (l >= 1)
  deltas: number[][];
}

/**
 * Computes chain-rule backpropagation gradients for a single training example (x, y).
 */
export function backpropagateSample(
  x: number[],
  target: number,
  network: NetworkWeights,
  layerConfigs: NetworkLayerConfig[],
  task: TaskType
): BackwardPassGradients {
  const fwd = forwardPropagate(x, network, layerConfigs);
  const numLayers = layerConfigs.length;

  const deltas: number[][] = new Array<number[]>(numLayers);
  for (let l = 0; l < numLayers; l++) {
    deltas[l] = [];
  }

  // 1. Output Layer Delta (Layer M - 1)
  const lastLayerIdx = numLayers - 1;
  const outputPred = fwd.output;
  const outputZ = fwd.zValues[lastLayerIdx][0];
  const outputActType = layerConfigs[lastLayerIdx].activation;

  let deltaOutput: number;
  if (task === 'classification') {
    // Binary cross-entropy with sigmoid output: dL/dz = pred - target
    deltaOutput = outputPred - target;
  } else {
    // Regression with linear/MSE: dL/dz = 2 * (pred - target) * linear'(z)
    deltaOutput = 2.0 * (outputPred - target) * activateDerivative(outputZ, outputActType);
  }
  deltas[lastLayerIdx] = [deltaOutput];

  // 2. Hidden Layers Deltas: propagating backward from M - 2 down to 1
  for (let l = lastLayerIdx - 1; l >= 1; l--) {
    const nextW = network.weights[l]; // connects layer l to layer l+1
    const nextDelta = deltas[l + 1];
    const currentZ = fwd.zValues[l];
    const actType = layerConfigs[l].activation;

    const currentDelta: number[] = new Array<number>(currentZ.length);
    for (let i = 0; i < currentZ.length; i++) {
      let sum = 0;
      for (let j = 0; j < nextDelta.length; j++) {
        sum += nextW[i][j] * nextDelta[j];
      }
      currentDelta[i] = sum * activateDerivative(currentZ[i], actType);
    }
    deltas[l] = currentDelta;
  }

  // 3. Compute Gradients for Weights and Biases
  const weightGradients: number[][][] = [];
  const biasGradients: number[][] = [];

  for (let l = 0; l < network.weights.length; l++) {
    const prevA = fwd.activations[l];
    const deltaNext = deltas[l + 1];
    const nIn = prevA.length;
    const nOut = deltaNext.length;

    const wGradLayer: number[][] = [];
    for (let i = 0; i < nIn; i++) {
      const wGradRow: number[] = [];
      for (let j = 0; j < nOut; j++) {
        wGradRow.push(prevA[i] * deltaNext[j]);
      }
      wGradLayer.push(wGradRow);
    }
    weightGradients.push(wGradLayer);

    const bGradLayer = [...deltaNext];
    biasGradients.push(bGradLayer);
  }

  return { weightGradients, biasGradients, deltas };
}

/**
 * Evaluates the full dataset and returns predictions and total loss.
 */
export function evaluateDataset(
  inputs: number[][],
  targets: number[],
  network: NetworkWeights,
  layerConfigs: NetworkLayerConfig[],
  task: TaskType
): { predictions: number[]; loss: number } {
  const predictions = inputs.map(x => forwardPropagate(x, network, layerConfigs).output);
  const loss = task === 'classification'
    ? computeBCE(predictions, targets)
    : computeMSE(predictions, targets);
  return { predictions, loss };
}

/**
 * Builds Visual Snapshot for the UI Visualizer.
 */
function buildVisualSnapshot(
  network: NetworkWeights,
  layerConfigs: NetworkLayerConfig[],
  task: TaskType,
  epoch: number,
  totalEpochs: number,
  loss: number,
  lossHistory: number[],
  inputSample: number[],
  target: number,
  learningRate: number,
  fwd?: ForwardPassResult,
  grads?: BackwardPassGradients,
  backpropStage?: NeuralNetworkSnapshot['backpropStage'],
  activeLayer?: number,
  converged = false
): NeuralNetworkSnapshot {
  const layers: LayerVisualState[] = layerConfigs.map((lc, lIdx) => {
    const neurons: NeuronVisualState[] = [];
    const isInput = lIdx === 0;

    for (let nIdx = 0; nIdx < lc.size; nIdx++) {
      const z = isInput ? (fwd?.activations[0][nIdx] ?? inputSample[nIdx] ?? 0) : (fwd?.zValues[lIdx]?.[nIdx] ?? 0);
      const a = isInput ? (inputSample[nIdx] ?? 0) : (fwd?.activations[lIdx]?.[nIdx] ?? 0);
      const delta = grads?.deltas[lIdx]?.[nIdx];
      const bias = isInput ? 0 : network.biases[lIdx - 1]?.[nIdx] ?? 0;
      const biasGrad = isInput ? undefined : grads?.biasGradients[lIdx - 1]?.[nIdx];

      neurons.push({
        layerIndex: lIdx,
        neuronIndex: nIdx,
        label: isInput ? `X${nIdx + 1}` : lIdx === layerConfigs.length - 1 ? 'Ŷ' : `H${lIdx}.${nIdx + 1}`,
        z: Number(z.toFixed(4)),
        a: Number(a.toFixed(4)),
        delta: delta !== undefined ? Number(delta.toFixed(4)) : undefined,
        bias: Number(bias.toFixed(4)),
        biasGradient: biasGrad !== undefined ? Number(biasGrad.toFixed(4)) : undefined,
      });
    }

    return {
      layerIndex: lIdx,
      name: lc.name,
      activation: lc.activation,
      neuronCount: lc.size,
      neurons,
    };
  });

  const connections: WeightConnectionVisualState[] = [];
  for (let l = 0; l < network.weights.length; l++) {
    const W = network.weights[l];
    for (let i = 0; i < W.length; i++) {
      for (let j = 0; j < W[i].length; j++) {
        connections.push({
          sourceLayer: l,
          sourceNeuron: i,
          targetLayer: l + 1,
          targetNeuron: j,
          weight: Number(W[i][j].toFixed(4)),
          gradient: grads?.weightGradients[l]?.[i]?.[j] !== undefined
            ? Number(grads.weightGradients[l][i][j].toFixed(4))
            : undefined,
        });
      }
    }
  }

  return {
    type: 'neural-network',
    task,
    layers,
    connections,
    currentEpoch: epoch,
    totalEpochs,
    currentLoss: Number(loss.toFixed(4)),
    lossHistory,
    inputSample,
    targetValue: target,
    predictedValue: fwd ? Number(fwd.output.toFixed(4)) : 0,
    activeLayer,
    backpropStage,
    learningRate,
    converged,
  };
}

// ── Main Step Generator ──────────────────────────────────────────────────────

export function runNeuralNetwork(
  customInputs?: number[][],
  customTargets?: number[],
  config?: NeuralNetworkConfig
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];

  const defaultDataset = neuralNetworkSampleDatasets[1]; // Binary classification default
  const rawInputs: number[][] = (customInputs !== undefined && customInputs.length > 0)
    ? (customInputs as any[]).map(r => Array.isArray(r) ? [...r] : [Number(r?.x ?? 0), Number(r?.y ?? 0)])
    : defaultDataset.rawMatrix !== undefined
      ? defaultDataset.rawMatrix.map(r => [...r])
      : defaultDataset.points.map(p => [p.x, p.y]);

  const rawTargets: number[] = (customTargets !== undefined && customTargets.length > 0)
    ? [...customTargets]
    : defaultDataset.targets !== undefined
      ? [...defaultDataset.targets]
      : defaultDataset.points.map(p => Number(p.label ?? 0));

  const task: TaskType = config?.task ?? (defaultDataset.category === 'neural-network' && defaultDataset.id.includes('regression') ? 'regression' : 'classification');
  const hiddenArchitecture = config?.hiddenLayers && config.hiddenLayers.length > 0
    ? config.hiddenLayers.map(h => Math.max(1, Math.min(8, Math.floor(h))))
    : [3]; // default 1 hidden layer with 3 neurons
  const hiddenActivation: ActivationFunctionType = config?.activation ?? (task === 'classification' ? 'tanh' : 'relu');
  const outputActivation: ActivationFunctionType = task === 'classification' ? 'sigmoid' : 'linear';
  const lr = Math.max(0.001, Math.min(1.0, config?.learningRate ?? 0.1));
  const epochs = Math.max(1, Math.min(100, config?.epochs ?? 15));
  const seed = config?.seed ?? 42;

  const n = rawInputs.length;
  const dIn = n > 0 ? rawInputs[0].length : 0;

  // Validation 1: Empty dataset or empty targets
  if (n === 0 || dIn === 0 || rawTargets.length === 0) {
    steps.push({
      data: {
        type: 'neural-network',
        task,
        layers: [],
        connections: [],
        currentEpoch: 0,
        totalEpochs: epochs,
        currentLoss: 0,
        lossHistory: [],
        inputSample: [],
        targetValue: 0,
        predictedValue: 0,
        learningRate: lr,
      },
      description: 'Neural Network requires at least 2 training examples and 1 feature dimension.',
      highlightLines: [0],
      operation: 'Invalid Dataset',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Validation 2: Mismatched input samples and target lengths
  if (n !== rawTargets.length) {
    steps.push({
      data: {
        type: 'neural-network',
        task,
        layers: [],
        connections: [],
        currentEpoch: 0,
        totalEpochs: epochs,
        currentLoss: 0,
        lossHistory: [],
        inputSample: [],
        targetValue: 0,
        predictedValue: 0,
        learningRate: lr,
      },
      description: `Mismatched lengths: input matrix contains ${n} rows but targets array contains ${rawTargets.length} values.`,
      highlightLines: [0],
      operation: 'Dimension Mismatch Error',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Validation 3: Ragged matrix detection
  if (rawInputs.some(r => r.length !== dIn)) {
    steps.push({
      data: {
        type: 'neural-network',
        task,
        layers: [],
        connections: [],
        currentEpoch: 0,
        totalEpochs: epochs,
        currentLoss: 0,
        lossHistory: [],
        inputSample: [],
        targetValue: 0,
        predictedValue: 0,
        learningRate: lr,
      },
      description: 'Dataset contains ragged rows: all input samples must have the identical feature count.',
      highlightLines: [0],
      operation: 'Ragged Rows Error',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Validation 4: Non-finite inputs or targets
  const hasNonFinite = rawInputs.some(r => r.some(v => !isFinite(v) || isNaN(v))) || rawTargets.some(t => !isFinite(t) || isNaN(t));
  if (hasNonFinite) {
    steps.push({
      data: {
        type: 'neural-network',
        task,
        layers: [],
        connections: [],
        currentEpoch: 0,
        totalEpochs: epochs,
        currentLoss: 0,
        lossHistory: [],
        inputSample: [],
        targetValue: 0,
        predictedValue: 0,
        learningRate: lr,
      },
      description: 'Dataset contains non-numeric, NaN, or non-finite values.',
      highlightLines: [0],
      operation: 'Invalid Coordinates',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Feature Normalization for robust educational neural training
  const means: number[] = new Array<number>(dIn).fill(0);
  const stds: number[] = new Array<number>(dIn).fill(0);
  for (let j = 0; j < dIn; j++) {
    means[j] = rawInputs.reduce((sum, r) => sum + r[j], 0) / n;
    const variance = rawInputs.reduce((sum, r) => sum + (r[j] - means[j]) ** 2, 0) / n;
    stds[j] = Math.sqrt(variance) || 1.0;
  }
  const normInputs = rawInputs.map(r => r.map((val, j) => (val - means[j]) / stds[j]));

  // Setup Layer Configurations
  const layerConfigs: NetworkLayerConfig[] = [
    { size: dIn, activation: 'linear', name: `Input Layer (${dIn})` },
    ...hiddenArchitecture.map((hSize, idx) => ({
      size: hSize,
      activation: hiddenActivation,
      name: `Hidden Layer ${idx + 1} (${hSize})`,
    })),
    { size: 1, activation: outputActivation, name: `Output Layer (1)` },
  ];

  const layerSizes = layerConfigs.map(lc => lc.size);
  const network = initializeNetworkWeights(layerSizes, hiddenActivation, seed);

  // Evaluate initial state
  const initialEval = evaluateDataset(normInputs, rawTargets, network, layerConfigs, task);
  const lossHistory: number[] = [Number(initialEval.loss.toFixed(4))];

  // Pick illustrative sample for detailed forward and backprop visualization
  const sampleIdx = 0;
  const sampleX = normInputs[sampleIdx];
  const sampleY = rawTargets[sampleIdx];
  const sampleRawX = rawInputs[sampleIdx];

  // Step 1: Initial Architecture & Weights
  const initFwd = forwardPropagate(sampleX, network, layerConfigs);
  steps.push({
    data: buildVisualSnapshot(
      network,
      layerConfigs,
      task,
      0,
      epochs,
      initialEval.loss,
      lossHistory,
      sampleRawX,
      sampleY,
      lr,
      initFwd,
      undefined,
      'forward',
      0
    ),
    description: `Initialized ${layerSizes.join('-')} Feed-Forward Neural Network (${task.toUpperCase()}). Initial loss: ${initialEval.loss.toFixed(4)} using ${task === 'classification' ? 'Binary Cross-Entropy' : 'Mean Squared Error'}. Hidden activation: ${hiddenActivation.toUpperCase()}, Output: ${outputActivation.toUpperCase()}.`,
    highlightLines: [0, 1],
    operation: 'Network Initialization',
    phase: 'Architecture Setup',
    auxiliary: [
      { label: 'Architecture', value: layerSizes.join(' → ') },
      { label: 'Initial Loss', value: Number(initialEval.loss.toFixed(4)) },
      { label: 'Hidden Activation', value: hiddenActivation.toUpperCase() },
      { label: 'Task', value: task === 'classification' ? 'Binary Classification' : 'Regression' },
    ],
    lineExplanation: 'initialize_network(layers); weights ~ Glorot/He(seed); biases = 0',
  });

  // Step 2: Forward Propagation on Illustrative Sample
  steps.push({
    data: buildVisualSnapshot(
      network,
      layerConfigs,
      task,
      0,
      epochs,
      initialEval.loss,
      lossHistory,
      sampleRawX,
      sampleY,
      lr,
      initFwd,
      undefined,
      'forward',
      1
    ),
    description: `Forward Pass on Sample [${sampleRawX.join(', ')}]: Computed weighted sums z = Σ w·x + b and applied ${hiddenActivation.toUpperCase()} activations. Output neuron produced prediction ŷ = ${initFwd.output.toFixed(4)} against target y = ${sampleY}.`,
    highlightLines: [2, 3],
    operation: 'Forward Propagation',
    phase: 'Forward Pass',
    auxiliary: [
      { label: 'Input Sample', value: `[${sampleRawX.join(', ')}]` },
      { label: 'Prediction ŷ', value: Number(initFwd.output.toFixed(4)) },
      { label: 'Ground Truth y', value: sampleY },
    ],
    lineExplanation: 'for l in 1..L: z[l] = W[l]*a[l-1] + b[l]; a[l] = phi(z[l])',
  });

  // Step 3: Output Error & Loss Calculation
  const initialGrads = backpropagateSample(sampleX, sampleY, network, layerConfigs, task);
  const outputDelta = initialGrads.deltas[layerConfigs.length - 1][0];

  steps.push({
    data: buildVisualSnapshot(
      network,
      layerConfigs,
      task,
      0,
      epochs,
      initialEval.loss,
      lossHistory,
      sampleRawX,
      sampleY,
      lr,
      initFwd,
      initialGrads,
      'output-error',
      layerConfigs.length - 1
    ),
    description: `Computed Output Loss and Error Signal: Output error δ_out = ∂L/∂z = ${outputDelta.toFixed(4)}. Target: ${sampleY}, Prediction: ${initFwd.output.toFixed(4)}, Residual: ${(initFwd.output - sampleY).toFixed(4)}.`,
    highlightLines: [4, 5],
    operation: 'Output Error Signal',
    phase: 'Error Calculation',
    auxiliary: [
      { label: 'Loss Formula', value: task === 'classification' ? 'Binary Cross-Entropy' : 'Mean Squared Error' },
      { label: 'Output Delta δ', value: Number(outputDelta.toFixed(4)) },
      { label: 'Error (ŷ - y)', value: Number((initFwd.output - sampleY).toFixed(4)) },
    ],
    lineExplanation: 'loss = compute_loss(y_hat, y); delta[L] = grad_loss(y_hat, y)',
  });

  // Step 4: Backpropagating Gradients through Hidden Layers
  steps.push({
    data: buildVisualSnapshot(
      network,
      layerConfigs,
      task,
      0,
      epochs,
      initialEval.loss,
      lossHistory,
      sampleRawX,
      sampleY,
      lr,
      initFwd,
      initialGrads,
      'backprop-hidden',
      1
    ),
    description: `Backpropagation: Propagating error backward via chain rule: δ[l] = (W[l+1]ᵀ · δ[l+1]) ⊙ φ'(z[l]). Hidden neurons computed local error gradients to guide weight adjustments.`,
    highlightLines: [6, 7],
    operation: 'Backpropagation',
    phase: 'Gradient Backprop',
    auxiliary: [
      { label: 'Chain Rule', value: 'δ[l] = (W[l+1]ᵀ · δ[l+1]) ⊙ φ\'(z[l])' },
      { label: 'Hidden Deltas', value: `[${initialGrads.deltas[1].map(d => d.toFixed(3)).join(', ')}]` },
    ],
    lineExplanation: 'for l in (L-1)..1: delta[l] = (W[l+1].T * delta[l+1]) * phi_prime(z[l])',
  });

  // Training Loop: Full-Batch Gradient Descent
  let currentLoss = initialEval.loss;
  const epochInterval = epochs <= 10 ? 1 : Math.ceil(epochs / 10);

  for (let epoch = 1; epoch <= epochs; epoch++) {
    // 1. Accumulate gradients over all n samples in dataset
    const batchWeightGrads: number[][][] = network.weights.map(W =>
      W.map(row => new Array<number>(row.length).fill(0))
    );
    const batchBiasGrads: number[][] = network.biases.map(b =>
      new Array<number>(b.length).fill(0)
    );

    for (let i = 0; i < n; i++) {
      const sampleGradients = backpropagateSample(normInputs[i], rawTargets[i], network, layerConfigs, task);
      // Accumulate
      for (let l = 0; l < network.weights.length; l++) {
        for (let r = 0; r < network.weights[l].length; r++) {
          for (let c = 0; c < network.weights[l][r].length; c++) {
            batchWeightGrads[l][r][c] += sampleGradients.weightGradients[l][r][c];
          }
        }
        for (let bIdx = 0; bIdx < network.biases[l].length; bIdx++) {
          batchBiasGrads[l][bIdx] += sampleGradients.biasGradients[l][bIdx];
        }
      }
    }

    // Average gradients over batch
    for (let l = 0; l < network.weights.length; l++) {
      for (let r = 0; r < network.weights[l].length; r++) {
        for (let c = 0; c < network.weights[l][r].length; c++) {
          batchWeightGrads[l][r][c] /= n;
        }
      }
      for (let bIdx = 0; bIdx < network.biases[l].length; bIdx++) {
        batchBiasGrads[l][bIdx] /= n;
      }
    }

    // 2. Apply Gradient Descent Update: W := W - lr * grad_W, b := b - lr * grad_b
    for (let l = 0; l < network.weights.length; l++) {
      for (let r = 0; r < network.weights[l].length; r++) {
        for (let c = 0; c < network.weights[l][r].length; c++) {
          network.weights[l][r][c] -= lr * batchWeightGrads[l][r][c];
        }
      }
      for (let bIdx = 0; bIdx < network.biases[l].length; bIdx++) {
        network.biases[l][bIdx] -= lr * batchBiasGrads[l][bIdx];
      }
    }

    // Re-evaluate model loss
    const epochEval = evaluateDataset(normInputs, rawTargets, network, layerConfigs, task);
    currentLoss = epochEval.loss;
    lossHistory.push(Number(currentLoss.toFixed(4)));

    // Divergence Guard
    if (!isFinite(currentLoss) || isNaN(currentLoss) || currentLoss > 1e6) {
      steps.push({
        data: buildVisualSnapshot(
          network,
          layerConfigs,
          task,
          epoch,
          epochs,
          9999,
          lossHistory,
          sampleRawX,
          sampleY,
          lr,
          undefined,
          undefined,
          'diverged'
        ),
        description: `Training diverged at Epoch ${epoch}! Loss exploded or produced non-finite values. Reduce learning rate η or try different activation.`,
        highlightLines: [8],
        operation: 'Divergence Guard',
        phase: 'Exploding Loss',
        auxiliary: [{ label: 'Status', value: 'Diverged' }, { label: 'Action', value: 'Reduce Learning Rate' }],
      });
      return steps;
    }

    // Capture visual snapshots at designated intervals
    if (epoch === 1 || epoch % epochInterval === 0 || epoch === epochs) {
      const epochFwd = forwardPropagate(sampleX, network, layerConfigs);
      const epochGrads = backpropagateSample(sampleX, sampleY, network, layerConfigs, task);

      steps.push({
        data: buildVisualSnapshot(
          network,
          layerConfigs,
          task,
          epoch,
          epochs,
          currentLoss,
          lossHistory,
          sampleRawX,
          sampleY,
          lr,
          epochFwd,
          epochGrads,
          'gradient-update'
        ),
        description: `Epoch ${epoch}/${epochs}: Parameter update W := W - η·∇W completed. Training loss decreased to ${currentLoss.toFixed(4)}. Sample prediction ŷ = ${epochFwd.output.toFixed(4)} (Target: ${sampleY}).`,
        highlightLines: [8, 9],
        operation: 'Gradient Update',
        phase: `Epoch ${epoch}`,
        auxiliary: [
          { label: 'Epoch', value: `${epoch}/${epochs}` },
          { label: 'Current Loss', value: Number(currentLoss.toFixed(4)) },
          { label: 'Learning Rate η', value: lr },
          { label: 'Sample Output ŷ', value: Number(epochFwd.output.toFixed(4)) },
        ],
        lineExplanation: 'W[l] = W[l] - lr * grad_W[l]; b[l] = b[l] - lr * grad_b[l]',
      });
    }
  }

  // Final Step: Model Training Complete & Summary
  const finalEval = evaluateDataset(normInputs, rawTargets, network, layerConfigs, task);
  const finalFwd = forwardPropagate(sampleX, network, layerConfigs);
  let accuracyText = '';
  if (task === 'classification') {
    const correct = finalEval.predictions.filter((p, i) => (p >= 0.5 ? 1 : 0) === rawTargets[i]).length;
    const accPct = ((correct / n) * 100).toFixed(1);
    accuracyText = ` Accuracy: ${accPct}% (${correct}/${n} correct).`;
  }

  steps.push({
    data: buildVisualSnapshot(
      network,
      layerConfigs,
      task,
      epochs,
      epochs,
      finalEval.loss,
      lossHistory,
      sampleRawX,
      sampleY,
      lr,
      finalFwd,
      undefined,
      'epoch-summary',
      undefined,
      true
    ),
    description: `Neural Network Training Complete after ${epochs} epochs! Final Loss: ${finalEval.loss.toFixed(4)} (Initial: ${initialEval.loss.toFixed(4)}).${accuracyText} All weights and biases successfully optimized.`,
    highlightLines: [10],
    operation: 'Training Complete',
    phase: 'Trained Model',
    auxiliary: [
      { label: 'Final Loss', value: Number(finalEval.loss.toFixed(4)) },
      { label: 'Total Reduction', value: `${(((initialEval.loss - finalEval.loss) / initialEval.loss) * 100).toFixed(1)}%` },
      { label: 'Total Epochs', value: epochs },
      { label: 'Status', value: 'Converged' },
    ],
    lineExplanation: 'training_complete; evaluate_model_on_test_data()',
  });

  return steps;
}
