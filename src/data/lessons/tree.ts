import type { AlgorithmLesson } from '../../types/algorithm';

// ============================================================================
// 1. INORDER TRAVERSAL LESSON
// ============================================================================
export const inorderTraversalLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A depth-first binary tree traversal that recursively visits the left subtree, processes the current node, and visits the right subtree, producing values in non-decreasing sorted order for Binary Search Trees.',
  mainPurpose: 'To retrieve elements of a Binary Search Tree in sorted order and evaluate arithmetic expression trees in infix notation.',
  whatIsIt: {
    overview: 'In-order traversal follows the strict recursive sequence: Left -> Root -> Right. For every node, all descendants in its left subtree are processed first. Then the node itself is visited. Finally, all descendants in its right subtree are processed. Because of the BST invariant (all keys in left subtree < node key < all keys in right subtree), this traversal visits keys from lowest to highest.',
    smallExample: 'A tree with root 2, left child 1, right child 3. In-order visits left child 1, then root 2, then right child 3. Output sequence: [1, 2, 3].',
  },
  whyUseIt: {
    problemSolved: 'Retrieving sorted data from hierarchical tree structures and validating Binary Search Tree invariants.',
    whyItMatters: 'It allows trees to function as dynamic ordered sets where insertions, lookups, and sorted enumerations all happen seamlessly without re-sorting.',
    whenToUse: [
      'Extracting all keys from a BST in sorted ascending order.',
      'Checking whether a binary tree is a valid BST (the in-order sequence must be strictly increasing).',
      'Infix evaluation of mathematical parse trees (e.g. converting an expression tree back to (3 + 5) * 2).',
    ],
    whenToAvoid: [
      'Cloning or serializing a tree structure (Pre-order traversal is better suited).',
      'Deleting all nodes in a tree bottom-up (Post-order traversal is better suited).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Database B-Tree Range Scans',
      description: 'Used in SQL database engines to execute queries like SELECT * WHERE age BETWEEN 20 AND 30 in ascending order.',
      educationalVsProductionNote: 'Direct production standard for indexed range scans in database storage engines.',
    },
    {
      title: 'Mathematical Formula Parsers (ASTs)',
      description: 'Translating expression syntax trees back into human-readable algebraic infix equations.',
      educationalVsProductionNote: 'Standard compiler and calculator syntax tree rendering.',
    },
    {
      title: 'BST Invariant Validation in Linters & Static Analysis',
      description: 'Validating that a binary tree conforms to the BST property by checking that in-order traversal yields a monotonically increasing array.',
      educationalVsProductionNote: 'Standard unit testing and runtime verification technique.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Base Case Check',
      description: 'If the current node is null, return immediately.',
    },
    {
      stepNumber: 2,
      title: 'Recurse on Left Child',
      description: 'Execute inOrder(node.left) to traverse smaller keys first.',
    },
    {
      stepNumber: 3,
      title: 'Process Current Node',
      description: 'Visit the current node (e.g. record or print node.value).',
    },
    {
      stepNumber: 4,
      title: 'Recurse on Right Child',
      description: 'Execute inOrder(node.right) to process larger keys next.',
    },
  ],
  workedExample: {
    datasetDescription: 'BST with Root 50, Left child 30 (with left 20, right 40), Right child 70 (with left 60, right 80)',
    initialState: 'Tree: 50 -> Left (30: 20, 40), Right (70: 60, 80)',
    steps: [
      {
        stepNumber: 1,
        operation: 'Traverse left: 50 -> 30 -> 20',
        stateDisplay: 'Output: [20]',
        explanation: 'Follow left pointers from 50 to 30 to 20. 20 has no left child. Visit 20. 20 has no right child.',
        whyNecessary: '20 is the absolute minimum in the tree; visited first.',
        beforeState: 'At Node 20',
        afterState: '20 appended to output',
        nextAction: 'Backtrack to 30.',
        intermediateResult: 'Output: [20].',
      },
      {
        stepNumber: 2,
        operation: 'Backtrack to 30 -> visit 30 -> move to 40',
        stateDisplay: 'Output: [20, 30, 40]',
        explanation: 'Visit 30. Move to right child 40. 40 has no children; visit 40. Entire left subtree of 50 is done.',
        whyNecessary: 'Processes root 30, then right child 40.',
        beforeState: 'At Node 30',
        afterState: '30 and 40 appended',
        nextAction: 'Backtrack to root 50.',
        intermediateResult: 'Left subtree complete: [20, 30, 40].',
      },
      {
        stepNumber: 3,
        operation: 'Visit Root 50 -> move to right child 70',
        stateDisplay: 'Output: [20, 30, 40, 50]',
        explanation: 'Visit root 50. Now traverse right subtree rooted at 70.',
        whyNecessary: 'Root 50 is greater than left subtree and smaller than right subtree.',
        beforeState: 'At Node 50',
        afterState: '50 appended',
        nextAction: 'Traverse right subtree of 50.',
        intermediateResult: 'Output: [20, 30, 40, 50].',
      },
      {
        stepNumber: 4,
        operation: 'In right subtree: 70 -> left 60 -> visit 60 -> visit 70 -> visit 80',
        stateDisplay: 'Output: [20, 30, 40, 50, 60, 70, 80]',
        explanation: 'Visit left child 60, then parent 70, then right child 80. Traversal complete.',
        whyNecessary: 'Visits remaining right subtree in sorted order.',
        beforeState: 'At Node 70',
        afterState: '60, 70, 80 appended',
        nextAction: 'Traversal complete.',
        intermediateResult: 'Final sorted list: [20, 30, 40, 50, 60, 70, 80].',
      },
    ],
    finalState: 'Output: [20, 30, 40, 50, 60, 70, 80]',
  },
  advantages: [
    'Produces sorted order from any Binary Search Tree in linear O(n) time.',
    'Simple recursive structure.',
    'Memory efficient: stack space is O(h) where h is tree height (O(log n) for balanced trees).',
  ],
  limitations: [
    'Recursive implementation can cause stack overflow on degenerate / linked-list trees (depth n).',
    'Cannot reconstruct tree structure from in-order alone (requires pre-order or post-order as well).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(n) time. Every node is visited exactly once.',
    averageCaseMeaning: 'O(n) time. T(n) = 2T(n/2) + O(1) for balanced trees = O(n).',
    worstCaseMeaning: 'O(n) time even on skewed trees.',
    spaceComplexityMeaning: 'O(h) auxiliary memory for the call stack, where h is the tree height. O(log n) for balanced trees, O(n) for skewed trees.',
  },
  relatedAlgorithms: [
    {
      name: 'Pre-Order Traversal (Root-Left-Right)',
      comparison: 'Pre-order visits the root first, which is ideal for cloning or serializing a tree structure.',
    },
    {
      name: 'Post-Order Traversal (Left-Right-Root)',
      comparison: 'Post-order visits children before parents, which is ideal for deleting nodes or computing directory sizes bottom-up.',
    },
  ],
  quiz: [
    {
      question: 'What is guaranteed about the output of an In-Order traversal performed on a valid Binary Search Tree?',
      options: [
        'The values are in reverse sorted order.',
        'The values are in strictly non-decreasing sorted order.',
        'The root is always the first element in the output.',
        'The output is a heap.',
      ],
      correctIndex: 1,
      explanation: 'Because a BST enforces Left < Root < Right, visiting Left then Root then Right guarantees ascending sorted output.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'In-order traversal is named because the root is visited "in" between its left and right subtrees: Left -> Root -> Right.',
    problemSolved: 'Visits all nodes in a binary tree, generating sorted keys when applied to a BST.',
    problemNotSolved: 'Does not reconstruct tree topology without additional traversal data.',
    whyLearn: 'Core tree traversal algorithm, illustrating structural recursion and BST validation.',
    prerequisites: ['Binary Trees', 'Recursion', 'Binary Search Tree property'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Enumerate all elements of a binary search tree in sorted order in O(n) time.',
    naiveApproachInefficiency: 'Collecting all nodes and then running an O(n log n) sort algorithm wastes time and memory. In-order traversal produces sorted keys directly in O(n) time.',
    coreIdeaUsed: 'Recursive decomposition: Left subtree < Root < Right subtree.',
    utilityExplanation: 'Traverses exactly in non-decreasing order.',
    workingConditions: ['Binary tree structure.'],
    whenAnotherIsBetter: 'When serializing a tree, use pre-order. When freeing memory bottom-up, use post-order.',
    analogyOrRealLifeExample: 'Reading a book chapter by chapter: you read chapter 1 first, then the title of chapter 2, then chapter 2’s subsections.',
  },

  inputOutputAssumptions: {
    expectedInput: 'Root node of a binary tree.',
    expectedOutput: 'List of values in Left-Root-Right order.',
    constraints: 'Binary tree with left and right child pointers.',
    preconditions: 'None.',
    specialCases: ['Empty tree (root === null) returns empty list.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If the tree is not a valid BST, in-order traversal still executes successfully, but output will not be sorted.',
  },

  coreIntuition: {
    simpleExplanation: 'Always go left as far as you can. When you cannot go left anymore, read the number you are at, and then take one step right and repeat.',
    keyDrivingDecision: 'Left -> Current -> Right.',
    whyRepeatedOperationWorks: 'Every node in a BST is greater than everything in its left subtree and less than everything in its right subtree.',
    paradigmSpecificDetail: 'Structural tree recursion.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure inOrder(node, result)',
      '  if node is null then return',
      '  inOrder(node.left, result)',
      '  result.append(node.value)',
      '  inOrder(node.right, result)',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'if node is null then return', explanation: 'Base case.' },
      { lineIndex: 2, lineText: 'inOrder(node.left, result)', explanation: 'Traverse left subtree.' },
      { lineIndex: 3, lineText: 'result.append(node.value)', explanation: 'Process root node.' },
      { lineIndex: 4, lineText: 'inOrder(node.right, result)', explanation: 'Traverse right subtree.' },
    ],
    terminationCondition: 'Recursion halts when node is null.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `interface TreeNode<T> {
  value: T;
  left?: TreeNode<T>;
  right?: TreeNode<T>;
}

export function inOrderTraversal<T>(root?: TreeNode<T>): T[] {
  const result: T[] = [];

  function traverse(node?: TreeNode<T>): void {
    if (!node) return;
    traverse(node.left);
    result.push(node.value);
    traverse(node.right);
  }

  traverse(root);
  return result;
}`,
    signature: 'function inOrderTraversal<T>(root?: TreeNode<T>): T[]',
    inputValidation: 'Null root returns [].',
    variables: [
      { name: 'result', type: 'T[]', purpose: 'Stores in-order traversal values.' },
      { name: 'node', type: 'TreeNode<T>', purpose: 'Current tree node being evaluated.' },
    ],
    lineByLine: [
      { line: 8, code: 'if (!node) return;', explanation: 'Base case.' },
      { line: 9, code: 'traverse(node.left);', explanation: 'Left child.' },
      { line: 10, code: 'result.push(node.value);', explanation: 'Visit.' },
      { line: 11, code: 'traverse(node.right);', explanation: 'Right child.' },
    ],
    returnExplanation: 'Returns array of values in in-order sequence.',
    commonBugs: ['Forgetting the null check base case.', 'Pushing node.value before traversing left child (becomes pre-order).'],
    edgeCaseHandling: ['Empty tree returns empty array.'],
  },

  correctness: {
    intuitiveExplanation: 'For any BST, all items in the left subtree are smaller than the node, and all items in the right subtree are larger. Since the traversal visits the left subtree, then the node, then the right subtree, it visits every element in ascending order.',
    formalProof: {
      method: 'Induction',
      invariantOrClaim: 'inOrder(root) outputs the keys of the BST rooted at root in strictly non-decreasing order.',
      initialization: 'Base case: A null tree has 0 keys and is sorted.',
      maintenance: 'Inductive step: Assume inOrder correctly outputs sorted keys for trees of size < k. A tree of size k has left subtree L, root key r, and right subtree R, each of size < k. By hypothesis, inOrder(L) outputs sorted keys < r. Then r is output. Then inOrder(R) outputs sorted keys > r. Combining them yields a sorted sequence.',
      termination: 'Every call reduces subtree size until reaching null leaves.',
      conclusion: 'In-order traversal is provably correct.',
    },
  },

  complexityAnalysis: {
    bestCase: { complexity: 'O(n)', explanation: 'Visits every node once.', condition: 'Any tree.' },
    averageCase: { complexity: 'O(n)', explanation: 'Visits every node once.', condition: 'Any tree.' },
    worstCase: { complexity: 'O(n)', explanation: 'Visits every node once.', condition: 'Any tree.' },
    auxiliarySpace: { complexity: 'O(h)', explanation: 'Call stack depth equals tree height h: O(log n) for balanced, O(n) for skewed.', },
    totalMemory: 'O(n) for tree + O(h) for call stack.',
    bigOExplanation: 'Theta(n) time, O(h) space.',
    scalingBehavior: 'Linear runtime scaling with number of tree nodes.',
  },

  advantagesAndLimitations: {
    strengths: ['Produces sorted order from BST in O(n) time.', 'Simple and elegant.'],
    limitations: ['Stack overflow risk on severely unbalanced trees.'],
    memoryTradeOffs: ['O(h) call stack memory.'],
    poorChoiceScenarios: ['Tree serialization without pre-order info.'],
  },

  comparisons: [
    {
      algorithm: 'Pre-Order Traversal',
      timeComplexity: 'Both O(n)',
      spaceComplexity: 'Both O(h)',
      stabilityOrType: 'Tree Traversals',
      similarities: 'Both depth-first tree traversals.',
      differences: 'In-order is Left-Root-Right (sorted in BST); Pre-order is Root-Left-Right (ideal for cloning).',
      whenToPreferThis: 'When sorted output is needed.',
      whenToPreferAlternative: 'When copying a tree.',
    },
  ],

  commonMistakes: [
    {
      title: 'Visiting Root Before Left Subtree',
      misconception: 'Placing result.push(node.value) before traverse(node.left).',
      badCodeOrApproach: 'result.push(node.value); traverse(node.left);',
      correctApproach: 'traverse(node.left) must execute before visiting root.',
    },
  ],

  exercises: [
    {
      id: 'iot-ex-1',
      type: 'step-tracing',
      question: 'What is the in-order traversal of a tree with Root 4, Left 2 (with left 1, right 3), Right 5?',
      options: ['1, 2, 3, 4, 5', '4, 2, 1, 3, 5', '1, 3, 2, 5, 4', '5, 4, 3, 2, 1'],
      correctIndex: 0,
      explanation: 'In-order traversal: Left subtree of 4 is (1, 2, 3), then 4, then Right child 5 -> [1, 2, 3, 4, 5].',
    },
  ],

  summary: {
    coreIdea: 'In-order traversal recursively visits Left -> Root -> Right, extracting keys from a Binary Search Tree in sorted ascending order in O(n) time.',
    keyConditions: [
      'Left -> Root -> Right order.',
      'Outputs sorted keys for BSTs.',
      'Call stack depth is O(h).',
    ],
    complexitySummary: {
      time: 'O(n)',
      space: 'O(h) auxiliary memory',
    },
    whenToUse: 'Retrieving sorted keys from a BST and validating BST properties.',
    prerequisites: ['Binary Trees', 'Recursion'],
    nextSteps: [
      { id: 'bst-search', name: 'BST Search', reason: 'Learn how the BST ordering property enables fast O(h) target searches.' },
    ],
  },
};

// ============================================================================
// 2. BST SEARCH LESSON
// ============================================================================
export const bstSearchLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'An efficient search algorithm that traverses a Binary Search Tree from the root, branching left or right at each node based on the ordering invariant.',
  mainPurpose: 'To locate a target key in a dynamic tree structure in O(h) time, where h is tree height.',
  whatIsIt: {
    overview: 'Binary Search Tree (BST) Search is the tree equivalent of Binary Search on arrays. Beginning at the root, it compares the target with the current node\'s key. If they match, the search succeeds. If the target is smaller, it branches into the left subtree (discarding the right). If the target is larger, it branches into the right subtree (discarding the left). This process repeats until the key is found or a null pointer is encountered.',
    smallExample: 'Looking for 40 in a BST with root 50. Since 40 < 50, go left to node 30. Since 40 > 30, go right to node 40. 40 === 40! Target found in 3 comparisons.',
  },
  whyUseIt: {
    problemSolved: 'Enables fast search, insertion, and deletion in a single dynamic data structure.',
    whyItMatters: 'Unlike sorted arrays where insertions take O(n) time to shift elements, balanced BSTs (AVL, Red-Black trees) support search, insertion, and deletion all in O(log n) time.',
    whenToUse: [
      'Dynamic collections with frequent insertions, deletions, and searches.',
      'Symbol tables and associative maps in compilers and database engines.',
      'Range query lookups.',
    ],
    whenToAvoid: [
      'Static data that never changes (a sorted array with Binary Search has better cache performance).',
      'Unbalanced BSTs where degenerate insertion order causes height h = n (use Self-Balancing trees like Red-Black or AVL instead).',
    ],
  },
  realWorldApplications: [
    {
      title: 'C++ std::map and std::set (Red-Black Trees)',
      description: 'The standard template library map and set containers are implemented as self-balancing binary search trees.',
      educationalVsProductionNote: 'Direct production standard across C++ applications.',
    },
    {
      title: 'Database Index Trees',
      description: 'In-memory database engines use binary search tree variants for indexing primary keys.',
      educationalVsProductionNote: 'Universal database query optimization technique.',
    },
    {
      title: 'Compiler Symbol Tables',
      description: 'Compilers use BSTs to store variable identifiers and resolve variable scope lookups quickly.',
      educationalVsProductionNote: 'Standard compiler implementation technique.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Start at Root',
      description: 'Begin search at the root of the BST.',
    },
    {
      stepNumber: 2,
      title: 'Check Null / Equality',
      description: 'If current node is null, target is absent. If current.value === target, search succeeds.',
    },
    {
      stepNumber: 3,
      title: 'Branch Left or Right',
      description: 'If target < current.value, move to current.left. If target > current.value, move to current.right.',
    },
    {
      stepNumber: 4,
      title: 'Repeat',
      description: 'Repeat until found or reaching null.',
    },
  ],
  workedExample: {
    datasetDescription: 'BST with Root 50, Left 30 (Left 20, Right 40), Right 70 (Left 60, Right 80). Searching for target 40.',
    initialState: 'Root = 50, Target = 40',
    steps: [
      {
        stepNumber: 1,
        operation: 'Compare Target 40 with Root 50',
        stateDisplay: 'Current: 50. Path: [50]',
        explanation: '40 < 50. By BST property, 40 must lie in the left subtree. Move to left child 30.',
        whyNecessary: 'Eliminates entire right subtree (70, 60, 80).',
        beforeState: 'At Node 50',
        afterState: 'At Node 30',
        nextAction: 'Compare target 40 with 30.',
        intermediateResult: 'Branch left to 30.',
      },
      {
        stepNumber: 2,
        operation: 'Compare Target 40 with Node 30',
        stateDisplay: 'Current: 30. Path: [50, 30]',
        explanation: '40 > 30. By BST property, 40 must lie in the right subtree of 30. Move to right child 40.',
        whyNecessary: 'Eliminates left child 20.',
        beforeState: 'At Node 30',
        afterState: 'At Node 40',
        nextAction: 'Compare target 40 with 40.',
        intermediateResult: 'Branch right to 40.',
      },
      {
        stepNumber: 3,
        operation: 'Compare Target 40 with Node 40',
        stateDisplay: 'Current: 40. Path: [50, 30, 40]',
        explanation: '40 === 40! Target found.',
        whyNecessary: 'Exact match located.',
        beforeState: 'At Node 40',
        afterState: 'Found',
        nextAction: 'Return true / node 40.',
        intermediateResult: 'Target located in 3 comparisons.',
      },
    ],
    finalState: 'Target 40 found at depth 2',
  },
  advantages: [
    'Fast O(h) search, insertion, and deletion in a single dynamic structure.',
    'No array element shifting required when inserting new items.',
    'Keys are always stored in sorted order.',
  ],
  limitations: [
    'Performance depends entirely on tree height h: if unbalanced, degrades to O(n) linear search.',
    'Requires balancing algorithms (AVL, Red-Black) to guarantee O(log n) height.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(1) time when target is located at the root node.',
    averageCaseMeaning: 'O(log n) time on randomly built or balanced binary search trees.',
    worstCaseMeaning: 'O(n) time when elements were inserted in sorted order, creating a degenerate linked-list tree.',
    spaceComplexityMeaning: 'O(1) auxiliary space for iterative search, or O(h) call stack space for recursive search.',
  },
  relatedAlgorithms: [
    {
      name: 'Binary Search (Array)',
      comparison: 'Binary Search on an array is strictly O(log n) but static (insertions take O(n)). BST Search supports dynamic insertions in O(h) time.',
    },
  ],
  quiz: [
    {
      question: 'What is the worst-case time complexity of searching for an element in an UNBALANCED Binary Search Tree?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'If elements are inserted in already sorted order (e.g. 1, 2, 3, 4, 5), the tree degrades into a single linked list of height n, making search take O(n) linear time.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'BST Search is named after the Binary Search Tree ordering invariant that guides the search direction at every step.',
    problemSolved: 'Searches for a key in a dynamic tree structure in O(h) time.',
    problemNotSolved: 'Does not guarantee O(log n) unless the tree is balanced.',
    whyLearn: 'Core operation in data structures; understanding BST search is essential for Red-Black trees, B-Trees, and database indexing.',
    prerequisites: ['Binary Trees', 'BST Invariant (Left < Root < Right)'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Search a dynamic dataset where elements are frequently added and removed, without paying O(n) insertion cost.',
    naiveApproachInefficiency: 'Sorted arrays take O(log n) search but O(n) insertion. Unsorted arrays take O(1) insertion but O(n) search. Balanced BSTs achieve O(log n) for both.',
    coreIdeaUsed: 'Compare target with root. If smaller, go left; if larger, go right.',
    utilityExplanation: 'Discards an entire subtree at each step.',
    workingConditions: ['Valid BST invariant.'],
    whenAnotherIsBetter: 'When only exact-match lookups are needed without ordering, a Hash Table (O(1)) is faster.',
    analogyOrRealLifeExample: 'Playing a higher/lower guessing game where each question divides the remaining numbers in half.',
  },

  inputOutputAssumptions: {
    expectedInput: 'Root of BST and a target key.',
    expectedOutput: 'Node containing target or null.',
    constraints: 'Binary tree satisfying BST property.',
    preconditions: 'All left descendants < root < all right descendants.',
    specialCases: ['Empty tree returns null immediately.'],
    isSortedRequired: true,
    brokenAssumptionsBehavior: 'If tree violates BST property, search may fail to find an existing key.',
  },

  coreIntuition: {
    simpleExplanation: 'At each node, ask: is my target smaller or bigger? If smaller, go left. If bigger, go right. Repeat until you find it or hit a dead end.',
    keyDrivingDecision: 'target < current.value ? go left : go right.',
    whyRepeatedOperationWorks: 'The BST invariant guarantees that all keys on the wrong side can be safely discarded.',
    paradigmSpecificDetail: 'Prune-and-search over hierarchical binary tree.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure bstSearch(node, target)',
      '  while node is not null do',
      '    if target = node.value then return node',
      '    else if target < node.value then node := node.left',
      '    else node := node.right',
      '  end while',
      '  return null',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'while node is not null do', explanation: 'Traverse down the tree.' },
      { lineIndex: 2, lineText: 'if target = node.value then return node', explanation: 'Target found.' },
      { lineIndex: 3, lineText: 'else if target < node.value then node := node.left', explanation: 'Branch left.' },
      { lineIndex: 4, lineText: 'else node := node.right', explanation: 'Branch right.' },
      { lineIndex: 6, lineText: 'return null', explanation: 'Target not found in tree.' },
    ],
    terminationCondition: 'Terminates when match is found or node becomes null.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `interface TreeNode<T> {
  value: T;
  left?: TreeNode<T>;
  right?: TreeNode<T>;
}

export function bstSearch<T>(root: TreeNode<T> | undefined, target: T): TreeNode<T> | null {
  let current = root;

  while (current) {
    if (target === current.value) {
      return current; // Found
    } else if (target < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }

  return null; // Not found
}`,
    signature: 'function bstSearch<T>(root: TreeNode<T> | undefined, target: T): TreeNode<T> | null',
    inputValidation: 'Handles undefined/null root by returning null.',
    variables: [
      { name: 'current', type: 'TreeNode<T> | undefined', purpose: 'Pointer traversing down tree.' },
      { name: 'target', type: 'T', purpose: 'Key being searched for.' },
    ],
    lineByLine: [
      { line: 9, code: 'while (current)', explanation: 'Loop while node is valid.' },
      { line: 10, code: 'if (target === current.value) return current;', explanation: 'Found.' },
      { line: 12, code: 'else if (target < current.value) current = current.left;', explanation: 'Branch left.' },
      { line: 14, code: 'else current = current.right;', explanation: 'Branch right.' },
      { line: 18, code: 'return null;', explanation: 'Absent.' },
    ],
    returnExplanation: 'Returns matching node or null.',
    commonBugs: ['Reversing the left/right branches.', 'Using recursion without returning the recursive call result.'],
    edgeCaseHandling: ['Empty tree returns null.'],
  },

  correctness: {
    intuitiveExplanation: 'By definition of a BST, every key in the left subtree is strictly less than the root, and every key in the right subtree is strictly greater. Hence, if target < root, target cannot exist in the right subtree, and vice-versa.',
    formalProof: {
      method: 'Loop Invariant',
      invariantOrClaim: 'If target is present in the tree, it must be located in the subtree rooted at current.',
      initialization: 'Initially current = root; target is in the tree, so it is in the tree rooted at root.',
      maintenance: 'If target === current.value, target is found. If target < current.value, by BST property, all nodes in current.right have values > current.value > target, so target cannot be in current.right. Thus target must be in current.left. Setting current = current.left preserves invariant.',
      termination: 'If current becomes null, the candidate subtree is empty. By the invariant, target does not exist in the tree. Returning null is correct.',
      conclusion: 'BST Search is provably correct.',
    },
  },

  complexityAnalysis: {
    bestCase: { complexity: 'O(1)', explanation: 'Target is at root.', condition: 'target === root.value.' },
    averageCase: { complexity: 'O(log n)', explanation: 'Tree is balanced (height h ≈ log₂(n)).', condition: 'Balanced BST.' },
    worstCase: { complexity: 'O(n)', explanation: 'Tree is degenerate line (height h = n).', condition: 'Skewed tree.' },
    auxiliarySpace: { complexity: 'O(1)', explanation: 'Iterative implementation uses 1 pointer.', },
    totalMemory: 'O(n) for tree storage.',
    bigOExplanation: 'Runtime is Theta(h) where h is tree height. O(log n) <= Theta(h) <= O(n).',
    scalingBehavior: 'Logarithmic scaling on balanced trees.',
  },

  advantagesAndLimitations: {
    strengths: ['Fast O(log n) dynamic search and insertion on balanced trees.', 'Maintains sorted key order.'],
    limitations: ['Degrades to O(n) on unbalanced trees without rebalancing.'],
    memoryTradeOffs: ['O(1) extra search memory.'],
    poorChoiceScenarios: ['When elements are inserted in strictly sorted order without auto-balancing.'],
  },

  comparisons: [
    {
      algorithm: 'Binary Search (Array)',
      timeComplexity: 'Both O(log n) search',
      spaceComplexity: 'Both O(1)',
      stabilityOrType: 'Search',
      similarities: 'Both halve search space based on comparison.',
      differences: 'Array has O(1) random access but O(n) insertion. BST has O(log n) insertion.',
      whenToPreferThis: 'When dataset is dynamic with frequent insertions.',
      whenToPreferAlternative: 'When dataset is static.',
    },
  ],

  commonMistakes: [
    {
      title: 'Assuming Standard BST Always Gives O(log n)',
      misconception: 'Believing an unbalanced BST cannot degrade to O(n).',
      badCodeOrApproach: 'Inserting 1, 2, 3, 4, 5 in order into a naive BST.',
      correctApproach: 'Use an AVL or Red-Black self-balancing tree to guarantee O(log n) height.',
    },
  ],

  exercises: [
    {
      id: 'bsts-ex-1',
      type: 'conceptual',
      question: 'In a BST of height h, what is the maximum number of comparisons needed to find a key?',
      options: ['h + 1 comparisons', '2^h comparisons', 'n comparisons', 'log₂(h) comparisons'],
      correctIndex: 0,
      explanation: 'A path from root to leaf has at most h + 1 nodes, so at most h + 1 comparisons are made.',
    },
  ],

  summary: {
    coreIdea: 'BST Search traverses down a Binary Search Tree by comparing the target with the current node, moving left if smaller and right if larger, in O(h) time.',
    keyConditions: [
      'BST ordering invariant: Left < Root < Right.',
      'Time complexity is O(h) where h is tree height.',
      'Balanced trees guarantee O(log n).',
    ],
    complexitySummary: {
      time: 'Best: O(1), Average: O(log n), Worst: O(n)',
      space: 'O(1) auxiliary memory',
    },
    whenToUse: 'Dynamic collections requiring fast search, insertion, and deletion.',
    prerequisites: ['Binary Trees', 'In-Order Traversal'],
    nextSteps: [
      { id: 'fibonacci-dp', name: 'Fibonacci (DP)', reason: 'Explore Dynamic Programming and how memoization eliminates redundant recursive calls.' },
    ],
  },
};
