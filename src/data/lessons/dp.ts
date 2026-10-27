import type { AlgorithmLesson } from '../../types/algorithm';

// ============================================================================
// 1. FIBONACCI (DYNAMIC PROGRAMMING) LESSON
// ============================================================================
export const fibonacciDPLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A classic dynamic programming algorithm that computes the n-th Fibonacci number in linear time by caching previously solved subproblems in a table or state variables.',
  mainPurpose: 'To eliminate the exponential O(2ⁿ) re-computation of overlapping subproblems through bottom-up tabulation or top-down memoization.',
  whatIsIt: {
    overview: 'The Fibonacci sequence is defined recursively as F(0) = 0, F(1) = 1, and F(n) = F(n - 1) + F(n - 2) for n >= 2. Naive recursive evaluation re-evaluates the same subproblems repeatedly: computing F(5) calculates F(3) two times, F(2) three times, and F(1) five times, exploding into an O(2ⁿ) tree. Dynamic Programming solves each subproblem once, storing the answer in a table or variable.',
    smallExample: 'To calculate F(5): Start with base cases dp[0]=0, dp[1]=1. Then dp[2]=0+1=1. dp[3]=1+1=2. dp[4]=1+2=3. dp[5]=2+3=5. Solved in 5 simple additions!',
  },
  whyUseIt: {
    problemSolved: 'Transforms an intractable exponential-time recursion into a blazing-fast linear O(n) or constant-space calculation.',
    whyItMatters: 'It is the "Hello World" of Dynamic Programming, demonstrating the two vital hallmarks of DP: Overlapping Subproblems and Optimal Substructure.',
    whenToUse: [
      'Recurrence relations where future states depend on overlapping prior states.',
      'Combinatorial counting problems (e.g. climbing stairs, tiling a board with dominoes).',
      'Understanding the difference between top-down memoization and bottom-up tabulation.',
    ],
    whenToAvoid: [
      'Very large n (e.g. n > 1,000,000) where O(log n) Matrix Exponentiation or Binet\'s formula is preferred.',
      'When standard 64-bit integer capacity is exceeded (n > 78 in JavaScript requires BigInt).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Financial Amortization & Growth Modeling',
      description: 'Used in dynamic cash-flow models, annuity forecasting, and compounding growth schedules.',
      educationalVsProductionNote: 'Direct application in quantitative finance calculations.',
    },
    {
      title: 'Procedural Botanical Modeling & Phyllotaxis',
      description: 'Computer graphics generation of natural spiral arrangements (sunflower seeds, pinecones, leaf positioning).',
      educationalVsProductionNote: 'Standard technique in 3D procedural plant generation in game engines.',
    },
    {
      title: 'Fibonacci Heaps in Advanced Graph Algorithms',
      description: 'Used in the internal structure of Fibonacci Heaps, achieving O(1) amortized decrease-key for Dijkstra’s algorithm.',
      educationalVsProductionNote: 'Theoretical and production standard for optimal network flow.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Define Base Cases',
      description: 'Establish F(0) = 0 and F(1) = 1.',
    },
    {
      stepNumber: 2,
      title: 'Establish DP State',
      description: 'Let dp[i] represent the i-th Fibonacci number.',
    },
    {
      stepNumber: 3,
      title: 'Iterative Tabulation',
      description: 'For i from 2 up to n, compute dp[i] = dp[i - 1] + dp[i - 2].',
    },
    {
      stepNumber: 4,
      title: 'Space Optimization',
      description: 'Notice that only the previous two numbers (prev2, prev1) are needed, allowing reduction to O(1) space.',
    },
    {
      stepNumber: 5,
      title: 'Extract Result',
      description: 'Return dp[n] as the final answer.',
    },
  ],
  workedExample: {
    datasetDescription: 'Calculating F(5) using bottom-up tabulation',
    initialState: 'dp[0] = 0, dp[1] = 1',
    steps: [
      {
        stepNumber: 1,
        operation: 'Base cases: dp[0] = 0, dp[1] = 1',
        stateDisplay: 'dp: [0, 1]',
        explanation: 'Initialize the base cases given by the definition.',
        whyNecessary: 'Seeds the recurrence relation.',
        beforeState: 'Uninitialized',
        afterState: 'dp = [0, 1]',
        nextAction: 'Compute dp[2].',
        intermediateResult: 'Base cases set.',
      },
      {
        stepNumber: 2,
        operation: 'Compute dp[2] = dp[1] + dp[0]',
        stateDisplay: 'dp: [0, 1, 1]',
        explanation: 'dp[2] = 1 + 0 = 1.',
        whyNecessary: 'Sums previous two states.',
        beforeState: 'dp = [0, 1]',
        afterState: 'dp = [0, 1, 1]',
        nextAction: 'Compute dp[3].',
        intermediateResult: 'F(2) = 1.',
      },
      {
        stepNumber: 3,
        operation: 'Compute dp[3] = dp[2] + dp[1]',
        stateDisplay: 'dp: [0, 1, 1, 2]',
        explanation: 'dp[3] = 1 + 1 = 2.',
        whyNecessary: 'Sums previous two states.',
        beforeState: 'dp = [0, 1, 1]',
        afterState: 'dp = [0, 1, 1, 2]',
        nextAction: 'Compute dp[4].',
        intermediateResult: 'F(3) = 2.',
      },
      {
        stepNumber: 4,
        operation: 'Compute dp[4] = dp[3] + dp[2]',
        stateDisplay: 'dp: [0, 1, 1, 2, 3]',
        explanation: 'dp[4] = 2 + 1 = 3.',
        whyNecessary: 'Sums previous two states.',
        beforeState: 'dp = [0, 1, 1, 2]',
        afterState: 'dp = [0, 1, 1, 2, 3]',
        nextAction: 'Compute dp[5].',
        intermediateResult: 'F(4) = 3.',
      },
      {
        stepNumber: 5,
        operation: 'Compute dp[5] = dp[4] + dp[3]',
        stateDisplay: 'dp: [0, 1, 1, 2, 3, 5]',
        explanation: 'dp[5] = 3 + 2 = 5.',
        whyNecessary: 'Final state computed.',
        beforeState: 'dp = [0, 1, 1, 2, 3]',
        afterState: 'dp = [0, 1, 1, 2, 3, 5]',
        nextAction: 'Return dp[5] = 5.',
        intermediateResult: 'F(5) = 5.',
      },
    ],
    finalState: 'Fibonacci(5) = 5',
  },
  advantages: [
    'Converts exponential O(2ⁿ) execution into linear O(n) time.',
    'Can be optimized to O(1) auxiliary space using two variables.',
    'Iterative bottom-up approach eliminates recursion call stack overhead.',
  ],
  limitations: [
    'Integers grow exponentially, quickly overflowing 64-bit precision without arbitrary precision (BigInt).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(1) time when n = 0 or n = 1.',
    averageCaseMeaning: 'O(n) time. Exactly n - 1 addition operations.',
    worstCaseMeaning: 'O(n) time. Loops from 2 up to n.',
    spaceComplexityMeaning: 'O(1) auxiliary space using two scalar variables (prev1, prev2), or O(n) if full table is preserved.',
  },
  relatedAlgorithms: [
    {
      name: 'Matrix Exponentiation Fibonacci',
      comparison: 'Matrix exponentiation computes [[F(n+1), F(n)], [F(n), F(n-1)]] = [[1, 1], [1, 0]]^n in O(log n) time using binary exponentiation.',
    },
  ],
  quiz: [
    {
      question: 'Why does naive recursive Fibonacci without memoization run in exponential O(2ⁿ) time?',
      options: [
        'Because calculating F(n) generates a binary tree of subproblems where identical values like F(3) are re-evaluated thousands of times.',
        'Because addition is an exponential operation.',
        'Because of compiler memory leaks.',
        'Because the numbers grow large.',
      ],
      correctIndex: 0,
      explanation: 'Without caching, the call tree splits into two at every level, creating roughly 2ⁿ function calls with massive redundancy.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Named after Italian mathematician Leonardo of Pisa (known as Fibonacci), who introduced the sequence to Western mathematics in his 1202 book Liber Abaci.',
    problemSolved: 'Computes the n-th value in the recurrence F(n) = F(n-1) + F(n-2) in linear time.',
    problemNotSolved: 'Does not compute non-integer indices directly without floating point formulas.',
    whyLearn: 'The primary educational model for demonstrating overlapping subproblems and dynamic programming state transitions.',
    prerequisites: ['Mathematical recurrence relations', 'Arrays', 'Iteration vs Recursion'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Compute F(n) efficiently for any given integer n >= 0.',
    naiveApproachInefficiency: 'Naive recursion has time complexity O(phi^n) where phi ≈ 1.618. For n = 50, it performs over 1 trillion recursive calls and freezes the machine.',
    coreIdeaUsed: 'Store previously computed values so each subproblem F(k) is computed exactly once.',
    utilityExplanation: 'Reduces 2ⁿ tree evaluations to a single linear loop of n operations.',
    workingConditions: ['n >= 0.'],
    whenAnotherIsBetter: 'When n > 1,000,000, use Matrix Exponentiation (O(log n)).',
    analogyOrRealLifeExample: 'Building a brick wall: you lay row 1 and row 2. To lay row 3, you place a brick on top of the two below it. You do not re-build the entire lower foundation from scratch for every new brick.',
  },

  inputOutputAssumptions: {
    expectedInput: 'A non-negative integer n >= 0.',
    expectedOutput: 'The n-th Fibonacci number.',
    constraints: 'n >= 0. For n > 78 in JavaScript, values exceed Number.MAX_SAFE_INTEGER and require BigInt.',
    preconditions: 'n is an integer.',
    specialCases: ['n = 0 returns 0.', 'n = 1 returns 1.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'Negative numbers are undefined in the standard sequence.',
  },

  coreIntuition: {
    simpleExplanation: 'Do not calculate backwards from the top down. Start at 0 and 1, add them to get the next number, and keep adding the last two numbers until you reach your goal.',
    keyDrivingDecision: 'next = prev1 + prev2; prev2 = prev1; prev1 = next;',
    whyRepeatedOperationWorks: 'Each step computes the next state directly from its immediate dependencies.',
    paradigmSpecificDetail: 'Bottom-up DP tabulation with optimal 2-variable sliding window.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure fibonacciDP(n)',
      '  if n = 0 then return 0',
      '  if n = 1 then return 1',
      '  prev2 := 0',
      '  prev1 := 1',
      '  for i from 2 to n do',
      '    current := prev1 + prev2',
      '    prev2 := prev1',
      '    prev1 := current',
      '  end for',
      '  return prev1',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'if n = 0 return 0', explanation: 'Base case 0.' },
      { lineIndex: 2, lineText: 'if n = 1 return 1', explanation: 'Base case 1.' },
      { lineIndex: 3, lineText: 'prev2 := 0; prev1 := 1', explanation: 'Initialize two sliding window variables.' },
      { lineIndex: 6, lineText: 'current := prev1 + prev2', explanation: 'Apply recurrence relation.' },
      { lineIndex: 7, lineText: 'prev2 := prev1; prev1 := current', explanation: 'Slide window forward by 1 step.' },
    ],
    terminationCondition: 'Loop terminates after n - 1 iterations.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function fibonacciDP(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev2 = 0;
  let prev1 = 1;

  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}`,
    signature: 'function fibonacciDP(n: number): number',
    inputValidation: 'Handles n <= 0 by returning 0.',
    variables: [
      { name: 'prev2', type: 'number', purpose: 'Holds value of F(i-2).' },
      { name: 'prev1', type: 'number', purpose: 'Holds value of F(i-1).' },
      { name: 'current', type: 'number', purpose: 'Stores calculated F(i).' },
    ],
    lineByLine: [
      { line: 2, code: 'if (n <= 0) return 0;', explanation: 'Base case 0.' },
      { line: 3, code: 'if (n === 1) return 1;', explanation: 'Base case 1.' },
      { line: 5, code: 'let prev2 = 0; let prev1 = 1;', explanation: 'Initialize sliding window.' },
      { line: 8, code: 'for (let i = 2; i <= n; i++)', explanation: 'Bottom-up progression.' },
      { line: 9, code: 'const current = prev1 + prev2;', explanation: 'Compute next state.' },
      { line: 10, code: 'prev2 = prev1; prev1 = current;', explanation: 'Advance window.' },
      { line: 14, code: 'return prev1;', explanation: 'Return result.' },
    ],
    returnExplanation: 'Returns F(n).',
    commonBugs: [
      'Allocating an array of size n instead of n + 1, causing index n to be out of bounds.',
      'Using naive recursion without memoization in production.',
      'Failing to handle 64-bit integer overflow for large n.',
    ],
    edgeCaseHandling: ['n = 0 and n = 1 return immediately.'],
  },

  correctness: {
    intuitiveExplanation: 'F(0) and F(1) are correct by definition. At every step i, F(i) is formed by summing the correct values of F(i-1) and F(i-2). By induction, every value up to F(n) is correct.',
    formalProof: {
      method: 'Induction',
      invariantOrClaim: 'At the end of loop iteration i, prev1 holds F(i) and prev2 holds F(i-1).',
      initialization: 'Before iteration i = 2, prev1 = F(1) = 1 and prev2 = F(0) = 0. True.',
      maintenance: 'In iteration i, current = prev1 + prev2 = F(i-1) + F(i-2) = F(i). Then prev2 becomes F(i-1) and prev1 becomes F(i). The invariant is preserved.',
      termination: 'The loop terminates when i = n. By the invariant, prev1 = F(n).',
      conclusion: 'The algorithm correctly computes F(n) in n-1 additions.',
    },
  },

  complexityAnalysis: {
    bestCase: { complexity: 'O(1)', explanation: 'n <= 1 takes constant time.', condition: 'n = 0 or 1.' },
    averageCase: { complexity: 'O(n)', explanation: 'n - 1 additions.', condition: 'General n.' },
    worstCase: { complexity: 'O(n)', explanation: 'n - 1 additions.', condition: 'General n.' },
    auxiliarySpace: { complexity: 'O(1)', explanation: 'Two scalar variables.', },
    totalMemory: 'O(1) auxiliary space.',
    bigOExplanation: 'Theta(n) time, Theta(1) space.',
    scalingBehavior: 'Linear time scaling; instantaneous for n < 100,000.',
  },

  advantagesAndLimitations: {
    strengths: ['O(n) time and O(1) space.', 'Eliminates all redundant recursive computations.', 'Zero stack memory risk.'],
    limitations: ['Number precision limitations in JavaScript (use BigInt for n > 78).'],
    memoryTradeOffs: ['O(1) memory with sliding window.'],
    poorChoiceScenarios: ['n > 10,000,000 where Matrix Exponentiation O(log n) is needed.'],
  },

  comparisons: [
    {
      algorithm: 'Naive Recursive Fibonacci',
      timeComplexity: 'Naive: O(2ⁿ) vs DP: O(n)',
      spaceComplexity: 'Naive: O(n) stack vs DP: O(1)',
      stabilityOrType: 'Fibonacci computation',
      similarities: 'Both evaluate the Fibonacci recurrence.',
      differences: 'Naive recomputes subproblems exponentially; DP caches or iterates in linear time.',
      whenToPreferThis: 'Always prefer DP over naive recursion.',
      whenToPreferAlternative: 'Never use naive recursion in production.',
    },
  ],

  commonMistakes: [
    {
      title: 'Off-by-One Array Size in Tabulation',
      misconception: 'Allocating const dp = new Array(n).',
      badCodeOrApproach: 'const dp = new Array(n); dp[n] = ...;',
      correctApproach: 'Allocate new Array(n + 1) because indices run from 0 to n inclusive.',
    },
  ],

  exercises: [
    {
      id: 'fib-ex-1',
      type: 'conceptual',
      question: 'Why can the auxiliary space of bottom-up Fibonacci DP be reduced from O(n) to O(1)?',
      options: [
        'Because calculating F(i) only requires the two immediately preceding values F(i-1) and F(i-2).',
        'Because JavaScript garbage collects the array.',
        'Because Fibonacci is a linear function.',
        'It cannot be reduced to O(1).',
      ],
      correctIndex: 0,
      explanation: 'Since F(i) only depends on the previous two states, we do not need to keep the entire historical table in memory—only a sliding window of 2 variables.',
    },
  ],

  summary: {
    coreIdea: 'Fibonacci DP computes values iteratively from the bottom up in O(n) time and O(1) space, eliminating the exponential O(2ⁿ) redundancy of naive recursion.',
    keyConditions: [
      'Base cases: F(0) = 0, F(1) = 1.',
      'Sliding window reduces space to O(1).',
      'Use BigInt for n > 78 in JavaScript.',
    ],
    complexitySummary: {
      time: 'O(n)',
      space: 'O(1) auxiliary space',
    },
    whenToUse: 'Whenever computing recurrence relations with overlapping subproblems.',
    prerequisites: ['Recurrence relations', 'Dynamic programming basics'],
    nextSteps: [
      { id: 'lcs', name: 'Longest Common Subsequence (LCS)', reason: 'Advance from 1D DP to 2D grid DP table construction and sequence reconstruction.' },
    ],
  },
};

// ============================================================================
// 2. LONGEST COMMON SUBSEQUENCE (LCS) LESSON
// ============================================================================
export const lcsLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A 2D dynamic programming algorithm that finds the length and content of the longest subsequence present in two sequences in the same relative order, but not necessarily contiguously.',
  mainPurpose: 'To measure similarity between sequences, power file difference tools (git diff), and align biological DNA/protein sequences.',
  whatIsIt: {
    overview: 'A subsequence is a sequence derived from another sequence by deleting zero or more elements without changing the order of the remaining elements. For example, "ace" is a subsequence of "abcde", but "aec" is not. Given two strings s1 and s2, the Longest Common Subsequence problem finds the maximum length common subsequence and reconstructs it using a 2D dynamic programming table.',
    smallExample: 'For s1 = "ABCBDAB" and s2 = "BDCAB": Common subsequences include "BCAB", "BCB", "BDAB". The longest has length 4: "BCAB" or "BDAB".',
  },
  whyUseIt: {
    problemSolved: 'Determines the minimum edits or longest shared patterns between two sequences.',
    whyItMatters: 'It is the core algorithm behind git diff, Unix diff, document revision histories, and bioinformatics DNA sequence alignment (e.g. Needleman-Wunsch).',
    whenToUse: [
      'File and code version comparison (diff tools).',
      'Bioinformatics: comparing genetic DNA (A, C, G, T) or protein sequences.',
      'Plagiarism detection and text similarity scoring.',
      'Speech recognition and automated spell-checking correction.',
    ],
    whenToAvoid: [
      'When contiguous matching is required (use Longest Common Substring instead).',
      'Extremely long sequences (millions of characters) where O(m * n) memory exceeds RAM (use Hirschberg’s divide-and-conquer algorithm in O(min(m, n)) space).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Git and Unix Diff Tools',
      description: 'Used in git diff and patch utilities to identify added, deleted, and modified lines between file versions.',
      educationalVsProductionNote: 'Universal production standard across version control systems.',
    },
    {
      title: 'Bioinformatics DNA Sequence Alignment',
      description: 'Aligning genomes and discovering evolutionary mutations between species (Needleman-Wunsch algorithm).',
      educationalVsProductionNote: 'Standard computational biology pipeline tool.',
    },
    {
      title: 'Spell Checking and Optical Character Recognition (OCR)',
      description: 'Comparing scanned character outputs with dictionary words to identify typographical errors.',
      educationalVsProductionNote: 'Standard linguistic and OCR post-processing technique.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Initialize 2D Table',
      description: 'Create a table dp of size (m + 1) x (n + 1), initialized with zeros.',
    },
    {
      stepNumber: 2,
      title: 'Character Match Case',
      description: 'If s1[i - 1] === s2[j - 1], the character matches: dp[i][j] = 1 + dp[i - 1][j - 1] (diagonal step).',
    },
    {
      stepNumber: 3,
      title: 'Character Mismatch Case',
      description: 'If s1[i - 1] !== s2[j - 1], take the maximum of excluding a character from either string: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]).',
    },
    {
      stepNumber: 4,
      title: 'Extract Length',
      description: 'The length of the LCS is stored at dp[m][n].',
    },
    {
      stepNumber: 5,
      title: 'Reconstruct Subsequence',
      description: 'Backtrack from dp[m][n] to dp[0][0] following diagonal matches to reconstruct the actual string.',
    },
  ],
  workedExample: {
    datasetDescription: 'Finding LCS of s1 = "ABCBDAB" (length 7) and s2 = "BDCAB" (length 5)',
    initialState: 's1 = "ABCBDAB", s2 = "BDCAB"',
    steps: [
      {
        stepNumber: 1,
        operation: 'Populate row 0 and column 0 with zeros',
        stateDisplay: 'dp[0][j] = 0, dp[i][0] = 0',
        explanation: 'An empty prefix string has LCS length 0 against any other string.',
        whyNecessary: 'Base cases of dynamic programming table.',
        beforeState: 'Uninitialized',
        afterState: 'Zeros on borders',
        nextAction: 'Fill table row by row.',
        intermediateResult: 'Base cases initialized.',
      },
      {
        stepNumber: 2,
        operation: 'Evaluate cells: s1[i-1] === s2[j-1]',
        stateDisplay: 'Diagonal increments when characters match',
        explanation: 'At s1[1]="B" and s2[0]="B": match! dp[2][1] = 1 + dp[1][0] = 1.',
        whyNecessary: 'Extends common subsequence by 1.',
        beforeState: 'dp[1][0] = 0',
        afterState: 'dp[2][1] = 1',
        nextAction: 'Continue filling table.',
        intermediateResult: 'Match "B" found.',
      },
      {
        stepNumber: 3,
        operation: 'Fill entire 7x5 table',
        stateDisplay: 'Bottom-right cell dp[7][5] = 4',
        explanation: 'Table completed. The value at dp[7][5] is 4. Longest common subsequence has length 4.',
        whyNecessary: 'Resolves all overlapping subproblems.',
        beforeState: 'In progress',
        afterState: 'dp[7][5] = 4',
        nextAction: 'Backtrack to reconstruct string.',
        intermediateResult: 'LCS length is 4.',
      },
      {
        stepNumber: 4,
        operation: 'Backtrack from (7, 5) to (0, 0)',
        stateDisplay: 'Reconstructed string: "BCAB"',
        explanation: 'Following diagonal steps where characters match yields B -> C -> A -> B ("BCAB").',
        whyNecessary: 'Extracts the actual matching characters.',
        beforeState: 'Length 4',
        afterState: 'String "BCAB"',
        nextAction: 'Done.',
        intermediateResult: 'LCS is "BCAB".',
      },
    ],
    finalState: 'LCS = "BCAB" (Length 4)',
  },
  advantages: [
    'Polynomial O(m * n) time and space complexity vs exponential O(2^(m+n)) brute force.',
    'Guaranteed to find the globally optimal longest subsequence.',
    'Provides the framework for reconstructing the sequence and computing edit distances.',
  ],
  limitations: [
    'O(m * n) auxiliary memory can be prohibitive for massive genome sequences (requires Hirschberg’s algorithm).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(m * n) time. Every cell in the m x n table is filled.',
    averageCaseMeaning: 'O(m * n) time where m and n are string lengths.',
    worstCaseMeaning: 'O(m * n) time.',
    spaceComplexityMeaning: 'O(m * n) auxiliary space for the full 2D DP table. Space can be reduced to O(min(m, n)) if only the length is needed.',
  },
  relatedAlgorithms: [
    {
      name: 'Levenshtein Edit Distance',
      comparison: 'Edit Distance measures the minimum insertions, deletions, and substitutions to transform one string into another. LCS is equivalent to edit distance when substitutions are disallowed.',
    },
    {
      name: 'Longest Common Substring',
      comparison: 'Substrings must be contiguous in memory; subsequences allow non-contiguous gaps.',
    },
  ],
  quiz: [
    {
      question: 'What is the key difference between a Substring and a Subsequence?',
      options: [
        'A substring must appear contiguously without gaps; a subsequence can have gaps as long as relative order is preserved.',
        'A subsequence is always shorter than a substring.',
        'A substring can be in reverse order.',
        'There is no difference.',
      ],
      correctIndex: 0,
      explanation: 'In "abcde", "bcd" is a substring (contiguous), while "ace" is a subsequence (non-contiguous characters maintaining left-to-right order).',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Longest Common Subsequence is named because it finds the subsequence of maximal length that is common to both input sequences.',
    problemSolved: 'Finds the length and characters of the longest shared non-contiguous pattern between two sequences.',
    problemNotSolved: 'Does not enforce contiguity (that is Longest Common Substring).',
    whyLearn: 'Core algorithm for 2D dynamic programming, sequence alignment, and diff tools.',
    prerequisites: ['Strings', '2D Arrays / Matrices', 'Dynamic Programming basics'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Given two strings s1 of length m and s2 of length n, find the longest sequence of characters that appears in both in the same order.',
    naiveApproachInefficiency: 'Brute force checks all 2ᵐ subsequences of s1 against s2, taking O(n * 2ᵐ) time, which is impossible for strings of length 50.',
    coreIdeaUsed: 'Construct a 2D table where dp[i][j] stores the LCS length of prefixes s1[0..i-1] and s2[0..j-1].',
    utilityExplanation: 'Optimal substructure: if the last characters match, LCS is 1 + LCS of the remaining prefixes; if not, it is max(LCS without s1’s last char, LCS without s2’s last char).',
    workingConditions: ['Sequential strings or arrays of comparable items.'],
    whenAnotherIsBetter: 'When memory is tight on long genomes, use Hirschberg’s algorithm (O(min(m, n)) space).',
    analogyOrRealLifeExample: 'Two friends writing a story: one writes "The quick brown fox", the other writes "That quick red fox". The common story thread is "Th quick fox".',
  },

  inputOutputAssumptions: {
    expectedInput: 'Two strings s1 and s2 (or two arrays of comparable tokens).',
    expectedOutput: 'The length of the LCS and the reconstructed subsequence string.',
    constraints: 'm, n >= 0.',
    preconditions: 'None.',
    specialCases: ['Either string empty: LCS length is 0.', 'Identical strings: LCS is the entire string.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If elements are not comparable, character equality checks fail.',
  },

  coreIntuition: {
    simpleExplanation: 'Look at the last letters of both words. If they match, keep that letter and look at the rest of both words. If they do not match, try dropping the last letter of word 1, try dropping the last letter of word 2, and take whichever result is longer.',
    keyDrivingDecision: 's1[i-1] === s2[j-1] ? 1 + dp[i-1][j-1] : max(dp[i-1][j], dp[i][j-1])',
    whyRepeatedOperationWorks: 'Builds optimal solutions for larger prefixes from optimal solutions for smaller prefixes.',
    paradigmSpecificDetail: '2D grid dynamic programming with optimal substructure.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure LCS(s1, s2)',
      '  m := length(s1), n := length(s2)',
      '  create 2D array dp[0..m][0..n] filled with 0',
      '  for i from 1 to m do',
      '    for j from 1 to n do',
      '      if s1[i-1] = s2[j-1] then',
      '        dp[i][j] := 1 + dp[i-1][j-1]',
      '      else',
      '        dp[i][j] := max(dp[i-1][j], dp[i][j-1])',
      '      end if',
      '    end for',
      '  end for',
      '  return dp[m][n]',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 2, lineText: 'create 2D array dp[0..m][0..n]', explanation: 'Table size is (m+1) x (n+1) to include empty string base cases.' },
      { lineIndex: 6, lineText: 'dp[i][j] := 1 + dp[i-1][j-1]', explanation: 'Matching character extends previous diagonal solution by 1.' },
      { lineIndex: 8, lineText: 'dp[i][j] := max(...)', explanation: 'Mismatch: inherit best result from excluding a character from s1 or s2.' },
      { lineIndex: 12, lineText: 'return dp[m][n]', explanation: 'Bottom-right cell contains the global maximum LCS length.' },
    ],
    terminationCondition: 'Table fills in m * n iterations.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function lcs(s1: string, s2: string): { length: number; sequence: string } {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to reconstruct string
  let lcsStr = '';
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      lcsStr = s1[i - 1] + lcsStr;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return { length: dp[m][n], sequence: lcsStr };
}`,
    signature: 'function lcs(s1: string, s2: string): { length: number; sequence: string }',
    inputValidation: 'Empty strings yield length 0 and empty sequence.',
    variables: [
      { name: 'm, n', type: 'number', purpose: 'Lengths of strings s1 and s2.' },
      { name: 'dp', type: 'number[][]', purpose: '2D table storing optimal prefix solutions.' },
      { name: 'lcsStr', type: 'string', purpose: 'Reconstructed common subsequence.' },
    ],
    lineByLine: [
      { line: 4, code: 'const dp = Array.from(...)', explanation: 'Allocate (m+1) x (n+1) table.' },
      { line: 8, code: 'if (s1[i-1] === s2[j-1])', explanation: 'Match condition.' },
      { line: 9, code: 'dp[i][j] = 1 + dp[i-1][j-1];', explanation: 'Diagonal transition.' },
      { line: 11, code: 'dp[i][j] = Math.max(...)', explanation: 'Horizontal/vertical transition.' },
      { line: 20, code: 'while (i > 0 && j > 0)', explanation: 'Backtracking loop for reconstruction.' },
    ],
    returnExplanation: 'Returns object containing both the maximum length and the reconstructed subsequence string.',
    commonBugs: [
      'Using s1[i] instead of s1[i - 1], causing 1-off indexing errors against 1-based DP table.',
      'Reconstructing string by appending to the end instead of prepending (reversing the sequence).',
    ],
    edgeCaseHandling: ['Empty string returns length 0 and empty string sequence.'],
  },

  correctness: {
    intuitiveExplanation: 'If the last characters match, any optimal solution must include this match plus the optimal solution of the remaining prefixes. If they do not match, the optimal solution cannot use both last characters, so it must equal the better of omitting s1\'s character or s2\'s character.',
    formalProof: {
      method: 'Dynamic Programming Recurrence',
      invariantOrClaim: 'dp[i][j] is the length of the Longest Common Subsequence of s1[0..i-1] and s2[0..j-1].',
      initialization: 'Base case: dp[0][j] = dp[i][0] = 0 because any prefix of length 0 has LCS 0.',
      maintenance: 'Case 1: s1[i-1] == s2[j-1]. Let this character be c. Any common subsequence can be extended by c. So LCS(s1[0..i-1], s2[0..j-1]) = 1 + LCS(s1[0..i-2], s2[0..j-2]). Case 2: s1[i-1] != s2[j-1]. The LCS cannot end in both characters, so it must be contained in either s1[0..i-2] and s2[0..j-1] or s1[0..i-1] and s2[0..j-2]. Taking the maximum ensures optimality.',
      termination: 'The nested loops compute every entry row by row from top-left to bottom-right, terminating at dp[m][n].',
      conclusion: 'By induction on prefix lengths, dp[m][n] is the exact maximum LCS length.',
    },
  },

  complexityAnalysis: {
    bestCase: { complexity: 'O(m * n)', explanation: 'All m * n cells must be filled.', condition: 'Any input.' },
    averageCase: { complexity: 'O(m * n)', explanation: 'Nested loops run m * n times.', condition: 'General input.' },
    worstCase: { complexity: 'O(m * n)', explanation: 'm * n cells filled.', condition: 'General input.' },
    auxiliarySpace: { complexity: 'O(m * n)', explanation: 'Table of size (m+1) x (n+1).', },
    totalMemory: 'O(m * n) for DP table.',
    bigOExplanation: 'Theta(m * n) time and space.',
    scalingBehavior: 'Quadratic in terms of string lengths. For strings of length 1,000, 1 million operations (instantaneous).',
  },

  advantagesAndLimitations: {
    strengths: ['Finds globally optimal subsequence.', 'Provides foundation for git diff and sequence alignment.'],
    limitations: ['O(m * n) memory is large for long genome sequences.'],
    memoryTradeOffs: ['O(m * n) memory to allow string reconstruction.'],
    poorChoiceScenarios: ['Millions of characters where Hirschberg’s algorithm is required.'],
  },

  comparisons: [
    {
      algorithm: 'Longest Common Substring',
      timeComplexity: 'Both O(m * n)',
      spaceComplexity: 'Both O(m * n)',
      stabilityOrType: 'String algorithms',
      similarities: 'Both use 2D DP grids.',
      differences: 'Substring requires contiguous characters (resets to 0 on mismatch); Subsequence allows non-contiguous gaps.',
      whenToPreferThis: 'When searching for shared patterns with gaps (diffs, mutations).',
      whenToPreferAlternative: 'When searching for exact contiguous phrases.',
    },
  ],

  commonMistakes: [
    {
      title: 'Confusing 0-Indexed String with 1-Indexed DP Table',
      misconception: 'Accessing s1[i] instead of s1[i - 1].',
      badCodeOrApproach: 'if (s1[i] === s2[j])',
      correctApproach: 'Use s1[i - 1] === s2[j - 1] because dp table has an extra row and column for empty strings.',
    },
  ],

  exercises: [
    {
      id: 'lcs-ex-1',
      type: 'step-tracing',
      question: 'What is the length of the Longest Common Subsequence of "ABCDE" and "ACE"?',
      options: ['2', '3', '4', '5'],
      correctIndex: 1,
      explanation: 'The characters "A", "C", and "E" appear in both strings in the same order, so the LCS is "ACE" with length 3.',
    },
  ],

  summary: {
    coreIdea: 'LCS uses a 2D dynamic programming grid to find the longest common sequence of characters between two strings in O(m * n) time, powering diff tools and DNA sequence alignment.',
    keyConditions: [
      'Subsequences preserve relative order but do not need to be contiguous.',
      'Recurrence: match -> 1 + diagonal; mismatch -> max(up, left).',
      'Table size is (m+1) x (n+1).',
    ],
    complexitySummary: {
      time: 'O(m * n)',
      space: 'O(m * n) auxiliary memory',
    },
    whenToUse: 'File diffing, version comparison, text similarity, and bioinformatics alignment.',
    prerequisites: ['2D Arrays', 'Dynamic Programming', 'Recursion'],
    nextSteps: [
      { id: 'coin-change-greedy', name: 'Greedy Coin Change', reason: 'Learn how Greedy algorithms differ from Dynamic Programming by making irreversible local choices.' },
    ],
  },
};
