import type { AlgorithmLesson } from '../../types/algorithm';

// ============================================================================
// 1. BUBBLE SORT LESSON
// ============================================================================
export const bubbleSortLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A foundational comparison-based sorting algorithm that repeatedly steps through a list, compares adjacent elements, and swaps them if they are in the wrong order.',
  mainPurpose: 'To sort elements in ascending or descending order through elementary adjacent comparisons, ideal for understanding the fundamentals of sorting.',
  whatIsIt: {
    overview: 'Bubble Sort gets its name because smaller elements gradually "bubble" to the top (front) of the list while larger elements sink to the bottom (end) with each complete pass. In each pass, we compare index 0 with 1, 1 with 2, 2 with 3, and so on. Whenever an element is larger than its right-hand neighbor, they swap places.',
    smallExample: 'For the array [5, 1, 4, 2], comparing 5 and 1 results in a swap: [1, 5, 4, 2]. Then 5 and 4 swap: [1, 4, 5, 2]. Then 5 and 2 swap: [1, 4, 2, 5]. After pass 1, the largest value (5) has reached its final destination.',
  },
  whyUseIt: {
    problemSolved: 'Arranging unsorted collections into ordered sequences so that searching, deduplication, and presentation can be done efficiently.',
    whyItMatters: 'It provides the simplest conceptual foundation for algorithmic invariants, time complexity trade-offs, and worst-case analysis in computer science.',
    whenToUse: [
      'Educational settings for introducing algorithms and loop invariants.',
      'Small datasets (typically n < 50) where simplicity outweighs asymptotic speed.',
      'Nearly sorted arrays where an optimized Bubble Sort can terminate in linear O(n) time.',
      'Systems with strict memory constraints requiring O(1) auxiliary memory.',
    ],
    whenToAvoid: [
      'Large or production datasets where quadratic O(n²) time causes severe performance bottlenecks.',
      'Performance-critical systems; algorithms like Quick Sort or Merge Sort are vastly superior.',
      'Reverse-sorted arrays, which trigger the absolute worst-case behavior.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Nearly Sorted Hardware Buffers',
      description: 'Used in embedded microcontrollers where data arrives almost in order and memory is too constrained for recursive call stacks.',
      educationalVsProductionNote: 'Occasionally used in microcontroller firmware when data is already 99% sorted and flash memory is under 4KB.',
    },
    {
      title: 'Computer Graphics & Z-Sorting',
      description: 'Historically used for sorting a small number of polygonal transparent faces back-to-front when frame coherence makes subsequent arrays almost sorted.',
      educationalVsProductionNote: 'Modern game engines use Radix Sort or spatial acceleration hierarchies instead.',
    },
    {
      title: 'Pedagogical Benchmark in Education',
      description: 'Standard baseline used in academia to introduce stability, in-place behavior, and algorithmic efficiency comparisons.',
      educationalVsProductionNote: 'Purely educational benchmark for teaching algorithm analysis and big-O notation.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Initialize Outer Pass Loop',
      description: 'Set up an outer loop running from pass 0 to n-2. Each complete pass guarantees that at least one more element at the end is placed in its permanent position.',
    },
    {
      stepNumber: 2,
      title: 'Scan Adjacent Pairs',
      description: 'In the inner loop, inspect pairs A[j] and A[j+1] from index 0 up to n - i - 2.',
    },
    {
      stepNumber: 3,
      title: 'Compare and Conditionally Swap',
      description: 'If A[j] > A[j+1], swap them. If A[j] <= A[j+1], leave them untouched to preserve relative ordering (stability).',
    },
    {
      stepNumber: 4,
      title: 'Finalize Rightmost Position',
      description: 'At the conclusion of pass i, the element at index n - i - 1 is permanently sorted and excluded from future passes.',
    },
    {
      stepNumber: 5,
      title: 'Early Exit Check',
      description: 'If an entire inner pass completes without making a single swap, the array is already sorted, and the algorithm terminates immediately.',
    },
  ],
  workedExample: {
    datasetDescription: 'Unsorted array of 4 distinct integers [7, 4, 6, 2]',
    initialState: '[7, 4, 6, 2]',
    steps: [
      {
        stepNumber: 1,
        operation: 'Compare A[0]=7 and A[1]=4',
        stateDisplay: '[4, 7, 6, 2]',
        explanation: '7 > 4 is true. Swap 7 and 4. Array becomes [4, 7, 6, 2].',
        whyNecessary: '7 is out of order with 4; adjacent swap moves 7 toward the right.',
        beforeState: '[7, 4, 6, 2]',
        afterState: '[4, 7, 6, 2]',
        nextAction: 'Compare next adjacent pair A[1] and A[2].',
        intermediateResult: 'Index 0 and 1 locally ordered.',
      },
      {
        stepNumber: 2,
        operation: 'Compare A[1]=7 and A[2]=6',
        stateDisplay: '[4, 6, 7, 2]',
        explanation: '7 > 6 is true. Swap 7 and 6. Array becomes [4, 6, 7, 2].',
        whyNecessary: '7 continues bubbling rightward because it is greater than 6.',
        beforeState: '[4, 7, 6, 2]',
        afterState: '[4, 6, 7, 2]',
        nextAction: 'Compare next adjacent pair A[2] and A[3].',
        intermediateResult: '7 pushed to index 2.',
      },
      {
        stepNumber: 3,
        operation: 'Compare A[2]=7 and A[3]=2',
        stateDisplay: '[4, 6, 2, 7]',
        explanation: '7 > 2 is true. Swap 7 and 2. Pass 1 complete: 7 is finalized at index 3.',
        whyNecessary: '7 is the maximum element in the array and reaches its final sorted destination at index 3.',
        beforeState: '[4, 6, 7, 2]',
        afterState: '[4, 6, 2, 7]',
        nextAction: 'Start Pass 2 on unsorted prefix [0..2].',
        intermediateResult: 'Element 7 permanently placed at index 3.',
      },
      {
        stepNumber: 4,
        operation: 'Pass 2: Compare A[0]=4 and A[1]=6',
        stateDisplay: '[4, 6, 2, 7]',
        explanation: '4 <= 6 is true. No swap needed.',
        whyNecessary: '4 and 6 are already in relative ascending order.',
        beforeState: '[4, 6, 2, 7]',
        afterState: '[4, 6, 2, 7]',
        nextAction: 'Compare A[1] and A[2].',
        intermediateResult: '4 and 6 remain in place.',
      },
      {
        stepNumber: 5,
        operation: 'Pass 2: Compare A[1]=6 and A[2]=2',
        stateDisplay: '[4, 2, 6, 7]',
        explanation: '6 > 2 is true. Swap 6 and 2. Pass 2 complete: 6 is finalized at index 2.',
        whyNecessary: '6 is the largest among the remaining unsorted elements [4, 6, 2], so it bubbles to index 2.',
        beforeState: '[4, 6, 2, 7]',
        afterState: '[4, 2, 6, 7]',
        nextAction: 'Start Pass 3 on unsorted prefix [0..1].',
        intermediateResult: 'Element 6 permanently placed at index 2.',
      },
      {
        stepNumber: 6,
        operation: 'Pass 3: Compare A[0]=4 and A[1]=2',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: '4 > 2 is true. Swap 4 and 2. Pass 3 complete: 4 and 2 finalized.',
        whyNecessary: '4 is greater than 2, swapping places both in their final positions.',
        beforeState: '[4, 2, 6, 7]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Algorithm completes; entire array is sorted.',
        intermediateResult: 'Array [2, 4, 6, 7] fully sorted.',
      },
    ],
    finalState: '[2, 4, 6, 7]',
  },
  advantages: [
    'Simple conceptual model that is intuitive for beginners.',
    'In-place algorithm requiring O(1) auxiliary memory.',
    'Stable sorting algorithm: preserves original relative order of duplicate elements.',
    'Adaptive: terminates in O(n) time when provided an already-sorted array.',
  ],
  limitations: [
    'O(n²) worst-case and average-case time complexity.',
    'Performs an excessive number of write/swap operations compared to Selection Sort or Insertion Sort.',
    'Completely impractical for large production datasets (n > 10,000).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(n) occurs when the array is already sorted. A single pass makes n-1 comparisons, detects zero swaps, and exits early.',
    averageCaseMeaning: 'O(n²) occurs on random input where about half of adjacent pairs require swaps, performing ~n²/4 swaps and ~n²/2 comparisons.',
    worstCaseMeaning: 'O(n²) occurs when the array is sorted in reverse order, requiring n(n-1)/2 comparisons and n(n-1)/2 swaps.',
    spaceComplexityMeaning: 'O(1) auxiliary memory. Only a constant number of scalar variables (indices, temporary swap variable, swapped boolean flag) are allocated.',
  },
  relatedAlgorithms: [
    {
      name: 'Insertion Sort',
      comparison: 'Both are stable, in-place, and have O(n) best-case time. However, Insertion Sort shifts elements rather than swapping them, making it 2x to 5x faster in practice.',
    },
    {
      name: 'Selection Sort',
      comparison: 'Selection Sort makes at most n swaps (O(n)), whereas Bubble Sort can make up to O(n²) swaps. However, standard Selection Sort is unstable and cannot terminate early on sorted input.',
    },
    {
      name: 'Quick Sort',
      comparison: 'Quick Sort uses divide-and-conquer partitioning to achieve O(n log n) average time, vastly outperforming Bubble Sort on large datasets.',
    },
  ],
  quiz: [
    {
      question: 'What is the best-case time complexity of an optimized Bubble Sort on an already sorted array?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctIndex: 1,
      explanation: 'With a swapped boolean flag, Bubble Sort detects in a single pass of n-1 comparisons that no elements moved, immediately terminating in O(n) time.',
      optionExplanations: [
        'O(1) is impossible because every element must be inspected at least once.',
        'Correct! A single pass of n-1 comparisons verifies sortedness in linear time.',
        'O(n log n) is typical for divide-and-conquer algorithms, not a single linear pass.',
        'O(n²) is what an unoptimized Bubble Sort without early exit would take.',
      ],
    },
    {
      question: 'Why does the inner loop bound shrink from n-1 down to n-i-1 on pass i?',
      options: [
        'To reduce CPU cache misses.',
        'Because the largest i elements have already bubbled to their final sorted positions at the end.',
        'Because the smallest element is guaranteed to be at index 0.',
        'It is an arbitrary optimization that does not affect correctness.',
      ],
      correctIndex: 1,
      explanation: 'Each pass i guarantees that the largest remaining unsorted element bubbles to index n-1-i. Therefore, the suffix A[n-i..n-1] is already permanently sorted.',
      optionExplanations: [
        'Cache misses are unrelated to the algorithmic invariant.',
        'Correct! Invariant guarantees that the suffix is sorted and contains the largest elements.',
        'Smallest elements bubble leftward very slowly (known as "turtles"), not immediately to index 0.',
        'It is a required mathematical property of the shrinking unsorted partition.',
      ],
    },
    {
      question: 'Which property describes Bubble Sort when equal elements retain their original relative order?',
      options: ['In-place', 'Stable', 'Optimal', 'Non-comparative'],
      correctIndex: 1,
      explanation: 'Stability means that duplicate keys maintain their original relative input order. Because Bubble Sort only swaps when A[j] > A[j+1] (strict inequality), equal elements never swap.',
      optionExplanations: [
        'In-place refers to O(1) auxiliary space, not preservation of duplicate order.',
        'Correct! Strict inequality prevents equal elements from crossing each other.',
        'Bubble Sort is far from optimal in terms of operations.',
        'Bubble Sort is comparison-based.',
      ],
    },
  ],

  // ── 16 COMPREHENSIVE SECTIONS ─────────────────────────────────────────
  introduction: {
    nameOriginAndMeaning: 'Bubble Sort derives its name from the physical metaphor of air bubbles rising to the surface of water. In each pass through the array, the largest unsorted element gradually "bubbles up" to its correct position at the end of the array.',
    problemSolved: 'Arranges an unsorted array of comparable elements into non-decreasing (ascending) order.',
    problemNotSolved: 'Does not sort elements without a defined total ordering; does not achieve sub-quadratic performance on large inputs; does not perform external or distributed sorting.',
    whyLearn: 'It is the primary conceptual stepping stone for learning algorithmic invariants, worst/average/best case divergences, in-place state mutation, and stability.',
    prerequisites: ['0-indexed arrays', 'Nested for loops', 'Basic comparison operators (<, >)', 'Variable swapping using a temporary variable'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Given an array A containing n unsorted numbers, rearrange A such that A[0] <= A[1] <= ... <= A[n-1].',
    naiveApproachInefficiency: 'Generating all n! permutations and checking if one is sorted takes O(n! * n) time, which is impossible even for n=20. Bubble Sort provides a deterministic guarantee of sorting in O(n²) time.',
    coreIdeaUsed: 'Local adjacent comparisons. If every adjacent pair (A[j], A[j+1]) satisfies A[j] <= A[j+1], then by transitivity, the entire array is globally sorted.',
    utilityExplanation: 'By continually swapping adjacent inverted pairs, inversions are systematically reduced until zero inversions remain.',
    workingConditions: ['Elements must possess a transitive total order.', 'Array must support random access reads and writes.'],
    whenAnotherIsBetter: 'When n exceeds 50, Quick Sort or Merge Sort is vastly superior. When minimizing writes is critical, Selection Sort performs at most n swaps.',
    analogyOrRealLifeExample: 'Imagine a row of people lined up by height. You walk down the row, and whenever two people standing next to each other are in the wrong order, you ask them to swap places. After walking down the line once, the tallest person is guaranteed to be at the very end.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of n comparable elements (integers, floats, characters, or records with a key).',
    expectedOutput: 'The same array permuted such that each element is less than or equal to its successor.',
    constraints: 'n >= 0. Fit entirely in main memory (internal sorting).',
    preconditions: 'None. Handles negative numbers, zeros, duplicates, already-sorted arrays, and reverse-sorted arrays.',
    specialCases: ['Empty array (n=0): immediate return.', 'Single element (n=1): already sorted, 0 comparisons.', 'All identical elements: terminates in 1 pass with 0 swaps.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If elements cannot be compared (e.g. comparing numbers to undefined or NaN), comparisons evaluate to false, resulting in an unsorted or partially corrupted array.',
  },

  coreIntuition: {
    simpleExplanation: 'Repeatedly walk through the list from left to right. Whenever you see two adjacent items in the wrong order, swap them. The heaviest item drops to the far right on every pass. Repeat until no more swaps are needed.',
    keyDrivingDecision: 'If A[j] > A[j+1], swap them; otherwise, keep their positions unchanged.',
    whyRepeatedOperationWorks: 'Each swap reduces the total number of inversions in the array by exactly 1. Because an unsorted array has at most n(n-1)/2 inversions, a finite sequence of swaps must eliminate all inversions and reach a sorted state.',
    paradigmSpecificDetail: 'Iterative pairwise relaxation of inversions with a shrinking unsorted suffix partition [0 .. n-i-1].',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure bubbleSort(A: list of sortable items)',
      '  n := length(A)',
      '  for i from 0 to n-2 do',
      '    swapped := false',
      '    for j from 0 to n-i-2 do',
      '      if A[j] > A[j+1] then',
      '        swap(A[j], A[j+1])',
      '        swapped := true',
      '      end if',
      '    end for',
      '    if not swapped then break',
      '  end for',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 0, lineText: 'procedure bubbleSort(A)', explanation: 'Declares procedure taking mutable array A.', variableRoles: 'A: input array.' },
      { lineIndex: 1, lineText: 'n := length(A)', explanation: 'Store total number of elements.', variableRoles: 'n: array size.' },
      { lineIndex: 2, lineText: 'for i from 0 to n-2 do', explanation: 'Outer pass counter. Runs at most n-1 times.', variableRoles: 'i: pass index.' },
      { lineIndex: 3, lineText: 'swapped := false', explanation: 'Flag to track if any swap happened in this pass for early exit.', variableRoles: 'swapped: boolean flag.' },
      { lineIndex: 4, lineText: 'for j from 0 to n-i-2 do', explanation: 'Inner loop scanning adjacent pairs up to unsorted boundary.', variableRoles: 'j: current element pointer.' },
      { lineIndex: 5, lineText: 'if A[j] > A[j+1] then', explanation: 'Check if current adjacent pair violates sorted order.', variableRoles: 'A[j], A[j+1]: adjacent pair.' },
      { lineIndex: 6, lineText: 'swap(A[j], A[j+1])', explanation: 'Exchange the two elements in memory.', variableRoles: 'temporary swap.' },
      { lineIndex: 7, lineText: 'swapped := true', explanation: 'Record that an inversion was corrected.', variableRoles: 'prevents early break.' },
      { lineIndex: 10, lineText: 'if not swapped then break', explanation: 'If no elements swapped during this full pass, array is already sorted.', variableRoles: 'early termination trigger.' },
    ],
    terminationCondition: 'Terminates when pass completes with swapped == false, or when outer loop completes n-1 passes.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function bubbleSort<T>(arr: T[]): T[] {
  const n = arr.length;
  if (n <= 1) return arr;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    signature: 'function bubbleSort<T>(arr: T[]): T[]',
    inputValidation: 'Checks if arr.length <= 1; if so, returns array immediately since 0 or 1 element is trivially sorted.',
    variables: [
      { name: 'n', type: 'number', purpose: 'Stores length of array.' },
      { name: 'i', type: 'number', purpose: 'Outer loop index denoting number of finalized elements at the end.' },
      { name: 'swapped', type: 'boolean', purpose: 'Flag indicating whether any adjacent swap occurred in the current pass.' },
      { name: 'j', type: 'number', purpose: 'Inner loop index traversing the unsorted prefix.' },
      { name: 'temp', type: 'T', purpose: 'Temporary storage variable for in-place swapping.' },
    ],
    lineByLine: [
      { line: 1, code: 'const n = arr.length;', explanation: 'Cache array length.' },
      { line: 2, code: 'if (n <= 1) return arr;', explanation: 'Edge case: single-element or empty array is already sorted.' },
      { line: 4, code: 'for (let i = 0; i < n - 1; i++) {', explanation: 'At most n-1 passes are required.' },
      { line: 5, code: 'let swapped = false;', explanation: 'Reset swap tracker at start of each pass.' },
      { line: 6, code: 'for (let j = 0; j < n - i - 1; j++) {', explanation: 'Bound excludes the i already-sorted elements at the end.' },
      { line: 7, code: 'if (arr[j] > arr[j + 1]) {', explanation: 'Strict inequality ensures stability.' },
      { line: 8, code: 'const temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;', explanation: 'In-place swap of adjacent elements.' },
      { line: 11, code: 'swapped = true;', explanation: 'Mark that an exchange occurred.' },
      { line: 14, code: 'if (!swapped) break;', explanation: 'Early termination: array is sorted.' },
    ],
    returnExplanation: 'Returns the sorted array mutated in place.',
    commonBugs: [
      'Using j < n - 1 instead of j < n - i - 1, which wastes time re-comparing already finalized suffix elements.',
      'Using arr[j] >= arr[j + 1] instead of >, which swaps equal elements and breaks stability.',
      'Using j < n in the inner loop, which causes arr[j + 1] to access undefined out-of-bounds.',
    ],
    edgeCaseHandling: [
      'Empty arrays (length 0) return immediately without entering loops.',
      'Single elements (length 1) return immediately.',
      'Arrays with all duplicates make 0 swaps and exit on pass 0.',
    ],
  },

  correctness: {
    intuitiveExplanation: 'At the end of pass i, the largest element among the first n-i elements must have been carried all the way to index n-1-i by adjacent swaps. By repeating this n-1 times, all elements are placed in monotonically increasing order.',
    formalProof: {
      method: 'Loop Invariant',
      invariantOrClaim: 'At the start of iteration i of the outer loop, the subarray arr[n-i .. n-1] consists of the i largest elements of the original array, in sorted order, and every element in arr[0 .. n-i-1] is <= arr[n-i].',
      initialization: 'Before iteration i = 0, the subarray arr[n .. n-1] is empty, which contains 0 elements and is trivially sorted.',
      maintenance: 'During pass i, the inner loop compares adjacent elements from 0 to n-i-2. By transitivity, whenever arr[j] > arr[j+1], the larger value is carried forward. Thus, the maximum element in arr[0 .. n-i-1] ends up at arr[n-i-1]. Subarray arr[n-i-1 .. n-1] now contains the i+1 largest elements in sorted order.',
      termination: 'The loop terminates when i = n-1 or when swapped is false. When i = n-1, arr[1 .. n-1] contains the n-1 largest elements sorted. The remaining single element arr[0] must be the minimum element, so the entire array arr[0 .. n-1] is sorted.',
      conclusion: 'By mathematical induction on loop invariants, Bubble Sort is guaranteed to produce a correctly sorted array upon termination.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(n)',
      explanation: 'Occurs when the input array is already sorted. The first pass performs n-1 comparisons, detects 0 swaps, and the swapped flag triggers an early break.',
      condition: 'Already sorted array, e.g. [1, 2, 3, 4, 5].',
    },
    averageCase: {
      complexity: 'O(n²)',
      explanation: 'On a randomly permuted array, each element is expected to be inverted with half of the other elements, resulting in n(n-1)/4 swaps and n(n-1)/2 comparisons.',
      condition: 'Randomly shuffled array.',
    },
    worstCase: {
      complexity: 'O(n²)',
      explanation: 'Occurs when the array is sorted in reverse order. Every single pair is inverted, requiring n(n-1)/2 comparisons and n(n-1)/2 swaps.',
      condition: 'Reverse sorted array, e.g. [5, 4, 3, 2, 1].',
    },
    auxiliarySpace: {
      complexity: 'O(1)',
      explanation: 'Sorts strictly in place. Requires only constant extra variables (n, i, j, swapped, temp).',
    },
    totalMemory: 'O(n) to store the input array in memory.',
    bigOExplanation: 'Worst case is Theta(n²), best case with early exit is Theta(n), so general upper bound is O(n²) and lower bound is Omega(n).',
    scalingBehavior: 'Doubling input size n multiplies the execution time by approximately 4x. For n=1,000, ~500,000 operations; for n=100,000, ~5 billion operations.',
  },

  advantagesAndLimitations: {
    strengths: [
      'Simple to understand, memorize, and implement.',
      'Requires zero additional memory allocation (O(1) auxiliary space).',
      'Stable sort: preserves relative ordering of equal keys.',
      'Linear O(n) detection of sorted or nearly sorted input.',
    ],
    limitations: [
      'Severely inefficient O(n²) time on large datasets.',
      'High number of write operations compared to Selection Sort.',
      'Cache performance is mediocre due to repeated passes over memory.',
    ],
    memoryTradeOffs: [
      'Trades execution speed for minimal memory footprint (O(1) memory vs Merge Sort O(n)).',
    ],
    poorChoiceScenarios: [
      'Datasets with more than a few hundred elements.',
      'Real-time systems with latency constraints.',
      'Flash memory where excessive write cycles cause hardware wear.',
    ],
  },

  comparisons: [
    {
      algorithm: 'Insertion Sort',
      timeComplexity: 'Best: O(n), Avg/Worst: O(n²)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Stable, In-Place',
      similarities: 'Both are stable, in-place, and achieve O(n) best-case time on sorted data.',
      differences: 'Insertion Sort shifts elements instead of swapping adjacent pairs, making it approximately 2x to 4x faster.',
      whenToPreferThis: 'Only for educational demonstration of adjacent pair bubbling.',
      whenToPreferAlternative: 'Whenever a simple quadratic sort is acceptable on small data (n < 50).',
    },
    {
      algorithm: 'Selection Sort',
      timeComplexity: 'Best/Avg/Worst: O(n²)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Unstable, In-Place',
      similarities: 'Both use nested loops and maintain a finalized suffix/prefix partition.',
      differences: 'Selection Sort does at most n swaps (O(n)), while Bubble Sort can perform up to O(n²) swaps. However, Selection Sort is not stable and cannot exit early.',
      whenToPreferThis: 'When stability is required or data is nearly sorted.',
      whenToPreferAlternative: 'When write operations are expensive (e.g. EEPROM / flash memory).',
    },
    {
      algorithm: 'Merge Sort',
      timeComplexity: 'Best/Avg/Worst: O(n log n)',
      spaceComplexity: 'O(n)',
      stabilityOrType: 'Stable, Out-of-Place',
      similarities: 'Both are stable comparison sorts.',
      differences: 'Merge Sort is O(n log n) divide-and-conquer, but requires O(n) auxiliary memory.',
      whenToPreferThis: 'When auxiliary memory is strictly limited to O(1) on tiny arrays.',
      whenToPreferAlternative: 'For any dataset with n >= 100.',
    },
  ],

  commonMistakes: [
    {
      title: 'Off-by-One in Inner Loop Bound',
      misconception: 'Writing j < n in the inner loop instead of j < n - i - 1.',
      badCodeOrApproach: 'for (let j = 0; j < n; j++) { if (arr[j] > arr[j+1]) ... }',
      correctApproach: 'for (let j = 0; j < n - i - 1; j++) { ... } to avoid accessing arr[n] (undefined) and re-checking sorted items.',
    },
    {
      title: 'Swapping Equal Elements (Destroying Stability)',
      misconception: 'Using >= in comparison instead of >.',
      badCodeOrApproach: 'if (arr[j] >= arr[j + 1]) swap(arr, j, j + 1);',
      correctApproach: 'Use strict > inequality so identical values never swap, preserving stability.',
    },
    {
      title: 'Omitting the Early Exit Flag',
      misconception: 'Running all n-1 passes unconditionally even when no swaps occurred.',
      badCodeOrApproach: 'Double loop without swapped boolean flag.',
      correctApproach: 'Use let swapped = false and break if !swapped to achieve O(n) best-case time.',
    },
  ],

  exercises: [
    {
      id: 'bs-ex-1',
      type: 'conceptual',
      question: 'After 2 complete passes of Bubble Sort on [9, 3, 8, 2, 7], which elements are guaranteed to be in their final positions?',
      options: ['The two smallest: 2 and 3 at indices 0 and 1', 'The two largest: 8 and 9 at indices 3 and 4', 'Only element 9 at index 4', 'All elements'],
      correctIndex: 1,
      explanation: 'In Bubble Sort, pass 1 places the largest element (9) at the last index (4). Pass 2 places the second largest element (8) at index 3. Therefore, 8 and 9 are permanently positioned.',
      optionExplanations: [
        'Incorrect; Bubble Sort bubbles elements to the end, not to the start.',
        'Correct! Pass 1 finalizes 9 at index 4, and Pass 2 finalizes 8 at index 3.',
        'Incorrect; after 2 passes, both 8 and 9 are guaranteed in position.',
        'Incorrect; the unsorted prefix [3, 2, 7] still has inversions.',
      ],
    },
    {
      id: 'bs-ex-2',
      type: 'step-tracing',
      question: 'How many swaps are executed by Bubble Sort on the array [4, 3, 2, 1]?',
      options: ['3 swaps', '4 swaps', '6 swaps', '12 swaps'],
      correctIndex: 2,
      explanation: 'The array is in reverse order. Total inversions = 4 * 3 / 2 = 6 swaps. Pass 1 takes 3 swaps, Pass 2 takes 2 swaps, Pass 3 takes 1 swap (3 + 2 + 1 = 6).',
      optionExplanations: [
        'Incorrect; 3 swaps only completes pass 1.',
        'Incorrect; calculation does not account for all pair inversions.',
        'Correct! 3 + 2 + 1 = 6 swaps in total.',
        'Incorrect; total comparisons is 6, not 12.',
      ],
    },
    {
      id: 'bs-ex-3',
      type: 'find-the-bug',
      question: 'What bug exists in: for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) { if (a[j] > a[j+1]) swap(a, j, j+1); } }?',
      options: [
        'When j = n - 1, a[j+1] accesses an index out of bounds (a[n]).',
        'The loop will throw a compile error because i and j cannot be compared.',
        'The array will be sorted in descending order.',
        'No bug exists; it is standard Bubble Sort.',
      ],
      correctIndex: 0,
      explanation: 'When j reaches n - 1, j + 1 is n, which is beyond the valid index range [0 .. n-1] for an array of size n, leading to undefined behavior or crash.',
      optionExplanations: [
        'Correct! Out-of-bounds access occurs on the final inner loop iteration.',
        'Variable scopes are fine; not a syntax error.',
        'The comparison > sorts ascending, not descending.',
        'Standard Bubble Sort restricts j up to n - i - 1.',
      ],
    },
  ],

  summary: {
    coreIdea: 'Bubble Sort repeatedly steps through the array, comparing adjacent items and swapping them if out of order, bubbling the largest remaining element to the end on each pass.',
    keyConditions: [
      'Early termination via a swapped flag makes best case O(n).',
      'Inner loop bound must be n - i - 1 to avoid redundant work and out-of-bounds access.',
      'Comparison must be strict (>) to preserve stability.',
    ],
    complexitySummary: {
      time: 'Best: O(n), Average: O(n²), Worst: O(n²)',
      space: 'O(1) auxiliary memory',
    },
    whenToUse: 'Ideal for teaching fundamental sorting mechanics and for nearly sorted datasets where only a few adjacent swaps are needed.',
    prerequisites: ['Basic Arrays', 'Nested Loops', 'Conditionals'],
    nextSteps: [
      { id: 'selection-sort', name: 'Selection Sort', reason: 'Learn how to reduce total swaps from O(n²) to O(n) by selecting minimums.' },
      { id: 'insertion-sort', name: 'Insertion Sort', reason: 'Master an in-place quadratic sort that is vastly faster in practice via shifts.' },
    ],
  },
};

