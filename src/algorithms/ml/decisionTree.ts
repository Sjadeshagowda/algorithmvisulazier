import type { AlgorithmStep } from '../../types/algorithm';
import type {
  DataPoint2D,
  DecisionTreeNodeData,
  DecisionTreeSplitCandidate,
} from '../../types/ml';
import { decisionTreeSampleDatasets } from '../../utils/ml/datasets';

export interface DecisionTreeConfig {
  criterion?: 'gini' | 'entropy';
  maxDepth?: number;
  minSamplesSplit?: number;
  queryPoint?: { x: number; y: number };
}

interface InternalNode {
  id: number;
  depth: number;
  points: DataPoint2D[];
  impurity: number;
  distribution: number[];
  predictedClass: number;
  isLeaf: boolean;
  featureIndex?: number;
  featureName?: string;
  threshold?: number;
  gain?: number;
  leftId?: number;
  rightId?: number;
  xRange: [number, number];
  yRange: [number, number];
}

// ── Mathematical Impurity Functions ──────────────────────────────────────────

export function computeGini(distribution: number[]): number {
  const total = distribution.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  let sumSqProb = 0;
  for (const count of distribution) {
    const p = count / total;
    sumSqProb += p * p;
  }
  return 1 - sumSqProb;
}

export function computeEntropy(distribution: number[]): number {
  const total = distribution.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  let entropy = 0;
  for (const count of distribution) {
    if (count > 0) {
      const p = count / total;
      entropy -= p * Math.log2(p);
    }
  }
  return entropy;
}

export function computeImpurity(distribution: number[], criterion: 'gini' | 'entropy'): number {
  return criterion === 'gini' ? computeGini(distribution) : computeEntropy(distribution);
}

function getClassDistribution(points: DataPoint2D[]): number[] {
  let count0 = 0;
  let count1 = 0;
  for (const p of points) {
    if (Number(p.label ?? 0) === 1) count1++;
    else count0++;
  }
  return [count0, count1];
}

function getMajorityClass(distribution: number[]): number {
  return distribution[1] > distribution[0] ? 1 : 0;
}

// ── Tree Coordinate Layout (for clean SVG hierarchy) ─────────────────────────

function assignTreeCoordinates(nodes: DecisionTreeNodeData[], rootId: number): void {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const root = nodeMap.get(rootId);
  if (!root) return;

  let currentLeafX = 50;
  const leafSpacing = 85;
  const levelHeight = 65;

  function layoutSubtree(nodeId: number): number {
    const node = nodeMap.get(nodeId);
    if (!node) return currentLeafX;

    node.y = 35 + node.depth * levelHeight;

    if (node.isLeaf || (node.leftId === undefined && node.rightId === undefined)) {
      node.x = currentLeafX;
      currentLeafX += leafSpacing;
      return node.x;
    }

    const leftX = node.leftId !== undefined ? layoutSubtree(node.leftId) : currentLeafX;
    const rightX = node.rightId !== undefined ? layoutSubtree(node.rightId) : currentLeafX;

    node.x = (leftX + rightX) / 2;
    return node.x;
  }

  layoutSubtree(rootId);
}

// ── Main Step Generator ──────────────────────────────────────────────────────

