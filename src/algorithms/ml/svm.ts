import type { AlgorithmStep } from '../../types/algorithm';
import type { DataPoint2D, SVMPointData } from '../../types/ml';
import { svmSampleDatasets } from '../../utils/ml/datasets';

export interface SVMConfig {
  c?: number;
  learningRate?: number;
  epochs?: number;
  queryPoint?: { x: number; y: number };
}

// ── Pure Mathematical Functions ──────────────────────────────────────────────

export function computeHingeLoss(yTrue: number, decisionScore: number): number {
  return Math.max(0, 1 - yTrue * decisionScore);
}

export function computeSVMObjective(
  weights: [number, number],
  bias: number,
  points: { x: number; y: number; label?: string | number }[],
  c: number
): { regLoss: number; totalHingeLoss: number; totalObjective: number } {
  const normSq = weights[0] * weights[0] + weights[1] * weights[1];
  const regLoss = 0.5 * normSq;

  let totalHingeLoss = 0;
  for (const p of points) {
    const rawLabel = Number(p.label ?? 1);
    const y = rawLabel === 0 ? -1 : rawLabel === -1 ? -1 : 1;
    const score = weights[0] * p.x + weights[1] * p.y + bias;
    totalHingeLoss += computeHingeLoss(y, score);
  }

  const totalObjective = regLoss + c * totalHingeLoss;
  return { regLoss, totalHingeLoss, totalObjective };
}

export function predictSVM(
  weights: [number, number],
  bias: number,
  point: { x: number; y: number }
): { decisionScore: number; predictedClass: number; marginDistance: number } {
  const decisionScore = weights[0] * point.x + weights[1] * point.y + bias;
  const predictedClass = decisionScore >= 0 ? 1 : -1;
  const norm = Math.sqrt(weights[0] * weights[0] + weights[1] * weights[1]);
  const marginDistance = norm > 1e-7 ? decisionScore / norm : 0;
  return { decisionScore, predictedClass, marginDistance };
}

// ── Main Step Generator ──────────────────────────────────────────────────────