// ============================================================================
// 2. SELECTION SORT LESSON
// ============================================================================
export const selectionSortLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'An in-place comparison sort that divides the input into a sorted prefix and unsorted suffix, repeatedly finding the minimum element from the unsorted suffix and appending it to the sorted prefix.',
  mainPurpose: 'To minimize the total number of swap/write operations to at most n-1 swaps while maintaining an intuitive sorted prefix partition.',
  whatIsIt: {
    overview: 'Selection Sort works by maintaining two partitions within the array: a sorted prefix at the front and an unsorted suffix at the rear. In each pass, it scans the entire unsorted suffix to locate the minimum element, and then performs a single swap to place that minimum at the end of the sorted prefix.',
    smallExample: 'For [64, 25, 12, 22, 11]: In pass 0, the minimum of [64, 25, 12, 22, 11] is 11. Swap 64 and 11 -> [11, 25, 12, 22, 64]. In pass 1, the minimum of [25, 12, 22, 64] is 12. Swap 25 and 12 -> [11, 12, 25, 22, 64].',
  },
  whyUseIt: {
    problemSolved: 'Sorts elements with the absolute minimum number of memory write operations (at most n-1 writes).',
    whyItMatters: 'In storage media where write operations are physically expensive or wear down hardware (e.g. Flash memory, EEPROM), minimizing writes is more critical than reducing comparisons.',
    whenToUse: [
      'Systems where write operations are significantly more costly than read operations (e.g., flash memory).',
      'Small lists where the overhead of complex algorithms is unwarranted.',
      'Situations where auxiliary memory is strictly limited to O(1).',
    ],
    whenToAvoid: [
      'Large lists (n > 100) because comparisons are always quadratic O(n²).',
      'Applications that require stability (Selection Sort is inherently unstable).',
      'Partially sorted data where algorithms like Insertion Sort can run in linear time.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Flash Memory and EEPROM Devices',
      description: 'Used in microcontrollers writing to EEPROM where each write cycle causes permanent physical wear on floating-gate transistors.',
      educationalVsProductionNote: 'Practically used in embedded hardware specifically for write endurance limits.',
    },
    {
      title: 'Sorting Small Hardware Sensor Readouts',
      description: 'Frequently used in embedded sensor nodes where memory is too scarce for recursion and writes consume battery power.',
      educationalVsProductionNote: 'Valid production choice for microcontroller firmware with < 1KB RAM.',
    },
    {
      title: 'Selection of Top K Candidates',
      description: 'Running k passes of Selection Sort finds the k smallest elements in O(k * n) time without fully sorting.',
      educationalVsProductionNote: 'Partial selection sort is a common utility in simple analytics pipelines.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Initialize Sorted Boundary',
      description: 'Start with index i = 0. The subarray A[0 .. i-1] is considered sorted (initially empty).',
    },
    {
      stepNumber: 2,
      title: 'Find Minimum in Unsorted Subarray',
      description: 'Set minIdx = i. Iterate j from i + 1 to n - 1. Whenever A[j] < A[minIdx], update minIdx = j.',
    },
    {
      stepNumber: 3,
      title: 'Perform Single Swap',
      description: 'After checking all elements in the unsorted suffix, swap A[i] with A[minIdx] if minIdx != i.',
    },
    {
      stepNumber: 4,
      title: 'Expand Sorted Prefix',
      description: 'Increment i by 1, extending the sorted subarray by one element.',
    },
    {
      stepNumber: 5,
      title: 'Terminate at n-1',
      description: 'When i reaches n - 1, the remaining single element at the end is already the maximum, so sorting terminates.',
    },
  ],
  workedExample: {
    datasetDescription: 'Unsorted array of 4 distinct integers [7, 4, 6, 2]',
    initialState: '[7, 4, 6, 2]',
    steps: [
      {
        stepNumber: 1,
        operation: 'Pass 0: Scan [7, 4, 6, 2] for minimum',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'minIdx starts at 0 (value 7). Comparing with 4 updates minIdx=1. Comparing with 6 keeps minIdx=1. Comparing with 2 updates minIdx=3 (value 2). Swap A[0]=7 with A[3]=2.',
        whyNecessary: '2 is the global minimum; placing it at index 0 establishes the sorted prefix [2].',
        beforeState: '[7, 4, 6, 2]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Scan unsorted suffix A[1..3] for pass 1.',
        intermediateResult: 'Sorted prefix: [2]. Unsorted suffix: [4, 6, 7].',
      },
      {
        stepNumber: 2,
        operation: 'Pass 1: Scan [4, 6, 7] for minimum',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'minIdx starts at 1 (value 4). Comparing with 6 and 7 shows 4 is already the minimum. minIdx remains 1. No swap needed (or swap with self).',
        whyNecessary: '4 is already the smallest element in the remaining unsorted subarray.',
        beforeState: '[2, 4, 6, 7]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Scan unsorted suffix A[2..3] for pass 2.',
        intermediateResult: 'Sorted prefix: [2, 4]. Unsorted suffix: [6, 7].',
      },
      {
        stepNumber: 3,
        operation: 'Pass 2: Scan [6, 7] for minimum',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'minIdx starts at 2 (value 6). Comparing with 7 shows 6 is smaller. minIdx remains 2. No swap needed.',
        whyNecessary: '6 is the smallest in [6, 7]; placing it at index 2 finalizes prefix [2, 4, 6].',
        beforeState: '[2, 4, 6, 7]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Pass 3: Final single element 7 is automatically placed.',
        intermediateResult: 'Sorted prefix: [2, 4, 6].',
      },
    ],
    finalState: '[2, 4, 6, 7]',
  },
  advantages: [
    'Performs at most n - 1 swaps, making it optimal for write-costly memory architectures.',
    'Strict O(1) auxiliary memory usage.',
    'Predictable performance: exact same number of comparisons regardless of input distribution.',
    'Simpler than other quadratic sorting algorithms.',
  ],
  limitations: [
    'Always runs in O(n²) time, even on an already sorted array (does not adapt to sortedness).',
    'Inherently unstable: long-range swaps can jump equal elements past each other.',
    'Inefficient for large arrays (n > 100).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(n²) comparisons even on already sorted input. The algorithm must inspect every remaining element to prove it is the minimum.',
    averageCaseMeaning: 'O(n²) comparisons (n(n-1)/2) on random input. Average number of swaps is O(n).',
    worstCaseMeaning: 'O(n²) comparisons and n-1 swaps when reverse sorted or sorted with minimums at the end.',
    spaceComplexityMeaning: 'O(1) auxiliary space. Only scalar pointers (i, j, minIdx) are maintained.',
  },
  relatedAlgorithms: [
    {
      name: 'Bubble Sort',
      comparison: 'Bubble Sort makes up to O(n²) swaps, whereas Selection Sort makes at most n-1 swaps. However, Bubble Sort is stable and can terminate in O(n) on sorted data.',
    },
    {
      name: 'Heap Sort',
      comparison: 'Heap Sort can be viewed as an optimized Selection Sort that uses a binary heap to find the minimum/maximum in O(log n) time instead of O(n) linear scans, achieving O(n log n) total time.',
    },
    {
      name: 'Insertion Sort',
      comparison: 'Insertion Sort is stable and runs in O(n) on nearly-sorted data, but makes O(n²) shifts compared to Selection Sort’s O(n) swaps.',
    },
  ],
  quiz: [
    {
      question: 'Why is standard Selection Sort considered an unstable sorting algorithm?',
      options: [
        'Because it uses random pivot elements.',
        'Because long-distance swaps can move an element past an identical element without comparing them.',
        'Because it does not terminate on duplicate values.',
        'Because its auxiliary space grows with duplicates.',
      ],
      correctIndex: 1,
      explanation: 'For example, in [4a, 4b, 2], the minimum 2 swaps with 4a, producing [2, 4b, 4a]. The original relative order of 4a and 4b is inverted, demonstrating instability.',
      optionExplanations: [
        'Selection Sort does not use pivots (that is Quick Sort).',
        'Correct! Swapping the minimum across multiple elements causes equal elements to invert order.',
        'It terminates normally on duplicate values.',
        'Auxiliary space is always O(1).',
      ],
    },
    {
      question: 'What is the maximum number of swap operations Selection Sort can execute on an array of length n?',
      options: ['n²', 'n(n - 1) / 2', 'n - 1', 'n log n'],
      correctIndex: 2,
      explanation: 'Selection Sort performs at most one swap per outer loop iteration. Since the outer loop executes n - 1 times, the maximum number of swaps is n - 1.',
      optionExplanations: [
        'n² is quadratic and would describe worst-case Bubble Sort swaps.',
        'n(n-1)/2 is the number of comparisons, not swaps.',
        'Correct! At most one swap occurs per pass, bounding total swaps to n - 1.',
        'n log n is not the swap bound.',
      ],
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Selection Sort is named because in each iteration, the algorithm explicitly "selects" the minimum (or maximum) element from the remaining unsorted portion and moves it to its finalized position.',
    problemSolved: 'Sorts comparable elements into ascending order with minimal write operations.',
    problemNotSolved: 'Does not preserve relative order of duplicates (unstable) and does not achieve sub-quadratic comparison counts.',
    whyLearn: 'Demonstrates the concept of sorted prefix vs unsorted suffix invariants, and introduces the motivation for Heap Sort (replacing linear search with a priority queue).',
    prerequisites: ['Basic Arrays', 'Nested loops', 'Finding minimum in an array', 'In-place swapping'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Sort an array A of size n while minimizing the total number of element writes.',
    naiveApproachInefficiency: 'Algorithms like Bubble Sort can execute up to n(n-1)/2 swaps. On flash storage, this causes significant hardware degradation.',
    coreIdeaUsed: 'Find the absolute minimum in the remaining unsorted subarray first, then execute exactly one swap per pass.',
    utilityExplanation: 'Bounds total memory write operations to at most n-1 swaps.',
    workingConditions: ['Array elements must have a total order.', 'Array must be stored in random-access mutable memory.'],
    whenAnotherIsBetter: 'When stability is required, or when the array is already mostly sorted (Insertion Sort is better).',
    analogyOrRealLifeExample: 'Imagine sorting a hand of playing cards on a table: you search your unsorted hand for the absolute lowest card, pick it up, and place it down on the table to start a sorted pile. You repeat this until no cards remain.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of n comparable elements.',
    expectedOutput: 'The same array sorted such that A[0] <= A[1] <= ... <= A[n-1].',
    constraints: 'n >= 0. In-place sorting.',
    preconditions: 'None.',
    specialCases: ['Empty array (n=0): returns immediately.', 'Single element (n=1): 0 comparisons.', 'Already sorted: still makes n(n-1)/2 comparisons.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If elements are incomparable, minIdx logic fails and the array remains unsorted.',
  },

  coreIntuition: {
    simpleExplanation: 'Divide the array into a sorted left part and an unsorted right part. Scan the right part to find the smallest number, and swap it to the end of the left part. Repeat until the whole array is sorted.',
    keyDrivingDecision: 'Scan the unsorted suffix to locate minIdx, then swap A[i] with A[minIdx].',
    whyRepeatedOperationWorks: 'Placing the minimum of the unsorted suffix into index i guarantees that A[i] is greater than or equal to all elements in A[0..i-1] and less than or equal to all elements in A[i+1..n-1].',
    paradigmSpecificDetail: 'Greedy selection of the global extremum from an unsorted suffix partition.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure selectionSort(A: list of sortable items)',
      '  n := length(A)',
      '  for i from 0 to n-2 do',
      '    minIdx := i',
      '    for j from i+1 to n-1 do',
      '      if A[j] < A[minIdx] then',
      '        minIdx := j',
      '      end if',
      '    end for',
      '    if minIdx != i then',
      '      swap(A[i], A[minIdx])',
      '    end if',
      '  end for',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 0, lineText: 'procedure selectionSort(A)', explanation: 'Declares procedure taking array A.' },
      { lineIndex: 1, lineText: 'n := length(A)', explanation: 'Store total number of elements.' },
      { lineIndex: 2, lineText: 'for i from 0 to n-2 do', explanation: 'Outer loop boundary. Advances the sorted prefix.' },
      { lineIndex: 3, lineText: 'minIdx := i', explanation: 'Assume current position i holds the minimum.' },
      { lineIndex: 4, lineText: 'for j from i+1 to n-1 do', explanation: 'Inner loop scans the remainder of the array.' },
      { lineIndex: 5, lineText: 'if A[j] < A[minIdx] then', explanation: 'Compare current element with known minimum.' },
      { lineIndex: 6, lineText: 'minIdx := j', explanation: 'Update index of minimum element found so far.' },
      { lineIndex: 9, lineText: 'if minIdx != i then swap(...)', explanation: 'Swap only if a strictly smaller element was found.' },
    ],
    terminationCondition: 'Terminates after n-1 passes, when only one element remains in the unsorted suffix.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function selectionSort<T>(arr: T[]): T[] {
  const n = arr.length;
  if (n <= 1) return arr;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
  return arr;
}`,
    signature: 'function selectionSort<T>(arr: T[]): T[]',
    inputValidation: 'Validates array length; returns immediately if length <= 1.',
    variables: [
      { name: 'n', type: 'number', purpose: 'Length of input array.' },
      { name: 'i', type: 'number', purpose: 'Pointer to the current destination index of the sorted prefix.' },
      { name: 'minIdx', type: 'number', purpose: 'Index of the smallest element in the current unsorted suffix.' },
      { name: 'j', type: 'number', purpose: 'Scanning index traversing the unsorted suffix.' },
      { name: 'temp', type: 'T', purpose: 'Temporary variable for swapping.' },
    ],
    lineByLine: [
      { line: 1, code: 'const n = arr.length;', explanation: 'Cache length.' },
      { line: 2, code: 'if (n <= 1) return arr;', explanation: 'Handle base cases.' },
      { line: 4, code: 'for (let i = 0; i < n - 1; i++) {', explanation: 'Iterate over all destination slots.' },
      { line: 5, code: 'let minIdx = i;', explanation: 'Initialize candidate minimum index.' },
      { line: 6, code: 'for (let j = i + 1; j < n; j++) {', explanation: 'Scan rest of the array.' },
      { line: 7, code: 'if (arr[j] < arr[minIdx]) minIdx = j;', explanation: 'Track minimum index.' },
      { line: 11, code: 'if (minIdx !== i) { ... }', explanation: 'Execute at most one swap per pass.' },
    ],
    returnExplanation: 'Returns the sorted array in-place.',
    commonBugs: [
      'Initializing minIdx with the value arr[i] instead of the index i, causing invalid index lookups.',
      'Starting inner loop at j = i instead of j = i + 1, wasting a comparison.',
      'Assuming the algorithm is stable; equal keys can be swapped out of relative order.',
    ],
    edgeCaseHandling: [
      'Arrays with all identical values make comparisons but 0 swaps because minIdx remains i.',
      'Already sorted arrays execute 0 swaps if minIdx !== i guard is used.',
    ],
  },

  correctness: {
    intuitiveExplanation: 'At each pass i, the smallest element among all remaining unsorted elements is chosen and placed at position i. Hence, every position i contains an element that is larger than all elements before it, and smaller than all elements after it.',
    formalProof: {
      method: 'Loop Invariant',
      invariantOrClaim: 'At the start of each iteration i of the outer loop, the subarray arr[0 .. i-1] contains the i smallest elements of the array in sorted order, and arr[k] <= arr[m] for all k < i and m >= i.',
      initialization: 'Before iteration i = 0, the subarray arr[0 .. -1] is empty, which is trivially sorted.',
      maintenance: 'In iteration i, the inner loop finds minIdx such that arr[minIdx] <= arr[j] for all j from i to n-1. Swapping arr[i] with arr[minIdx] puts this minimum at arr[i]. Since all elements in arr[i .. n-1] were >= all elements in arr[0 .. i-1], the new prefix arr[0 .. i] is sorted and contains the i+1 smallest elements.',
      termination: 'The loop terminates when i = n - 1. By the invariant, arr[0 .. n-2] contains the n-1 smallest elements in sorted order. The remaining element at arr[n-1] must be the maximum, so the entire array arr[0 .. n-1] is sorted.',
      conclusion: 'Selection Sort is mathematically guaranteed to sort any comparable collection in n-1 passes.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(n²)',
      explanation: 'Selection Sort always executes n(n-1)/2 comparisons because it must inspect every unsorted element to confirm the minimum, even if already sorted.',
      condition: 'Already sorted array.',
    },
    averageCase: {
      complexity: 'O(n²)',
      explanation: 'Comparisons are strictly deterministic: sum_{i=0}^{n-2} (n - 1 - i) = n(n-1)/2 comparisons.',
      condition: 'Randomly ordered array.',
    },
    worstCase: {
      complexity: 'O(n²)',
      explanation: 'n(n-1)/2 comparisons and n-1 swaps when reverse sorted.',
      condition: 'Reverse sorted array.',
    },
    auxiliarySpace: {
      complexity: 'O(1)',
      explanation: 'Requires only a few scalar pointers (i, j, minIdx).',
    },
    totalMemory: 'O(n) for input storage.',
    bigOExplanation: 'Both best, average, and worst-case comparison counts are Theta(n²). Swap count is O(n).',
    scalingBehavior: 'Every doubling of n increases execution time by 4x. For n=10,000, ~50 million comparisons.',
  },

  advantagesAndLimitations: {
    strengths: [
      'Minimizes total memory write/swap operations to at most n - 1.',
      'O(1) auxiliary space.',
      'Extremely simple and deterministic runtime.',
    ],
    limitations: [
      'Does not adapt to sorted input; always takes O(n²) time.',
      'Not a stable sort.',
      'Slow on large datasets compared to O(n log n) sorts.',
    ],
    memoryTradeOffs: ['Tradeoff: Fewer memory writes than Bubble/Insertion Sort, but non-adaptive quadratic comparison count.'],
    poorChoiceScenarios: ['When input is already mostly sorted.', 'When stability is needed.', 'Large datasets.'],
  },

  comparisons: [
    {
      algorithm: 'Bubble Sort',
      timeComplexity: 'Best: O(n), Avg/Worst: O(n²)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Stable, In-Place',
      similarities: 'Both are O(n²) comparison sorts.',
      differences: 'Selection Sort makes at most n swaps vs Bubble Sort’s O(n²) swaps, but Bubble Sort is stable and adaptive.',
      whenToPreferThis: 'When memory writes must be minimized.',
      whenToPreferAlternative: 'When stability is required or data is nearly sorted.',
    },
    {
      algorithm: 'Insertion Sort',
      timeComplexity: 'Best: O(n), Avg/Worst: O(n²)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Stable, In-Place',
      similarities: 'Both maintain a sorted prefix partition.',
      differences: 'Insertion Sort inserts by shifting and is adaptive; Selection Sort scans the whole suffix and is non-adaptive.',
      whenToPreferThis: 'When memory writes are significantly costlier than reads.',
      whenToPreferAlternative: 'In general practical use on small arrays.',
    },
  ],

  commonMistakes: [
    {
      title: 'Confusing Index with Value in minIdx',
      misconception: 'Storing the minimum value rather than its index minIdx.',
      badCodeOrApproach: 'let minVal = arr[i]; ... if (arr[j] < minVal) minVal = arr[j]; (losing the index to swap).',
      correctApproach: 'Store minIdx = j so that swap(arr, i, minIdx) can be executed.',
    },
    {
      title: 'Assuming Selection Sort is Stable',
      misconception: 'Believing equal keys maintain original order.',
      badCodeOrApproach: 'Using Selection Sort on objects with equal secondary keys.',
      correctApproach: 'Use Insertion Sort or Merge Sort if stability is required.',
    },
  ],

  exercises: [
    {
      id: 'ss-ex-1',
      type: 'step-tracing',
      question: 'After 1 pass of Selection Sort on [29, 10, 14, 37, 13], what is the state of the array?',
      options: ['[10, 29, 14, 37, 13]', '[10, 14, 29, 37, 13]', '[10, 13, 14, 29, 37]', '[29, 10, 14, 13, 37]'],
      correctIndex: 0,
      explanation: 'The minimum element in the entire array is 10 (at index 1). It swaps with the first element 29 (at index 0). The array becomes [10, 29, 14, 37, 13].',
      optionExplanations: [
        'Correct! 10 and 29 swap.',
        'Incorrect; 14 is not involved in pass 0 swap.',
        'Incorrect; this is the final sorted array, not pass 1.',
        'Incorrect; 37 was not selected.',
      ],
    },
  ],

  summary: {
    coreIdea: 'Selection Sort repeatedly scans the unsorted suffix to locate the minimum element and places it into the next slot of the sorted prefix, performing at most n-1 swaps in total.',
    keyConditions: [
      'Always performs exactly n(n-1)/2 comparisons regardless of input.',
      'Unstable due to long-range swaps.',
      'Ideal when memory writes are physically expensive.',
    ],
    complexitySummary: {
      time: 'Best: O(n²), Average: O(n²), Worst: O(n²)',
      space: 'O(1) auxiliary memory',
    },
    whenToUse: 'When writes to physical memory (Flash/EEPROM) must be minimized and array size is small.',
    prerequisites: ['Basic Loops', 'Array Indexing', 'Swapping'],
    nextSteps: [
      { id: 'heap-sort', name: 'Heap Sort', reason: 'Learn how to speed up the minimum selection step from O(n) to O(log n) using a Heap.' },
      { id: 'insertion-sort', name: 'Insertion Sort', reason: 'Explore a stable, adaptive alternative that runs in O(n) on sorted arrays.' },
    ],
  },
};

// ============================================================================
// 3. INSERTION SORT LESSON
// ============================================================================
export const insertionSortLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'An intuitive, stable, in-place sorting algorithm that builds the final sorted array one element at a time by extracting a key element and shifting preceding larger elements to find its correct position.',
  mainPurpose: 'To sort small or nearly-sorted datasets with optimal linear O(n) best-case performance and minimal overhead.',
  whatIsIt: {
    overview: 'Insertion Sort functions just like the way most people sort a hand of playing cards. You start with the first card (trivially sorted). You pick up the next card (the "key"), look at the cards in your hand from right to left, shift all cards that are greater than your key one spot to the right, and insert the key into the empty slot.',
    smallExample: 'For [12, 11, 13, 5, 6]: At index 1, key=11. 12 shifts right -> [11, 12, 13, 5, 6]. At index 2, key=13. 13 > 12, stays -> [11, 12, 13, 5, 6]. At index 3, key=5. 13, 12, 11 shift right -> [5, 11, 12, 13, 6]. At index 4, key=6. 13, 12, 11 shift right -> [5, 6, 11, 12, 13].',
  },
  whyUseIt: {
    problemSolved: 'Efficiently sorts small arrays and adapts to already-sorted or nearly-sorted collections with O(n) time.',
    whyItMatters: 'It is the engine behind production-grade hybrid algorithms like Timsort (used in Python and Java) and Introsort (used in C++ std::sort), which switch to Insertion Sort for subarrays of size n <= 32.',
    whenToUse: [
      'Small datasets (typically n <= 32) where low overhead beats O(n log n) complex algorithms.',
      'Nearly sorted arrays where few elements are inverted.',
      'Online sorting where elements arrive continuously in a live stream.',
      'When stability and in-place O(1) auxiliary memory are strictly required.',
    ],
    whenToAvoid: [
      'Large, randomly shuffled or reverse-ordered datasets (n > 100) where O(n²) shifts cause quadratic slowdown.',
      'Systems with strict worst-case latency limits where O(n log n) guarantee is necessary.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Timsort and Introsort Base Cases',
      description: 'Used in Python’s sorted(), Java’s Arrays.sort(), and C++ std::sort() to sort small partitions (n <= 32) generated by Merge/Quick Sort.',
      educationalVsProductionNote: 'High-volume production standard: modern runtimes rely on Insertion Sort inside their standard libraries for small base cases.',
    },
    {
      title: 'Real-Time Online Data Streaming',
      description: 'When new telemetry data points or financial ticker trades arrive one by one, Insertion Sort inserts each item into an already sorted list in O(n) time.',
      educationalVsProductionNote: 'Active production technique for incremental updates in low-latency analytics.',
    },
    {
      title: 'Nearly Sorted Database Records',
      description: 'Re-sorting database rows where a few new rows have been appended to an already-sorted index table.',
      educationalVsProductionNote: 'Frequently utilized in log consolidation and sequential batch updates.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Designate Sorted Prefix',
      description: 'The single element A[0] is trivially sorted on its own. Begin with index i = 1.',
    },
    {
      stepNumber: 2,
      title: 'Extract Key Element',
      description: 'Save key = A[i] in a temporary variable. A slot is now conceptually open at index i.',
    },
    {
      stepNumber: 3,
      title: 'Shift Greater Elements',
      description: 'Scan backwards from j = i - 1. While j >= 0 and A[j] > key, shift A[j] to A[j + 1], decrementing j.',
    },
    {
      stepNumber: 4,
      title: 'Insert Key at Correct Slot',
      description: 'Place key into position A[j + 1], which is its sorted home among the first i + 1 elements.',
    },
    {
      stepNumber: 5,
      title: 'Advance to Next Element',
      description: 'Increment i and repeat until i reaches n. The entire array is then sorted.',
    },
  ],
  workedExample: {
    datasetDescription: 'Unsorted array of 4 distinct integers [7, 4, 6, 2]',
    initialState: '[7, 4, 6, 2]',
    steps: [
      {
        stepNumber: 1,
        operation: 'i=1: key = 4. Compare with A[0]=7',
        stateDisplay: '[4, 7, 6, 2]',
        explanation: 'key=4. Since 7 > 4, shift 7 to index 1. j reaches -1. Insert key 4 at index 0. Array becomes [4, 7, 6, 2].',
        whyNecessary: 'Inserts 4 before 7, establishing the sorted prefix [4, 7].',
        beforeState: '[7, 4, 6, 2]',
        afterState: '[4, 7, 6, 2]',
        nextAction: 'Increment i to 2; extract key = A[2].',
        intermediateResult: 'Sorted prefix: [4, 7].',
      },
      {
        stepNumber: 2,
        operation: 'i=2: key = 6. Compare with A[1]=7',
        stateDisplay: '[4, 6, 7, 2]',
        explanation: 'key=6. Since 7 > 6, shift 7 to index 2. Compare key 6 with A[0]=4. Since 4 <= 6, stop shifting. Insert key 6 at index 1.',
        whyNecessary: 'Places 6 between 4 and 7, expanding sorted prefix to [4, 6, 7].',
        beforeState: '[4, 7, 6, 2]',
        afterState: '[4, 6, 7, 2]',
        nextAction: 'Increment i to 3; extract key = A[3].',
        intermediateResult: 'Sorted prefix: [4, 6, 7].',
      },
      {
        stepNumber: 3,
        operation: 'i=3: key = 2. Compare with 7, 6, 4',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'key=2. 7 > 2, shift 7 right. 6 > 2, shift 6 right. 4 > 2, shift 4 right. j reaches -1. Insert key 2 at index 0.',
        whyNecessary: '2 is the global minimum; shifting all 3 prefix elements places 2 at index 0.',
        beforeState: '[4, 6, 7, 2]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Algorithm completes; entire array is sorted.',
        intermediateResult: 'Full array sorted: [2, 4, 6, 7].',
      },
    ],
    finalState: '[2, 4, 6, 7]',
  },
  advantages: [
    'Optimal adaptive O(n) runtime on already sorted or nearly-sorted data.',
    'Stable sorting: preserves original relative order of duplicate elements.',
    'In-place with O(1) auxiliary space.',
    'Very low constant factor and minimal code overhead, outperforming Quick/Merge sort on tiny arrays.',
  ],
  limitations: [
    'Quadratic O(n²) time on reverse-sorted or randomly shuffled large arrays.',
    'Shifting elements one position at a time is inefficient when items must travel long distances.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(n) occurs when the array is already sorted. Each key is compared once with its left neighbor, no shifts occur, resulting in n-1 comparisons.',
    averageCaseMeaning: 'O(n²) occurs on random data where each key shifts past approximately half of the sorted prefix (~n²/4 shifts and comparisons).',
    worstCaseMeaning: 'O(n²) occurs when the array is sorted in reverse order. Every element must shift past all preceding elements: sum_{i=1}^{n-1} i = n(n-1)/2 shifts.',
    spaceComplexityMeaning: 'O(1) auxiliary space. Only a single key variable and index pointers (i, j) are kept in memory.',
  },
  relatedAlgorithms: [
    {
      name: 'Bubble Sort',
      comparison: 'Both have O(n) best and O(n²) worst time, but Insertion Sort shifts items into place with a single assignment instead of executing full 3-instruction swaps, making it 2x to 4x faster.',
    },
    {
      name: 'Selection Sort',
      comparison: 'Selection Sort always takes O(n²) comparisons even on sorted arrays, whereas Insertion Sort terminates in O(n) time on sorted data and is stable.',
    },
    {
      name: 'Merge Sort',
      comparison: 'Merge Sort guarantees O(n log n) worst-case time, but requires O(n) extra memory and has higher overhead for small n (n <= 32).',
    },
  ],
  quiz: [
    {
      question: 'What is the time complexity of Insertion Sort when running on an array that is already sorted in ascending order?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctIndex: 1,
      explanation: 'For each element from index 1 to n-1, it is compared once with the element immediately to its left. Since it is already greater, 0 shifts occur, yielding n-1 comparisons = O(n).',
    },
    {
      question: 'Why do production hybrid sorting algorithms like Timsort use Insertion Sort for small partitions?',
      options: [
        'Because Insertion Sort is faster than Quick Sort on millions of elements.',
        'Because its low overhead, lack of recursion, and cache efficiency beat O(n log n) algorithms for n <= 32.',
        'Because Insertion Sort uses O(n) extra memory.',
        'Because it is non-comparative.',
      ],
      correctIndex: 1,
      explanation: 'For small arrays (n <= 32), the constant factor overhead of recursive function calls in Merge/Quick sort exceeds the quadratic cost of Insertion Sort. Additionally, Insertion Sort is stable and in-place.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Insertion Sort is named because each element is taken one by one and "inserted" into its proper sorted location among the elements already considered.',
    problemSolved: 'Sorts comparable elements into non-decreasing order with exceptional performance on small or partially ordered inputs.',
    problemNotSolved: 'Does not scale efficiently to large unsorted collections due to pairwise element shifting.',
    whyLearn: 'Crucial for understanding adaptive algorithms, shift vs swap mechanics, and the foundation of production hybrid sorters (Timsort, Introsort).',
    prerequisites: ['1D Arrays', 'While loops', 'Nested loops', 'Variable assignment and shifting'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Sort array A of n items with minimal overhead, preserving stability and adapting gracefully to nearly sorted order.',
    naiveApproachInefficiency: 'Standard algorithms like Selection Sort do not adapt to sorted order, always taking O(n²) comparisons.',
    coreIdeaUsed: 'Build a sorted prefix incrementally by shifting larger elements one position to the right to create an opening for the key.',
    utilityExplanation: 'Number of operations is directly proportional to the number of inversions in the array: O(n + d) where d is the inversion count.',
    workingConditions: ['Random access read/write memory.', 'Total order defined on elements.'],
    whenAnotherIsBetter: 'When n > 50 and the array is randomly shuffled, Merge Sort or Quick Sort is significantly faster.',
    analogyOrRealLifeExample: 'Sorting playing cards in your hand: as you pick up each card from the deck, you slide it between the cards in your hand where it belongs.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of n comparable elements.',
    expectedOutput: 'The same array sorted in ascending order.',
    constraints: 'n >= 0.',
    preconditions: 'None.',
    specialCases: ['Empty or 1-element array: 0 operations.', 'Already sorted: n-1 comparisons, 0 shifts.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If elements cannot be ordered, the while condition fails to find the insertion slot properly.',
  },

  coreIntuition: {
    simpleExplanation: 'Take elements one by one from left to right. Insert each new item into its correct spot among the numbers you have already sorted on the left by sliding bigger numbers out of the way.',
    keyDrivingDecision: 'While the previous number is bigger than your key, shift it right. When it is smaller or equal, drop the key into the open space.',
    whyRepeatedOperationWorks: 'Maintains the invariant that the subarray A[0..i-1] is always sorted. Adding A[i] into its sorted position preserves this invariant for A[0..i]. By induction, the entire array is sorted when i=n.',
    paradigmSpecificDetail: 'Incremental construction of a sorted prefix via rightward shifting of larger elements.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure insertionSort(A: list of sortable items)',
      '  n := length(A)',
      '  for i from 1 to n-1 do',
      '    key := A[i]',
      '    j := i - 1',
      '    while j >= 0 and A[j] > key do',
      '      A[j+1] := A[j]',
      '      j := j - 1',
      '    end while',
      '    A[j+1] := key',
      '  end for',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 0, lineText: 'procedure insertionSort(A)', explanation: 'Procedure definition taking array A.' },
      { lineIndex: 2, lineText: 'for i from 1 to n-1 do', explanation: 'Starts at index 1 because single element A[0] is already sorted.' },
      { lineIndex: 3, lineText: 'key := A[i]', explanation: 'Extract the item to be inserted into the sorted prefix.' },
      { lineIndex: 4, lineText: 'j := i - 1', explanation: 'Set pointer to the end of the sorted prefix.' },
      { lineIndex: 5, lineText: 'while j >= 0 and A[j] > key do', explanation: 'Condition to find insertion slot. Strict > preserves stability.' },
      { lineIndex: 6, lineText: 'A[j+1] := A[j]', explanation: 'Shift element one slot to the right.' },
      { lineIndex: 7, lineText: 'j := j - 1', explanation: 'Move backward in sorted prefix.' },
      { lineIndex: 9, lineText: 'A[j+1] := key', explanation: 'Insert key into the vacated slot.' },
    ],
    terminationCondition: 'Outer loop terminates when all n elements have been processed into the sorted prefix.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function insertionSort<T>(arr: T[]): T[] {
  const n = arr.length;
  if (n <= 1) return arr;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    signature: 'function insertionSort<T>(arr: T[]): T[]',
    inputValidation: 'Validates array length; returns immediately if length <= 1.',
    variables: [
      { name: 'n', type: 'number', purpose: 'Length of input array.' },
      { name: 'i', type: 'number', purpose: 'Index of element currently being inserted into the prefix.' },
      { name: 'key', type: 'T', purpose: 'Value of the current element being inserted.' },
      { name: 'j', type: 'number', purpose: 'Backward scanning index in the sorted prefix.' },
    ],
    lineByLine: [
      { line: 1, code: 'const n = arr.length;', explanation: 'Cache length.' },
      { line: 2, code: 'if (n <= 1) return arr;', explanation: 'Base case handling.' },
      { line: 4, code: 'for (let i = 1; i < n; i++) {', explanation: 'Iterate from second element to end.' },
      { line: 5, code: 'const key = arr[i];', explanation: 'Extract current key.' },
      { line: 6, code: 'let j = i - 1;', explanation: 'Initialize shift pointer.' },
      { line: 8, code: 'while (j >= 0 && arr[j] > key) {', explanation: 'Shift elements larger than key.' },
      { line: 9, code: 'arr[j + 1] = arr[j]; j--;', explanation: 'Shift rightward and decrement pointer.' },
      { line: 12, code: 'arr[j + 1] = key;', explanation: 'Place key into vacant position.' },
    ],
    returnExplanation: 'Returns the sorted array mutated in place.',
    commonBugs: [
      'Using arr[j] >= key in the while loop, which causes equal keys to shift and destroys stability.',
      'Checking arr[j] > key before checking j >= 0, causing out-of-bounds error on index -1 in some languages.',
      'Forgetting to decrement j in the while loop, causing an infinite loop.',
    ],
    edgeCaseHandling: [
      'Empty and 1-element arrays return immediately.',
      'Reverse-sorted arrays cause maximum shifts (n(n-1)/2).',
      'Already-sorted arrays break out of the while loop immediately on first check.',
    ],
  },

  correctness: {
    intuitiveExplanation: 'At the start of step i, the elements A[0..i-1] are sorted. We then take A[i] and place it into its exact relative position among A[0..i-1], shifting larger elements to make room. Now A[0..i] is sorted. Continuing until i=n sorts the entire array.',
    formalProof: {
      method: 'Loop Invariant',
      invariantOrClaim: 'At the start of each iteration of the outer for loop (indexed by i), the subarray arr[0 .. i-1] consists of the elements originally in arr[0 .. i-1], but in sorted order.',
      initialization: 'Before the first iteration (i = 1), the subarray arr[0 .. 0] contains only one element, which is trivially sorted.',
      maintenance: 'The body of the for loop extracts key = arr[i] and moves elements arr[i-1], arr[i-2], ... that are greater than key to the right by one position until finding the correct position for key at arr[j+1]. Inserting key into arr[j+1] yields a sorted subarray arr[0 .. i] containing the original elements of arr[0 .. i].',
      termination: 'The loop terminates when i = n. Substituting n for i, the subarray arr[0 .. n-1] consists of the original elements of the array in sorted order.',
      conclusion: 'By induction on loop invariants, Insertion Sort is provably correct.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(n)',
      explanation: 'When the array is already sorted, the while loop condition arr[j] > key fails on the very first comparison for every i, leading to n-1 comparisons and 0 shifts.',
      condition: 'Already sorted array.',
    },
    averageCase: {
      complexity: 'O(n²)',
      explanation: 'On random data, each element is compared with half of the elements in the sorted prefix on average, resulting in ~n²/4 comparisons and shifts.',
      condition: 'Randomly permuted array.',
    },
    worstCase: {
      complexity: 'O(n²)',
      explanation: 'Occurs on reverse-sorted input where each key must be compared and shifted past all elements in the sorted prefix (n(n-1)/2 operations).',
      condition: 'Reverse sorted array.',
    },
    auxiliarySpace: {
      complexity: 'O(1)',
      explanation: 'Operates in-place; requires only scalar key and index pointers.',
    },
    totalMemory: 'O(n) for the input array.',
    bigOExplanation: 'Runtime is Theta(n + d), where d is the number of inversions. When d = O(n), runtime is linear.',
    scalingBehavior: 'For random arrays, doubling n increases time by 4x. For nearly sorted arrays with few inversions, time scales linearly with n.',
  },

  advantagesAndLimitations: {
    strengths: [
      'Fastest sorting algorithm for small arrays (n <= 32).',
      'Adaptive linear O(n) performance on nearly sorted data.',
      'Stable sorting preserving equal elements.',
      'Online: can sort data as it is received.',
    ],
    limitations: [
      'O(n²) time makes it unusable for large unsorted lists.',
      'Elements only shift one position at a time (Shellsort addresses this).',
    ],
    memoryTradeOffs: ['Zero auxiliary memory overhead.'],
    poorChoiceScenarios: ['Large randomly ordered datasets.', 'Reverse-sorted large datasets.'],
  },

  comparisons: [
    {
      algorithm: 'Bubble Sort',
      timeComplexity: 'Best: O(n), Avg/Worst: O(n²)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Stable, In-Place',
      similarities: 'Both are stable, in-place, and adaptive O(n) on sorted data.',
      differences: 'Insertion Sort shifts elements instead of swapping pairs, executing ~3x fewer operations.',
      whenToPreferThis: 'Virtually always prefer Insertion Sort over Bubble Sort in practical code.',
      whenToPreferAlternative: 'Never prefer Bubble Sort over Insertion Sort in production.',
    },
    {
      algorithm: 'Quick Sort',
      timeComplexity: 'Best/Avg: O(n log n), Worst: O(n²)',
      spaceComplexity: 'O(log n)',
      stabilityOrType: 'Unstable, In-Place',
      similarities: 'Both are in-place.',
      differences: 'Quick Sort is O(n log n) and unstable; Insertion Sort is O(n²) and stable.',
      whenToPreferThis: 'When n <= 32 or data is nearly sorted.',
      whenToPreferAlternative: 'When n > 50.',
    },
  ],

  commonMistakes: [
    {
      title: 'Breaking Stability with Non-Strict Inequality',
      misconception: 'Writing arr[j] >= key in the while loop.',
      badCodeOrApproach: 'while (j >= 0 && arr[j] >= key)',
      correctApproach: 'Use strict arr[j] > key so equal elements are not shifted past each other.',
    },
    {
      title: 'Index Out-of-Bounds on j',
      misconception: 'Checking arr[j] > key before checking j >= 0.',
      badCodeOrApproach: 'while (arr[j] > key && j >= 0)',
      correctApproach: 'Check j >= 0 first to take advantage of short-circuit evaluation: while (j >= 0 && arr[j] > key).',
    },
  ],

  exercises: [
    {
      id: 'is-ex-1',
      type: 'step-tracing',
      question: 'What is the array state after inserting key=3 into prefix [2, 5, 8]?',
      options: ['[2, 3, 5, 8]', '[3, 2, 5, 8]', '[2, 5, 3, 8]', '[2, 5, 8, 3]'],
      correctIndex: 0,
      explanation: 'key=3 is compared with 8 (shifts right), then 5 (shifts right), then 2 (2 <= 3, stops). 3 is inserted into index 1, yielding [2, 3, 5, 8].',
    },
  ],

  summary: {
    coreIdea: 'Insertion Sort builds a sorted array incrementally by taking the next element and shifting larger elements in the sorted prefix to the right until finding its proper slot.',
    keyConditions: [
      'Strict inequality (arr[j] > key) guarantees stability.',
      'O(n) best-case makes it ideal for nearly-sorted data.',
      'Used as the base case for Timsort and Introsort for n <= 32.',
    ],
    complexitySummary: {
      time: 'Best: O(n), Average: O(n²), Worst: O(n²)',
      space: 'O(1) auxiliary memory',
    },
    whenToUse: 'On small arrays (n <= 32) and datasets with very few inverted pairs.',
    prerequisites: ['While loops', 'Array shifting', 'Indices'],
    nextSteps: [
      { id: 'merge-sort', name: 'Merge Sort', reason: 'Discover how divide-and-conquer achieves guaranteed O(n log n) worst-case time.' },
      { id: 'quick-sort', name: 'Quick Sort', reason: 'Learn in-place O(n log n) sorting via recursive partitioning.' },
    ],
  },
};

// ============================================================================
// 4. MERGE SORT LESSON
// ============================================================================
export const mergeSortLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A divide-and-conquer, comparison-based sorting algorithm that recursively splits an array into halves, sorts them, and merges the sorted halves in linear time, guaranteeing O(n log n) performance.',
  mainPurpose: 'To guarantee optimal O(n log n) time complexity in all cases while maintaining sorting stability.',
  whatIsIt: {
    overview: 'Merge Sort is a textbook example of the divide-and-conquer paradigm invented by John von Neumann in 1945. It divides the array in half repeatedly until each subproblem contains a single element (which is trivially sorted). Then, it systematically merges pairs of sorted subarrays back together into a single sorted array by comparing their front elements.',
    smallExample: 'For [38, 27, 43, 3, 9, 82, 10]: Split into [38, 27, 43] and [3, 9, 82, 10]. Recurse down until single items [38], [27], etc. Merge [38] and [27] -> [27, 38]. Merge [27, 38] with [43] -> [27, 38, 43]. Merge [3, 9] with [10, 82] -> [3, 9, 10, 82]. Finally, merge [27, 38, 43] and [3, 9, 10, 82] -> [3, 9, 10, 27, 38, 43, 82].',
  },
  whyUseIt: {
    problemSolved: 'Guarantees worst-case O(n log n) time and stable sorting, overcoming the quadratic worst cases of Bubble, Selection, and Quick sort.',
    whyItMatters: 'Essential for sorting linked lists (which require no extra memory for merging) and massive datasets that do not fit in RAM (External Merge Sort).',
    whenToUse: [
      'When guaranteed worst-case O(n log n) runtime is required.',
      'When stability must be preserved on large datasets.',
      'External sorting on disk drives or tape storage.',
      'Sorting linked lists, where merging is done in-place without auxiliary array allocation.',
    ],
    whenToAvoid: [
      'Memory-constrained systems where O(n) auxiliary memory overhead cannot be tolerated.',
      'Small arrays (n <= 32) where the overhead of recursion makes Insertion Sort faster.',
    ],
  },
  realWorldApplications: [
    {
      title: 'External Multi-Way Merge Sort',
      description: 'Standard algorithm used by database management systems (PostgreSQL, Oracle, MySQL) when sorting tables too large to fit in RAM.',
      educationalVsProductionNote: 'High-volume production standard in all relational database query engines for large ORDER BY queries.',
    },
    {
      title: 'Timsort Subarray Merging',
      description: 'Python and Java standard libraries use an adaptive variant of Merge Sort (Timsort) as their primary sorting engine.',
      educationalVsProductionNote: 'Direct production standard for general-purpose high-level programming language runtimes.',
    },
    {
      title: 'E-Commerce and Financial Ledger Sorting',
      description: 'Used whenever transactional records must be sorted by price or date while strictly preserving the initial time order of equal entries (stability).',
      educationalVsProductionNote: 'Industry requirement in financial accounting systems where duplicate timestamp ordering matters.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Divide',
      description: 'Calculate mid = floor((left + right) / 2) to divide the current subarray into two halves: A[left..mid] and A[mid+1..right].',
    },
    {
      stepNumber: 2,
      title: 'Conquer (Recursive Calls)',
      description: 'Recursively call mergeSort on the left half and right half until reaching the base case of length 1.',
    },
    {
      stepNumber: 3,
      title: 'Combine (Merge)',
      description: 'Merge the two sorted halves into a temporary auxiliary buffer by repeatedly choosing the smaller of the two front elements.',
    },
    {
      stepNumber: 4,
      title: 'Copy Back',
      description: 'Copy the merged elements from the temporary buffer back into the original array partition.',
    },
  ],
  workedExample: {
    datasetDescription: 'Unsorted array of 4 distinct integers [7, 4, 6, 2]',
    initialState: '[7, 4, 6, 2]',
    steps: [
      {
        stepNumber: 1,
        operation: 'Split [7, 4, 6, 2] into Left [7, 4] and Right [6, 2]',
        stateDisplay: '[7, 4 | 6, 2]',
        explanation: 'mid = 1. Subarray divided into left half A[0..1] and right half A[2..3].',
        whyNecessary: 'Divide step splits problem into two subproblems of size n/2 = 2.',
        beforeState: '[7, 4, 6, 2]',
        afterState: '[7, 4 | 6, 2]',
        nextAction: 'Recurse on left subarray [7, 4].',
        intermediateResult: 'Left: [7, 4], Right: [6, 2].',
      },
      {
        stepNumber: 2,
        operation: 'Split [7, 4] into [7] and [4], then Merge',
        stateDisplay: '[4, 7 | 6, 2]',
        explanation: 'Base cases [7] and [4] reached. Merge them: compare 7 and 4; 4 is smaller, then 7. Left half sorted into [4, 7].',
        whyNecessary: 'Combines two 1-element arrays into a sorted 2-element array.',
        beforeState: '[7, 4 | 6, 2]',
        afterState: '[4, 7 | 6, 2]',
        nextAction: 'Recurse on right subarray [6, 2].',
        intermediateResult: 'Left half sorted: [4, 7].',
      },
      {
        stepNumber: 3,
        operation: 'Split [6, 2] into [6] and [2], then Merge',
        stateDisplay: '[4, 7 | 2, 6]',
        explanation: 'Base cases [6] and [2] reached. Merge them: compare 6 and 2; 2 is smaller, then 6. Right half sorted into [2, 6].',
        whyNecessary: 'Combines two 1-element arrays into a sorted 2-element array.',
        beforeState: '[4, 7 | 6, 2]',
        afterState: '[4, 7 | 2, 6]',
        nextAction: 'Final Merge of sorted halves [4, 7] and [2, 6].',
        intermediateResult: 'Both halves sorted: Left=[4, 7], Right=[2, 6].',
      },
      {
        stepNumber: 4,
        operation: 'Final Merge of [4, 7] and [2, 6]',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'Compare 4 and 2 -> pick 2. Compare 4 and 6 -> pick 4. Compare 7 and 6 -> pick 6. Append remaining 7. Result: [2, 4, 6, 7].',
        whyNecessary: 'Two sorted halves are merged into a fully sorted array in O(n) linear time.',
        beforeState: '[4, 7 | 2, 6]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Algorithm completes.',
        intermediateResult: 'Fully sorted array [2, 4, 6, 7].',
      },
    ],
    finalState: '[2, 4, 6, 7]',
  },
  advantages: [
    'Guaranteed O(n log n) time complexity across all inputs (best, average, and worst).',
    'Stable sorting: never alters relative order of duplicate items.',
    'Ideal for linked lists (O(1) auxiliary space without random access requirement).',
    'Easily parallelizable and extensible to external disk sorting.',
  ],
  limitations: [
    'Requires O(n) auxiliary memory for the temporary merge buffer.',
    'Slower than Quick Sort in practice on average due to cache misses and array copying.',
    'Recursive call overhead on small arrays.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(n log n). The recursion tree has log₂(n) levels and every level performs O(n) merge work.',
    averageCaseMeaning: 'O(n log n). Independent of initial element arrangement; divides in half at each level.',
    worstCaseMeaning: 'O(n log n). Even on reverse-sorted or duplicate-heavy data, it splits evenly into halves.',
    spaceComplexityMeaning: 'O(n) auxiliary space to hold the temporary buffer during merging, plus O(log n) call stack space.',
  },
  relatedAlgorithms: [
    {
      name: 'Quick Sort',
      comparison: 'Quick Sort is faster in practice and uses O(log n) space, but has an O(n²) worst case and is unstable. Merge Sort guarantees O(n log n) and stability at the cost of O(n) memory.',
    },
    {
      name: 'Heap Sort',
      comparison: 'Heap Sort also achieves guaranteed O(n log n) and runs in O(1) space, but is unstable and has poor cache locality compared to Merge Sort.',
    },
  ],
  quiz: [
    {
      question: 'What is the recurrence relation that models the runtime of Merge Sort on an array of size n?',
      options: ['T(n) = T(n - 1) + O(n)', 'T(n) = 2T(n / 2) + O(n)', 'T(n) = 2T(n / 2) + O(1)', 'T(n) = T(n / 2) + O(n)'],
      correctIndex: 1,
      explanation: 'The array is divided into 2 subproblems of size n/2 (2T(n/2)), and the merge step takes linear O(n) time to combine them.',
    },
    {
      question: 'Why does standard array-based Merge Sort require O(n) auxiliary space?',
      options: [
        'To store the recursion call stack.',
        'Because merging two sorted subarrays in linear time requires an auxiliary buffer to hold elements without overwriting.',
        'Because it creates a binary tree data structure.',
        'It does not require O(n) space; it is in-place.',
      ],
      correctIndex: 1,
      explanation: 'When merging two adjacent sorted subarrays A[left..mid] and A[mid+1..right], writing directly back into A would overwrite unmerged elements, necessitating a temporary buffer of size up to n.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Merge Sort is named for its core operation: "merging" two sorted lists into one combined sorted list in a single linear pass.',
    problemSolved: 'Sorts any comparable collection in guaranteed O(n log n) time while maintaining stability.',
    problemNotSolved: 'Does not achieve in-place sorting on standard arrays without significant overhead.',
    whyLearn: 'It is the quintessential divide-and-conquer algorithm and the standard proof for the Master Theorem ($T(n) = 2T(n/2) + O(n)$).',
    prerequisites: ['Recursion and base cases', 'Divide and conquer', 'Two-pointer technique', 'Recurrence relations'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Sort an array of size n with a strict guarantee that execution never degrades to O(n²), while ensuring duplicate elements maintain their original order.',
    naiveApproachInefficiency: 'Quadratic sorts degrade to hours or days on millions of records. Quick Sort can degrade to O(n²) on adverse pivot choices.',
    coreIdeaUsed: 'Two sorted lists can be merged into one sorted list in linear time O(n) using two pointers. Recursively splitting achieves depth log₂(n).',
    utilityExplanation: 'log₂(n) levels * O(n) work per level = strictly O(n log n) total operations.',
    workingConditions: ['Input elements must be comparable.', 'Available memory must accommodate an extra O(n) buffer.'],
    whenAnotherIsBetter: 'When memory is strictly limited to O(1) in-place, Heap Sort is preferred. When average speed on in-memory arrays is paramount, Quick Sort is preferred.',
    analogyOrRealLifeExample: 'Two stacks of student exam papers already sorted alphabetically. To combine them, you only compare the top papers of each stack, place the earlier name face down in a new pile, and repeat. You never need to look deeper into the stacks.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of n comparable elements.',
    expectedOutput: 'A new or permuted array sorted in non-decreasing order.',
    constraints: 'n >= 0. Requires enough RAM to allocate an auxiliary array of size n.',
    preconditions: 'None.',
    specialCases: ['Empty or 1-element array returns immediately.', 'All duplicate elements: stability is preserved.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If comparison logic is inconsistent, subarrays will not merge properly.',
  },

  coreIntuition: {
    simpleExplanation: 'Split the list in half, sort each half by calling yourself, and then zip the two sorted halves together by repeatedly taking the smaller of the two front items.',
    keyDrivingDecision: 'During the merge, compare the front of the left list and front of the right list: if left <= right, take left; else take right.',
    whyRepeatedOperationWorks: 'Base case of 1 element is already sorted. The merge step preserves sortedness inductively. Since recursion depth is log₂(n), all elements are combined into a single sorted array in O(n log n) total time.',
    paradigmSpecificDetail: 'Divide and conquer: splitting is O(1), recursion does 2T(n/2), merging is O(n).',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure mergeSort(A, left, right)',
      '  if left >= right then return',
      '  mid := floor((left + right) / 2)',
      '  mergeSort(A, left, mid)',
      '  mergeSort(A, mid + 1, right)',
      '  merge(A, left, mid, right)',
      'end procedure',
      '',
      'procedure merge(A, left, mid, right)',
      '  create temp array of size (right - left + 1)',
      '  i := left, j := mid + 1, k := 0',
      '  while i <= mid and j <= right do',
      '    if A[i] <= A[j] then temp[k++] := A[i++]',
      '    else temp[k++] := A[j++]',
      '  end while',
      '  copy remaining from A[i..mid] or A[j..right] to temp',
      '  copy temp back to A[left..right]',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'if left >= right then return', explanation: 'Base case: subarray of 0 or 1 element is already sorted.' },
      { lineIndex: 2, lineText: 'mid := floor((left + right) / 2)', explanation: 'Find dividing midpoint.' },
      { lineIndex: 3, lineText: 'mergeSort(A, left, mid)', explanation: 'Recursively sort the left half.' },
      { lineIndex: 4, lineText: 'mergeSort(A, mid + 1, right)', explanation: 'Recursively sort the right half.' },
      { lineIndex: 5, lineText: 'merge(A, left, mid, right)', explanation: 'Merge two sorted halves in linear time.' },
      { lineIndex: 12, lineText: 'if A[i] <= A[j] then ...', explanation: '<= condition guarantees stability by taking left item first on equal keys.' },
    ],
    terminationCondition: 'Recursion halts when left >= right. The merge step halts when both halves are fully traversed.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function mergeSort<T>(arr: T[]): T[] {
  if (arr.length <= 1) return arr;

  function merge(leftArr: T[], rightArr: T[]): T[] {
    const result: T[] = [];
    let i = 0;
    let j = 0;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        result.push(leftArr[i]);
        i++;
      } else {
        result.push(rightArr[j]);
        j++;
      }
    }
    return result.concat(leftArr.slice(i)).concat(rightArr.slice(j));
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}`,
    signature: 'function mergeSort<T>(arr: T[]): T[]',
    inputValidation: 'Base case returns array if length <= 1.',
    variables: [
      { name: 'mid', type: 'number', purpose: 'Split point dividing array in half.' },
      { name: 'left', type: 'T[]', purpose: 'Recursively sorted left half.' },
      { name: 'right', type: 'T[]', purpose: 'Recursively sorted right half.' },
      { name: 'i, j', type: 'number', purpose: 'Pointers advancing through left and right subarrays during merge.' },
      { name: 'result', type: 'T[]', purpose: 'Temporary merged output buffer.' },
    ],
    lineByLine: [
      { line: 2, code: 'if (arr.length <= 1) return arr;', explanation: 'Base case.' },
      { line: 19, code: 'const mid = Math.floor(arr.length / 2);', explanation: 'Divide.' },
      { line: 20, code: 'const left = mergeSort(arr.slice(0, mid));', explanation: 'Conquer left.' },
      { line: 21, code: 'const right = mergeSort(arr.slice(mid));', explanation: 'Conquer right.' },
      { line: 23, code: 'return merge(left, right);', explanation: 'Combine.' },
    ],
    returnExplanation: 'Returns a new sorted array containing all elements in non-decreasing order.',
    commonBugs: [
      'Using leftArr[i] < rightArr[j] instead of <=, which breaks stability.',
      'Integer overflow in (left + right) / 2 in languages with fixed integer sizes (use left + (right - left) / 2).',
      'Forgetting to copy remaining elements after the main merge loop terminates.',
    ],
    edgeCaseHandling: ['Empty array and single element arrays return immediately without recursive splitting.'],
  },

  correctness: {
    intuitiveExplanation: 'Base cases of 1 element are trivially sorted. The merge subroutine takes two sorted lists and systematically selects the smallest unmerged element at each step, yielding a sorted combined list. By induction, the entire array is sorted.',
    formalProof: {
      method: 'Induction',
      invariantOrClaim: 'mergeSort(A, left, right) correctly sorts A[left..right].',
      initialization: 'Base case: If left >= right, the subarray has 0 or 1 element and is sorted by definition.',
      maintenance: 'Inductive step: Assume mergeSort correctly sorts any subarray of length < k. For length k, mid divides the array into lengths floor(k/2) and ceil(k/2), both < k. By hypothesis, left and right halves are sorted correctly. The merge function preserves loop invariant that result contains min elements in order. Thus A[left..right] is sorted.',
      termination: 'Every recursive call strictly halves the subarray length, ensuring termination at length 1 in exactly ceil(log₂ n) levels.',
      conclusion: 'By structural induction on divide-and-conquer, Merge Sort is provably correct.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(n log n)',
      explanation: 'Array is still halved log₂(n) times and every level performs O(n) comparisons.',
      condition: 'Already sorted array.',
    },
    averageCase: {
      complexity: 'O(n log n)',
      explanation: 'Recurrence T(n) = 2T(n/2) + O(n). By Master Theorem (Case 2), T(n) = Theta(n log n).',
      condition: 'Randomly permuted input.',
    },
    worstCase: {
      complexity: 'O(n log n)',
      explanation: 'Identical tree structure regardless of input values.',
      condition: 'Reverse sorted or adversary input.',
    },
    auxiliarySpace: {
      complexity: 'O(n)',
      explanation: 'Requires an auxiliary buffer of size n for merging plus O(log n) call stack frames.',
    },
    totalMemory: 'O(n) auxiliary + O(n) input = 2n memory footprint.',
    bigOExplanation: 'Merge Sort is Theta(n log n) in all cases: best, average, and worst.',
    scalingBehavior: 'Extremely scalable: sorting 10 million items takes only ~24 * 10 million comparisons.',
  },

  advantagesAndLimitations: {
    strengths: [
      'Guaranteed O(n log n) runtime without any worst-case pitfalls.',
      'Stable sorting algorithm.',
      'Optimal for linked lists and external disk-based sorting.',
    ],
    limitations: [
      'Requires O(n) extra memory for arrays.',
      'Larger constant factor than Quick Sort due to copying data between arrays.',
    ],
    memoryTradeOffs: ['Trades O(n) extra RAM for guaranteed O(n log n) worst-case time and stability.'],
    poorChoiceScenarios: ['Memory-constrained embedded systems.', 'Small arrays where Insertion Sort is faster.'],
  },

  comparisons: [
    {
      algorithm: 'Quick Sort',
      timeComplexity: 'Best/Avg: O(n log n), Worst: O(n²)',
      spaceComplexity: 'O(log n)',
      stabilityOrType: 'Unstable, In-Place',
      similarities: 'Both are divide-and-conquer comparison sorts.',
      differences: 'Quick Sort partitions first and merges for free; Merge Sort splits for free and merges with work. Quick Sort is in-place and faster in RAM, but unstable with O(n²) worst case.',
      whenToPreferThis: 'When stability or worst-case O(n log n) guarantee is strictly required.',
      whenToPreferAlternative: 'For general-purpose in-memory sorting where average speed and low memory usage dominate.',
    },
    {
      algorithm: 'Heap Sort',
      timeComplexity: 'Best/Avg/Worst: O(n log n)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Unstable, In-Place',
      similarities: 'Both guarantee O(n log n) worst case.',
      differences: 'Heap Sort is in-place (O(1) space) but unstable; Merge Sort requires O(n) space but is stable.',
      whenToPreferThis: 'When stability is needed.',
      whenToPreferAlternative: 'When O(1) auxiliary memory is required.',
    },
  ],

  commonMistakes: [
    {
      title: 'Breaking Stability in Merge Condition',
      misconception: 'Writing leftArr[i] < rightArr[j] instead of <=.',
      badCodeOrApproach: 'if (leftArr[i] < rightArr[j]) ...',
      correctApproach: 'Use <= so that on equal keys, the element from the left subarray is selected first, preserving input order.',
    },
    {
      title: 'Integer Overflow on Midpoint',
      misconception: 'Computing (left + right) / 2.',
      badCodeOrApproach: 'const mid = (left + right) / 2;',
      correctApproach: 'Use left + Math.floor((right - left) / 2) to prevent potential 32-bit integer overflow.',
    },
  ],

  exercises: [
    {
      id: 'ms-ex-1',
      type: 'conceptual',
      question: 'How many total recursive levels are created when Merge Sort runs on an array of 64 elements?',
      options: ['6 levels (log₂ 64)', '8 levels', '32 levels', '64 levels'],
      correctIndex: 0,
      explanation: 'At each level the array is divided by 2: 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1. Total levels = log₂(64) = 6.',
    },
  ],

  summary: {
    coreIdea: 'Merge Sort recursively halves the array until base cases of size 1 are reached, then merges sorted subarrays back together in linear O(n) time, guaranteeing O(n log n) total time.',
    keyConditions: [
      'Recurrence T(n) = 2T(n/2) + O(n) = O(n log n).',
      'Requires O(n) auxiliary memory for buffer merging.',
      'Comparison <= ensures sorting stability.',
    ],
    complexitySummary: {
      time: 'Best: O(n log n), Average: O(n log n), Worst: O(n log n)',
      space: 'O(n) auxiliary memory',
    },
    whenToUse: 'When stability is required, worst-case O(n log n) must be guaranteed, or data resides on external disk storage.',
    prerequisites: ['Divide and conquer', 'Recursion', 'Two pointers'],
    nextSteps: [
      { id: 'quick-sort', name: 'Quick Sort', reason: 'Learn an in-place divide-and-conquer sorting algorithm that avoids O(n) extra memory.' },
      { id: 'heap-sort', name: 'Heap Sort', reason: 'Study how a binary heap achieves guaranteed O(n log n) in-place without recursion.' },
    ],
  },
};

