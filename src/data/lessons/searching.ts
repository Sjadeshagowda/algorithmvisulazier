import type { AlgorithmLesson } from '../../types/algorithm';

// ============================================================================
// 1. LINEAR SEARCH LESSON
// ============================================================================
export const linearSearchLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A fundamental search algorithm that sequentially inspects each element in a collection one by one until a match is found or the collection is exhausted.',
  mainPurpose: 'To locate a target element in an unsorted or unordered dataset without requiring pre-processing or sorting.',
  whatIsIt: {
    overview: 'Linear Search (also known as Sequential Search) is the simplest search algorithm. It begins at the first element (index 0) and inspects every subsequent element in linear order. If an element matches the target value, the search halts and returns that element\'s index. If the entire collection is scanned without finding the target, it returns -1 to indicate an unsuccessful search.',
    smallExample: 'Looking for 6 in [4, 2, 7, 6, 9]: Check index 0 (4 != 6). Check index 1 (2 != 6). Check index 2 (7 != 6). Check index 3 (6 == 6 -> match found at index 3!). Total 4 comparisons.',
  },
  whyUseIt: {
    problemSolved: 'Finding a specific value or record in raw, unsorted, or streaming data where sorting is impossible or more expensive than searching.',
    whyItMatters: 'If you only need to search an array once, sorting it first takes O(n log n), whereas a direct Linear Search takes O(n). It is also the only general search algorithm that works on singly-linked lists.',
    whenToUse: [
      'Small datasets (e.g. n < 50 items) where simplicity and zero setup time dominate.',
      'Unsorted data where the cost of sorting (O(n log n)) exceeds the cost of a single O(n) search.',
      'Singly-linked lists or data streams where random access by index is impossible.',
      'Searching by an arbitrary unindexed predicate (e.g. finding the first object where user.age > 30 and user.hasCar).',
    ],
    whenToAvoid: [
      'Large collections (thousands or millions of items).',
      'Datasets queried repeatedly (where sorting once for Binary Search or building a Hash Map is orders of magnitude faster).',
      'Arrays that are already sorted (where Binary Search runs in O(log n) time).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Searching Short Application Settings & Configs',
      description: 'Used in command-line flag parsers and app config lists where there are only 10 to 50 options.',
      educationalVsProductionNote: 'Universal production standard across CLI tools and configuration loaders.',
    },
    {
      title: 'Linear Scanning in IoT Telemetry Buffers',
      description: 'Scanning circular telemetry buffers in IoT microcontroller sensors to check for abnormal temperature spikes.',
      educationalVsProductionNote: 'Common in embedded microcontrollers with strictly sequential ring buffers.',
    },
    {
      title: 'Unindexed Database Table Scans (Full Table Scan)',
      description: 'Relational databases execute a sequential scan (full table scan) when a query filters on a column that lacks an index.',
      educationalVsProductionNote: 'Core database engine behavior when an index is absent or when selecting a large fraction of the table.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Start at Beginning',
      description: 'Initialize a pointer or loop variable i at index 0.',
    },
    {
      stepNumber: 2,
      title: 'Inspect Current Element',
      description: 'Compare the value at A[i] with the target. If A[i] === target, report immediate success and return index i.',
    },
    {
      stepNumber: 3,
      title: 'Advance Step-by-Step',
      description: 'If A[i] !== target, increment i by 1 to inspect the next element.',
    },
    {
      stepNumber: 4,
      title: 'Unsuccessful Search Termination',
      description: 'If i reaches the end of the array (i === n), the target does not exist in the collection. Return -1.',
    },
  ],
  workedExample: {
    datasetDescription: 'Unsorted array of 4 integers [7, 4, 6, 2], searching for target 6',
    initialState: 'Array: [7, 4, 6, 2], Target: 6',
    steps: [
      {
        stepNumber: 1,
        operation: 'Inspect index 0: A[0] = 7',
        stateDisplay: '[7, 4, 6, 2]',
        explanation: '7 !== 6. Not a match. Advance pointer to index 1.',
        whyNecessary: 'Sequential evaluation of candidate at index 0.',
        beforeState: 'Pointer at index 0',
        afterState: 'Pointer moving to index 1',
        nextAction: 'Compare A[1] with 6.',
        intermediateResult: '1 comparison made; no match yet.',
      },
      {
        stepNumber: 2,
        operation: 'Inspect index 1: A[1] = 4',
        stateDisplay: '[7, 4, 6, 2]',
        explanation: '4 !== 6. Not a match. Advance pointer to index 2.',
        whyNecessary: 'Sequential evaluation of candidate at index 1.',
        beforeState: 'Pointer at index 1',
        afterState: 'Pointer moving to index 2',
        nextAction: 'Compare A[2] with 6.',
        intermediateResult: '2 comparisons made; no match yet.',
      },
      {
        stepNumber: 3,
        operation: 'Inspect index 2: A[2] = 6',
        stateDisplay: '[7, 4, 6, 2]',
        explanation: '6 === 6! Match found at index 2. Early termination triggers.',
        whyNecessary: 'Target located; no further comparisons needed.',
        beforeState: 'Pointer at index 2',
        afterState: 'Success returned',
        nextAction: 'Return index 2.',
        intermediateResult: 'Search successful at index 2 with 3 comparisons.',
      },
    ],
    finalState: 'Target 6 found at index 2',
  },
  advantages: [
    'Zero preprocessing or sorting required.',
    'Works on any sequential data structure, including linked lists, streams, and generators.',
    'Extremely simple to implement with O(1) auxiliary memory.',
    'Can evaluate complex custom matching predicates without requiring comparison ordering.',
  ],
  limitations: [
    'Linear O(n) time complexity scales poorly on large collections.',
    'Inefficient for repeated search queries compared to Binary Search or Hash Maps.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(1) time (1 comparison) when the target element is located at index 0.',
    averageCaseMeaning: 'O(n) time ((n + 1) / 2 comparisons on average) when the target is uniformly distributed across the array.',
    worstCaseMeaning: 'O(n) time (exactly n comparisons) when the target is at the very last index (n - 1) or completely absent from the array.',
    spaceComplexityMeaning: 'O(1) auxiliary space. Requires only a single integer loop counter.',
  },
  relatedAlgorithms: [
    {
      name: 'Binary Search',
      comparison: 'Binary Search runs in O(log n) time by halving the search interval, but strictly requires pre-sorted input. Linear Search runs in O(n) but works on any data.',
    },
    {
      name: 'Hash Map Lookup',
      comparison: 'Hash Maps provide O(1) expected lookup time, but require O(n) memory to build an index table and require hashable keys.',
    },
  ],
  quiz: [
    {
      question: 'How many comparisons does Linear Search make in the worst case on an array of n elements when the target is NOT present?',
      options: ['1 comparison', 'log₂(n) comparisons', 'n comparisons', 'n² comparisons'],
      correctIndex: 2,
      explanation: 'To definitively confirm that the target is absent from an unsorted array, every single element from index 0 to n - 1 must be inspected, requiring exactly n comparisons.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Linear Search is named because it progresses in a straight "linear" line from index 0 to index n - 1, inspecting each element sequentially.',
    problemSolved: 'Determines whether a target element exists in an arbitrary collection, and returns its position.',
    problemNotSolved: 'Does not exploit ordering in sorted arrays; does not achieve logarithmic or constant lookup speeds.',
    whyLearn: 'It is the baseline against which all advanced searching algorithms and indexing structures are compared.',
    prerequisites: ['Arrays', 'Loops (for / while)', 'Equality operators (===)'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Find whether an item x exists in an unsorted list A of size n, and if so, return its index.',
    naiveApproachInefficiency: 'Sorting the array first would cost O(n log n). If only one search query is needed, sorting is a waste of time. Linear Search answers the query in O(n) without preprocessing.',
    coreIdeaUsed: 'Exhaustive sequential verification: check each position until found or exhausted.',
    utilityExplanation: 'Guaranteed to find the target if it exists, without modifying the underlying collection.',
    workingConditions: ['Collection must be sequentially iterable.'],
    whenAnotherIsBetter: 'When doing repeated queries on static data, sort once and use Binary Search (O(log n)) or use a Hash Map (O(1)).',
    analogyOrRealLifeExample: 'Searching for your keys in an unorganized house: you check room by room, drawer by drawer, until you spot them.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of n items and a target value.',
    expectedOutput: 'The index of the first occurrence of the target, or -1 if not found.',
    constraints: 'n >= 0.',
    preconditions: 'None.',
    specialCases: ['Empty array returns -1 immediately.', 'Target at index 0 returns immediately in O(1).', 'Target absent takes exactly n comparisons.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'Works on any data type where equality comparison is defined.',
  },

  coreIntuition: {
    simpleExplanation: 'Look at the first item. If it is the one you want, you are done. If not, look at the next. Keep going until you find it or run out of items.',
    keyDrivingDecision: 'If A[i] === target, stop and return i; otherwise move to i + 1.',
    whyRepeatedOperationWorks: 'By checking every index from 0 to n-1, it is mathematically impossible to miss the target if it exists.',
    paradigmSpecificDetail: 'Brute-force sequential scan with early exit.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure linearSearch(A, target)',
      '  for i from 0 to length(A) - 1 do',
      '    if A[i] = target then',
      '      return i',
      '    end if',
      '  end for',
      '  return -1',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'for i from 0 to length(A) - 1 do', explanation: 'Loop through each index sequentially.' },
      { lineIndex: 2, lineText: 'if A[i] = target then', explanation: 'Compare current element with target.' },
      { lineIndex: 3, lineText: 'return i', explanation: 'Early return on first match found.' },
      { lineIndex: 6, lineText: 'return -1', explanation: 'Return -1 sentinel indicating target not present.' },
    ],
    terminationCondition: 'Terminates when A[i] === target, or when index reaches length(A).',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Early success
    }
  }
  return -1; // Unsuccessful search
}`,
    signature: 'function linearSearch<T>(arr: T[], target: T): number',
    inputValidation: 'Empty array loop does not execute; returns -1.',
    variables: [
      { name: 'i', type: 'number', purpose: 'Sequential index pointer traversing from 0 to arr.length - 1.' },
      { name: 'target', type: 'T', purpose: 'Value being searched for.' },
    ],
    lineByLine: [
      { line: 2, code: 'for (let i = 0; i < arr.length; i++)', explanation: 'Traverse entire array sequentially.' },
      { line: 3, code: 'if (arr[i] === target)', explanation: 'Equality check.' },
      { line: 4, code: 'return i;', explanation: 'Immediate return on match.' },
      { line: 7, code: 'return -1;', explanation: 'Sentinel for target absent.' },
    ],
    returnExplanation: 'Returns 0-based index of first match, or -1 if absent.',
    commonBugs: [
      'Returning -1 inside the loop after the first non-match instead of letting the loop finish.',
      'Using <= arr.length in the loop bound, causing an out-of-bounds check at index arr.length.',
    ],
    edgeCaseHandling: ['Empty arrays return -1 without entering the loop.'],
  },

  correctness: {
    intuitiveExplanation: 'The search inspects every index from 0 to n-1. If target is in the array, the loop must hit its index and return it. If the loop completes without returning, every index has been proven not to equal target, so returning -1 is correct.',
    formalProof: {
      method: 'Loop Invariant',
      invariantOrClaim: 'At the start of iteration i, the target does not appear in the subarray arr[0 .. i-1].',
      initialization: 'Before iteration i = 0, arr[0 .. -1] is empty, so target is vacuously not in the subarray.',
      maintenance: 'In iteration i, we test arr[i] === target. If true, we return i, which is correct. If false, target is not at index i. Combining with the invariant that target is not in arr[0 .. i-1], target is not in arr[0 .. i]. Incrementing i maintains the invariant.',
      termination: 'If the loop terminates because i = n, by the invariant target does not appear in arr[0 .. n-1]. Hence returning -1 is correct.',
      conclusion: 'Linear Search is provably correct.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(1)',
      explanation: 'Target is at index 0 (1 comparison).',
      condition: 'arr[0] === target.',
    },
    averageCase: {
      complexity: 'O(n)',
      explanation: 'Average comparisons = (n + 1) / 2 when target is present with equal probability.',
      condition: 'Random target position.',
    },
    worstCase: {
      complexity: 'O(n)',
      explanation: 'Exactly n comparisons when target is at index n-1 or absent.',
      condition: 'Target absent or at end.',
    },
    auxiliarySpace: {
      complexity: 'O(1)',
      explanation: 'No memory allocated beyond index pointer i.',
    },
    totalMemory: 'O(n) for input array.',
    bigOExplanation: 'Runtime is O(n) upper bound, Omega(1) lower bound.',
    scalingBehavior: 'Execution time grows strictly linearly with array length n.',
  },

  advantagesAndLimitations: {
    strengths: ['Requires no sorted order.', 'Works on linked lists and streams.', 'Zero memory overhead.'],
    limitations: ['Inefficient O(n) for large arrays.', 'Slow for repeated lookups.'],
    memoryTradeOffs: ['Zero memory overhead.'],
    poorChoiceScenarios: ['Repeated lookups on large datasets.'],
  },

  comparisons: [
    {
      algorithm: 'Binary Search',
      timeComplexity: 'Linear: O(n) vs Binary: O(log n)',
      spaceComplexity: 'Both O(1)',
      stabilityOrType: 'Search algorithms',
      similarities: 'Both search for a target element in an array.',
      differences: 'Binary Search requires a sorted array; Linear Search works on any array.',
      whenToPreferThis: 'When array is unsorted and will only be searched once or twice.',
      whenToPreferAlternative: 'When array is already sorted or searched repeatedly.',
    },
  ],

  commonMistakes: [
    {
      title: 'Premature Return on First Non-Match',
      misconception: 'Putting return -1 inside an else block inside the loop.',
      badCodeOrApproach: 'if (arr[i] === target) return i; else return -1;',
      correctApproach: 'Only return -1 after the entire loop has completed.',
    },
  ],

  exercises: [
    {
      id: 'ls-ex-1',
      type: 'conceptual',
      question: 'Under what condition does Linear Search outperform Binary Search?',
      options: [
        'On an already sorted array of 1,000,000 items.',
        'When the target is at index 0, Linear Search finds it in 1 comparison, whereas Binary Search checks the midpoint first.',
        'Linear Search is never faster than Binary Search under any circumstance.',
        'When searching for strings.',
      ],
      correctIndex: 1,
      explanation: 'When the target is at index 0, Linear Search inspects index 0 first and terminates in 1 comparison (O(1)), whereas Binary Search checks mid = 500,000 first.',
    },
  ],

  summary: {
    coreIdea: 'Linear Search inspects every element from start to finish until finding a match or exhausting the collection in O(n) time.',
    keyConditions: [
      'Works on unsorted arrays and linked lists.',
      'Best case: O(1); Worst case: O(n).',
      'Auxiliary memory: strictly O(1).',
    ],
    complexitySummary: {
      time: 'Best: O(1), Average: O(n), Worst: O(n)',
      space: 'O(1) auxiliary space',
    },
    whenToUse: 'When data is unsorted, small, or only searched once.',
    prerequisites: ['Arrays', 'Loops'],
    nextSteps: [
      { id: 'binary-search', name: 'Binary Search', reason: 'Learn how pre-sorted data enables logarithmic O(log n) search by halving the search space.' },
    ],
  },
};

// ============================================================================
// 2. BINARY SEARCH LESSON
// ============================================================================
export const binarySearchLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'An extremely fast search algorithm that repeatedly divides a sorted search interval in half by comparing the target value to the middle element.',
  mainPurpose: 'To locate a target element in a sorted collection in logarithmic O(log n) time.',
  whatIsIt: {
    overview: 'Binary Search is the classic divide-and-conquer search algorithm. Given an array that is ALREADY SORTED, it compares the target value to the middle element. If they are equal, the search is complete. If the target is smaller, the search continues in the left half, discarding the entire right half. If the target is larger, it continues in the right half. With each step, the search space is cut exactly in half.',
    smallExample: 'Looking for 7 in sorted [2, 4, 6, 7, 9, 11, 15]: Check midpoint 7 (index 3). 7 === 7! Match found in 1 step! Even for 1 billion items, Binary Search takes at most 30 comparisons.',
  },
  whyUseIt: {
    problemSolved: 'Eliminates the linear scan bottleneck by searching massive sorted datasets in logarithmic time.',
    whyItMatters: 'Finding an item among 4 billion records takes up to 4 billion comparisons with Linear Search, but at most 32 comparisons with Binary Search.',
    whenToUse: [
      'Any dataset that is already sorted.',
      'Static datasets where the upfront cost of sorting (O(n log n)) is amortized over many search queries.',
      'Database B-Tree index lookups and binary search over numerical ranges (e.g. square root or optimization problems).',
    ],
    whenToAvoid: [
      'Unsorted datasets (Binary Search yields completely incorrect results on unsorted data).',
      'Singly-linked lists (because finding the midpoint takes O(n) time, destroying the O(log n) advantage).',
      'Tiny arrays (n < 10) where branch mispredictions make Linear Search just as fast.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Database Index Lookups (B-Trees)',
      description: 'Relational databases use binary search inside B-Tree index pages to locate row pointers in microseconds.',
      educationalVsProductionNote: 'Universal production standard in database engines worldwide.',
    },
    {
      title: 'Git Bisect (Debugging)',
      description: 'git bisect uses binary search over commit history to find the exact commit that introduced a software regression in O(log n) tests.',
      educationalVsProductionNote: 'Standard developer tool utility used daily across software engineering teams.',
    },
    {
      title: 'Binary Search Over Answers in Optimization',
      description: 'Used in competitive programming and operations research to find the minimum feasible threshold for constraints.',
      educationalVsProductionNote: 'High-frequency algorithmic optimization technique.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Set Pointers',
      description: 'Initialize low = 0 and high = n - 1.',
    },
    {
      stepNumber: 2,
      title: 'Compute Midpoint',
      description: 'Calculate mid = low + floor((high - low) / 2) to prevent 32-bit integer overflow.',
    },
    {
      stepNumber: 3,
      title: 'Compare with Middle Element',
      description: 'If A[mid] === target, return mid.',
    },
    {
      stepNumber: 4,
      title: 'Halve the Search Space',
      description: 'If target < A[mid], discard the right half by setting high = mid - 1. If target > A[mid], discard the left half by setting low = mid + 1.',
    },
    {
      stepNumber: 5,
      title: 'Termination on Empty Range',
      description: 'Repeat while low <= high. If low > high, the target is absent. Return -1.',
    },
  ],
  workedExample: {
    datasetDescription: 'Sorted array of 4 integers [2, 4, 6, 7], searching for target 6',
    initialState: 'Array: [2, 4, 6, 7], Target: 6',
    steps: [
      {
        stepNumber: 1,
        operation: 'low = 0, high = 3. Compute mid = 1 (value 4)',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'mid = 0 + floor((3 - 0)/2) = 1. A[1] = 4. Compare 6 with 4: 6 > 4. Target is in right half. Set low = mid + 1 = 2.',
        whyNecessary: 'Eliminates left half [2, 4] from consideration in a single step.',
        beforeState: 'Search range [0 .. 3]',
        afterState: 'Search range [2 .. 3]',
        nextAction: 'Recompute mid on range [2 .. 3].',
        intermediateResult: 'Range reduced from 4 items to 2 items.',
      },
      {
        stepNumber: 2,
        operation: 'low = 2, high = 3. Compute mid = 2 (value 6)',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'mid = 2 + floor((3 - 2)/2) = 2. A[2] = 6. Compare 6 with 6: 6 === 6! Match found at index 2.',
        whyNecessary: 'Target located directly at midpoint.',
        beforeState: 'Search range [2 .. 3]',
        afterState: 'Match found',
        nextAction: 'Return index 2.',
        intermediateResult: 'Search successful at index 2 in 2 comparisons.',
      },
    ],
    finalState: 'Target 6 found at index 2',
  },
  advantages: [
    'Logarithmic O(log n) time complexity: searches 1 billion items in at most 30 comparisons.',
    'Strictly O(1) auxiliary memory.',
    'Extremely simple and deterministic.',
  ],
  limitations: [
    'STRICT PRECONDITION: Input array MUST be sorted. Running on unsorted data gives wrong results.',
    'Requires random access memory O(1); inefficient on linked lists.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(1) time (1 comparison) when the target is located exactly at the initial midpoint.',
    averageCaseMeaning: 'O(log n) time. Each step cuts the search space by half.',
    worstCaseMeaning: 'O(log n) time (at most floor(log₂ n) + 1 comparisons) when target is at the leaves or absent.',
    spaceComplexityMeaning: 'O(1) auxiliary space for iterative implementation. O(log n) call stack space if implemented recursively.',
  },
  relatedAlgorithms: [
    {
      name: 'Linear Search',
      comparison: 'Linear Search takes O(n) but works on unsorted data. Binary Search takes O(log n) but requires sorted data.',
    },
    {
      name: 'Interpolation Search',
      comparison: 'Interpolation search estimates target position using value distribution, achieving O(log log n) on uniformly distributed data, but degrades to O(n) on skewed data.',
    },
  ],
  quiz: [
    {
      question: 'What is the MAXIMUM number of comparisons Binary Search needs to find a target or confirm absence in an array of 1,024 elements?',
      options: ['10 comparisons', '11 comparisons', '512 comparisons', '1,024 comparisons'],
      correctIndex: 1,
      explanation: 'For n = 1,024, log₂(1024) = 10. The maximum number of comparisons is floor(log₂ n) + 1 = 10 + 1 = 11 comparisons.',
    },
    {
      question: 'Why should midpoint be computed as low + floor((high - low) / 2) instead of (low + high) / 2?',
      options: [
        'To prevent 32-bit signed integer overflow when low + high exceeds 2,147,483,647.',
        'Because JavaScript does not support division.',
        'To make the algorithm run in O(1) time.',
        'It is an arbitrary stylistic choice.',
      ],
      correctIndex: 0,
      explanation: 'In languages like Java, C++, and C, if low + high exceeds 2^31 - 1, it overflows to a negative integer, causing an array index out of bounds crash. low + (high - low) / 2 prevents overflow.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Binary Search is named because it divides the search interval into two ("binary") halves at each step.',
    problemSolved: 'Finds the location of a target value in a sorted array in O(log n) time.',
    problemNotSolved: 'Cannot search unsorted data without sorting first.',
    whyLearn: 'It is the quintessential logarithmic algorithm and the gateway to divide-and-conquer and binary search trees.',
    prerequisites: ['Sorted arrays', 'Integer division', 'Logarithms (base 2)', 'While loop termination conditions'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Quickly find an element in a sorted collection containing millions or billions of items.',
    naiveApproachInefficiency: 'Linear Search on 1 billion items takes up to 1 billion comparisons (~1 second). Binary Search takes at most 30 comparisons (< 1 microsecond).',
    coreIdeaUsed: 'Because elements are ordered, comparing target to the middle element eliminates an entire half of all candidates in a single comparison.',
    utilityExplanation: 'Halving the search space repeatedly reduces problem size exponentially: n -> n/2 -> n/4 -> ... -> 1 in log₂(n) steps.',
    workingConditions: ['Array must be sorted in monotonic non-decreasing order.', 'Random access by index in O(1) time.'],
    whenAnotherIsBetter: 'When data is constantly being inserted and deleted, a Self-Balancing BST or Hash Table is better than maintaining a contiguous sorted array.',
    analogyOrRealLifeExample: 'Opening a dictionary: to look up the word "Algorithm", you flip open to the middle (letter M). Since A comes before M, you ignore the entire second half of the book and flip to the middle of the first half.',
  },

  inputOutputAssumptions: {
    expectedInput: 'A sorted array of n comparable elements and a target value.',
    expectedOutput: 'The index of the target if present, or -1 if absent.',
    constraints: 'n >= 0. Must be sorted.',
    preconditions: 'A[0] <= A[1] <= ... <= A[n-1].',
    specialCases: ['Empty array returns -1.', 'Target smaller than A[0] or larger than A[n-1] exits in O(log n) or O(1) with boundary checks.'],
    isSortedRequired: true,
    brokenAssumptionsBehavior: 'If the array is NOT sorted, Binary Search will discard valid halves and return -1 or a wrong index even when the target exists.',
  },

  coreIntuition: {
    simpleExplanation: 'Look at the middle number. If your target is smaller, throw away the entire right half. If your target is larger, throw away the entire left half. Repeat until you hit the number or run out of numbers.',
    keyDrivingDecision: 'Compare target with A[mid]: if target < A[mid], high = mid - 1; if target > A[mid], low = mid + 1.',
    whyRepeatedOperationWorks: 'Every comparison halves the search interval. An interval of size n reaches size 1 in ceil(log₂ n) steps.',
    paradigmSpecificDetail: 'Divide and conquer / prune-and-search: reduces problem size by factor of 2 at each step.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure binarySearch(A, target)',
      '  low := 0',
      '  high := length(A) - 1',
      '  while low <= high do',
      '    mid := low + floor((high - low) / 2)',
      '    if A[mid] = target then',
      '      return mid',
      '    else if A[mid] < target then',
      '      low := mid + 1',
      '    else',
      '      high := mid - 1',
      '    end if',
      '  end while',
      '  return -1',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'low := 0, high := length(A) - 1', explanation: 'Define active search boundaries.' },
      { lineIndex: 3, lineText: 'while low <= high do', explanation: 'Loop continues as long as search space contains at least one candidate.' },
      { lineIndex: 4, lineText: 'mid := low + floor((high - low) / 2)', explanation: 'Compute midpoint safely without integer overflow.' },
      { lineIndex: 5, lineText: 'if A[mid] = target then return mid', explanation: 'Target found.' },
      { lineIndex: 7, lineText: 'else if A[mid] < target then low := mid + 1', explanation: 'Target is in upper half; discard lower half.' },
      { lineIndex: 9, lineText: 'else high := mid - 1', explanation: 'Target is in lower half; discard upper half.' },
      { lineIndex: 13, lineText: 'return -1', explanation: 'Target absent.' },
    ],
    terminationCondition: 'Terminates when A[mid] === target (success) or when low > high (failure).',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function binarySearch<T>(arr: T[], target: T): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === target) {
      return mid; // Found
    } else if (arr[mid] < target) {
      low = mid + 1; // Search right half
    } else {
      high = mid - 1; // Search left half
    }
  }

  return -1; // Not found
}`,
    signature: 'function binarySearch<T>(arr: T[], target: T): number',
    inputValidation: 'Empty array sets high = -1, while loop never runs, returns -1.',
    variables: [
      { name: 'low', type: 'number', purpose: 'Lower index boundary of candidate range.' },
      { name: 'high', type: 'number', purpose: 'Upper index boundary of candidate range.' },
      { name: 'mid', type: 'number', purpose: 'Current midpoint being compared with target.' },
    ],
    lineByLine: [
      { line: 2, code: 'let low = 0; let high = arr.length - 1;', explanation: 'Initialize pointers.' },
      { line: 5, code: 'while (low <= high)', explanation: 'Search valid range.' },
      { line: 6, code: 'const mid = low + Math.floor((high - low) / 2);', explanation: 'Overflow-safe midpoint.' },
      { line: 8, code: 'if (arr[mid] === target) return mid;', explanation: 'Match.' },
      { line: 10, code: 'else if (arr[mid] < target) low = mid + 1;', explanation: 'Right half.' },
      { line: 12, code: 'else high = mid - 1;', explanation: 'Left half.' },
      { line: 16, code: 'return -1;', explanation: 'Absent.' },
    ],
    returnExplanation: 'Returns index of target if found; -1 if absent.',
    commonBugs: [
      'Using low < high instead of low <= high, missing single-element ranges.',
      'Using mid instead of mid + 1 or mid - 1, causing infinite loops.',
      'Using (low + high) / 2 in fixed-width integer languages causing integer overflow.',
    ],
    edgeCaseHandling: ['Empty array returns -1.', 'Single-element array checks index 0 and exits correctly.'],
  },

  correctness: {
    intuitiveExplanation: 'Because the array is sorted, if target < A[mid], target cannot possibly appear at or to the right of mid. Discarding mid through high loses no valid candidates. The same logic holds for the left half. Therefore, if target exists, it must remain in the range [low..high]. If the range becomes empty (low > high), target does not exist.',
    formalProof: {
      method: 'Loop Invariant',
      invariantOrClaim: 'If target is present in the array, it must be located within the subarray arr[low .. high].',
      initialization: 'Initially low = 0 and high = n - 1. If target is in the array, it is certainly within arr[0 .. n-1].',
      maintenance: 'In the loop, we inspect mid. If arr[mid] === target, we return mid. If arr[mid] < target, then by sorted order, arr[k] <= arr[mid] < target for all k <= mid. Hence target cannot be in arr[low .. mid]. Thus target must be in arr[mid+1 .. high]. Setting low = mid + 1 preserves the invariant. Symmetrically, if arr[mid] > target, setting high = mid - 1 preserves the invariant.',
      termination: 'If low > high, the range is empty. By the invariant, if target existed, it would be in the range. Since the range contains 0 elements, target does not exist in the array. Returning -1 is correct.',
      conclusion: 'Binary Search is provably correct.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(1)',
      explanation: 'Target is at the exact initial midpoint (1 comparison).',
      condition: 'arr[mid] === target on first step.',
    },
    averageCase: {
      complexity: 'O(log n)',
      explanation: 'Search space halves at each step: n / 2^k = 1 -> k = log₂(n).',
      condition: 'Random target.',
    },
    worstCase: {
      complexity: 'O(log n)',
      explanation: 'At most floor(log₂ n) + 1 comparisons when target is absent or at the endpoints.',
      condition: 'Target absent or at interval extremes.',
    },
    auxiliarySpace: {
      complexity: 'O(1)',
      explanation: 'Iterative implementation uses only 3 scalar pointers (low, mid, high).',
    },
    totalMemory: 'O(n) for input array.',
    bigOExplanation: 'Both average and worst case are Theta(log n).',
    scalingBehavior: 'Every doubling of n adds only 1 additional comparison. For 1 trillion elements, at most 40 comparisons.',
  },

  advantagesAndLimitations: {
    strengths: ['Blazingly fast O(log n) lookup.', 'O(1) memory overhead.', 'Optimal comparison search bound for sorted arrays.'],
    limitations: ['Requires sorted array.', 'Requires O(1) random access indexing (bad for linked lists).'],
    memoryTradeOffs: ['Zero memory overhead.'],
    poorChoiceScenarios: ['Unsorted data.', 'Linked lists.'],
  },

  comparisons: [
    {
      algorithm: 'Linear Search',
      timeComplexity: 'Linear: O(n) vs Binary: O(log n)',
      spaceComplexity: 'Both O(1)',
      stabilityOrType: 'Search algorithms',
      similarities: 'Both search for a target value.',
      differences: 'Binary Search requires sorted input; Linear Search works on anything.',
      whenToPreferThis: 'Whenever the input is already sorted or queried repeatedly.',
      whenToPreferAlternative: 'When data is unsorted and queried only once.',
    },
  ],

  commonMistakes: [
    {
      title: 'Off-by-One in While Condition',
      misconception: 'Writing while (low < high) instead of while (low <= high).',
      badCodeOrApproach: 'while (low < high)',
      correctApproach: 'Use while (low <= high) so that single-element search spaces (low === high) are evaluated.',
    },
    {
      title: 'Integer Overflow on Midpoint',
      misconception: 'Writing const mid = (low + high) / 2.',
      badCodeOrApproach: 'const mid = Math.floor((low + high) / 2);',
      correctApproach: 'Use low + Math.floor((high - low) / 2) to protect against 32-bit signed integer overflow in typed environments.',
    },
    {
      title: 'Infinite Loop by Not Advancing Past Mid',
      misconception: 'Writing high = mid or low = mid.',
      badCodeOrApproach: 'low = mid; or high = mid;',
      correctApproach: 'Always step past mid: low = mid + 1; high = mid - 1;',
    },
  ],

  exercises: [
    {
      id: 'bs-ex-1',
      type: 'step-tracing',
      question: 'In sorted array [1, 3, 5, 7, 9, 11, 13], which index is checked first when searching for 11?',
      options: ['Index 0 (value 1)', 'Index 3 (value 7)', 'Index 6 (value 13)', 'Index 5 (value 11)'],
      correctIndex: 1,
      explanation: 'low = 0, high = 6. mid = 0 + floor(6 / 2) = 3 (value 7).',
    },
  ],

  summary: {
    coreIdea: 'Binary Search cuts the search space in half at each step by comparing the target with the middle element, achieving O(log n) time on sorted arrays.',
    keyConditions: [
      'Input array MUST be pre-sorted.',
      'Loop condition must be low <= high.',
      'Midpoint formula: low + floor((high - low) / 2).',
    ],
    complexitySummary: {
      time: 'Best: O(1), Average: O(log n), Worst: O(log n)',
      space: 'O(1) auxiliary memory',
    },
    whenToUse: 'When searching any pre-sorted array or B-Tree index.',
    prerequisites: ['Sorted arrays', 'Logarithms'],
    nextSteps: [
      { id: 'bst-search', name: 'Binary Search Tree Search', reason: 'See how the binary search logic applies to dynamic tree data structures with fast insertions.' },
    ],
  },
};
