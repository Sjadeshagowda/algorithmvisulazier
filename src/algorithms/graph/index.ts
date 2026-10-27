import type { AlgorithmStep, GraphNode, GraphEdge } from '../../types/algorithm';

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function bfs(graphData: GraphData, startId: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const { nodes, edges } = graphData;

  const nodeMap = new Map<number, GraphNode>(nodes.map(n => [n.id, { ...n }]));
  const adjList = new Map<number, number[]>();
  nodes.forEach(n => adjList.set(n.id, []));
  edges.forEach(e => {
    adjList.get(e.from)?.push(e.to);
    adjList.get(e.to)?.push(e.from);
  });

  const getSnapshot = (): { nodes: GraphNode[]; edges: GraphEdge[] } => ({
    nodes: nodes.map(n => ({ ...nodeMap.get(n.id)! })),
    edges: edges.map(e => ({ ...e })),
  });

  // Reset all
  nodes.forEach(n => nodeMap.set(n.id, { ...n, state: 'default' }));

  steps.push({
    data: { type: 'graph', ...getSnapshot() },
    description: `Starting BFS from node ${startId}. We explore layer by layer.`,
    highlightLines: [0],
    operation: 'Initialize',
    auxiliary: [{ label: 'Queue', value: [startId] }],
  });

  const visited = new Set<number>();
  const queue: number[] = [startId];
  visited.add(startId);
  nodeMap.set(startId, { ...nodeMap.get(startId)!, state: 'current' });

  steps.push({
    data: { type: 'graph', ...getSnapshot() },
    description: `Added start node ${startId} to queue.`,
    highlightLines: [2],
    operation: 'Enqueue',
    auxiliary: [{ label: 'Queue', value: [...queue] }],
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    nodeMap.set(current, { ...nodeMap.get(current)!, state: 'active' });

    steps.push({
      data: { type: 'graph', ...getSnapshot() },
      description: `Processing node ${current}. Exploring its neighbors.`,
      highlightLines: [4, 5],
      operation: 'Dequeue',
      auxiliary: [{ label: 'Processing', value: current }, { label: 'Queue', value: [...queue] }],
    });

    const neighbors = adjList.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        nodeMap.set(neighbor, { ...nodeMap.get(neighbor)!, state: 'comparing' });
        queue.push(neighbor);

        steps.push({
          data: { type: 'graph', ...getSnapshot() },
          description: `Found unvisited neighbor ${neighbor}. Adding to queue.`,
          highlightLines: [7, 8],
          operation: 'Enqueue',
          auxiliary: [{ label: 'Neighbor', value: neighbor }, { label: 'Queue', value: [...queue] }],
        });

        nodeMap.set(neighbor, { ...nodeMap.get(neighbor)!, state: 'visited' });
      }
    }

    nodeMap.set(current, { ...nodeMap.get(current)!, state: 'sorted' });
    steps.push({
      data: { type: 'graph', ...getSnapshot() },
      description: `Finished processing node ${current}.`,
      highlightLines: [9],
      operation: 'Completed Node',
      auxiliary: [{ label: 'Queue', value: [...queue] }],
    });
  }

  steps.push({
    data: { type: 'graph', ...getSnapshot() },
    description: 'BFS complete! All reachable nodes have been visited.',
    highlightLines: [11],
    operation: 'Finished',
    auxiliary: [{ label: 'Visited Total', value: visited.size }],
  });

  return steps;
}

