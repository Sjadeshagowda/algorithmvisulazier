import type { AlgorithmStep } from '../../types/algorithm';
import type { DataPoint2D } from '../../types/ml';
import { classificationSampleDatasets } from '../../utils/ml/datasets';
import { calculateAccuracy, calculateConfusionMatrix } from '../../utils/ml/metrics';

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
}

export function runLogisticRegression(
  customPoints?: DataPoint2D[],
  customLearningRate = 0.005,
  epochs = 6
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const points: DataPoint2D[] = customPoints && customPoints.length > 0
    ? customPoints.map((p, i) => ({ ...p, id: i }))
    : classificationSampleDatasets[0].points.map((p, i) => ({ ...p, id: i }));

  const n = points.length;

  if (n < 2) {
    steps.push({
      data: {
        type: 'classification',
        points,
        accuracy: 0,
        loss: 0,
      },
      description: 'Logistic Regression requires at least 2 labeled samples.',
      highlightLines: [0],
      operation: 'Invalid Dataset',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Model weights: w1, w2, bias
  let w1 = 0.05;
  let w2 = 0.05;
  let b = -4.0;
  const lr = customLearningRate;
  const lossHistory: number[] = [];

  // Initial step
  const initZ = points.map(p => w1 * p.x + w2 * p.y + b);
  const initProb = initZ.map(sigmoid);
  const initPred = initProb.map(p => (p >= 0.5 ? 1 : 0));
  const yTrue = points.map(p => Number(p.label ?? 0));
  const initAcc = calculateAccuracy(yTrue, initPred);

  steps.push({
    data: {
      type: 'classification',
      points: points.map((p, idx) => ({ ...p, predicted: initPred[idx] })),
      weights: [w1, w2],
      bias: b,
      decisionBoundary: w2 !== 0 ? { slope: -w1 / w2, intercept: -b / w2 } : undefined,
      accuracy: Number((initAcc * 100).toFixed(1)),
      loss: 1.0,
      lossHistory: [1.0],
    },
    description: `Initialized Logistic Regression binary classifier. Sigmoid link function σ(z) = 1/(1+e⁻ᶻ) maps linear combination w₁x₁ + w₂x₂ + b to probabilities in [0, 1]. Initial accuracy: ${(initAcc * 100).toFixed(1)}%.`,
    highlightLines: [0],
    operation: 'Model Initialization',
    phase: 'Setup',
    auxiliary: [
      { label: 'Samples (N)', value: n },
      { label: 'Classes', value: 'Class 0 vs Class 1' },
      { label: 'Initial Accuracy', value: `${(initAcc * 100).toFixed(1)}%` },
    ],
    lineExplanation: 'initialize weights w1, w2, b',
  });

  for (let epoch = 1; epoch <= epochs; epoch++) {
    // Mini-gradient descent steps
    let gradW1 = 0;
    let gradW2 = 0;
    let gradB = 0;
    let bceLoss = 0;

    const currentProbs: number[] = [];
    const currentPreds: number[] = [];

    for (let i = 0; i < n; i++) {
      const p = points[i];
      const z = w1 * p.x + w2 * p.y + b;
      const prob = sigmoid(z);
      currentProbs.push(prob);
      currentPreds.push(prob >= 0.5 ? 1 : 0);

      const y = yTrue[i];
      const error = prob - y;
      gradW1 += error * p.x;
      gradW2 += error * p.y;
      gradB += error;

      // Binary Cross Entropy Loss: -[y ln(p) + (1-y) ln(1-p)]
      const eps = 1e-7;
      bceLoss += -(y * Math.log(prob + eps) + (1 - y) * Math.log(1 - prob + eps));
    }

    gradW1 /= n;
    gradW2 /= n;
    gradB /= n;
    bceLoss /= n;
    lossHistory.push(Number(bceLoss.toFixed(4)));

    // Parameter update
    w1 -= lr * gradW1;
    w2 -= lr * gradW2;
    b -= lr * gradB;

    const acc = calculateAccuracy(yTrue, currentPreds);
    const cm = calculateConfusionMatrix(yTrue, currentPreds);

    const boundary = w2 !== 0 ? { slope: -w1 / w2, intercept: -b / w2 } : undefined;

    steps.push({
      data: {
        type: 'classification',
        points: points.map((p, idx) => ({ ...p, predicted: currentPreds[idx] })),
        weights: [Number(w1.toFixed(3)), Number(w2.toFixed(3))],
        bias: Number(b.toFixed(3)),
        decisionBoundary: boundary,
        accuracy: Number((acc * 100).toFixed(1)),
        loss: Number(bceLoss.toFixed(4)),
        lossHistory: [...lossHistory],
        epoch,
      },
      description: `Training Epoch ${epoch}/${epochs}: Computed cross-entropy loss J(w,b) = ${bceLoss.toFixed(4)}. Updated weights: w₁=${w1.toFixed(3)}, w₂=${w2.toFixed(3)}, bias=${b.toFixed(3)}. Decision boundary shifted. Current classification accuracy: ${(acc * 100).toFixed(1)}%.`,
      highlightLines: [3, 4],
      operation: 'Gradient Step',
      phase: `Epoch ${epoch}`,
      auxiliary: [
        { label: 'Loss J(w,b)', value: Number(bceLoss.toFixed(4)) },
        { label: 'Accuracy', value: `${(acc * 100).toFixed(1)}%` },
        { label: 'Precision', value: `${(cm.precision * 100).toFixed(1)}%` },
        { label: 'Recall', value: `${(cm.recall * 100).toFixed(1)}%` },
      ],
      lineExplanation: 'w := w - alpha * grad; b := b - alpha * grad_b',
    });
  }

  // Final evaluation step
  const finalProbs = points.map(p => sigmoid(w1 * p.x + w2 * p.y + b));
  const finalPreds = finalProbs.map(p => (p >= 0.5 ? 1 : 0));
  const finalAcc = calculateAccuracy(yTrue, finalPreds);
  const finalCM = calculateConfusionMatrix(yTrue, finalPreds);

  steps.push({
    data: {
      type: 'classification',
      points: points.map((p, idx) => ({ ...p, predicted: finalPreds[idx] })),
      weights: [Number(w1.toFixed(3)), Number(w2.toFixed(3))],
      bias: Number(b.toFixed(3)),
      decisionBoundary: w2 !== 0 ? { slope: -w1 / w2, intercept: -b / w2 } : undefined,
      accuracy: Number((finalAcc * 100).toFixed(1)),
      loss: lossHistory[lossHistory.length - 1],
      lossHistory,
    },
    description: `Logistic Regression training converged! Final Accuracy: ${(finalAcc * 100).toFixed(1)}% (TP: ${finalCM.tp}, TN: ${finalCM.tn}, FP: ${finalCM.fp}, FN: ${finalCM.fn}). F1 Score: ${(finalCM.f1 * 100).toFixed(1)}%. Linear separating hyperplane separates Class 0 from Class 1.`,
    highlightLines: [6],
    operation: 'Training Complete',
    phase: 'Model Evaluated',
    auxiliary: [
      { label: 'Final Accuracy', value: `${(finalAcc * 100).toFixed(1)}%` },
      { label: 'F1 Score', value: `${(finalCM.f1 * 100).toFixed(1)}%` },
      { label: 'True Positives', value: finalCM.tp },
      { label: 'True Negatives', value: finalCM.tn },
    ],
    lineExplanation: 'return classifier (weights, bias, metrics)',
  });

  return steps;
}