export function runSVM(
  customPoints?: DataPoint2D[],
  config?: SVMConfig
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const points: DataPoint2D[] = customPoints !== undefined
    ? customPoints.map((p, i) => ({ ...p, id: i }))
    : svmSampleDatasets[0].points.map((p, i) => ({ ...p, id: i }));

  const c = Math.max(0.01, Math.min(100, config?.c ?? 1.0));
  const baseLR = Math.max(0.0001, Math.min(1.0, config?.learningRate ?? 0.005));
  const epochs = Math.max(1, Math.min(50, config?.epochs ?? 10));
  const queryPoint = config?.queryPoint ?? { x: 50, y: 50 };

  const n = points.length;

  // Validation 1: Empty or fewer than 2 points
  if (n < 2) {
    steps.push({
      data: {
        type: 'svm',
        points: [],
        weights: [0, 0],
        bias: 0,
        c,
        epoch: 0,
        totalEpochs: epochs,
        totalHingeLoss: 0,
        regLoss: 0,
        objectiveValue: 0,
        marginWidth: 0,
        supportVectorCount: 0,
      },
      description: 'Support Vector Machine requires at least 2 training samples.',
      highlightLines: [0],
      operation: 'Invalid Dataset',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Validation 2: Non-finite coordinates or labels
  const hasInvalidCoords = points.some(p => !isFinite(p.x) || !isFinite(p.y) || isNaN(p.x) || isNaN(p.y));
  if (hasInvalidCoords) {
    steps.push({
      data: {
        type: 'svm',
        points: [],
        weights: [0, 0],
        bias: 0,
        c,
        epoch: 0,
        totalEpochs: epochs,
        totalHingeLoss: 0,
        regLoss: 0,
        objectiveValue: 0,
        marginWidth: 0,
        supportVectorCount: 0,
      },
      description: 'Dataset contains invalid or non-finite numerical coordinates.',
      highlightLines: [0],
      operation: 'Invalid Coordinates',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Normalize labels into {-1, +1}
  const normalizedLabels = points.map(p => {
    const raw = Number(p.label ?? 1);
    return raw === 0 ? -1 : raw === -1 ? -1 : 1;
  });

  const posCount = normalizedLabels.filter(y => y === 1).length;
  const negCount = normalizedLabels.filter(y => y === -1).length;

  // Validation 3: Both classes required
  if (posCount === 0 || negCount === 0) {
    steps.push({
      data: {
        type: 'svm',
        points: points.map((p, idx) => ({ ...p, label: normalizedLabels[idx] })),
        weights: [0, 0],
        bias: 0,
        c,
        epoch: 0,
        totalEpochs: epochs,
        totalHingeLoss: 0,
        regLoss: 0,
        objectiveValue: 0,
        marginWidth: 0,
        supportVectorCount: 0,
      },
      description: `Support Vector Machine binary classification requires examples from both classes (+1 and -1). Current dataset contains only ${posCount > 0 ? 'positive (+1)' : 'negative (-1)'} samples.`,
      highlightLines: [0],
      operation: 'Single Class Error',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Feature Normalization for robust subgradient optimization
  // Map points to [0, 1] internally for stable learning, then transform weights back
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;
  const stdX = Math.sqrt(points.reduce((sum, p) => sum + (p.x - meanX) ** 2, 0) / n) || 1;
  const stdY = Math.sqrt(points.reduce((sum, p) => sum + (p.y - meanY) ** 2, 0) / n) || 1;

  // Initialize weights in normalized space, with slight separation bias
  let wNorm1 = (points.filter(p => p.label === 1).reduce((s, p) => s + (p.x - meanX) / stdX, 0) / posCount) -
              (points.filter(p => p.label === -1 || p.label === 0).reduce((s, p) => s + (p.x - meanX) / stdX, 0) / negCount);
  let wNorm2 = (points.filter(p => p.label === 1).reduce((s, p) => s + (p.y - meanY) / stdY, 0) / posCount) -
              (points.filter(p => p.label === -1 || p.label === 0).reduce((s, p) => s + (p.y - meanY) / stdY, 0) / negCount);
  let bNorm = 0;

  // Normalize initial vector magnitude
  const initMag = Math.sqrt(wNorm1 * wNorm1 + wNorm2 * wNorm2) || 1;
  wNorm1 = (wNorm1 / initMag) * 0.5;
  wNorm2 = (wNorm2 / initMag) * 0.5;

  function getPhysicalParameters(wn1: number, wn2: number, bn: number): { w: [number, number]; b: number } {
    const w1 = wn1 / stdX;
    const w2 = wn2 / stdY;
    const b = bn - (wn1 * meanX / stdX) - (wn2 * meanY / stdY);
    return { w: [w1, w2], b };
  }

  function getBoundaryGeometry(w1: number, w2: number, b: number, offset = 0) {
    if (Math.abs(w2) < 1e-6) {
      if (Math.abs(w1) < 1e-6) return undefined;
      return { isVertical: true, xIntercept: (-b + offset) / w1 };
    }
    return {
      isVertical: false,
      slope: -w1 / w2,
      intercept: (-b + offset) / w2,
    };
  }

  function evaluatePoints(w: [number, number], b: number): SVMPointData[] {
    return points.map((p, idx) => {
      const y = normalizedLabels[idx];
      const score = w[0] * p.x + w[1] * p.y + b;
      const functionalMargin = y * score;
      const hinge = computeHingeLoss(y, score);
      // Primal margin approximation: points on or violating margin
      const isSupportVector = functionalMargin <= 1.05;

      return {
        ...p,
        label: y,
        decisionScore: Number(score.toFixed(3)),
        functionalMargin: Number(functionalMargin.toFixed(3)),
        hingeLoss: Number(hinge.toFixed(3)),
        isSupportVector,
      };
    });
  }

  // Step 1: Initial State
  const initialParams = getPhysicalParameters(wNorm1, wNorm2, bNorm);
  const initialPoints = evaluatePoints(initialParams.w, initialParams.b);
  const initialObj = computeSVMObjective(initialParams.w, initialParams.b, points, c);
  const initialNorm = Math.sqrt(initialParams.w[0] ** 2 + initialParams.w[1] ** 2);
  const initialMarginWidth = initialNorm > 1e-6 ? 2 / initialNorm : 0;
  const initialSVCount = initialPoints.filter(p => p.isSupportVector).length;

  steps.push({
    data: {
      type: 'svm',
      points: initialPoints,
      weights: initialParams.w,
      bias: initialParams.b,
      c,
      epoch: 0,
      totalEpochs: epochs,
      totalHingeLoss: Number(initialObj.totalHingeLoss.toFixed(2)),
      regLoss: Number(initialObj.regLoss.toFixed(2)),
      objectiveValue: Number(initialObj.totalObjective.toFixed(2)),
      marginWidth: Number(initialMarginWidth.toFixed(2)),
      supportVectorCount: initialSVCount,
      decisionBoundary: getBoundaryGeometry(initialParams.w[0], initialParams.w[1], initialParams.b, 0),
      positiveMarginBoundary: getBoundaryGeometry(initialParams.w[0], initialParams.w[1], initialParams.b, 1),
      negativeMarginBoundary: getBoundaryGeometry(initialParams.w[0], initialParams.w[1], initialParams.b, -1),
    },
    description: `Initialized Linear Soft-Margin SVM with C = ${c}. Primal objective: J(w,b) = ½||w||² + C Σ max(0, 1 - yᵢ(w·xᵢ+b)). Initial Objective = ${initialObj.totalObjective.toFixed(2)} (Hinge: ${initialObj.totalHingeLoss.toFixed(2)}, Reg: ${initialObj.regLoss.toFixed(2)}). Initial margin width: ${initialMarginWidth.toFixed(2)}.`,
    highlightLines: [0, 1],
    operation: 'Model Initialization',
    phase: 'Setup',
    auxiliary: [
      { label: 'Regularization C', value: c },
      { label: 'Initial Objective J', value: Number(initialObj.totalObjective.toFixed(2)) },
      { label: 'Margin Width 2/||w||', value: Number(initialMarginWidth.toFixed(2)) },
      { label: 'Approx SVs', value: initialSVCount },
    ],
    lineExplanation: 'initialize w, b; set objective J(w,b) = 0.5*||w||^2 + C*sum(hinge)',
  });

  // Training Loop: Subgradient Descent
  let prevObjective = initialObj.totalObjective;
  let converged = false;

  for (let ep = 1; ep <= epochs; ep++) {
    // Learning rate schedule with decaying step size
    const lr_t = baseLR / (1 + 0.05 * ep);

    // Compute subgradients in normalized coordinate space
    let subgradW1 = wNorm1; // regularization derivative
    let subgradW2 = wNorm2;
    let subgradB = 0;

    for (let i = 0; i < n; i++) {
      const p = points[i];
      const y = normalizedLabels[i];
      const xNorm = (p.x - meanX) / stdX;
      const yNorm = (p.y - meanY) / stdY;

      const score = wNorm1 * xNorm + wNorm2 * yNorm + bNorm;
      const margin = y * score;

      // Hinge loss subgradient: if 1 - y*score > 0, gradient is -y * x
      if (margin < 1.0) {
        subgradW1 -= c * y * xNorm;
        subgradW2 -= c * y * yNorm;
        subgradB -= c * y;
      }
    }

    // Apply parameter updates
    wNorm1 -= lr_t * subgradW1;
    wNorm2 -= lr_t * subgradW2;
    bNorm -= lr_t * subgradB;

    const currentParams = getPhysicalParameters(wNorm1, wNorm2, bNorm);
    const currentPoints = evaluatePoints(currentParams.w, currentParams.b);
    const currentObj = computeSVMObjective(currentParams.w, currentParams.b, points, c);
    const norm = Math.sqrt(currentParams.w[0] ** 2 + currentParams.w[1] ** 2);
    const marginWidth = norm > 1e-6 ? 2 / norm : 0;
    const svCount = currentPoints.filter(p => p.isSupportVector).length;

    // Divergence guard
    if (!isFinite(currentObj.totalObjective) || currentObj.totalObjective > 1e6) {
      steps.push({
        data: {
          type: 'svm',
          points: currentPoints,
          weights: currentParams.w,
          bias: currentParams.b,
          c,
          epoch: ep,
          totalEpochs: epochs,
          totalHingeLoss: 0,
          regLoss: 0,
          objectiveValue: 0,
          marginWidth: 0,
          supportVectorCount: 0,
        },
        description: `SVM Subgradient Descent diverged at epoch ${ep}! Objective value exceeded safe threshold. Reduce learning rate or regularization C.`,
        highlightLines: [4],
        operation: 'Divergence Guard',
        phase: 'Exploding Objective',
        auxiliary: [
          { label: 'Status', value: 'Diverged' },
          { label: 'Warning', value: 'Learning Rate Too High' },
        ],
      });
      return steps;
    }

    if (Math.abs(prevObjective - currentObj.totalObjective) < 0.005) {
      converged = true;
    }
    prevObjective = currentObj.totalObjective;

    steps.push({
      data: {
        type: 'svm',
        points: currentPoints,
        weights: currentParams.w,
        bias: currentParams.b,
        c,
        epoch: ep,
        totalEpochs: epochs,
        totalHingeLoss: Number(currentObj.totalHingeLoss.toFixed(2)),
        regLoss: Number(currentObj.regLoss.toFixed(2)),
        objectiveValue: Number(currentObj.totalObjective.toFixed(2)),
        marginWidth: Number(marginWidth.toFixed(2)),
        supportVectorCount: svCount,
        decisionBoundary: getBoundaryGeometry(currentParams.w[0], currentParams.w[1], currentParams.b, 0),
        positiveMarginBoundary: getBoundaryGeometry(currentParams.w[0], currentParams.w[1], currentParams.b, 1),
        negativeMarginBoundary: getBoundaryGeometry(currentParams.w[0], currentParams.w[1], currentParams.b, -1),
        converged,
      },
      description: `Epoch ${ep}/${epochs}: Computed hinge loss subgradient and adjusted separating hyperplane. Objective J(w,b) = ${currentObj.totalObjective.toFixed(2)} (Hinge: ${currentObj.totalHingeLoss.toFixed(2)}, Reg: ${currentObj.regLoss.toFixed(2)}). Margin width: ${marginWidth.toFixed(2)}, ${svCount} support vector candidates.`,
      highlightLines: [4, 5],
      operation: 'Subgradient Step',
      phase: `Epoch ${ep}`,
      auxiliary: [
        { label: 'Epoch', value: `${ep}/${epochs}` },
        { label: 'Total Objective', value: Number(currentObj.totalObjective.toFixed(2)) },
        { label: 'Margin Width', value: Number(marginWidth.toFixed(2)) },
        { label: 'Support Vectors', value: svCount },
      ],
      lineExplanation: 'w := w - lr * (w - C * sum(y*x for margin violators)); b := b + lr * C * sum(y)',
    });

    if (converged && ep >= 3) break;
  }

  // Final Model Summary Step
  const finalParams = getPhysicalParameters(wNorm1, wNorm2, bNorm);
  const finalPoints = evaluatePoints(finalParams.w, finalParams.b);
  const finalObj = computeSVMObjective(finalParams.w, finalParams.b, points, c);
  const finalNorm = Math.sqrt(finalParams.w[0] ** 2 + finalParams.w[1] ** 2);
  const finalMarginWidth = finalNorm > 1e-6 ? 2 / finalNorm : 0;
  const finalSVCount = finalPoints.filter(p => p.isSupportVector).length;
  const correctCount = finalPoints.filter(p => (p.decisionScore ?? 0) * Number(p.label ?? 1) > 0).length;
  const accuracy = ((correctCount / n) * 100).toFixed(1);

  steps.push({
    data: {
      type: 'svm',
      points: finalPoints,
      weights: finalParams.w,
      bias: finalParams.b,
      c,
      epoch: epochs,
      totalEpochs: epochs,
      totalHingeLoss: Number(finalObj.totalHingeLoss.toFixed(2)),
      regLoss: Number(finalObj.regLoss.toFixed(2)),
      objectiveValue: Number(finalObj.totalObjective.toFixed(2)),
      marginWidth: Number(finalMarginWidth.toFixed(2)),
      supportVectorCount: finalSVCount,
      decisionBoundary: getBoundaryGeometry(finalParams.w[0], finalParams.w[1], finalParams.b, 0),
      positiveMarginBoundary: getBoundaryGeometry(finalParams.w[0], finalParams.w[1], finalParams.b, 1),
      negativeMarginBoundary: getBoundaryGeometry(finalParams.w[0], finalParams.w[1], finalParams.b, -1),
      converged: true,
    },
    description: `SVM Training Complete! Decision hyperplane: ${finalParams.w[0].toFixed(3)}·X₁ + ${finalParams.w[1].toFixed(3)}·X₂ + (${finalParams.b.toFixed(3)}) = 0. Final Margin Width: ${finalMarginWidth.toFixed(2)}. Identified ${finalSVCount} approximate support vectors. Training Accuracy: ${accuracy}%.`,
    highlightLines: [7],
    operation: 'Training Complete',
    phase: 'Evaluation',
    auxiliary: [
      { label: 'Final Objective J', value: Number(finalObj.totalObjective.toFixed(2)) },
      { label: 'Margin Width 2/||w||', value: Number(finalMarginWidth.toFixed(2)) },
      { label: 'Accuracy', value: `${accuracy}%` },
      { label: 'Support Vectors', value: finalSVCount },
    ],
    lineExplanation: 'return optimal_hyperplane(w, b, support_vectors)',
  });

  // Query Inference Step
  if (queryPoint) {
    const queryEval = predictSVM(finalParams.w, finalParams.b, queryPoint);

    steps.push({
      data: {
        type: 'svm',
        points: finalPoints,
        weights: finalParams.w,
        bias: finalParams.b,
        c,
        epoch: epochs,
        totalEpochs: epochs,
        totalHingeLoss: Number(finalObj.totalHingeLoss.toFixed(2)),
        regLoss: Number(finalObj.regLoss.toFixed(2)),
        objectiveValue: Number(finalObj.totalObjective.toFixed(2)),
        marginWidth: Number(finalMarginWidth.toFixed(2)),
        supportVectorCount: finalSVCount,
        decisionBoundary: getBoundaryGeometry(finalParams.w[0], finalParams.w[1], finalParams.b, 0),
        positiveMarginBoundary: getBoundaryGeometry(finalParams.w[0], finalParams.w[1], finalParams.b, 1),
        negativeMarginBoundary: getBoundaryGeometry(finalParams.w[0], finalParams.w[1], finalParams.b, -1),
        queryPoint: {
          x: queryPoint.x,
          y: queryPoint.y,
          decisionScore: Number(queryEval.decisionScore.toFixed(3)),
          marginDistance: Number(queryEval.marginDistance.toFixed(3)),
          predictedClass: queryEval.predictedClass,
        },
      },
      description: `Inference for Query Point (${queryPoint.x}, ${queryPoint.y}): Decision Score f(q) = w·q + b = ${queryEval.decisionScore.toFixed(3)}. Signed geometric margin distance: ${queryEval.marginDistance.toFixed(2)}. Classified as Class ${queryEval.predictedClass === 1 ? '+1 (Positive)' : '-1 (Negative)'}.`,
      highlightLines: [9],
      operation: 'Query Inference',
      phase: 'Inference',
      auxiliary: [
        { label: 'Query (X, Y)', value: `(${queryPoint.x}, ${queryPoint.y})` },
        { label: 'Decision Score f(q)', value: Number(queryEval.decisionScore.toFixed(3)) },
        { label: 'Margin Distance', value: Number(queryEval.marginDistance.toFixed(2)) },
        { label: 'Predicted Class', value: queryEval.predictedClass === 1 ? '+1' : '-1' },
      ],
      lineExplanation: 'prediction := sign(w · q + b)',
    });
  }

  return steps;
}
