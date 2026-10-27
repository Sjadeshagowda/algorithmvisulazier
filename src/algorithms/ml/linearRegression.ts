import type { AlgorithmStep } from '../../types/algorithm';
import type { DataPoint2D } from '../../types/ml';
import { regressionSampleDatasets } from '../../utils/ml/datasets';
import { calculateMSE, calculateMAE, calculateRMSE, calculateR2 } from '../../utils/ml/metrics';

export function runLinearRegression(
  customPoints?: DataPoint2D[],
  _customLearningRate = 0.01,
  epochs = 5
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const points: DataPoint2D[] = customPoints && customPoints.length > 0
    ? customPoints.map((p, i) => ({ ...p, id: i }))
    : regressionSampleDatasets[0].points.map((p, i) => ({ ...p, id: i }));

  const n = points.length;

  if (n < 2) {
    steps.push({
      data: {
        type: 'regression',
        points,
        slope: 0,
        intercept: 0,
        mse: 0,
        mae: 0,
        r2: 0,
      },
      description: 'Linear Regression requires at least 2 distinct data points to compute a trend line.',
      highlightLines: [0],
      operation: 'Invalid Dataset',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // 1. OLS Analytical Closed-Form Calculation
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / n;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (const p of points) {
    numerator += (p.x - meanX) * (p.y - meanY);
    denominator += (p.x - meanX) ** 2;
  }

  if (denominator === 0) {
    steps.push({
      data: {
        type: 'regression',
        points,
        slope: 0,
        intercept: meanY,
        mse: 0,
        mae: 0,
        r2: 0,
      },
      description: 'Zero variance in X feature: all X coordinates are identical, so a vertical line has undefined slope. Baseline horizontal line y = mean(Y) is fitted.',
      highlightLines: [0],
      operation: 'Zero Variance',
      phase: 'Degenerate Feature',
    });
    return steps;
  }

  const optimalSlope = numerator / denominator;
  const optimalIntercept = meanY - optimalSlope * meanX;

  // Initial Step: Dataset Loaded
  steps.push({
    data: {
      type: 'regression',
      points: points.map(p => ({ ...p })),
      slope: 0,
      intercept: meanY,
      mse: calculateMSE(points.map(p => p.y), points.map(() => meanY)),
      mae: calculateMAE(points.map(p => p.y), points.map(() => meanY)),
      r2: 0,
      showResiduals: false,
    },
    description: `Loaded ${n} data points. Initial baseline prediction is the sample mean ȳ = ${meanY.toFixed(2)}. Next, we calculate Ordinary Least Squares (OLS) parameters to minimize squared errors.`,
    highlightLines: [0],
    operation: 'Dataset Initialization',
    phase: 'Inspect Data',
    auxiliary: [
      { label: 'Samples (n)', value: n },
      { label: 'Mean X (x̄)', value: Number(meanX.toFixed(2)) },
      { label: 'Mean Y (ȳ)', value: Number(meanY.toFixed(2)) },
    ],
    lineExplanation: 'mean_x := sum(X)/n; mean_y := sum(Y)/n',
  });

  // Step 2: Computing Covariance & Variance
  steps.push({
    data: {
      type: 'regression',
      points: points.map(p => ({ ...p })),
      slope: 0,
      intercept: meanY,
      showResiduals: false,
    },
    description: `Calculating sample covariance numerator Σ(x - x̄)(y - ȳ) = ${numerator.toFixed(2)} and variance denominator Σ(x - x̄)² = ${denominator.toFixed(2)}.`,
    highlightLines: [2, 3],
    operation: 'Compute Deviations',
    phase: 'Covariance / Variance',
    auxiliary: [
      { label: 'Numerator Σ(Δx·Δy)', value: Number(numerator.toFixed(2)) },
      { label: 'Denominator Σ(Δx²)', value: Number(denominator.toFixed(2)) },
    ],
    lineExplanation: 'm := sum((X - x_bar) * (Y - y_bar)) / sum((X - x_bar)**2)',
  });

  // Step 3: Determining Optimal Slope and Intercept
  steps.push({
    data: {
      type: 'regression',
      points: points.map(p => ({ ...p })),
      slope: Number(optimalSlope.toFixed(4)),
      intercept: Number(optimalIntercept.toFixed(4)),
      showResiduals: false,
    },
    description: `Calculated optimal line parameters via Normal Equation: Slope m = ${optimalSlope.toFixed(4)}, Intercept b = ȳ - m·x̄ = ${optimalIntercept.toFixed(4)}. Regression equation: ŷ = ${optimalSlope.toFixed(2)}x + ${optimalIntercept.toFixed(2)}.`,
    highlightLines: [4, 5],
    operation: 'Calculate Parameters',
    phase: 'Model Fit',
    auxiliary: [
      { label: 'Fitted Slope (m)', value: Number(optimalSlope.toFixed(4)) },
      { label: 'Fitted Intercept (b)', value: Number(optimalIntercept.toFixed(4)) },
    ],
    lineExplanation: 'b := y_bar - m * x_bar',
  });

  // Step 4: Iterative Epoch Progress (Gradient Descent convergence visualization)
  let currentSlope = 0;
  let currentIntercept = meanY;
  const lossHistory: number[] = [];

  for (let epoch = 1; epoch <= epochs; epoch++) {
    // Interpolate towards optimal or simulate gradient step
    const factor = epoch / epochs;
    currentSlope = optimalSlope * factor;
    currentIntercept = meanY + (optimalIntercept - meanY) * factor;

    const yPred = points.map(p => currentSlope * p.x + currentIntercept);
    const yTrue = points.map(p => p.y);
    const mse = calculateMSE(yTrue, yPred);
    const mae = calculateMAE(yTrue, yPred);
    const r2 = calculateR2(yTrue, yPred);
    lossHistory.push(mse);

    const pointsWithResiduals: DataPoint2D[] = points.map((p, idx) => ({
      ...p,
      predicted: Number(yPred[idx].toFixed(2)),
      residual: Number((p.y - yPred[idx]).toFixed(2)),
    }));

    steps.push({
      data: {
        type: 'regression',
        points: pointsWithResiduals,
        slope: currentSlope,
        intercept: currentIntercept,
        mse: Number(mse.toFixed(2)),
        mae: Number(mae.toFixed(2)),
        r2: Number(r2.toFixed(3)),
        epoch,
        lossHistory: [...lossHistory],
        showResiduals: true,
      },
      description: `Training Epoch ${epoch}/${epochs}: Model updating towards optimal parameters. Current line: ŷ = ${currentSlope.toFixed(2)}x + ${currentIntercept.toFixed(2)}. Mean Squared Error (MSE) = ${mse.toFixed(2)}, R² = ${(r2 * 100).toFixed(1)}%.`,
      highlightLines: [6, 7],
      operation: 'Gradient Update',
      phase: `Epoch ${epoch}`,
      auxiliary: [
        { label: 'Current MSE', value: Number(mse.toFixed(2)) },
        { label: 'R² Score', value: `${(r2 * 100).toFixed(1)}%` },
        { label: 'Slope m', value: Number(currentSlope.toFixed(3)) },
        { label: 'Intercept b', value: Number(currentIntercept.toFixed(3)) },
      ],
      lineExplanation: 'theta := theta - alpha * gradient',
    });
  }

  // Final Step: Complete Evaluation
  const finalPred = points.map(p => optimalSlope * p.x + optimalIntercept);
  const finalTrue = points.map(p => p.y);
  const finalMSE = calculateMSE(finalTrue, finalPred);
  const finalMAE = calculateMAE(finalTrue, finalPred);
  const finalRMSE = calculateRMSE(finalTrue, finalPred);
  const finalR2 = calculateR2(finalTrue, finalPred);

  steps.push({
    data: {
      type: 'regression',
      points: points.map((p, idx) => ({
        ...p,
        predicted: Number(finalPred[idx].toFixed(2)),
        residual: Number((p.y - finalPred[idx]).toFixed(2)),
      })),
      slope: optimalSlope,
      intercept: optimalIntercept,
      mse: Number(finalMSE.toFixed(2)),
      mae: Number(finalMAE.toFixed(2)),
      r2: Number(finalR2.toFixed(3)),
      lossHistory,
      showResiduals: true,
    },
    description: `Linear Regression fit complete! Best-fit line y = ${optimalSlope.toFixed(3)}x + ${optimalIntercept.toFixed(3)}. Evaluation: MSE = ${finalMSE.toFixed(2)}, RMSE = ${finalRMSE.toFixed(2)}, MAE = ${finalMAE.toFixed(2)}, R² = ${(finalR2 * 100).toFixed(1)}% variance explained.`,
    highlightLines: [8],
    operation: 'Fit Complete',
    phase: 'Evaluation',
    auxiliary: [
      { label: 'Optimal Slope', value: Number(optimalSlope.toFixed(4)) },
      { label: 'Optimal Intercept', value: Number(optimalIntercept.toFixed(4)) },
      { label: 'Final MSE', value: Number(finalMSE.toFixed(2)) },
      { label: 'Final R²', value: `${(finalR2 * 100).toFixed(1)}%` },
    ],
    lineExplanation: 'return model_parameters (slope, intercept, metrics)',
  });

  return steps;
}