export function runDecisionTree(
  customPoints?: DataPoint2D[],
  config?: DecisionTreeConfig
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const points: DataPoint2D[] = customPoints !== undefined
    ? customPoints.map((p, i) => ({ ...p, id: i }))
    : decisionTreeSampleDatasets[0].points.map((p, i) => ({ ...p, id: i }));

  const criterion = config?.criterion ?? 'gini';
  const maxDepth = Math.max(1, Math.min(6, config?.maxDepth ?? 3));
  const minSamplesSplit = Math.max(2, Math.min(20, config?.minSamplesSplit ?? 2));
  const queryPoint = config?.queryPoint ?? { x: 50, y: 60 };
  const featureNames: [string, string] = ['Feature X', 'Feature Y'];

  const n = points.length;

  if (n < 2) {
    steps.push({
      data: {
        type: 'decision-tree',
        nodes: [],
        rootId: 0,
        criterion,
        maxDepth,
        minSamplesSplit,
        points,
        featureNames,
      },
      description: 'Decision Tree requires at least 2 labeled sample points to evaluate partitions.',
      highlightLines: [0],
      operation: 'Invalid Dataset',
      phase: 'Dataset Error',
    });
    return steps;
  }

  // Find overall coordinate domain for 2D boundaries
  const allX = points.map(p => p.x);
  const allY = points.map(p => p.y);
  const minDomainX = Math.min(0, ...allX);
  const maxDomainX = Math.max(100, ...allX);
  const minDomainY = Math.min(0, ...allY);
  const maxDomainY = Math.max(100, ...allY);

  // Initialize nodes storage
  let nextNodeId = 0;
  const internalNodes: InternalNode[] = [];
  const decisionBoundaries: Array<{
    featureIndex: number;
    threshold: number;
    range: [number, number];
  }> = [];

  const rootDist = getClassDistribution(points);
  const rootImpurity = computeImpurity(rootDist, criterion);
  const rootMajority = getMajorityClass(rootDist);

  const rootNode: InternalNode = {
    id: nextNodeId++,
    depth: 0,
    points,
    impurity: rootImpurity,
    distribution: rootDist,
    predictedClass: rootMajority,
    isLeaf: false,
    xRange: [minDomainX, maxDomainX],
    yRange: [minDomainY, maxDomainY],
  };
  internalNodes.push(rootNode);

  function exportPublicNodes(): DecisionTreeNodeData[] {
    const list: DecisionTreeNodeData[] = internalNodes.map(inNode => ({
      id: inNode.id,
      depth: inNode.depth,
      featureIndex: inNode.featureIndex,
      featureName: inNode.featureName,
      threshold: inNode.threshold,
      gain: inNode.gain,
      impurity: Number(inNode.impurity.toFixed(3)),
      samples: inNode.points.length,
      distribution: inNode.distribution,
      predictedClass: inNode.predictedClass,
      isLeaf: inNode.isLeaf,
      leftId: inNode.leftId,
      rightId: inNode.rightId,
    }));
    assignTreeCoordinates(list, 0);
    return list;
  }

  // Step 1: Initialize Root Node
  steps.push({
    data: {
      type: 'decision-tree',
      nodes: exportPublicNodes(),
      rootId: 0,
      criterion,
      maxDepth,
      minSamplesSplit,
      points: points.map(p => ({ ...p })),
      featureNames,
      activeNodeId: 0,
    },
    description: `Initialized Decision Tree root node with ${n} training samples. Initial ${criterion === 'gini' ? 'Gini Impurity' : 'Entropy'} = ${rootImpurity.toFixed(3)}. Distribution: ${rootDist[0]} Class 0, ${rootDist[1]} Class 1.`,
    highlightLines: [0, 1],
    operation: 'Initialize Root',
    phase: 'Tree Construction',
    auxiliary: [
      { label: 'Criterion', value: criterion.toUpperCase() },
      { label: `Root ${criterion === 'gini' ? 'Gini' : 'Entropy'}`, value: Number(rootImpurity.toFixed(3)) },
      { label: 'Max Depth', value: maxDepth },
      { label: 'Min Split Size', value: minSamplesSplit },
    ],
    lineExplanation: 'root := create_node(dataset, depth=0)',
  });

  // Split evaluation queue (Breadth-First for intuitive progressive visualization)
  const queue: number[] = [rootNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const node = internalNodes.find(n => n.id === currentId)!;

    // Check Stopping Conditions
    const isPure = node.impurity <= 1e-6 || node.distribution[0] === 0 || node.distribution[1] === 0;
    const isMaxDepthReached = node.depth >= maxDepth;
    const isTooFewSamples = node.points.length < minSamplesSplit;

    if (isPure || isMaxDepthReached || isTooFewSamples) {
      node.isLeaf = true;
      let stopReason = '';
      if (isPure) stopReason = `Node is 100% pure (${criterion === 'gini' ? 'Gini' : 'Entropy'} = 0.000).`;
      else if (isMaxDepthReached) stopReason = `Maximum tree depth (${maxDepth}) reached.`;
      else if (isTooFewSamples) stopReason = `Sample count (${node.points.length}) is below minimum split threshold (${minSamplesSplit}).`;

      steps.push({
        data: {
          type: 'decision-tree',
          nodes: exportPublicNodes(),
          rootId: 0,
          criterion,
          maxDepth,
          minSamplesSplit,
          points: points.map(p => ({ ...p })),
          featureNames,
          activeNodeId: node.id,
          decisionBoundaries: [...decisionBoundaries],
        },
        description: `Node #${node.id} marked as Leaf Node! ${stopReason} Predicts Class ${node.predictedClass} (${node.distribution[node.predictedClass]}/${node.points.length} samples).`,
        highlightLines: [10],
        operation: 'Make Leaf Node',
        phase: `Depth ${node.depth} - Leaf`,
        auxiliary: [
          { label: 'Node ID', value: node.id },
          { label: 'Predicted Class', value: `Class ${node.predictedClass}` },
          { label: 'Stop Reason', value: isPure ? 'Pure Node' : isMaxDepthReached ? 'Max Depth' : 'Min Samples' },
        ],
        lineExplanation: 'if should_stop(node) then node.isLeaf := true',
      });
      continue;
    }

    // Evaluate Candidate Splits across features 0 (X) and 1 (Y)
    const candidates: DecisionTreeSplitCandidate[] = [];

    for (let fIdx = 0; fIdx < 2; fIdx++) {
      const featName = featureNames[fIdx];
      const featVals = node.points.map(p => (fIdx === 0 ? p.x : p.y));
      const uniqueSorted = Array.from(new Set(featVals)).sort((a, b) => a - b);

      for (let i = 0; i < uniqueSorted.length - 1; i++) {
        const threshold = (uniqueSorted[i] + uniqueSorted[i + 1]) / 2;

        const leftPts = node.points.filter(p => (fIdx === 0 ? p.x : p.y) <= threshold);
        const rightPts = node.points.filter(p => (fIdx === 0 ? p.x : p.y) > threshold);

        if (leftPts.length === 0 || rightPts.length === 0) continue;

        const leftDist = getClassDistribution(leftPts);
        const rightDist = getClassDistribution(rightPts);

        const leftImp = computeImpurity(leftDist, criterion);
        const rightImp = computeImpurity(rightDist, criterion);

        const weightedChildImpurity =
          (leftPts.length / node.points.length) * leftImp +
          (rightPts.length / node.points.length) * rightImp;

        const gain = node.impurity - weightedChildImpurity;

        candidates.push({
          featureIndex: fIdx,
          featureName: featName,
          threshold: Number(threshold.toFixed(2)),
          gain: Number(gain.toFixed(4)),
          leftSamples: leftPts.length,
          rightSamples: rightPts.length,
        });
      }
    }

    // Deterministic tie-breaking: Sort by gain DESC, then featureIndex ASC, then threshold ASC
    candidates.sort((a, b) => {
      const gainDiff = b.gain - a.gain;
      if (Math.abs(gainDiff) > 1e-6) return gainDiff;
      if (a.featureIndex !== b.featureIndex) return a.featureIndex - b.featureIndex;
      return a.threshold - b.threshold;
    });

    const bestSplit = candidates[0];

    // Check if any split achieves positive gain
    if (!bestSplit || bestSplit.gain <= 1e-6) {
      node.isLeaf = true;
      steps.push({
        data: {
          type: 'decision-tree',
          nodes: exportPublicNodes(),
          rootId: 0,
          criterion,
          maxDepth,
          minSamplesSplit,
          points: points.map(p => ({ ...p })),
          featureNames,
          activeNodeId: node.id,
          candidates,
          decisionBoundaries: [...decisionBoundaries],
        },
        description: `Node #${node.id} cannot be split further (no candidate split yields positive information gain). Converted to Leaf predicting Class ${node.predictedClass}.`,
        highlightLines: [10],
        operation: 'No Gain - Leaf',
        phase: `Depth ${node.depth} - Stop`,
        auxiliary: [
          { label: 'Node ID', value: node.id },
          { label: 'Max Gain', value: bestSplit ? bestSplit.gain : 0 },
        ],
        lineExplanation: 'if max_gain <= 0 then make_leaf(node)',
      });
      continue;
    }

    // Step: Show candidate split evaluation
    bestSplit.isSelected = true;
    steps.push({
      data: {
        type: 'decision-tree',
        nodes: exportPublicNodes(),
        rootId: 0,
        criterion,
        maxDepth,
        minSamplesSplit,
        points: points.map(p => ({ ...p })),
        featureNames,
        activeNodeId: node.id,
        candidates: candidates.slice(0, 4), // show top candidate splits
        decisionBoundaries: [...decisionBoundaries],
      },
      description: `Evaluating candidate splits for Node #${node.id} (${node.points.length} samples). Tested ${candidates.length} threshold candidates. Best split found: [${bestSplit.featureName} <= ${bestSplit.threshold}] producing highest Information Gain = ${bestSplit.gain.toFixed(4)}.`,
      highlightLines: [4, 5],
      operation: 'Evaluate Splits',
      phase: `Depth ${node.depth} - Evaluate`,
      auxiliary: [
        { label: 'Candidates Evaluated', value: candidates.length },
        { label: 'Optimal Feature', value: bestSplit.featureName },
        { label: 'Optimal Threshold', value: bestSplit.threshold },
        { label: 'Max Information Gain', value: bestSplit.gain },
      ],
      lineExplanation: 'for each feature and threshold: compute_gain()',
    });

    // Execute the Split
    const leftPoints = node.points.filter(p =>
      (bestSplit.featureIndex === 0 ? p.x : p.y) <= bestSplit.threshold
    );
    const rightPoints = node.points.filter(p =>
      (bestSplit.featureIndex === 0 ? p.x : p.y) > bestSplit.threshold
    );

    const leftDist = getClassDistribution(leftPoints);
    const rightDist = getClassDistribution(rightPoints);

    const leftNode: InternalNode = {
      id: nextNodeId++,
      depth: node.depth + 1,
      points: leftPoints,
      impurity: computeImpurity(leftDist, criterion),
      distribution: leftDist,
      predictedClass: getMajorityClass(leftDist),
      isLeaf: false,
      xRange: bestSplit.featureIndex === 0 ? [node.xRange[0], bestSplit.threshold] : [...node.xRange],
      yRange: bestSplit.featureIndex === 1 ? [node.yRange[0], bestSplit.threshold] : [...node.yRange],
    };

    const rightNode: InternalNode = {
      id: nextNodeId++,
      depth: node.depth + 1,
      points: rightPoints,
      impurity: computeImpurity(rightDist, criterion),
      distribution: rightDist,
      predictedClass: getMajorityClass(rightDist),
      isLeaf: false,
      xRange: bestSplit.featureIndex === 0 ? [bestSplit.threshold, node.xRange[1]] : [...node.xRange],
      yRange: bestSplit.featureIndex === 1 ? [bestSplit.threshold, node.yRange[1]] : [...node.yRange],
    };

    node.featureIndex = bestSplit.featureIndex;
    node.featureName = bestSplit.featureName;
    node.threshold = bestSplit.threshold;
    node.gain = bestSplit.gain;
    node.leftId = leftNode.id;
    node.rightId = rightNode.id;

    internalNodes.push(leftNode, rightNode);
    queue.push(leftNode.id, rightNode.id);

    // Save decision boundary line
    decisionBoundaries.push({
      featureIndex: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      range: bestSplit.featureIndex === 0 ? [...node.yRange] : [...node.xRange],
    });

    // Step: Partition children created
    steps.push({
      data: {
        type: 'decision-tree',
        nodes: exportPublicNodes(),
        rootId: 0,
        criterion,
        maxDepth,
        minSamplesSplit,
        points: points.map(p => ({ ...p })),
        featureNames,
        activeNodeId: node.id,
        decisionBoundaries: [...decisionBoundaries],
      },
      description: `Split Node #${node.id} on [${bestSplit.featureName} <= ${bestSplit.threshold}]. Created Left Child #${leftNode.id} (${leftPoints.length} samples, ${criterion}=${leftNode.impurity.toFixed(3)}) and Right Child #${rightNode.id} (${rightPoints.length} samples, ${criterion}=${rightNode.impurity.toFixed(3)}).`,
      highlightLines: [6, 7],
      operation: 'Apply Split',
      phase: `Depth ${node.depth} - Partition`,
      auxiliary: [
        { label: 'Left Child ID', value: leftNode.id },
        { label: 'Left Samples', value: leftPoints.length },
        { label: 'Right Child ID', value: rightNode.id },
        { label: 'Right Samples', value: rightPoints.length },
      ],
      lineExplanation: 'node.left := split_left; node.right := split_right',
    });
  }

  // Final Step: Complete Tree Construction
  const allTreeNodes = exportPublicNodes();
  const leafCount = allTreeNodes.filter(n => n.isLeaf).length;

  steps.push({
    data: {
      type: 'decision-tree',
      nodes: allTreeNodes,
      rootId: 0,
      criterion,
      maxDepth,
      minSamplesSplit,
      points: points.map(p => ({ ...p })),
      featureNames,
      decisionBoundaries: [...decisionBoundaries],
    },
    description: `Decision Tree construction complete! Total nodes: ${allTreeNodes.length} (${leafCount} leaf prediction nodes). Tree depth: ${Math.max(...allTreeNodes.map(n => n.depth))}/${maxDepth}.`,
    highlightLines: [11],
    operation: 'Tree Construction Complete',
    phase: 'Complete',
    auxiliary: [
      { label: 'Total Nodes', value: allTreeNodes.length },
      { label: 'Leaf Nodes', value: leafCount },
      { label: 'Max Depth', value: Math.max(...allTreeNodes.map(n => n.depth)) },
      { label: 'Criterion', value: criterion.toUpperCase() },
    ],
    lineExplanation: 'return constructed_decision_tree',
  });

  // Query Inference Walkthrough
  if (queryPoint) {
    let curr = allTreeNodes.find(n => n.id === 0);
    const pathIds: number[] = [];

    while (curr) {
      pathIds.push(curr.id);

      if (curr.isLeaf || curr.leftId === undefined || curr.rightId === undefined) {
        break;
      }

      const val = curr.featureIndex === 0 ? queryPoint.x : queryPoint.y;
      const isLeft = val <= (curr.threshold ?? 0);
      const nextId = isLeft ? curr.leftId : curr.rightId;

      const currNodeRef = curr;
      const stepNodes = allTreeNodes.map(n => ({
        ...n,
        isTraversed: pathIds.includes(n.id),
      }));

      steps.push({
        data: {
          type: 'decision-tree',
          nodes: stepNodes,
          rootId: 0,
          criterion,
          maxDepth,
          minSamplesSplit,
          points: points.map(p => ({ ...p })),
          featureNames,
          activeNodeId: currNodeRef.id,
          decisionBoundaries: [...decisionBoundaries],
          queryPoint: {
            x: queryPoint.x,
            y: queryPoint.y,
            pathNodeIds: [...pathIds],
          },
        },
        description: `Classifying Query (${queryPoint.x}, ${queryPoint.y}): At Node #${currNodeRef.id}, testing condition [${currNodeRef.featureName} <= ${currNodeRef.threshold}]. Query value = ${val}. Condition is ${isLeft ? 'TRUE (<=)' : 'FALSE (>)'} -> Branching ${isLeft ? 'LEFT' : 'RIGHT'} to Node #${nextId}.`,
        highlightLines: [13, 14],
        operation: 'Traverse Node',
        phase: 'Inference',
        auxiliary: [
          { label: 'Query Point', value: `(${queryPoint.x}, ${queryPoint.y})` },
          { label: 'Current Node', value: currNodeRef.id },
          { label: 'Test Value', value: val },
          { label: 'Branch', value: isLeft ? 'Left (<=)' : 'Right (>)' },
        ],
        lineExplanation: 'if query[feature] <= threshold then go(left) else go(right)',
      });

      curr = allTreeNodes.find(n => n.id === nextId);
    }

    if (curr) {
      const finalPred = curr.predictedClass;
      const stepNodes = allTreeNodes.map(n => ({
        ...n,
        isTraversed: pathIds.includes(n.id),
      }));

      steps.push({
        data: {
          type: 'decision-tree',
          nodes: stepNodes,
          rootId: 0,
          criterion,
          maxDepth,
          minSamplesSplit,
          points: points.map(p => ({ ...p })),
          featureNames,
          activeNodeId: curr.id,
          decisionBoundaries: [...decisionBoundaries],
          queryPoint: {
            x: queryPoint.x,
            y: queryPoint.y,
            predictedClass: finalPred,
            pathNodeIds: [...pathIds],
          },
        },
        description: `Inference Complete! Query point (${queryPoint.x}, ${queryPoint.y}) reached Leaf Node #${curr.id} (Distribution: ${curr.distribution[0]} Class 0, ${curr.distribution[1]} Class 1). Final predicted classification: Class ${finalPred}.`,
        highlightLines: [15],
        operation: 'Query Classified',
        phase: 'Inference Complete',
        auxiliary: [
          { label: 'Query Point', value: `(${queryPoint.x}, ${queryPoint.y})` },
          { label: 'Final Node', value: curr.id },
          { label: 'Predicted Class', value: `Class ${finalPred}` },
          { label: 'Leaf Confidence', value: `${((curr.distribution[finalPred] / curr.samples) * 100).toFixed(1)}%` },
        ],
        lineExplanation: 'return leaf_node.predicted_class',
      });
    }
  }

  return steps;
}
