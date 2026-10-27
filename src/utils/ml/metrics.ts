export function calculateMSE(yTrue: number[], yPred: number[]): number {
  if (yTrue.length === 0 || yTrue.length !== yPred.length) return 0;
  const sumSq = yTrue.reduce((sum, val, i) => sum + (val - yPred[i]) ** 2, 0);
  return sumSq / yTrue.length;
}

export function calculateMAE(yTrue: number[], yPred: number[]): number {
  if (yTrue.length === 0 || yTrue.length !== yPred.length) return 0;
  const sumAbs = yTrue.reduce((sum, val, i) => sum + Math.abs(val - yPred[i]), 0);
  return sumAbs / yTrue.length;
}

export function calculateRMSE(yTrue: number[], yPred: number[]): number {
  return Math.sqrt(calculateMSE(yTrue, yPred));
}

export function calculateR2(yTrue: number[], yPred: number[]): number {
  if (yTrue.length <= 1 || yTrue.length !== yPred.length) return 0;
  const meanY = yTrue.reduce((sum, val) => sum + val, 0) / yTrue.length;
  const ssTotal = yTrue.reduce((sum, val) => sum + (val - meanY) ** 2, 0);
  const ssResidual = yTrue.reduce((sum, val, i) => sum + (val - yPred[i]) ** 2, 0);
  if (ssTotal === 0) return 1;
  return Math.max(0, 1 - ssResidual / ssTotal);
}

export function calculateAccuracy(yTrue: number[], yPred: number[]): number {
  if (yTrue.length === 0 || yTrue.length !== yPred.length) return 0;
  const correct = yTrue.reduce((count, val, i) => count + (val === yPred[i] ? 1 : 0), 0);
  return correct / yTrue.length;
}

export interface ConfusionMatrix {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  precision: number;
  recall: number;
  f1: number;
}

export function calculateConfusionMatrix(yTrue: number[], yPred: number[]): ConfusionMatrix {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const actual = yTrue[i];
    const predicted = yPred[i];
    if (actual === 1 && predicted === 1) tp++;
    else if (actual === 0 && predicted === 1) fp++;
    else if (actual === 1 && predicted === 0) fn++;
    else tn++;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return { tp, fp, fn, tn, precision, recall, f1 };
}

export function calculateInertia(
  points: { x: number; y: number; cluster: number }[],
  centroids: { x: number; y: number; cluster: number }[]
): number {
  const centroidMap = new Map(centroids.map(c => [c.cluster, c]));
  let totalSqDist = 0;
  for (const pt of points) {
    const c = centroidMap.get(pt.cluster);
    if (c) {
      totalSqDist += (pt.x - c.x) ** 2 + (pt.y - c.y) ** 2;
    }
  }
  return totalSqDist;
}