// ============================================================================
// 5. QUICK SORT LESSON
// ============================================================================
export const quickSortLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A highly efficient, in-place, divide-and-conquer sorting algorithm that partitions an array around a chosen pivot element so that smaller elements are moved to its left and larger elements to its right.',
  mainPurpose: 'To provide the fastest general-purpose in-memory sorting performance with minimal O(log n) call stack space.',
  whatIsIt: {
    overview: 'Invented by Tony Hoare in 1959, Quick Sort works by choosing a "pivot" element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. The pivot is guaranteed to be in its permanent, final sorted position after the partition step.',
    smallExample: 'For [10, 80, 30, 90, 40, 50, 70] with pivot 70: Partitioning rearranges elements so all numbers < 70 ([10, 30, 40, 50]) are on the left and numbers > 70 ([80, 90]) are on the right, placing 70 at its exact sorted index. Recursing on the left and right halves sorts the entire list.',
  },
  whyUseIt: {
    problemSolved: 'Sorts large arrays faster than almost any other comparison sort in real-world computer hardware due to exceptional cache locality and in-place partitioning.',
    whyItMatters: 'It is the default sorting algorithm or core component of the C standard library (qsort) and C++ STL (std::sort inside Introsort).',
    whenToUse: [
      'General-purpose in-memory sorting of large datasets where speed is critical.',
      'Systems where auxiliary memory is restricted (uses O(log n) stack space vs Merge Sort O(n)).',
      'When hardware cache locality provides a major speed advantage over other algorithms.',
    ],
    whenToAvoid: [
      'When stability must be maintained (Quick Sort is inherently unstable).',
      'Mission-critical real-time systems where O(n²) worst-case latency is unacceptable (use Heap Sort or Introsort).',
      'Singly-linked lists where random access partitioning is inefficient.',
    ],
  },
  realWorldApplications: [
    {
      title: 'C/C++ Standard Libraries (qsort, std::sort)',
      description: 'Used as the foundational sorting algorithm in the C standard library qsort() and C++ Introsort (which falls back to Heap Sort if recursion exceeds 2*log(n)).',
      educationalVsProductionNote: 'Universal production standard across compiled systems programming languages.',
    },
    {
      title: 'V8 JavaScript Engine (Numeric Sorts)',
      description: 'Historically and currently used inside browser JavaScript runtimes for in-memory sorting of primitive arrays.',
      educationalVsProductionNote: 'High-volume production standard in browser engines.',
    },
    {
      title: 'Operating System Kernel Scheduling',
      description: 'Used inside kernel routines for sorting process priority queues and memory address allocations.',
      educationalVsProductionNote: 'Critical production use in operating system internals.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Pivot Selection',
      description: 'Pick an element to act as the pivot (common strategies: last element, first element, random element, or median-of-three).',
    },
    {
      stepNumber: 2,
      title: 'Partitioning',
      description: 'Rearrange the array so that all elements smaller than the pivot move to its left, and all elements larger move to its right. Place the pivot between them.',
    },
    {
      stepNumber: 3,
      title: 'Recursion on Left Subarray',
      description: 'Recursively apply Quick Sort to the subarray of elements to the left of the pivot.',
    },
    {
      stepNumber: 4,
      title: 'Recursion on Right Subarray',
      description: 'Recursively apply Quick Sort to the subarray of elements to the right of the pivot.',
    },
    {
      stepNumber: 5,
      title: 'Base Case Termination',
      description: 'When a subarray has 0 or 1 element, it is already sorted and recursion returns immediately.',
    },
  ],
  workedExample: {
    datasetDescription: 'Unsorted array of 4 distinct integers [7, 4, 6, 2] using Lomuto partition (last element as pivot)',
    initialState: '[7, 4, 6, 2]',
    steps: [
      {
        stepNumber: 1,
        operation: 'Partition [7, 4, 6, 2] with pivot = 2 (index 3)',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'Scan elements: 7 > 2 (skip), 4 > 2 (skip), 6 > 2 (skip). No elements are smaller than 2. Swap pivot 2 with A[0]=7. Pivot 2 is now finalized at index 0.',
        whyNecessary: '2 is the global minimum; partitioning moves it to index 0, where it is permanently fixed.',
        beforeState: '[7, 4, 6, 2]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Pivot at 0. Left subarray is empty. Recurse on right subarray A[1..3] = [4, 6, 7].',
        intermediateResult: 'Pivot 2 finalized at index 0.',
      },
      {
        stepNumber: 2,
        operation: 'Partition right subarray [4, 6, 7] with pivot = 7 (index 3)',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'Scan [4, 6]: 4 < 7 (keep at index 1), 6 < 7 (keep at index 2). Swap pivot 7 with A[3]=7 (self swap). Pivot 7 is finalized at index 3.',
        whyNecessary: 'All elements 4 and 6 are smaller than 7, so 7 belongs at index 3.',
        beforeState: '[2, 4, 6, 7]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Recurse on left subarray of 7, which is A[1..2] = [4, 6].',
        intermediateResult: 'Pivot 7 finalized at index 3.',
      },
      {
        stepNumber: 3,
        operation: 'Partition [4, 6] with pivot = 6 (index 2)',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'Scan [4]: 4 < 6. Pivot 6 stays at index 2. Left side has [4] (size 1, base case). Entire array is sorted.',
        whyNecessary: 'Places 6 at index 2 and leaves 4 at index 1.',
        beforeState: '[2, 4, 6, 7]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Base cases reached; algorithm terminates.',
        intermediateResult: 'Fully sorted array [2, 4, 6, 7].',
      },
    ],
    finalState: '[2, 4, 6, 7]',
  },
  advantages: [
    'Fastest general-purpose comparison sort in practice due to tight inner loops and cache locality.',
    'Sorts in-place with only O(log n) auxiliary stack space.',
    'No auxiliary memory allocation needed (unlike Merge Sort).',
    'Easily parallelized and optimized with median-of-three and 3-way partitioning.',
  ],
  limitations: [
    'Worst-case time complexity is O(n²) if pivot choices are consistently poor (e.g. sorted input with end pivot).',
    'Unstable sorting algorithm: non-adjacent swaps across the pivot disrupt equal keys.',
    'Worst-case call stack depth can reach O(n).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(n log n). Occurs when the pivot divides the array into two equal halves at every recursion level (T(n) = 2T(n/2) + O(n)).',
    averageCaseMeaning: 'O(n log n). On random inputs, partitioning produces balanced splits on average (approximately 1.39 n log₂(n) comparisons).',
    worstCaseMeaning: 'O(n²). Occurs when the pivot is always the smallest or largest element, creating an unbalanced split of sizes 0 and n-1 at each step (T(n) = T(n-1) + O(n)).',
    spaceComplexityMeaning: 'O(log n) auxiliary space on average to store recursive call frames on the execution stack. In worst case O(n) stack space without tail-call optimization.',
  },
  relatedAlgorithms: [
    {
      name: 'Merge Sort',
      comparison: 'Merge Sort guarantees O(n log n) worst case and is stable, but requires O(n) extra space. Quick Sort is in-place and ~2x faster in RAM due to cache friendliness.',
    },
    {
      name: 'Heap Sort',
      comparison: 'Heap Sort guarantees O(n log n) and O(1) space, but has worse cache locality than Quick Sort, making Quick Sort substantially faster on real hardware.',
    },
  ],
  quiz: [
    {
      question: 'What causes the worst-case O(n²) time complexity in a standard Quick Sort that always picks the last element as pivot?',
      options: [
        'An array with millions of duplicate elements.',
        'An already sorted or reverse-sorted array where the pivot is always the minimum or maximum, leading to partitions of size 0 and n-1.',
        'An array with random values.',
        'A memory allocation failure.',
      ],
      correctIndex: 1,
      explanation: 'When the pivot is the extremum, one partition has 0 elements and the other has n-1 elements. The recursion tree depth becomes n instead of log₂(n), leading to sum_{i=1}^n i = O(n²) operations.',
    },
    {
      question: 'How does Introsort prevent Quick Sort from degrading to O(n²)?',
      options: [
        'It converts the array to a linked list.',
        'It monitors recursion depth and switches to Heap Sort if the depth exceeds 2 * log₂(n).',
        'It uses Bubble Sort instead.',
        'It ignores duplicate elements.',
      ],
      correctIndex: 1,
      explanation: 'Introsort runs Quick Sort by default for maximum speed, but tracks stack depth. If depth exceeds 2*log₂(n), it automatically switches to Heap Sort to guarantee an O(n log n) worst case.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Quick Sort was named by its creator Tony Hoare because in practical hardware benchmarks, it quickly outpaced all existing sorting routines.',
    problemSolved: 'Rapid in-memory sorting of large comparable arrays in O(n log n) average time.',
    problemNotSolved: 'Does not preserve the relative order of duplicate elements (unstable).',
    whyLearn: 'It is the most practically significant sorting algorithm in computer science and the prototype for randomized and divide-and-conquer analysis.',
    prerequisites: ['Recursion and call stacks', 'In-place array partitioning', 'Divide and conquer', 'Probability and expected value'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Sort a large array of n elements in-place with the fastest practical throughput on modern CPU hardware.',
    naiveApproachInefficiency: 'Merge Sort allocates a duplicate array of size n, which exhausts RAM on large files and causes cache eviction. Heap Sort exhibits scattered memory access patterns.',
    coreIdeaUsed: 'Partitioning: Pick a pivot, move items smaller than pivot to the left, and items greater to the right. The pivot is placed into its exact final sorted position.',
    utilityExplanation: 'Linear memory traversal during partitioning keeps CPU cache lines hot, minimizing memory latency.',
    workingConditions: ['Random access memory.', 'Total order defined on items.'],
    whenAnotherIsBetter: 'When stability is mandatory (use Merge Sort). When worst-case latency must be mathematically bounded to O(n log n) without random pivot overhead (use Heap Sort).',
    analogyOrRealLifeExample: 'Organizing students by height for a class photo: you pick one student (pivot) to stand in place, send all students shorter than them to their left, and all students taller to their right. Then you repeat the process within the left and right groups independently.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of n comparable elements.',
    expectedOutput: 'The same array partitioned and sorted in ascending order.',
    constraints: 'n >= 0. In-place sorting.',
    preconditions: 'None.',
    specialCases: ['Empty or 1-element array returns immediately.', 'Array of all identical elements takes O(n log n) with 3-way partitioning, but O(n²) with naive Lomuto.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'Incomparable values lead to unpredictable pivot placement.',
  },

  coreIntuition: {
    simpleExplanation: 'Choose a pivot number. Move everything smaller than the pivot to the left side and everything larger to the right side. The pivot is now frozen in its perfect sorted spot. Repeat the same trick on the left and right sides.',
    keyDrivingDecision: 'Scan through array with two pointers; swap elements that are on the wrong side of the pivot.',
    whyRepeatedOperationWorks: 'Every partitioning step puts at least one element (the pivot) into its final, permanent sorted location. Recursively doing this on smaller and smaller subarrays eventually finalizes all elements.',
    paradigmSpecificDetail: 'Divide and conquer: Partitioning does all the work (O(n)), and recombination is free (O(1)).',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure quickSort(A, low, high)',
      '  if low < high then',
      '    p := partition(A, low, high)',
      '    quickSort(A, low, p - 1)',
      '    quickSort(A, p + 1, high)',
      '  end if',
      'end procedure',
      '',
      'procedure partition(A, low, high)',
      '  pivot := A[high]',
      '  i := low - 1',
      '  for j from low to high - 1 do',
      '    if A[j] <= pivot then',
      '      i := i + 1',
      '      swap(A[i], A[j])',
      '    end if',
      '  end for',
      '  swap(A[i + 1], A[high])',
      '  return i + 1',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'if low < high then', explanation: 'Base case check: single element or invalid bounds require no sorting.' },
      { lineIndex: 2, lineText: 'p := partition(...)', explanation: 'Rearranges array around pivot; returns pivot final index.' },
      { lineIndex: 3, lineText: 'quickSort(A, low, p - 1)', explanation: 'Recursively sorts the subarray to the left of the pivot.' },
      { lineIndex: 4, lineText: 'quickSort(A, p + 1, high)', explanation: 'Recursively sorts the subarray to the right of the pivot.' },
      { lineIndex: 9, lineText: 'pivot := A[high]', explanation: 'Lomuto scheme chooses last element as pivot.' },
      { lineIndex: 13, lineText: 'swap(A[i], A[j])', explanation: 'Expands the partition of elements smaller than or equal to pivot.' },
      { lineIndex: 16, lineText: 'swap(A[i + 1], A[high])', explanation: 'Places pivot into its permanent sorted index between smaller and larger items.' },
    ],
    terminationCondition: 'Recursion terminates when low >= high.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function quickSort<T>(arr: T[], low = 0, high = arr.length - 1): T[] {
  if (low < high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }

    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    const p = i + 1;

    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
  return arr;
}`,
    signature: 'function quickSort<T>(arr: T[], low = 0, high = arr.length - 1): T[]',
    inputValidation: 'Guarded by low < high check.',
    variables: [
      { name: 'pivot', type: 'T', purpose: 'Reference value around which array is partitioned.' },
      { name: 'i', type: 'number', purpose: 'Boundary index tracking the end of elements <= pivot.' },
      { name: 'j', type: 'number', purpose: 'Scanning index inspecting each element against pivot.' },
      { name: 'p', type: 'number', purpose: 'Finalized index of the pivot element.' },
    ],
    lineByLine: [
      { line: 2, code: 'if (low < high) {', explanation: 'Base case check.' },
      { line: 3, code: 'const pivot = arr[high];', explanation: 'Select pivot.' },
      { line: 4, code: 'let i = low - 1;', explanation: 'Initialize smaller element boundary.' },
      { line: 6, code: 'for (let j = low; j < high; j++) {', explanation: 'Scan partition.' },
      { line: 7, code: 'if (arr[j] <= pivot) { i++; swap... }', explanation: 'Swap smaller element into lower partition.' },
      { line: 15, code: 'swap(arr[i + 1], arr[high]);', explanation: 'Finalize pivot position.' },
      { line: 18, code: 'quickSort(arr, low, p - 1);', explanation: 'Recurse on left.' },
      { line: 19, code: 'quickSort(arr, p + 1, high);', explanation: 'Recurse on right.' },
    ],
    returnExplanation: 'Returns the sorted array mutated in place.',
    commonBugs: [
      'Calling quickSort(arr, low, p) instead of p - 1, causing infinite recursion on 2-element arrays.',
      'Selecting a fixed pivot on sorted arrays, triggering worst-case O(n²) performance.',
      'Stack overflow on large reverse-sorted arrays without tail call optimization.',
    ],
    edgeCaseHandling: ['Empty array and single element arrays return immediately without partitioning.'],
  },

  correctness: {
    intuitiveExplanation: 'Partitioning ensures that the pivot is placed exactly where it belongs, with strictly smaller elements to its left and larger elements to its right. Since the left and right halves are sorted recursively without ever moving across the pivot, the whole array must end up sorted.',
    formalProof: {
      method: 'Induction',
      invariantOrClaim: 'quickSort(A, low, high) correctly sorts the subarray A[low..high].',
      initialization: 'Base case: When low >= high, the subarray contains at most 1 element, which is trivially sorted.',
      maintenance: 'Inductive step: Assume quickSort correctly sorts any subarray of size < k. For a subarray of size k, partition places pivot at index p such that A[x] <= A[p] for all x < p and A[y] >= A[p] for all y > p. The subarrays A[low..p-1] and A[p+1..high] have lengths strictly less than k. By the induction hypothesis, recursive calls sort them correctly. Because all elements left of p are <= A[p] and all right are >= A[p], the combined subarray A[low..high] is sorted.',
      termination: 'Each partition places at least one element (the pivot) in its final position, strictly decreasing the size of remaining subproblems until the base case is reached.',
      conclusion: 'Quick Sort is correct by mathematical induction on array length.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(n log n)',
      explanation: 'Occurs when the partition splits the array into two exactly equal halves at every step: T(n) = 2T(n/2) + O(n) = O(n log n).',
      condition: 'Balanced pivot selections.',
    },
    averageCase: {
      complexity: 'O(n log n)',
      explanation: 'Across all random permutations, the average number of comparisons is 2n ln(n) ≈ 1.39 n log₂(n).',
      condition: 'Randomly shuffled array.',
    },
    worstCase: {
      complexity: 'O(n²)',
      explanation: 'Occurs when the pivot is always the extreme element (minimum or maximum), yielding partitions of sizes 0 and n-1: T(n) = T(n-1) + O(n) = O(n²).',
      condition: 'Already sorted or reverse sorted array with naive endpoint pivot selection.',
    },
    auxiliarySpace: {
      complexity: 'O(log n)',
      explanation: 'Requires call stack memory for recursion. With balanced partitions, stack depth is log₂(n).',
    },
    totalMemory: 'O(n) input array + O(log n) call stack.',
    bigOExplanation: 'Worst case is O(n²), average case is Theta(n log n).',
    scalingBehavior: 'Extremely fast scaling: 100 million elements can be sorted in ~2.5 seconds on modern CPUs.',
  },

  advantagesAndLimitations: {
    strengths: [
      'Fastest in-memory comparison sort on modern computer architectures.',
      'Low memory overhead: in-place sorting requiring only O(log n) stack space.',
      'Excellent CPU cache line utilization.',
    ],
    limitations: [
      'Unstable: equal keys can change relative order during partitioning.',
      'O(n²) worst-case performance if pivot selection is unmitigated.',
    ],
    memoryTradeOffs: ['O(log n) stack space vs Merge Sort O(n) heap memory.'],
    poorChoiceScenarios: ['When sorting stability is required.', 'Real-time hard deadline systems.'],
  },

  comparisons: [
    {
      algorithm: 'Merge Sort',
      timeComplexity: 'Best/Avg/Worst: O(n log n)',
      spaceComplexity: 'O(n)',
      stabilityOrType: 'Stable, Out-of-Place',
      similarities: 'Both are divide-and-conquer.',
      differences: 'Quick Sort is in-place, unstable, and faster in practice; Merge Sort is stable, uses O(n) space, and guarantees O(n log n).',
      whenToPreferThis: 'General in-memory arrays.',
      whenToPreferAlternative: 'Linked lists, stability needs, external sorting.',
    },
    {
      algorithm: 'Heap Sort',
      timeComplexity: 'Best/Avg/Worst: O(n log n)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Unstable, In-Place',
      similarities: 'Both are in-place comparison sorts.',
      differences: 'Heap Sort guarantees O(n log n) in O(1) space, but Quick Sort has significantly better cache locality and is 2x-3x faster on average.',
      whenToPreferThis: 'When average speed is the priority.',
      whenToPreferAlternative: 'When strict worst-case latency guarantee is required in O(1) memory.',
    },
  ],

  commonMistakes: [
    {
      title: 'Including the Pivot in Recursive Subarrays',
      misconception: 'Calling quickSort(arr, low, p) instead of p - 1.',
      badCodeOrApproach: 'quickSort(arr, low, p); quickSort(arr, p + 1, high);',
      correctApproach: 'Exclude the pivot because it is already sorted: quickSort(arr, low, p - 1); quickSort(arr, p + 1, high);',
    },
    {
      title: 'Using Naive Pivot on Already-Sorted Data',
      misconception: 'Always choosing arr[0] or arr[high].',
      badCodeOrApproach: 'const pivot = arr[high]; on pre-sorted array.',
      correctApproach: 'Use randomized pivot or median-of-three to avoid O(n²) worst-case.',
    },
  ],

  exercises: [
    {
      id: 'qs-ex-1',
      type: 'conceptual',
      question: 'Where is the pivot element guaranteed to be after the partition subroutine finishes?',
      options: [
        'At the very beginning of the array.',
        'At its final, permanent sorted position in the overall array.',
        'At the very end of the array.',
        'It is discarded.',
      ],
      correctIndex: 1,
      explanation: 'The fundamental invariant of partitioning is that the pivot is placed between elements smaller than it and elements greater than it, which is its exact final position.',
    },
  ],

  summary: {
    coreIdea: 'Quick Sort partitions the array around a pivot such that smaller elements move left and larger move right, fixing the pivot in its final position, and recurses on both halves.',
    keyConditions: [
      'Average runtime is O(n log n); worst case is O(n²).',
      'In-place with O(log n) stack memory.',
      'Unstable comparison sort.',
    ],
    complexitySummary: {
      time: 'Best: O(n log n), Average: O(n log n), Worst: O(n²)',
      space: 'O(log n) auxiliary stack space',
    },
    whenToUse: 'General-purpose in-memory sorting of large datasets when stability is not needed.',
    prerequisites: ['Recursion', 'Partitioning', 'In-place swapping'],
    nextSteps: [
      { id: 'heap-sort', name: 'Heap Sort', reason: 'Master a sort that achieves guaranteed O(n log n) with strict O(1) space.' },
    ],
  },
};

// ============================================================================
// 6. HEAP SORT LESSON
// ============================================================================
export const heapSortLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'An efficient, in-place, comparison-based sorting algorithm that organizes array elements into a binary max-heap and repeatedly extracts the maximum root element to the end of the array.',
  mainPurpose: 'To guarantee O(n log n) worst-case time complexity while using strictly O(1) auxiliary space without recursion overhead.',
  whatIsIt: {
    overview: 'Heap Sort combines the best aspects of Selection Sort and Merge Sort. Like Selection Sort, it finds the maximum element and moves it to the end. But instead of doing an O(n) linear scan, it uses a complete binary tree structured as a Max-Heap where the maximum element is always at the root (index 0). Extracting the maximum and restoring the heap property takes only O(log n) time.',
    smallExample: 'For [4, 10, 3, 5, 1]: First, build a max-heap -> [10, 5, 3, 4, 1]. Swap root 10 with last element 1 -> [1, 5, 3, 4 | 10]. Heapify root -> [5, 4, 3, 1 | 10]. Swap root 5 with 1 -> [1, 4, 3 | 5, 10]. Heapify root -> [4, 1, 3 | 5, 10]. Continue until fully sorted -> [1, 3, 4, 5, 10].',
  },
  whyUseIt: {
    problemSolved: 'Sorts large datasets with guaranteed O(n log n) worst-case performance using strictly O(1) auxiliary memory.',
    whyItMatters: 'Essential in mission-critical embedded systems and Linux kernel routines where memory allocation failure is intolerable and quadratic worst cases cannot be risked.',
    whenToUse: [
      'Systems with strict memory constraints where O(n) extra space of Merge Sort cannot be allocated.',
      'Mission-critical real-time applications requiring guaranteed O(n log n) without worst-case degradation.',
      'Embedded devices without reliable stack memory for recursion.',
    ],
    whenToAvoid: [
      'When stability is required (Heap Sort is unstable).',
      'Applications where maximum cache locality is needed (Quick Sort is faster in RAM).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Linux Kernel Priority Sorting',
      description: 'Used inside the Linux kernel scheduler and memory manager where heap allocations are forbidden and stack depth must be tightly bounded.',
      educationalVsProductionNote: 'Direct production standard inside OS kernel core code.',
    },
    {
      title: 'Introsort Safety Fallback',
      description: 'C++ std::sort switches to Heap Sort when Quick Sort recursion exceeds 2*log(n) depth, ensuring worst-case O(n log n).',
      educationalVsProductionNote: 'Universal production standard in the C++ standard template library.',
    },
    {
      title: 'Top-K Stream Filtering (Priority Queues)',
      description: 'Maintaining a heap allows finding the K largest elements from a stream of billions of items in O(n log K) time with O(K) memory.',
      educationalVsProductionNote: 'High-frequency streaming analytics standard.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Build Max Heap',
      description: 'Transform the input array into a Max-Heap in O(n) time by calling heapify on all non-leaf nodes starting from index floor(n/2) - 1 down to 0.',
    },
    {
      stepNumber: 2,
      title: 'Extract Maximum Root',
      description: 'Swap the root element A[0] (the maximum) with the last element of the heap A[i].',
    },
    {
      stepNumber: 3,
      title: 'Shrink Heap Boundary',
      description: 'Decrease the active heap size by 1. The extracted element is now finalized at the end of the array.',
    },
    {
      stepNumber: 4,
      title: 'Restore Heap Property (Heapify)',
      description: 'Call heapify on the new root A[0] to sift it down to its correct position in O(log n) time.',
    },
    {
      stepNumber: 5,
      title: 'Repeat Until Heap is Empty',
      description: 'Repeat extraction and heapification until only 1 element remains in the heap. The array is now sorted in ascending order.',
    },
  ],
  workedExample: {
    datasetDescription: 'Unsorted array of 4 distinct integers [7, 4, 6, 2]',
    initialState: '[7, 4, 6, 2]',
    steps: [
      {
        stepNumber: 1,
        operation: 'Build Max-Heap on [7, 4, 6, 2]',
        stateDisplay: '[7, 4, 6, 2]',
        explanation: 'Leaves are at indices 2 and 3. Heapify node 1 (value 4, child 2) -> 4 > 2 (ok). Heapify node 0 (value 7, children 4 and 6) -> 7 is greater than both. Max-heap is [7, 4, 6, 2].',
        whyNecessary: 'Transforms arbitrary array into a valid Max-Heap where A[parent] >= A[children].',
        beforeState: '[7, 4, 6, 2]',
        afterState: '[7, 4, 6, 2]',
        nextAction: 'Swap root 7 with last element 2.',
        intermediateResult: 'Valid Max-Heap built: root is 7.',
      },
      {
        stepNumber: 2,
        operation: 'Extract Max: Swap A[0]=7 with A[3]=2, heapify root',
        stateDisplay: '[6, 4, 2 | 7]',
        explanation: 'Swap 7 with 2 -> [2, 4, 6 | 7]. Heap size becomes 3. Heapify root 2: children are 4 and 6. 6 is largest; swap 2 and 6. Heap becomes [6, 4, 2 | 7].',
        whyNecessary: 'Places global maximum 7 into its final position at index 3, and restores heap property on remaining 3 items.',
        beforeState: '[7, 4, 6, 2]',
        afterState: '[6, 4, 2 | 7]',
        nextAction: 'Swap new root 6 with last heap element 2.',
        intermediateResult: '7 finalized at index 3. Root is 6.',
      },
      {
        stepNumber: 3,
        operation: 'Extract Max: Swap A[0]=6 with A[2]=2, heapify root',
        stateDisplay: '[4, 2 | 6, 7]',
        explanation: 'Swap 6 with 2 -> [2, 4 | 6, 7]. Heap size becomes 2. Heapify root 2: child is 4. Swap 2 and 4 -> [4, 2 | 6, 7].',
        whyNecessary: 'Places second largest element 6 at index 2.',
        beforeState: '[6, 4, 2 | 7]',
        afterState: '[4, 2 | 6, 7]',
        nextAction: 'Swap new root 4 with last heap element 2.',
        intermediateResult: '6 finalized at index 2. Root is 4.',
      },
      {
        stepNumber: 4,
        operation: 'Extract Max: Swap A[0]=4 with A[1]=2',
        stateDisplay: '[2, 4, 6, 7]',
        explanation: 'Swap 4 with 2 -> [2 | 4, 6, 7]. Heap size becomes 1. Only 1 item remains; array is fully sorted.',
        whyNecessary: 'Finalizes 4 at index 1 and leaves 2 at index 0.',
        beforeState: '[4, 2 | 6, 7]',
        afterState: '[2, 4, 6, 7]',
        nextAction: 'Algorithm completes.',
        intermediateResult: 'Array [2, 4, 6, 7] fully sorted.',
      },
    ],
    finalState: '[2, 4, 6, 7]',
  },
  advantages: [
    'Guaranteed O(n log n) time complexity across best, average, and worst cases.',
    'Strictly in-place sorting requiring only O(1) auxiliary space.',
    'No recursion stack memory required (can be implemented with iterative heapify).',
    'Cannot be exploited with adversarial input to trigger O(n²) slowdown.',
  ],
  limitations: [
    'Unstable sorting algorithm.',
    'Poor cache locality: jumping between parent index i and children 2i+1, 2i+2 causes frequent CPU cache misses.',
    'Significantly slower in practice than Quick Sort on in-memory data.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(n log n). Building the heap takes O(n), and extracting n elements takes n * O(log n) time.',
    averageCaseMeaning: 'O(n log n). Deterministic heap height log₂(n) bounds all extraction steps.',
    worstCaseMeaning: 'O(n log n). Guaranteed even on reverse-sorted or duplicate-heavy data.',
    spaceComplexityMeaning: 'O(1) auxiliary space. All heap operations occur directly within the existing array without extra allocation.',
  },
  relatedAlgorithms: [
    {
      name: 'Selection Sort',
      comparison: 'Heap Sort is essentially an optimized Selection Sort. While Selection Sort takes O(n) to find the maximum in an unsorted list, Heap Sort takes O(log n) using a max-heap.',
    },
    {
      name: 'Merge Sort',
      comparison: 'Merge Sort guarantees O(n log n) and is stable, but requires O(n) extra memory. Heap Sort runs in O(1) space but is unstable.',
    },
  ],
  quiz: [
    {
      question: 'What is the time complexity of the buildMaxHeap phase when creating a heap from an unsorted array of size n?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'Although a naive bound suggests O(n log n), a rigorous mathematical summation of node heights sum_{h=0}^{log n} (n / 2^(h+1)) * O(h) converges to strictly linear O(n) time.',
    },
    {
      question: 'Why does Heap Sort suffer from poorer real-world cache performance than Quick Sort?',
      options: [
        'Because Heap Sort allocates extra arrays.',
        'Because parent-child indices (i to 2i+1) skip large memory gaps, causing CPU cache line evictions.',
        'Because Heap Sort uses recursion.',
        'Because it runs in O(n²) time.',
      ],
      correctIndex: 1,
      explanation: 'In a binary heap, child nodes are located at indices 2i+1 and 2i+2. As i increases, jumping across indices spans multiple cache lines, degrading hardware prefetching.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Heap Sort is named after the Binary Heap data structure that it constructs and uses to organize and extract elements.',
    problemSolved: 'Guaranteed O(n log n) sorting with strictly O(1) auxiliary memory.',
    problemNotSolved: 'Does not maintain stable sorting order.',
    whyLearn: 'Demonstrates the power of priority queues, implicit tree representations in arrays, and how to convert an O(n²) algorithm (Selection Sort) into O(n log n).',
    prerequisites: ['Binary Trees', 'Array-based tree indexing (2i+1, 2i+2)', 'Max-Heap property', 'Loop invariants'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Sort array A in guaranteed O(n log n) time without allocating any extra memory and without risking stack overflow.',
    naiveApproachInefficiency: 'Selection Sort takes O(n) per pass to find the maximum. Heap Sort reduces this to O(log n).',
    coreIdeaUsed: 'Store a complete binary tree inside the array. By enforcing A[parent] >= A[children], the maximum is always at A[0].',
    utilityExplanation: 'Extraction takes O(1), and restoring the heap takes O(log n). Repeating n times yields O(n log n).',
    workingConditions: ['Array elements must have a total order.', 'Zero extra memory allocation allowed.'],
    whenAnotherIsBetter: 'When average speed on modern CPUs is paramount (Quick Sort is faster). When stability is required (Merge Sort).',
    analogyOrRealLifeExample: 'A corporate tournament where the reigning champion is always at the top of the ladder. You take the champion out to award 1st place, promote a challenger from the bottom, let them fight their way down to their proper rank, and repeat.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of n comparable elements.',
    expectedOutput: 'The same array sorted in ascending order.',
    constraints: 'n >= 0. In-place.',
    preconditions: 'None.',
    specialCases: ['Empty or 1-element array returns immediately.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If elements cannot be compared, heap property cannot be established.',
  },

  coreIntuition: {
    simpleExplanation: 'First, turn the array into a pyramid (max-heap) where every parent is bigger than its children. The biggest number is now sitting right at the top! Swap it to the very end of the array, shrink the pyramid by 1, fix the pyramid, and repeat.',
    keyDrivingDecision: 'Sift down (heapify): compare parent with both children; if a child is bigger, swap with the largest child and continue down.',
    whyRepeatedOperationWorks: 'Extracting the root moves the current maximum to its finalized sorted position. Since the heap shrinks by 1 each time, all elements end up in ascending order.',
    paradigmSpecificDetail: 'Priority queue selection sort: uses a binary heap to accelerate extremum finding from O(n) to O(log n).',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure heapSort(A)',
      '  n := length(A)',
      '  // Step 1: Build Max Heap',
      '  for i from floor(n/2) - 1 down to 0 do',
      '    heapify(A, n, i)',
      '  end for',
      '  // Step 2: Extract elements from heap',
      '  for i from n - 1 down to 1 do',
      '    swap(A[0], A[i])',
      '    heapify(A, i, 0)',
      '  end for',
      'end procedure',
      '',
      'procedure heapify(A, size, root)',
      '  largest := root',
      '  left := 2 * root + 1',
      '  right := 2 * root + 2',
      '  if left < size and A[left] > A[largest] then largest := left',
      '  if right < size and A[right] > A[largest] then largest := right',
      '  if largest != root then',
      '    swap(A[root], A[largest])',
      '    heapify(A, size, largest)',
      '  end if',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 3, lineText: 'for i from floor(n/2) - 1 down to 0', explanation: 'Bottom-up heap construction starting from last non-leaf node.' },
      { lineIndex: 4, lineText: 'heapify(A, n, i)', explanation: 'Enforces max-heap property on subtree rooted at i in O(log n) time.' },
      { lineIndex: 8, lineText: 'swap(A[0], A[i])', explanation: 'Moves root maximum to finalized position at index i.' },
      { lineIndex: 9, lineText: 'heapify(A, i, 0)', explanation: 'Restores max-heap on reduced heap of size i.' },
      { lineIndex: 14, lineText: 'left := 2 * root + 1', explanation: 'Left child formula in 0-indexed complete binary tree.' },
      { lineIndex: 15, lineText: 'right := 2 * root + 2', explanation: 'Right child formula.' },
    ],
    terminationCondition: 'Terminates when heap size shrinks to 1.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function heapSort<T>(arr: T[]): T[] {
  const n = arr.length;
  if (n <= 1) return arr;

  function heapify(size: number, root: number): void {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < size && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== root) {
      const temp = arr[root];
      arr[root] = arr[largest];
      arr[largest] = temp;
      heapify(size, largest);
    }
  }

  // 1. Build max heap (in O(n) time)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // 2. Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    heapify(i, 0);
  }

  return arr;
}`,
    signature: 'function heapSort<T>(arr: T[]): T[]',
    inputValidation: 'Returns array if length <= 1.',
    variables: [
      { name: 'n', type: 'number', purpose: 'Length of input array.' },
      { name: 'size', type: 'number', purpose: 'Current boundary of active max-heap.' },
      { name: 'root', type: 'number', purpose: 'Root index of current subtree being sifted down.' },
      { name: 'largest', type: 'number', purpose: 'Index containing maximum value among root, left, and right children.' },
    ],
    lineByLine: [
      { line: 5, code: 'function heapify(size, root)', explanation: 'Sifts down root to restore max-heap property.' },
      { line: 26, code: 'for (let i = Math.floor(n/2) - 1; i >= 0; i--)', explanation: 'Builds max heap bottom-up in O(n) total time.' },
      { line: 31, code: 'for (let i = n - 1; i > 0; i--)', explanation: 'Extracts max root and places at index i.' },
      { line: 35, code: 'heapify(i, 0);', explanation: 'Restores heap on remaining i elements.' },
    ],
    returnExplanation: 'Returns the sorted array mutated in place.',
    commonBugs: [
      'Using 1-based index formulas (2i, 2i+1) on 0-based arrays (must use 2i+1, 2i+2).',
      'Starting buildMaxHeap at n-1 instead of floor(n/2)-1, wasting calls on leaf nodes.',
      'Passing array length n instead of active heap size i during extraction heapify.',
    ],
    edgeCaseHandling: ['Empty and single-element arrays return immediately without heap operations.'],
  },

  correctness: {
    intuitiveExplanation: 'At the start of extraction step i, the largest element among the remaining i+1 elements is at A[0]. Swapping it with A[i] puts it in its final sorted position. By maintaining the max-heap on the remaining elements, every position from n-1 down to 0 receives its correct value.',
    formalProof: {
      method: 'Loop Invariant',
      invariantOrClaim: 'At the start of iteration i of the extraction loop, the subarray A[0..i] is a Max-Heap containing the i+1 smallest elements, and A[i+1..n-1] is sorted with A[i+1..n-1] >= A[0..i].',
      initialization: 'Before the first iteration (i = n - 1), buildMaxHeap ensures A[0..n-1] is a Max-Heap. The subarray A[n..n-1] is empty, vacuously true.',
      maintenance: 'A[0] is the maximum of A[0..i]. Swapping A[0] with A[i] puts the maximum at A[i]. Now A[i..n-1] is sorted. Calling heapify on A[0..i-1] restores the max-heap property for the remaining elements.',
      termination: 'The loop terminates when i = 0. The remaining element A[0] is the smallest element, and A[1..n-1] is sorted. Thus A[0..n-1] is fully sorted.',
      conclusion: 'Heap Sort is correct by induction on the loop invariant.',
    },
  },

  complexityAnalysis: {
    bestCase: {
      complexity: 'O(n log n)',
      explanation: 'Even on sorted data, extraction still takes n * O(log n) sifts.',
      condition: 'Any valid input.',
    },
    averageCase: {
      complexity: 'O(n log n)',
      explanation: 'n extractions each taking O(log n) time.',
      condition: 'Random input.',
    },
    worstCase: {
      complexity: 'O(n log n)',
      explanation: 'Heap height is strictly bounded by floor(log₂ n); guaranteed O(n log n) worst case.',
      condition: 'Reverse-sorted or adversary input.',
    },
    auxiliarySpace: {
      complexity: 'O(1)',
      explanation: 'Operates strictly in-place within the input array.',
    },
    totalMemory: 'O(n) for input array.',
    bigOExplanation: 'Heap Sort is Theta(n log n) across best, average, and worst cases.',
    scalingBehavior: 'Predictable and reliable scaling; unaffected by sortedness or duplicate distribution.',
  },

  advantagesAndLimitations: {
    strengths: [
      'Guaranteed O(n log n) worst case with strict O(1) auxiliary memory.',
      'Immune to adversarial worst-case inputs.',
      'No recursive stack memory risk.',
    ],
    limitations: [
      'Unstable sort.',
      'Poor cache locality due to non-adjacent child index calculations.',
      'Slower than Quick Sort in average in-memory sorting.',
    ],
    memoryTradeOffs: ['Strictly O(1) memory at the cost of cache performance.'],
    poorChoiceScenarios: ['When sorting stability is required.', 'When maximum cache throughput is needed.'],
  },

  comparisons: [
    {
      algorithm: 'Selection Sort',
      timeComplexity: 'Best/Avg/Worst: O(n²)',
      spaceComplexity: 'O(1)',
      stabilityOrType: 'Unstable, In-Place',
      similarities: 'Both find the maximum and place it at the end.',
      differences: 'Heap Sort finds the maximum in O(log n) via a Max-Heap; Selection Sort takes O(n) linear scan.',
      whenToPreferThis: 'Virtually always prefer Heap Sort over Selection Sort for n > 20.',
      whenToPreferAlternative: 'Only on tiny arrays where code simplicity matters.',
    },
    {
      algorithm: 'Quick Sort',
      timeComplexity: 'Best/Avg: O(n log n), Worst: O(n²)',
      spaceComplexity: 'O(log n)',
      stabilityOrType: 'Unstable, In-Place',
      similarities: 'Both are in-place, unstable comparison sorts.',
      differences: 'Quick Sort is 2x-3x faster in practice due to contiguous cache access, but has an O(n²) worst case. Heap Sort guarantees O(n log n).',
      whenToPreferThis: 'When worst-case execution time must be guaranteed in O(1) space.',
      whenToPreferAlternative: 'General-purpose in-memory sorting.',
    },
  ],

  commonMistakes: [
    {
      title: 'Using 1-Based Child Formulas on 0-Based Array',
      misconception: 'Computing children as 2*i and 2*i + 1.',
      badCodeOrApproach: 'const left = 2 * i;',
      correctApproach: 'On 0-indexed arrays, left = 2*i + 1 and right = 2*i + 2.',
    },
    {
      title: 'Starting Heap Construction at Leaf Nodes',
      misconception: 'Looping from n - 1 down to 0 during buildMaxHeap.',
      badCodeOrApproach: 'for (let i = n - 1; i >= 0; i--) heapify(...)',
      correctApproach: 'Leaves have no children and cannot sift down. Start at Math.floor(n / 2) - 1.',
    },
  ],

  exercises: [
    {
      id: 'hs-ex-1',
      type: 'conceptual',
      question: 'For a 0-indexed array representation of a binary heap, what are the left and right child indices of the node at index i?',
      options: ['2*i and 2*i + 1', '2*i + 1 and 2*i + 2', 'i / 2 and i / 2 + 1', 'i + 1 and i + 2'],
      correctIndex: 1,
      explanation: 'In 0-indexed complete binary trees, left child is 2*i + 1 and right child is 2*i + 2. Parent is floor((i - 1) / 2).',
    },
  ],

  summary: {
    coreIdea: 'Heap Sort builds a binary Max-Heap in O(n) time, then repeatedly swaps the maximum root to the end and restores the heap property in O(log n) time, achieving guaranteed O(n log n) in-place sorting.',
    keyConditions: [
      'Guaranteed O(n log n) runtime in all cases.',
      'Strictly O(1) auxiliary memory.',
      'Unstable due to heap structural rebalancing.',
    ],
    complexitySummary: {
      time: 'Best: O(n log n), Average: O(n log n), Worst: O(n log n)',
      space: 'O(1) auxiliary memory',
    },
    whenToUse: 'When memory is strictly constrained to O(1) and worst-case O(n log n) latency must be guaranteed.',
    prerequisites: ['Binary Heaps', 'Complete binary trees', 'Array tree formulas'],
    nextSteps: [
      { id: 'binary-search', name: 'Binary Search', reason: 'Learn how sorted arrays enable logarithmic O(log n) search queries.' },
    ],
  },
};
