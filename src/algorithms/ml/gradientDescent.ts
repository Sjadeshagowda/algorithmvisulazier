import type { AlgorithmStep } from '../../types/algorithm';

export function runGradientDescent(
  customStart?: { x: number; y: number },
  learningRate = 0.15,
  iterations = 8
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const start = customStart ?? { x: 8, y: 7 };
  const lr = isNaN(learningRate) || learningRate <= 0 ? 0.15 : learningRate;

  // Objective function: J(w1, w2) = w1^2 + 2*w2^2 (Convex paraboloid bowl)
  function computeLoss(x: number, y: number): number {
    return x ** 2 + 2 * (y ** 2);
  }

  function computeGradient(x: number, y: number): { dx: number; dy: number } {
    return { dx: 2 * x, dy: 4 * y };
  }

  let currX = start.x;
  let currY = start.y;
  let currLoss = computeLoss(currX, currY);

  const path: { x: number; y: number; loss: number }[] = [
    { x: Number(currX.toFixed(2)), y: Number(currY.toFixed(2)), loss: Number(currLoss.toFixed(2)) }
  ];
  const lossHistory: number[] = [Number(currLoss.toFixed(2))];

  // Initial step
  const initGrad = computeGradient(currX, currY);
  steps.push({
    data: {
      type: 'optimization',
      currentPoint: { x: Number(currX.toFixed(2)), y: Number(currY.toFixed(2)), loss: Number(currLoss.toFixed(2)) },
      path: [...path],
      gradient: { dx: Number(initGrad.dx.toFixed(2)), dy: Number(initGrad.dy.toFixed(2)) },
      learningRate: lr,
      iteration: 0,
      lossHistory: [...lossHistory],
      converged: false,
      targetMinimum: { x: 0, y: 0, loss: 0 },
    },
    description: `Gradient Descent initialized at w = (${currX.toFixed(1)}, ${currY.toFixed(1)}). Objective loss function: J(w₁, w₂) = w₁² + 2w₂². Initial loss: ${currLoss.toFixed(2)}. Learning rate α = ${lr}.`,
    highlightLines: [0, 1],
    operation: 'Initialize Optimizer',
    phase: 'Start Position',
    auxiliary: [
      { label: 'Initial w', value: `(${currX}, ${currY})` },
      { label: 'Initial Loss J(w)', value: Number(currLoss.toFixed(2)) },
      { label: 'Learning Rate α', value: lr },
    ],
    lineExplanation: 'initialize w := w0; alpha := learning_rate',
  });

  let converged = false;

  for (let iter = 1; iter <= iterations; iter++) {
    const grad = computeGradient(currX, currY);
    const stepX = lr * grad.dx;
    const stepY = lr * grad.dy;

    const nextX = currX - stepX;
    const nextY = currY - stepY;
    const nextLoss = computeLoss(nextX, nextY);

    if (!isFinite(nextLoss) || nextLoss > 1e6) {
      steps.push({
        data: {
          type: 'optimization',
          currentPoint: { x: Number(currX.toFixed(2)), y: Number(currY.toFixed(2)), loss: Number(currLoss.toFixed(2)) },
          path: [...path],
          gradient: { dx: Number(grad.dx.toFixed(2)), dy: Number(grad.dy.toFixed(2)) },
          learningRate: lr,
          iteration: iter,
          lossHistory: [...lossHistory],
          converged: false,
          targetMinimum: { x: 0, y: 0, loss: 0 },
        },
        description: `Gradient Descent diverged at iteration ${iter}! Learning rate α = ${lr} is too large, causing loss to explode to ${nextLoss.toFixed(1)}. Reduce learning rate to ensure monotonic convergence.`,
        highlightLines: [3],
        operation: 'Divergence Guard',
        phase: 'Exploding Loss',
        auxiliary: [
          { label: 'Status', value: 'Diverged' },
          { label: 'Warning', value: 'Learning Rate Too High' },
        ],
      });
      return steps;
    }

    const gradMagnitude = Math.sqrt(grad.dx ** 2 + grad.dy ** 2);
    if (gradMagnitude < 0.05 || Math.abs(nextLoss - currLoss) < 0.001) {
      converged = true;
    }

    currX = nextX;
    currY = nextY;
    currLoss = nextLoss;

    path.push({ x: Number(currX.toFixed(2)), y: Number(currY.toFixed(2)), loss: Number(currLoss.toFixed(2)) });
    lossHistory.push(Number(currLoss.toFixed(2)));

    steps.push({
      data: {
        type: 'optimization',
        currentPoint: { x: Number(currX.toFixed(2)), y: Number(currY.toFixed(2)), loss: Number(currLoss.toFixed(2)) },
        path: [...path],
        gradient: { dx: Number(grad.dx.toFixed(2)), dy: Number(grad.dy.toFixed(2)) },
        learningRate: lr,
        iteration: iter,
        lossHistory: [...lossHistory],
        converged,
        targetMinimum: { x: 0, y: 0, loss: 0 },
      },
      description: `Iteration ${iter}: Gradient ∇J = [${grad.dx.toFixed(2)}, ${grad.dy.toFixed(2)}]. Updated parameters: w := w - α·∇J = (${currX.toFixed(2)}, ${currY.toFixed(2)}). Loss reduced to ${currLoss.toFixed(2)}.`,
      highlightLines: [3, 4],
      operation: 'Gradient Step',
      phase: `Iteration ${iter}`,
      auxiliary: [
        { label: 'Iteration', value: iter },
        { label: 'Loss J(w)', value: Number(currLoss.toFixed(2)) },
        { label: 'Gradient Norm ||∇J||', value: Number(gradMagnitude.toFixed(2)) },
        { label: 'Coordinates', value: `(${currX.toFixed(2)}, ${currY.toFixed(2)})` },
      ],
      lineExplanation: 'w := w - alpha * gradient(w)',
    });

    if (converged) break;
  }

  // Final step
  steps.push({
    data: {
      type: 'optimization',
      currentPoint: { x: Number(currX.toFixed(2)), y: Number(currY.toFixed(2)), loss: Number(currLoss.toFixed(2)) },
      path: [...path],
      gradient: { dx: 0, dy: 0 },
      learningRate: lr,
      iteration: path.length - 1,
      lossHistory: [...lossHistory],
      converged: true,
      targetMinimum: { x: 0, y: 0, loss: 0 },
    },
    description: `Optimization finished! Parameter values reached (${currX.toFixed(3)}, ${currY.toFixed(3)}) with final loss ${currLoss.toFixed(4)}. Total loss reduction: ${(lossHistory[0] - currLoss).toFixed(2)}.`,
    highlightLines: [6],
    operation: 'Convergence Reached',
    phase: 'Optimization Complete',
    auxiliary: [
      { label: 'Final w', value: `(${currX.toFixed(3)}, ${currY.toFixed(3)})` },
      { label: 'Final Loss', value: Number(currLoss.toFixed(4)) },
      { label: 'Total Steps', value: path.length - 1 },
    ],
    lineExplanation: 'return optimized_parameters w',
  });

  return steps;
}
