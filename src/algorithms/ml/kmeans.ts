import type { AlgorithmStep } from '../../types/algorithm';
import type { DataPoint2D, Centroid2D } from '../../types/ml';
import { clusteringSampleDatasets } from '../../utils/ml/datasets';
import { calculateInertia } from '../../utils/ml/metrics';

export function runKMeans(
  customPoints?: DataPoint2D[],
  k = 3,
  maxIterations = 6
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const rawPoints = customPoints && customPoints.length > 0
    ? customPoints
    : clusteringSampleDatasets[0].points;

  const validK = Math.max(1, Math.min(rawPoints.length, isNaN(k) ? 3 : k));

  // Deterministic centroid initialization across data span
  const centroids: Centroid2D[] = [];
  for (let i = 0; i < validK; i++) {
    const idx = Math.floor((i * rawPoints.length) / validK);
    const p = rawPoints[idx];
    centroids.push({
      id: i,
      x: p.x + (i % 2 === 0 ? 5 : -5),
      y: p.y + (i % 2 === 0 ? -5 : 5),
      cluster: i,
    });
  }

  // Points structure with assigned cluster to compute initial inertia
  let currentPoints = rawPoints.map((p, idx) => {
    let minDist = Infinity;
    let closestCluster = 0;
    for (const c of centroids) {
      const distSq = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
      if (distSq < minDist) {
        minDist = distSq;
        closestCluster = c.cluster;
      }
    }
    return {
      x: p.x,
      y: p.y,
      cluster: closestCluster,
      id: p.id ?? idx,
    };
  });

  const initialInertia = calculateInertia(currentPoints, centroids);

  // Initial step: Centroids placed
  steps.push({
    data: {
      type: 'clustering',
      points: currentPoints.map(p => ({ ...p })),
      centroids: centroids.map(c => ({ ...c })),
      iteration: 0,
      inertia: Number(initialInertia.toFixed(1)),
      converged: false,
      k: validK,
    },
    description: `K-Means initialized with K = ${validK} clusters. Placed initial centroids at [${centroids.map(c => `(${c.x.toFixed(1)}, ${c.y.toFixed(1)})`).join(', ')}]. Initial inertia: ${initialInertia.toFixed(1)}.`,
    highlightLines: [0, 1],
    operation: 'Initialize Centroids',
    phase: 'Initialization',
    auxiliary: [
      { label: 'Cluster Count (K)', value: validK },
      { label: 'Total Samples', value: currentPoints.length },
      { label: 'Initial Inertia', value: Number(initialInertia.toFixed(1)) },
    ],
    lineExplanation: 'initialize k centroids randomly in feature space',
  });

  let converged = false;

  for (let iter = 1; iter <= maxIterations; iter++) {
    // 1. Assignment Step: Assign each point to closest centroid
    let assignmentsChanged = false;
    currentPoints = currentPoints.map(p => {
      let minDist = Infinity;
      let closestCluster = 0;
      for (const c of centroids) {
        const distSq = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (distSq < minDist) {
          minDist = distSq;
          closestCluster = c.cluster;
        }
      }
      if (p.cluster !== closestCluster) assignmentsChanged = true;
      return { ...p, cluster: closestCluster };
    });

    const inertia = calculateInertia(currentPoints, centroids);

    steps.push({
      data: {
        type: 'clustering',
        points: currentPoints.map(p => ({ ...p })),
        centroids: centroids.map(c => ({ ...c })),
        iteration: iter,
        inertia: Number(inertia.toFixed(1)),
        converged: false,
        k: validK,
      },
      description: `Iteration ${iter} (Assignment Step): Assigned all ${currentPoints.length} points to their nearest centroid. Within-cluster sum of squared errors (Inertia) = ${inertia.toFixed(1)}.`,
      highlightLines: [3, 4],
      operation: 'Assign Points',
      phase: `Iter ${iter} - Assign`,
      auxiliary: [
        { label: 'Iteration', value: iter },
        { label: 'Inertia (WCSS)', value: Number(inertia.toFixed(1)) },
        { label: 'Assignments Changed', value: assignmentsChanged ? 'Yes' : 'No' },
      ],
      lineExplanation: 'for each point x: cluster[x] := argmin_k ||x - mu_k||^2',
    });

    // 2. Update Step: Recompute centroid coordinates
    let maxCentroidShift = 0;
    for (let cIdx = 0; cIdx < validK; cIdx++) {
      const clusterPoints = currentPoints.filter(p => p.cluster === cIdx);
      if (clusterPoints.length > 0) {
        const newX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
        const newY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
        const shift = Math.sqrt((centroids[cIdx].x - newX) ** 2 + (centroids[cIdx].y - newY) ** 2);
        maxCentroidShift = Math.max(maxCentroidShift, shift);
        centroids[cIdx].x = Number(newX.toFixed(2));
        centroids[cIdx].y = Number(newY.toFixed(2));
      }
    }

    if (!assignmentsChanged || maxCentroidShift < 0.1) {
      converged = true;
    }

    steps.push({
      data: {
        type: 'clustering',
        points: currentPoints.map(p => ({ ...p })),
        centroids: centroids.map(c => ({ ...c })),
        iteration: iter,
        inertia: Number(inertia.toFixed(1)),
        converged,
        k: validK,
      },
      description: `Iteration ${iter} (Update Step): Recalculated centroid positions to the center-of-mass (mean) of their assigned points. Max centroid shift: ${maxCentroidShift.toFixed(2)}px.`,
      highlightLines: [6, 7],
      operation: 'Update Centroids',
      phase: `Iter ${iter} - Update`,
      auxiliary: [
        { label: 'Iteration', value: iter },
        { label: 'Max Shift', value: `${maxCentroidShift.toFixed(2)}px` },
        { label: 'Status', value: converged ? 'Converged' : 'Adjusting' },
      ],
      lineExplanation: 'for each cluster k: mu_k := mean(points in cluster k)',
    });

    if (converged) break;
  }

  // Final step
  const finalInertia = calculateInertia(currentPoints, centroids);
  const lastStepData = steps[steps.length - 1]?.data;
  const totalIters = lastStepData?.type === 'clustering' ? lastStepData.iteration : 0;

  steps.push({
    data: {
      type: 'clustering',
      points: currentPoints.map(p => ({ ...p })),
      centroids: centroids.map(c => ({ ...c })),
      iteration: totalIters,
      inertia: Number(finalInertia.toFixed(1)),
      converged: true,
      k: validK,
    },
    description: `K-Means clustering complete! Clusters have stabilized with final Inertia = ${finalInertia.toFixed(1)}. Centroids: [${centroids.map((c, i) => `C${i + 1}: (${c.x}, ${c.y})`).join(', ')}].`,
    highlightLines: [8],
    operation: 'Clustering Converged',
    phase: 'Complete',
    auxiliary: [
      { label: 'Final Inertia', value: Number(finalInertia.toFixed(1)) },
      { label: 'Total Iterations', value: totalIters },
      { label: 'Convergence', value: 'Achieved' },
    ],
    lineExplanation: 'return final clusters and centroids',
  });

  return steps;
}