export function dfs(graphData: GraphData, startId: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const { nodes, edges } = graphData;

  const nodeMap = new Map<number, GraphNode>(nodes.map(n => [n.id, { ...n, state: 'default' }]));
  const adjList = new Map<number, number[]>();
  nodes.forEach(n => adjList.set(n.id, []));
  edges.forEach(e => {
    adjList.get(e.from)?.push(e.to);
    adjList.get(e.to)?.push(e.from);
  });

  const getSnapshot = () => ({
    nodes: nodes.map(n => ({ ...nodeMap.get(n.id)! })),
    edges: edges.map(e => ({ ...e })),
  });

  nodes.forEach(n => nodeMap.set(n.id, { ...n, state: 'default' }));

  steps.push({
    data: { type: 'graph', ...getSnapshot() },
    description: `Starting DFS from node ${startId}. We explore as deep as possible before backtracking.`,
    highlightLines: [0],
  });

  const visited = new Set<number>();
  const callStack: number[] = [];

  function dfsHelper(nodeId: number) {
    visited.add(nodeId);
    callStack.push(nodeId);
    nodeMap.set(nodeId, { ...nodeMap.get(nodeId)!, state: 'current' });

    steps.push({
      data: { type: 'graph', ...getSnapshot() },
      description: `Visiting node ${nodeId}. Added to recursion stack.`,
      highlightLines: [2, 3],
      operation: 'DFS Visit',
      auxiliary: [{ label: 'Call Stack', value: [...callStack] }],
    });

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        nodeMap.set(neighbor, { ...nodeMap.get(neighbor)!, state: 'comparing' });
        steps.push({
          data: { type: 'graph', ...getSnapshot() },
          description: `Exploring neighbor ${neighbor} from node ${nodeId}.`,
          highlightLines: [5, 6],
          operation: 'DFS Recurse',
          auxiliary: [{ label: 'Call Stack', value: [...callStack] }, { label: 'Next', value: neighbor }],
        });
        dfsHelper(neighbor);
        nodeMap.set(nodeId, { ...nodeMap.get(nodeId)!, state: 'active' });
      }
    }

    callStack.pop();
    nodeMap.set(nodeId, { ...nodeMap.get(nodeId)!, state: 'sorted' });
    steps.push({
      data: { type: 'graph', ...getSnapshot() },
      description: `Backtracking from node ${nodeId}. Popped from stack.`,
      highlightLines: [8],
      operation: 'DFS Backtrack',
      auxiliary: [{ label: 'Call Stack', value: [...callStack] }],
    });
  }

  dfsHelper(startId);

  steps.push({
    data: { type: 'graph', ...getSnapshot() },
    description: 'DFS complete! All reachable nodes have been visited.',
    highlightLines: [10],
  });

  return steps;
}

export function createCustomGraph(nodeCount: number, edgePairs: Array<[number, number]>): GraphData {
  const count = Math.max(1, Math.min(10, nodeCount));
  const centerX = 300;
  const centerY = 200;
  const radius = 130;

  const nodes: GraphNode[] = Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      id: i,
      label: String(i),
      x: Math.round(centerX + radius * Math.cos(angle)),
      y: Math.round(centerY + radius * Math.sin(angle)),
      state: 'default',
    };
  });

  const validEdges: GraphEdge[] = [];
  const seen = new Set<string>();

  for (const [u, v] of edgePairs) {
    if (u >= 0 && u < count && v >= 0 && v < count && u !== v) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      if (!seen.has(key)) {
        seen.add(key);
        validEdges.push({ from: u, to: v, state: 'default' });
      }
    }
  }

  return { nodes, edges: validEdges };
}

export function generateSampleGraph(): GraphData {
  const nodes: GraphNode[] = [
    { id: 0, x: 300, y: 80, label: '0', state: 'default' },
    { id: 1, x: 150, y: 200, label: '1', state: 'default' },
    { id: 2, x: 450, y: 200, label: '2', state: 'default' },
    { id: 3, x: 80, y: 340, label: '3', state: 'default' },
    { id: 4, x: 220, y: 340, label: '4', state: 'default' },
    { id: 5, x: 380, y: 340, label: '5', state: 'default' },
    { id: 6, x: 520, y: 340, label: '6', state: 'default' },
  ];
  const edges: GraphEdge[] = [
    { from: 0, to: 1, state: 'default' },
    { from: 0, to: 2, state: 'default' },
    { from: 1, to: 3, state: 'default' },
    { from: 1, to: 4, state: 'default' },
    { from: 2, to: 5, state: 'default' },
    { from: 2, to: 6, state: 'default' },
    { from: 3, to: 4, state: 'default' },
    { from: 5, to: 6, state: 'default' },
  ];
  return { nodes, edges };
}
