import type { AlgorithmLesson } from '../../types/algorithm';

// ============================================================================
// 1. BREADTH-FIRST SEARCH (BFS) LESSON
// ============================================================================
export const bfsLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A fundamental graph traversal algorithm that explores vertices level by level using a FIFO queue, guaranteeing the shortest path in unweighted graphs.',
  mainPurpose: 'To systematically visit all reachable vertices in order of increasing distance from a starting node.',
  whatIsIt: {
    overview: 'Breadth-First Search (BFS) explores a graph like ripples radiating outward on water: it first visits the starting vertex (distance 0), then all immediate neighbors (distance 1), then all neighbors of neighbors (distance 2), and so on. It relies on a First-In-First-Out (FIFO) queue to ensure nodes are discovered and processed in strictly increasing order of their shortest path distance from the start.',
    smallExample: 'Start at Node A. Neighbors of A are B and C. BFS visits A, then enqueues B and C. It processes B (discovering D), then processes C (discovering E). Exploration order is A -> B -> C -> D -> E.',
  },
  whyUseIt: {
    problemSolved: 'Finding the shortest path (minimum number of edges) between two nodes in unweighted graphs and calculating network connectivity.',
    whyItMatters: 'It guarantees that when a target node is first discovered, the path taken to reach it has the minimum possible number of edges.',
    whenToUse: [
      'Shortest path in unweighted networks (social network degrees of separation, minimum moves in chess/puzzles).',
      'Web crawling to explore nearby hyperlinks before deep links.',
      'Checking whether an undirected graph is bipartite or connected.',
      'Finding all connected components in an unweighted graph.',
    ],
    whenToAvoid: [
      'Weighted graphs where edge costs vary (use Dijkstra’s Algorithm or A* Search instead).',
      'Extremely wide graphs with enormous branching factors where the queue memory explodes.',
      'Maze solving where deep exploration (DFS) might locate an exit faster without checking every room on that level.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Social Network Connections (Six Degrees of Separation)',
      description: 'Used by LinkedIn and Facebook to find "1st degree", "2nd degree", and "3rd degree" friend connections.',
      educationalVsProductionNote: 'Direct production standard for bidirectional search in social graphs.',
    },
    {
      title: 'GPS Navigation on Unweighted Road Grids',
      description: 'Finding the route with the fewest street turns or fewest metro stops on subway maps.',
      educationalVsProductionNote: 'Used for hop-count routing in network protocols and transit systems.',
    },
    {
      title: 'Peer-to-Peer Network Neighbor Discovery',
      description: 'BitTorrent and blockchain clients use BFS over distributed hash tables (DHT) to locate nearest active peers.',
      educationalVsProductionNote: 'Universal protocol standard for peer discovery.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Enqueue Start Node',
      description: 'Initialize a FIFO queue and mark the start node as visited.',
    },
    {
      stepNumber: 2,
      title: 'Dequeue Current Node',
      description: 'Remove the node at the front of the queue to process it.',
    },
    {
      stepNumber: 3,
      title: 'Inspect Neighbors',
      description: 'For each adjacent neighbor, check if it has already been visited.',
    },
    {
      stepNumber: 4,
      title: 'Mark and Enqueue',
      description: 'For any unvisited neighbor, mark it as visited and append it to the back of the queue.',
    },
    {
      stepNumber: 5,
      title: 'Repeat Until Queue is Empty',
      description: 'Repeat steps 2-4 until the queue is empty, visiting all reachable nodes.',
    },
  ],
  workedExample: {
    datasetDescription: 'Graph with 6 nodes (0 to 5) starting from Node 0. Edges: (0-1), (0-2), (1-3), (1-4), (2-5).',
    initialState: 'Queue: [0], Visited: {0}',
    steps: [
      {
        stepNumber: 1,
        operation: 'Dequeue 0 (level 0)',
        stateDisplay: 'Queue: [1, 2], Visited: {0, 1, 2}',
        explanation: 'Dequeue 0. Inspect neighbors 1 and 2. Both unvisited: mark visited and enqueue. Queue becomes [1, 2].',
        whyNecessary: 'Discovers all nodes at distance 1 from source.',
        beforeState: 'Queue: [0]',
        afterState: 'Queue: [1, 2]',
        nextAction: 'Dequeue node 1.',
        intermediateResult: 'Level 1 discovered: nodes 1 and 2.',
      },
      {
        stepNumber: 2,
        operation: 'Dequeue 1 (level 1)',
        stateDisplay: 'Queue: [2, 3, 4], Visited: {0, 1, 2, 3, 4}',
        explanation: 'Dequeue 1. Inspect neighbors 0 (visited), 3 (unvisited), and 4 (unvisited). Mark 3 and 4 visited and enqueue. Queue becomes [2, 3, 4].',
        whyNecessary: 'Discovers nodes at distance 2 reachable via node 1.',
        beforeState: 'Queue: [1, 2]',
        afterState: 'Queue: [2, 3, 4]',
        nextAction: 'Dequeue node 2.',
        intermediateResult: 'Level 2 partially discovered: nodes 3 and 4.',
      },
      {
        stepNumber: 3,
        operation: 'Dequeue 2 (level 1)',
        stateDisplay: 'Queue: [3, 4, 5], Visited: {0, 1, 2, 3, 4, 5}',
        explanation: 'Dequeue 2. Inspect neighbors 0 (visited) and 5 (unvisited). Mark 5 visited and enqueue. Queue becomes [3, 4, 5].',
        whyNecessary: 'Discovers remaining node at distance 2 via node 2.',
        beforeState: 'Queue: [2, 3, 4]',
        afterState: 'Queue: [3, 4, 5]',
        nextAction: 'Dequeue nodes 3, 4, 5 (all leaf nodes).',
        intermediateResult: 'All 6 nodes visited.',
      },
      {
        stepNumber: 4,
        operation: 'Dequeue nodes 3, 4, 5 (level 2)',
        stateDisplay: 'Queue: [], Visited: {0, 1, 2, 3, 4, 5}',
        explanation: 'Dequeue 3, 4, and 5 one by one. All their neighbors are already visited. Queue becomes empty. Traversal complete.',
        whyNecessary: 'Verifies no further unvisited neighbors exist.',
        beforeState: 'Queue: [3, 4, 5]',
        afterState: 'Queue: []',
        nextAction: 'Traversal complete.',
        intermediateResult: 'Traversal order: 0 -> 1 -> 2 -> 3 -> 4 -> 5.',
      },
    ],
    finalState: 'All nodes visited in order: [0, 1, 2, 3, 4, 5]',
  },
  advantages: [
    'Guarantees shortest path in unweighted graphs.',
    'Systematic level-by-level exploration.',
    'Optimal for finding nearby targets.',
    'Detects connected components and bipartiteness in O(V + E) time.',
  ],
  limitations: [
    'Memory consumption can be high: O(V) queue size can be large for graphs with high branching factor.',
    'Does not work for shortest paths on weighted graphs (use Dijkstra).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(V + E). Every reachable node and edge is examined once.',
    averageCaseMeaning: 'O(V + E) where V is vertex count and E is edge count.',
    worstCaseMeaning: 'O(V + E). In dense graphs where E ≈ V², runtime is O(V²).',
    spaceComplexityMeaning: 'O(V) auxiliary space to store the visited set and the FIFO queue.',
  },
  relatedAlgorithms: [
    {
      name: 'Depth-First Search (DFS)',
      comparison: 'DFS explores as deep as possible along each branch before backtracking, using a stack or recursion. BFS explores level by level using a queue and guarantees shortest paths in unweighted graphs.',
    },
    {
      name: 'Dijkstra’s Algorithm',
      comparison: 'Dijkstra generalizes BFS to graphs with non-negative edge weights using a Priority Queue (min-heap) instead of a FIFO queue.',
    },
  ],
  quiz: [
    {
      question: 'Which data structure is essential for implementing Breadth-First Search (BFS)?',
      options: ['LIFO Stack', 'FIFO Queue', 'Priority Queue', 'Disjoint Set (Union-Find)'],
      correctIndex: 1,
      explanation: 'A FIFO (First-In, First-Out) queue ensures that vertices discovered earlier (closer to the source) are processed before vertices discovered later.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Breadth-First Search is named because it explores the "breadth" (all neighbors at the current depth) before expanding downward to the next level of depth.',
    problemSolved: 'Traverses all reachable vertices in an unweighted graph and calculates shortest paths in terms of number of edges.',
    problemNotSolved: 'Does not find shortest paths in weighted graphs; does not detect negative cycles.',
    whyLearn: 'Core algorithm for graph traversal, networking, web crawling, and the basis of Dijkstra and A*.',
    prerequisites: ['Graph representations (Adjacency List / Matrix)', 'FIFO Queue data structure', 'Set data structure for visited tracking'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Given a starting node s in a graph, visit every reachable vertex and determine the minimum number of edge hops to reach each vertex.',
    naiveApproachInefficiency: 'Trying random paths or deep exploration (DFS) does not guarantee finding the shortest path first and can wander into cycles.',
    coreIdeaUsed: 'Level-order expansion using a FIFO queue. Nodes at distance d are guaranteed to be visited before any node at distance d + 1.',
    utilityExplanation: 'Ensures the first time a node is visited, it has been reached via the shortest possible edge count.',
    workingConditions: ['Unweighted edges (or all edge weights equal to 1).', 'Graph represented as adjacency list or matrix.'],
    whenAnotherIsBetter: 'When edges have varying positive weights, use Dijkstra’s Algorithm. When searching a deep tree for any solution, DFS uses less memory.',
    analogyOrRealLifeExample: 'Searching for a lost file in your company: first you ask your immediate desk neighbors (level 1). If they do not know, you ask the people sitting around them (level 2). You do not fly across the country to another branch before asking the person next to you.',
  },

  inputOutputAssumptions: {
    expectedInput: 'A graph G = (V, E) and a source vertex s.',
    expectedOutput: 'List of visited nodes in traversal order, and optionally distances/parent pointers.',
    constraints: '|V| >= 1.',
    preconditions: 'None.',
    specialCases: ['Disconnected graph: BFS only visits the connected component of s.', 'Single node: returns immediately.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If applied to weighted graphs, BFS does not find shortest paths (it only finds paths with the fewest edges).',
  },

  coreIntuition: {
    simpleExplanation: 'Put the start node in a line (queue). Take the person at the front of the line, visit them, and put all their unvisited friends at the back of the line. Repeat until the line is empty.',
    keyDrivingDecision: 'Always dequeue from the front and enqueue unvisited neighbors at the rear.',
    whyRepeatedOperationWorks: 'Queue order strictly mirrors discovery distance. Nodes at distance d are dequeued before nodes at distance d + 1.',
    paradigmSpecificDetail: 'FIFO frontier expansion ensuring monotonic non-decreasing distance processing.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure BFS(graph, startVertex)',
      '  create FIFO queue Q',
      '  create visited set',
      '  Q.enqueue(startVertex)',
      '  visited.add(startVertex)',
      '  while Q is not empty do',
      '    current := Q.dequeue()',
      '    visit(current)',
      '    for each neighbor in graph.adj[current] do',
      '      if neighbor not in visited then',
      '        visited.add(neighbor)',
      '        Q.enqueue(neighbor)',
      '      end if',
      '    end for',
      '  end while',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'create FIFO queue Q', explanation: 'Holds discovered nodes waiting for expansion.' },
      { lineIndex: 4, lineText: 'visited.add(startVertex)', explanation: 'Mark visited immediately upon enqueuing to prevent duplicate queue entries.' },
      { lineIndex: 6, lineText: 'current := Q.dequeue()', explanation: 'Process the node that has been waiting longest.' },
      { lineIndex: 8, lineText: 'for each neighbor in graph.adj[current]', explanation: 'Inspect all outgoing edges from current.' },
      { lineIndex: 10, lineText: 'visited.add(neighbor); Q.enqueue(neighbor)', explanation: 'CRITICAL: Mark visited immediately when added to queue, not when popped!' },
    ],
    terminationCondition: 'Terminates when queue Q becomes empty.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function bfs(adj: Map<number, number[]>, start: number): number[] {
  const visited = new Set<number>();
  const queue: number[] = [];
  const order: number[] = [];

  visited.add(start);
  queue.push(start);

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }

  return order;
}`,
    signature: 'function bfs(adj: Map<number, number[]>, start: number): number[]',
    inputValidation: 'If start is not in graph, returns [start].',
    variables: [
      { name: 'visited', type: 'Set<number>', purpose: 'Prevents infinite loops and duplicate node visits.' },
      { name: 'queue', type: 'number[]', purpose: 'FIFO queue maintaining the discovery frontier.' },
      { name: 'order', type: 'number[]', purpose: 'Sequential record of visited vertices.' },
    ],
    lineByLine: [
      { line: 2, code: 'const visited = new Set<number>();', explanation: 'O(1) lookup set for visited states.' },
      { line: 6, code: 'visited.add(start); queue.push(start);', explanation: 'Initialize with start node.' },
      { line: 8, code: 'while (queue.length > 0)', explanation: 'Loop while frontier exists.' },
      { line: 9, code: 'const u = queue.shift()!;', explanation: 'Dequeue front node.' },
      { line: 14, code: 'if (!visited.has(v)) { visited.add(v); queue.push(v); }', explanation: 'Mark visited and enqueue.' },
    ],
    returnExplanation: 'Returns list of visited node IDs in exact BFS order.',
    commonBugs: [
      'Marking a node visited when it is DEQUEUED instead of when it is ENQUEUED. This causes nodes with multiple in-edges to be enqueued many times, exploding memory to exponential O(2^V).',
      'Forgetting the visited set on cyclic graphs, causing an infinite loop.',
    ],
    edgeCaseHandling: ['Isolated vertices return immediately after visiting the start node.'],
  },

  correctness: {
    intuitiveExplanation: 'BFS explores nodes in layers of distance 0, 1, 2, ... from the source. Because edges are unweighted, any node discovered at layer d cannot possibly be reached in fewer than d steps. Thus the shortest path is found.',
    formalProof: {
      method: 'Graph-Search Invariant',
      invariantOrClaim: 'Queue Monotonicity Theorem: At any point during BFS execution, the queue contains vertices with distances d and d+1, with all distance d vertices appearing before all distance d+1 vertices.',
      initialization: 'Initially queue contains only s with distance 0. Monotonicity holds.',
      maintenance: 'When node u of distance d is dequeued, all its unvisited neighbors are assigned distance d+1 and enqueued at the back. Since all remaining elements in the queue have distance d or d+1, adding elements of distance d+1 at the back preserves the invariant.',
      termination: 'Every reachable node is enqueued once and dequeued once. By monotonicity, vertices are dequeued in non-decreasing order of distance. Therefore, the first time a node is discovered, its shortest path distance is finalized.',
      conclusion: 'BFS is guaranteed to compute shortest paths on unweighted graphs.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(V + E)',
      explanation: 'Every reachable vertex is enqueued once (O(V)) and every incident edge is scanned once (O(E)).',
      condition: 'Any graph.',
    },
    averageCase: {
      complexity: 'O(V + E)',
      explanation: 'Linear in terms of graph size.',
      condition: 'Standard graph.',
    },
    worstCase: {
      complexity: 'O(V + E)',
      explanation: 'O(V + E) for adjacency list, O(V²) for adjacency matrix.',
      condition: 'Dense graph.',
    },
    auxiliarySpace: {
      complexity: 'O(V)',
      explanation: 'Visited set holds at most V items, queue holds at most V items.',
    },
    totalMemory: 'O(V + E) for graph representation + O(V) for search state.',
    bigOExplanation: 'Both time and space are linear in graph representation size: Theta(V + E).',
    scalingBehavior: 'Scales easily to graphs with millions of vertices and edges.',
  },

  advantagesAndLimitations: {
    strengths: ['Finds shortest path in unweighted graphs.', 'Never gets trapped in infinite depth loops on infinite graphs.'],
    limitations: ['High queue memory on graphs with large branching factors.', 'Does not handle edge weights.'],
    memoryTradeOffs: ['O(V) memory to track queue frontier.'],
    poorChoiceScenarios: ['Weighted road networks with varying distances.'],
  },

  comparisons: [
    {
      algorithm: 'Depth-First Search (DFS)',
      timeComplexity: 'Both O(V + E)',
      spaceComplexity: 'Both O(V)',
      stabilityOrType: 'Graph Traversals',
      similarities: 'Both visit all reachable vertices in O(V + E) time.',
      differences: 'BFS uses a FIFO queue and finds shortest paths; DFS uses a LIFO stack and explores deeply, suitable for cycle detection and topological sorting.',
      whenToPreferThis: 'When finding shortest paths or exploring nearby nodes.',
      whenToPreferAlternative: 'For maze solving, cycle detection, or topological sort.',
    },
  ],

  commonMistakes: [
    {
      title: 'Late Visited Marking (Exponential Queue Bloat)',
      misconception: 'Marking visited on dequeue.',
      badCodeOrApproach: 'const u = queue.shift(); visited.add(u);',
      correctApproach: 'Mark visited IMMEDIATELY upon pushing to queue: visited.add(v); queue.push(v);',
    },
  ],

  exercises: [
    {
      id: 'bfs-ex-1',
      type: 'conceptual',
      question: 'Why does BFS guarantee the shortest path between two nodes in an unweighted graph?',
      options: [
        'Because it explores nodes in order of strictly non-decreasing distance from the source.',
        'Because it uses recursion.',
        'Because it sorts the edge weights.',
        'Because it checks cycles.',
      ],
      correctIndex: 0,
      explanation: 'The FIFO queue guarantees that all vertices at distance d are visited before any vertex at distance d + 1.',
    },
  ],

  summary: {
    coreIdea: 'BFS explores a graph level by level using a FIFO queue, guaranteeing shortest paths in unweighted graphs in O(V + E) time.',
    keyConditions: [
      'FIFO queue data structure.',
      'Mark nodes visited upon ENQUEUE.',
      'Unweighted edge assumption.',
    ],
    complexitySummary: {
      time: 'O(V + E)',
      space: 'O(V) auxiliary memory',
    },
    whenToUse: 'Shortest paths in unweighted graphs and level-by-level exploration.',
    prerequisites: ['Graphs', 'Queues', 'Sets'],
    nextSteps: [
      { id: 'dfs', name: 'Depth-First Search (DFS)', reason: 'Learn the dual graph exploration algorithm that dives deep using a stack.' },
    ],
  },
};

// ============================================================================
// 2. DEPTH-FIRST SEARCH (DFS) LESSON
// ============================================================================
export const dfsLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A classic graph traversal algorithm that explores as deep as possible along each branch before backtracking, utilizing a call stack or LIFO structure.',
  mainPurpose: 'To explore all paths, detect cycles, find connected components, and compute topological orderings.',
  whatIsIt: {
    overview: 'Depth-First Search (DFS) explores a graph by following a single path as far as it will go until it reaches a dead end or a previously visited node. It then backtracks to the most recent fork and explores the next unexplored branch. DFS is inherently recursive and naturally maps to a Last-In-First-Out (LIFO) stack.',
    smallExample: 'Start at Node A. A is connected to B and C. DFS moves to B. B is connected to D. DFS moves to D (dead end). DFS backtracks to B, then backtracks to A, then explores C. Path: A -> B -> D (backtrack) -> C.',
  },
  whyUseIt: {
    problemSolved: 'Exhaustive path exploration, topological sorting of directed acyclic graphs (DAGs), finding strongly connected components, and detecting cycles.',
    whyItMatters: 'DFS forms the backbone of critical compiler optimizations (dependency resolution, dead-code elimination) and maze-solving algorithms.',
    whenToUse: [
      'Topological sorting in build systems (npm, Makefiles, package dependency resolution).',
      'Cycle detection in directed and undirected graphs.',
      'Maze generation and maze solving.',
      'Finding strongly connected components (Tarjan’s or Kosaraju’s algorithm).',
      'Exploring whether any path exists between two nodes when shortest path is not needed.',
    ],
    whenToAvoid: [
      'Finding shortest paths in unweighted graphs (BFS is guaranteed to find shortest path; DFS can find an arbitrarily long path first).',
      'Infinite or extremely deep graphs where recursion depth causes stack overflow.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Build Systems & Package Managers (Dependency Resolution)',
      description: 'npm, yarn, and pip use DFS topological sort to resolve package dependencies and detect circular import errors.',
      educationalVsProductionNote: 'High-volume production standard in software package managers.',
    },
    {
      title: 'Compiler Dead Code Elimination',
      description: 'Compilers use DFS reachability analysis from the main() function to identify and strip unused functions and dead code.',
      educationalVsProductionNote: 'Standard optimization pass in LLVM and GCC.',
    },
    {
      title: 'Deadlock Detection in Operating Systems',
      description: 'Operating systems use DFS cycle detection on resource-allocation graphs to detect deadlocked threads.',
      educationalVsProductionNote: 'Core operating system concurrency control mechanism.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Visit Node',
      description: 'Mark the current node as visited and record its visit in the traversal log.',
    },
    {
      stepNumber: 2,
      title: 'Explore First Unvisited Neighbor',
      description: 'Iterate over neighbors. As soon as an unvisited neighbor is found, immediately recurse on it.',
    },
    {
      stepNumber: 3,
      title: 'Backtrack on Dead End',
      description: 'When all neighbors of the current node have been visited, return from the recursive call (backtrack) to the parent node.',
    },
    {
      stepNumber: 4,
      title: 'Continue Traversal',
      description: 'The parent continues iterating over its remaining neighbors.',
    },
  ],
  workedExample: {
    datasetDescription: 'Graph with 6 nodes (0 to 5) starting from Node 0. Edges: (0-1), (0-2), (1-3), (1-4), (2-5).',
    initialState: 'Stack: [0], Visited: {0}',
    steps: [
      {
        stepNumber: 1,
        operation: 'Visit Node 0 -> move to neighbor 1',
        stateDisplay: 'Call Stack: [0, 1], Visited: {0, 1}',
        explanation: 'Visit 0. Neighbor 1 is unvisited: push 1 to call stack. Visit 1.',
        whyNecessary: 'Dives deep into first branch.',
        beforeState: 'At Node 0',
        afterState: 'At Node 1',
        nextAction: 'Inspect neighbors of 1.',
        intermediateResult: '0 -> 1 visited.',
      },
      {
        stepNumber: 2,
        operation: 'Visit Node 1 -> move to neighbor 3',
        stateDisplay: 'Call Stack: [0, 1, 3], Visited: {0, 1, 3}',
        explanation: 'From 1, inspect neighbor 3. Unvisited: push 3 to call stack. Visit 3.',
        whyNecessary: 'Continues diving along the leftmost path.',
        beforeState: 'At Node 1',
        afterState: 'At Node 3',
        nextAction: 'Inspect neighbors of 3.',
        intermediateResult: '0 -> 1 -> 3 visited.',
      },
      {
        stepNumber: 3,
        operation: 'Node 3 is a dead end -> Backtrack to 1 -> move to 4',
        stateDisplay: 'Call Stack: [0, 1, 4], Visited: {0, 1, 3, 4}',
        explanation: '3 has no unvisited neighbors. Pop 3 (backtrack to 1). At 1, next unvisited neighbor is 4. Push 4 to call stack. Visit 4.',
        whyNecessary: 'Backtracks from dead end to explore alternative branch.',
        beforeState: 'At Node 3',
        afterState: 'At Node 4',
        nextAction: 'Inspect neighbors of 4.',
        intermediateResult: '0 -> 1 -> 3 -> 4 visited.',
      },
      {
        stepNumber: 4,
        operation: 'Backtrack 4 -> Backtrack 1 -> Backtrack 0 -> move to 2 -> move to 5',
        stateDisplay: 'Call Stack: [], Visited: {0, 1, 3, 4, 2, 5}',
        explanation: '4 dead ends. Backtrack 4 -> 1 -> 0. At 0, next neighbor is 2. Visit 2, then visit 5. All nodes visited.',
        whyNecessary: 'Exhausts all remaining branches in the graph.',
        beforeState: 'At Node 4',
        afterState: 'Traversal complete',
        nextAction: 'Return traversal order.',
        intermediateResult: 'DFS order: 0 -> 1 -> 3 -> 4 -> 2 -> 5.',
      },
    ],
    finalState: 'Visited order: [0, 1, 3, 4, 2, 5]',
  },
  advantages: [
    'Uses O(h) memory where h is maximum graph depth (often h << V).',
    'Ideal for detecting cycles, topological sorting, and articulation points.',
    'Simple recursive formulation.',
  ],
  limitations: [
    'Does not find shortest paths.',
    'Can get trapped in deep branches or cause call stack overflow on deep graphs.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(V + E). Visits every reachable node and edge once.',
    averageCaseMeaning: 'O(V + E).',
    worstCaseMeaning: 'O(V + E) for adjacency lists.',
    spaceComplexityMeaning: 'O(V) auxiliary memory for the visited set and recursive call stack (stack depth equals longest simple path).',
  },
  relatedAlgorithms: [
    {
      name: 'Breadth-First Search (BFS)',
      comparison: 'BFS searches level by level using a queue and guarantees shortest paths; DFS searches depth first using a stack and is optimal for cycle detection and topological order.',
    },
  ],
  quiz: [
    {
      question: 'Which graph property can be determined using DFS but CANNOT be directly determined by a standard BFS traversal?',
      options: ['Graph connectivity', 'Topological sort of a DAG', 'Bipartiteness', 'Reachability of a node'],
      correctIndex: 1,
      explanation: 'Topological sort requires ordering vertices by their finish times in post-order DFS traversal. BFS does not produce a valid topological ordering.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Depth-First Search is named because it progresses as deep into the graph as possible before backtracking.',
    problemSolved: 'Comprehensive graph traversal, cycle detection, topological sorting, and path existence.',
    problemNotSolved: 'Shortest paths in unweighted graphs.',
    whyLearn: 'Core algorithm for maze solving, dependency analysis, compiler optimizations, and backtracking algorithms.',
    prerequisites: ['Recursion and call stacks', 'Graph adjacency representations', 'Visited sets'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Traverse an entire graph to analyze its structure (cycles, components, topological order) without needing shortest path guarantees.',
    naiveApproachInefficiency: 'BFS requires keeping an entire frontier layer in memory, which can be massive. DFS only keeps the current path on the call stack.',
    coreIdeaUsed: 'Follow each edge as deep as possible until hitting a dead end or visited node, then backtrack.',
    utilityExplanation: 'Vertices are assigned discovery and finish times, enabling detection of forward, cross, and back edges (cycles).',
    workingConditions: ['Graph with finite vertices.'],
    whenAnotherIsBetter: 'When finding shortest path in unweighted graphs (use BFS).',
    analogyOrRealLifeExample: 'Navigating a labyrinth or maze: you always keep your left hand on the wall, walking into every corridor until you hit a dead end, and then retracing your footsteps to the last fork in the road.',
  },

  inputOutputAssumptions: {
    expectedInput: 'Graph G = (V, E) and start vertex s.',
    expectedOutput: 'List of visited nodes in DFS order.',
    constraints: '|V| >= 1.',
    preconditions: 'None.',
    specialCases: ['Cyclic graphs: visited set prevents infinite loops.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If visited set is omitted on cyclic graphs, recursion causes stack overflow.',
  },

  coreIntuition: {
    simpleExplanation: 'Walk down a path as far as you can go. When you hit a wall, back up to the last crossroad and try the other turn.',
    keyDrivingDecision: 'Recursively visit the first unvisited neighbor found.',
    whyRepeatedOperationWorks: 'Because each visited node is recorded, the algorithm never enters infinite cycles and terminates when all reachable nodes have been explored.',
    paradigmSpecificDetail: 'LIFO recursive backtracking exploration.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure DFS(graph, startVertex)',
      '  create visited set',
      '  dfsHelper(graph, startVertex, visited)',
      'end procedure',
      '',
      'procedure dfsHelper(graph, u, visited)',
      '  visited.add(u)',
      '  visit(u)',
      '  for each v in graph.adj[u] do',
      '    if v not in visited then',
      '      dfsHelper(graph, v, visited)',
      '    end if',
      '  end for',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 5, lineText: 'visited.add(u)', explanation: 'Mark node visited as soon as it is entered.' },
      { lineIndex: 7, lineText: 'for each v in graph.adj[u]', explanation: 'Iterate over all neighbors.' },
      { lineIndex: 9, lineText: 'dfsHelper(graph, v, visited)', explanation: 'Deep recursive call on unvisited neighbor.' },
    ],
    terminationCondition: 'Recursion unwinds when all neighbors of u have been visited.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function dfs(adj: Map<number, number[]>, start: number): number[] {
  const visited = new Set<number>();
  const order: number[] = [];

  function explore(u: number): void {
    visited.add(u);
    order.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      if (!visited.has(v)) {
        explore(v); // Recurse deeply
      }
    }
  }

  explore(start);
  return order;
}`,
    signature: 'function dfs(adj: Map<number, number[]>, start: number): number[]',
    inputValidation: 'Single node graph returns [start].',
    variables: [
      { name: 'visited', type: 'Set<number>', purpose: 'Tracks discovered vertices to avoid cycles.' },
      { name: 'order', type: 'number[]', purpose: 'Stores chronological DFS discovery order.' },
    ],
    lineByLine: [
      { line: 5, code: 'visited.add(u); order.push(u);', explanation: 'Mark visited and record order.' },
      { line: 9, code: 'for (const v of neighbors)', explanation: 'Iterate over neighbors.' },
      { line: 11, code: 'explore(v);', explanation: 'Recursive exploration.' },
    ],
    returnExplanation: 'Returns nodes in order of DFS discovery.',
    commonBugs: [
      'Forgetting the visited set, which causes infinite mutual recursion on cyclic graphs.',
      'Assuming DFS returns the shortest path between nodes.',
    ],
    edgeCaseHandling: ['Isolated nodes terminate after 1 call.'],
  },

  correctness: {
    intuitiveExplanation: 'Every reachable node is either already visited or will be discovered when its incident edge is explored. Because all edges are examined and nodes are never re-explored, all reachable vertices are visited exactly once.',
    formalProof: {
      method: 'Induction',
      invariantOrClaim: 'DFS visits all vertices in the connected component of start vertex s.',
      initialization: 'Base case: Vertex s is visited immediately upon entry.',
      maintenance: 'Inductive step: Let u be a visited vertex. For any neighbor v of u, if v is unvisited, DFS is invoked on v. By induction on path length, any vertex at distance k from s is visited once all vertices along the path from s to v are visited.',
      termination: 'Since |V| is finite and each vertex is marked visited upon first discovery, explore() is called at most |V| times and examines each edge at most twice (undirected).',
      conclusion: 'DFS is provably correct.',
    },
  },

  complexityAnalysis: {
    bestCase: { complexity: 'O(V + E)', explanation: 'Visits every reachable node and edge once.', condition: 'Any graph.' },
    averageCase: { complexity: 'O(V + E)', explanation: 'Linear in vertices and edges.', condition: 'Standard graph.' },
    worstCase: { complexity: 'O(V + E)', explanation: 'Traverses entire component.', condition: 'Dense graph.' },
    auxiliarySpace: { complexity: 'O(V)', explanation: 'Visited set + call stack depth (at most V in a linear graph).', },
    totalMemory: 'O(V + E) for adjacency list + O(V) for stack.',
    bigOExplanation: 'Theta(V + E) operations.',
    scalingBehavior: 'Linear scaling with respect to graph size.',
  },

  advantagesAndLimitations: {
    strengths: ['Low memory usage on thin graphs (O(h) stack depth).', 'Ideal for topological sort and cycle detection.'],
    limitations: ['Does not find shortest paths.', 'Risk of stack overflow on very deep graphs without tail recursion.'],
    memoryTradeOffs: ['O(h) stack space where h is tree depth.'],
    poorChoiceScenarios: ['Shortest path queries.'],
  },

  comparisons: [
    {
      algorithm: 'Breadth-First Search (BFS)',
      timeComplexity: 'Both O(V + E)',
      spaceComplexity: 'Both O(V)',
      stabilityOrType: 'Graph Traversals',
      similarities: 'Both explore all reachable vertices in O(V + E) time.',
      differences: 'BFS uses a queue and finds shortest paths; DFS uses a stack and is used for cycles and topological sort.',
      whenToPreferThis: 'Topological sort, cycle detection, maze solving.',
      whenToPreferAlternative: 'Shortest paths.',
    },
  ],

  commonMistakes: [
    {
      title: 'Assuming DFS Finds Shortest Paths',
      misconception: 'Believing the first path found by DFS is the shortest.',
      badCodeOrApproach: 'Using DFS to find distance between nodes.',
      correctApproach: 'Use BFS for shortest paths in unweighted graphs.',
    },
  ],

  exercises: [
    {
      id: 'dfs-ex-1',
      type: 'conceptual',
      question: 'What type of edge in a DFS traversal of a directed graph indicates the presence of a cycle?',
      options: ['Tree Edge', 'Forward Edge', 'Back Edge', 'Cross Edge'],
      correctIndex: 2,
      explanation: 'A Back Edge connects a vertex to an ancestor in the DFS tree that is currently on the call stack (gray vertex), indicating a cycle.',
    },
  ],

  summary: {
    coreIdea: 'DFS explores as deep as possible along each branch before backtracking, using a LIFO stack or recursion, ideal for cycle detection and topological sorting in O(V + E) time.',
    keyConditions: [
      'Visited set prevents infinite loops on cycles.',
      'Recursion depth up to V.',
      'Does not guarantee shortest path.',
    ],
    complexitySummary: {
      time: 'O(V + E)',
      space: 'O(V) auxiliary memory',
    },
    whenToUse: 'Cycle detection, topological sort, maze generation, component analysis.',
    prerequisites: ['Recursion', 'Graphs'],
    nextSteps: [
      { id: 'inorder-traversal', name: 'In-Order Traversal', reason: 'See how depth-first recursion produces sorted order in binary search trees.' },
    ],
  },
};
