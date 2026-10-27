import type { AlgorithmStep } from '../../types/algorithm';
import type { DataPoint2D } from '../../types/ml';
import { classificationSampleDatasets } from '../../utils/ml/datasets';

export function runKNN(
  customPoints?: DataPoint2D[],
  customQuery?: { x: number; y: number },
  k = 3
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const points: DataPoint2D[] = customPoints && customPoints.length > 0
    ? customPoints.map((p, i) => ({ ...p, id: i }))
    : classificationSampleDatasets[0].points.map((p, i) => ({ ...p, id: i }));

  const query = customQuery ?? { x: 55, y: 55 };
  const validK = Math.max(1, Math.min(points.length, isNaN(k) ? 3 : k));

  // Step 1: Initialize Query Point
  steps.push({
    data: {
      type: 'classification',
      points: points.map(p => ({ ...p })),
      queryPoint: {
        x: query.x,
        y: query.y,
        k: validK,
      },
    },
    description: `K-Nearest Neighbors (k = ${validK}): We want to classify the unknown query point at (${query.x}, ${query.y}) based on the majority class of its ${validK} closest neighbors in the training set.`,
    highlightLines: [0],
    operation: 'Query Inspection',
    phase: 'Input Query',
    auxiliary: [
      { label: 'Query Coordinate', value: `(${query.x}, ${query.y})` },
      { label: 'Parameter k', value: validK },
      { label: 'Dataset Size', value: points.length },
    ],
    lineExplanation: 'procedure knnClassify(trainingSet, queryPoint, k)',
  });

  // Step 2: Compute Euclidean distances to all training points
  const distances = points.map((p, idx) => {
    const dist = Math.sqrt((p.x - query.x) ** 2 + (p.y - query.y) ** 2);
    return { id: p.id ?? idx, point: p, distance: dist };
  });

  steps.push({
    data: {
      type: 'classification',
      points: points.map(p => ({ ...p })),
      queryPoint: {
        x: query.x,
        y: query.y,
        k: validK,
      },
    },
    description: `Computed Euclidean distance d(p, q) = √((xₚ - x_q)² + (yₚ - y_q)²) from query (${query.x}, ${query.y}) to all ${points.length} samples.`,
    highlightLines: [2, 3],
    operation: 'Calculate Distances',
    phase: 'Metric Evaluation',
    auxiliary: [
      { label: 'Metric', value: 'Euclidean (L2 Norm)' },
      { label: 'Total Distances', value: distances.length },
    ],
    lineExplanation: 'for each p in dataset: dist[p] := distance(p, query)',
  });

  // Step 3: Sort by distance
  const sortedByDist = [...distances].sort((a, b) => a.distance - b.distance);
  const kNearest = sortedByDist.slice(0, validK);
  const kIndices = kNearest.map(item => item.id);

  steps.push({
    data: {
      type: 'classification',
      points: points.map(p => ({ ...p })),
      queryPoint: {
        x: query.x,
        y: query.y,
        nearestNeighbors: kIndices,
        k: validK,
      },
    },
    description: `Sorted distances in ascending order and identified the top ${validK} nearest neighbors: [${kNearest.map(item => `ID ${item.id} (dist: ${item.distance.toFixed(1)})`).join(', ')}].`,
    highlightLines: [4, 5],
    operation: 'Identify K-Neighbors',
    phase: 'Neighbor Selection',
    auxiliary: [
      { label: 'Top-1 Dist', value: Number(kNearest[0]?.distance.toFixed(2) ?? 0) },
      { label: `Top-${validK} Max Dist`, value: Number(kNearest[validK - 1]?.distance.toFixed(2) ?? 0) },
    ],
    lineExplanation: 'nearestNeighbors := sort(distances)[0..k-1]',
  });

  // Step 4: Majority Voting
  const voteCounts: Record<number, number> = {};
  for (const item of kNearest) {
    const lbl = Number(item.point.label ?? 0);
    voteCounts[lbl] = (voteCounts[lbl] || 0) + 1;
  }

  let predictedClass = 0;
  let maxVotes = -1;
  for (const [cls, votes] of Object.entries(voteCounts)) {
    if (votes > maxVotes) {
      maxVotes = votes;
      predictedClass = Number(cls);
    }
  }

  const confidence = ((maxVotes / validK) * 100).toFixed(1);

  steps.push({
    data: {
      type: 'classification',
      points: points.map(p => ({ ...p })),
      queryPoint: {
        x: query.x,
        y: query.y,
        nearestNeighbors: kIndices,
        k: validK,
        predictedLabel: predictedClass,
      },
    },
    description: `Majority voting complete! Out of ${validK} nearest neighbors, Class ${predictedClass} received ${maxVotes} votes (${confidence}% consensus). Query point (${query.x}, ${query.y}) is classified as Class ${predictedClass}.`,
    highlightLines: [7, 8],
    operation: 'Majority Vote Decision',
    phase: 'Classification Complete',
    auxiliary: [
      { label: 'Predicted Class', value: `Class ${predictedClass}` },
      { label: 'Winning Votes', value: `${maxVotes} / ${validK}` },
      { label: 'Consensus', value: `${confidence}%` },
    ],
    lineExplanation: 'return majority_vote(nearestNeighbors)',
  });

  return steps;
}
