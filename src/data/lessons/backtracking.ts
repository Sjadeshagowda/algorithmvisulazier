import type { AlgorithmLesson } from '../../types/algorithm';

// ============================================================================
// 1. N-QUEENS (BACKTRACKING) LESSON
// ============================================================================
export const nQueensLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A quintessential backtracking algorithm that places N non-attacking queens on an N×N chessboard by incrementally building candidate solutions and abandoning invalid paths as soon as a conflict is detected.',
  mainPurpose: 'To solve constraint satisfaction problems (CSPs) by pruning large state spaces through intelligent trial-and-error.',
  whatIsIt: {
    overview: 'The N-Queens puzzle requires placing N chess queens on an N×N board such that no two queens threaten each other. Because a queen attacks horizontally, vertically, and diagonally, every queen must be placed in a unique row and column with no shared diagonal. Backtracking places a queen row by row: if a candidate square is safe, it places the queen and recurses to the next row; if all squares in a row conflict, it backtracks to the previous row, removes that queen, and tries the next column.',
    smallExample: 'For N = 4: Row 0 places Q at (0, 1). Row 1 places Q at (1, 3). Row 2 places Q at (2, 0). Row 3 places Q at (3, 2). All 4 queens are mutually safe!',
  },
  whyUseIt: {
    problemSolved: 'Finding valid configurations under multiple complex geometric or logical constraints without testing all N^N brute-force combinations.',
    whyItMatters: 'Demonstrates the power of state-space tree pruning: abandoning branches early avoids billions of fruitless calculations.',
    whenToUse: [
      'Constraint Satisfaction Problems (CSPs).',
      'Sudoku, crossword puzzle, and cryptarithmetic solvers.',
      'VLSI semiconductor chip component layout (avoiding electrical signal cross-talk).',
      'Timetable scheduling and classroom assignment with conflict rules.',
    ],
    whenToAvoid: [
      'Very large N (e.g. N > 25) without heuristic optimizations like Minimum Conflicts or SAT solvers.',
      'Problems with simple greedy solutions where backtracking is unnecessary.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Semiconductor Circuit Routing (VLSI)',
      description: 'Placing electronic components on computer microprocessors so that electromagnetic radiation and conductive traces do not interfere.',
      educationalVsProductionNote: 'Direct engineering application in automated chip layout routing.',
    },
    {
      title: 'Automated Timetable and Exam Scheduling',
      description: 'Assigning exam slots and classrooms so that no student has overlapping exams or back-to-back conflicts.',
      educationalVsProductionNote: 'Standard academic and airline crew scheduling technique.',
    },
    {
      title: 'Robotic Motion Path Planning',
      description: 'Planning collision-free trajectories for multi-joint robotic arms through physical obstacle constraints.',
      educationalVsProductionNote: 'Widely used in industrial robotics path planning.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Row-by-Row Strategy',
      description: 'Start at row 0. Each row must contain exactly one queen.',
    },
    {
      stepNumber: 2,
      title: 'Test Column Candidates',
      description: 'Try placing a queen at column col = 0 to N-1.',
    },
    {
      stepNumber: 3,
      title: 'Safety Check',
      description: 'Verify if (row, col) shares a column or diagonal with any queen already placed in previous rows.',
    },
    {
      stepNumber: 4,
      title: 'Recurse or Backtrack',
      description: 'If safe, record placement and recurse on row + 1. If recursive call fails, undo placement (backtrack) and try next column.',
    },
    {
      stepNumber: 5,
      title: 'Base Case Success',
      description: 'When row === N, all N queens have been placed safely without conflicts. Record solution.',
    },
  ],
  workedExample: {
    datasetDescription: 'Solving 4-Queens on a 4x4 board',
    initialState: 'Board 4x4, row = 0',
    steps: [
      {
        stepNumber: 1,
        operation: 'Row 0: Place Queen at (0, 0)',
        stateDisplay: 'Queens: [0, -1, -1, -1]',
        explanation: 'Place Q0 at column 0. Recurse to row 1.',
        whyNecessary: 'First available slot in row 0.',
        beforeState: '[-1, -1, -1, -1]',
        afterState: '[0, -1, -1, -1]',
        nextAction: 'Try row 1.',
        intermediateResult: 'Row 0 queen at col 0.',
      },
      {
        stepNumber: 2,
        operation: 'Row 1: Try cols 0, 1, 2. Place at (1, 2)',
        stateDisplay: 'Queens: [0, 2, -1, -1]',
        explanation: 'Col 0 conflicts vertically with (0,0). Col 1 conflicts diagonally with (0,0). Col 2 is safe! Place Q1 at col 2.',
        whyNecessary: 'Col 2 is the first safe column in row 1.',
        beforeState: '[0, -1, -1, -1]',
        afterState: '[0, 2, -1, -1]',
        nextAction: 'Try row 2.',
        intermediateResult: 'Row 1 queen at col 2.',
      },
      {
        stepNumber: 3,
        operation: 'Row 2: All columns conflict -> Backtrack!',
        stateDisplay: 'Queens: [0, -1, -1, -1]',
        explanation: 'Col 0 (conflict with (0,0)), Col 1 (diagonal with (1,2)), Col 2 (conflict with (1,2)), Col 3 (diagonal with (1,2)). All 4 columns blocked! Backtrack to row 1.',
        whyNecessary: 'Dead end encountered; algorithm undoes previous choice.',
        beforeState: '[0, 2, -1, -1]',
        afterState: '[0, -1, -1, -1]',
        nextAction: 'Try next column in row 1.',
        intermediateResult: 'Removed Q1 from (1, 2).',
      },
      {
        stepNumber: 4,
        operation: 'Row 1: Place Q1 at (1, 3)',
        stateDisplay: 'Queens: [0, 3, -1, -1]',
        explanation: 'Col 3 is safe. Place Q1 at (1, 3). Recurse to row 2.',
        whyNecessary: 'Alternative branch exploration.',
        beforeState: '[0, -1, -1, -1]',
        afterState: '[0, 3, -1, -1]',
        nextAction: 'Try row 2.',
        intermediateResult: 'Row 1 queen at col 3.',
      },
      {
        stepNumber: 5,
        operation: 'Row 2: Col 1 is safe! Place at (2, 1)',
        stateDisplay: 'Queens: [0, 3, 1, -1]',
        explanation: 'Col 0 (conflict), Col 1 (safe!). Place Q2 at (2, 1). Recurse to row 3.',
        whyNecessary: 'Advances to final row.',
        beforeState: '[0, 3, -1, -1]',
        afterState: '[0, 3, 1, -1]',
        nextAction: 'Try row 3.',
        intermediateResult: 'Row 2 queen at col 1.',
      },
      {
        stepNumber: 6,
        operation: 'Row 3: All blocked -> Backtrack all the way to Row 0!',
        stateDisplay: 'Queens: [1, -1, -1, -1]',
        explanation: 'Row 3 is blocked. Backtrack row 2, backtrack row 1, backtrack row 0! Try Q0 at (0, 1).',
        whyNecessary: 'Branch rooted at Q0=(0,0) contains no solutions. Backtrack to root.',
        beforeState: '[0, 3, 1, -1]',
        afterState: '[1, -1, -1, -1]',
        nextAction: 'Explore branch starting at (0, 1).',
        intermediateResult: 'Q0 placed at col 1.',
      },
      {
        stepNumber: 7,
        operation: 'Complete search on Q0=(0, 1) -> Solution Found!',
        stateDisplay: 'Queens: [1, 3, 0, 2]',
        explanation: 'Row 0 at 1, Row 1 at 3, Row 2 at 0, Row 3 at 2. All 4 queens placed safely! Base case reached.',
        whyNecessary: 'All 4 rows satisfied without conflict.',
        beforeState: '[1, 3, 0, -1]',
        afterState: '[1, 3, 0, 2]',
        nextAction: 'Record solution.',
        intermediateResult: 'Solution: [1, 3, 0, 2].',
      },
    ],
    finalState: 'Solution: [1, 3, 0, 2] (Queens at (0,1), (1,3), (2,0), (3,2))',
  },
  advantages: [
    'Drastically prunes the search space compared to brute-force generate-and-test.',
    'Finds all solutions or a single solution.',
    'Strict O(N) auxiliary space for board state and recursion stack.',
  ],
  limitations: [
    'Exponential worst-case time complexity O(N!).',
    'Impractical for N > 30 without local search heuristics.',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(N) time if the very first path explored leads directly to a valid solution without backtracking.',
    averageCaseMeaning: 'Exponential time, but vastly faster than N^N brute force due to pruning.',
    worstCaseMeaning: 'O(N!) time. In the first row there are N choices, in the second at most N-2 choices, in the third N-4, bounding the tree by O(N!).',
    spaceComplexityMeaning: 'O(N) auxiliary space. Board array of size N plus recursion call stack of depth N.',
  },
  relatedAlgorithms: [
    {
      name: 'Sudoku Solver (Backtracking)',
      comparison: 'Sudoku applies the exact same backtracking paradigm with 3 constraints (row, column, 3x3 box).',
    },
  ],
  quiz: [
    {
      question: 'Why are there NO valid solutions to the N-Queens puzzle for board sizes N = 2 and N = 3?',
      options: [
        'Because the board is too small for mathematical formulas.',
        'Because on 2x2 and 3x3 boards, every possible placement of queens results in at least one horizontal, vertical, or diagonal conflict.',
        'Because N must always be an even number.',
        'Because chess rules prohibit small boards.',
      ],
      correctIndex: 1,
      explanation: 'Exhaustive check shows that on a 2x2 board, placing 2 queens always results in an attack. On a 3x3 board, placing 3 queens always leaves at least 2 queens on the same row, col, or diagonal. The minimum non-trivial board with a solution is N = 4.',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'N-Queens is named after the standard chess queen piece, which can move any number of squares horizontally, vertically, or diagonally.',
    problemSolved: 'Places N non-attacking queens on an N×N board.',
    problemNotSolved: 'Does not find solutions in polynomial time (it is NP-hard in generalized form).',
    whyLearn: 'The universal benchmark for teaching constraint satisfaction and recursive backtracking with state restoration.',
    prerequisites: ['Recursion and call stacks', '2D coordinate geometry (rows, cols, diagonals)', 'Backtracking state undo'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Place N queens on an N×N grid such that no two queens attack each other.',
    naiveApproachInefficiency: 'Brute force testing all N^N placements would check 8⁸ = 16,777,216 boards for N = 8. Backtracking checks only a tiny fraction (just 15,720 nodes) by pruning invalid branches immediately.',
    coreIdeaUsed: 'Place one queen per row. If placing at (row, col) violates any constraint, prune the entire subtree immediately and backtrack.',
    utilityExplanation: 'Never explores subtrees that already contain an illegal placement.',
    workingConditions: ['N >= 4 (or N = 1). For N = 2 and N = 3, no solutions exist.'],
    whenAnotherIsBetter: 'For N > 1,000,000, local search algorithms like the Min-Conflicts heuristic can find a solution in O(N) time.',
    analogyOrRealLifeExample: 'Walking through a hedge maze: at each fork, you choose a path. If you hit a dead end, you retrace your steps back to the fork, mark the path as bad, and take the other route.',
  },

  inputOutputAssumptions: {
    expectedInput: 'Board size N (typically 4 <= N <= 12).',
    expectedOutput: 'List of all valid board configurations (or a single solution).',
    constraints: 'N >= 1.',
    preconditions: 'None.',
    specialCases: ['N = 1 has 1 solution.', 'N = 2 and N = 3 have 0 solutions.', 'N = 4 has 2 solutions.', 'N = 8 has 92 solutions.'],
    isSortedRequired: false,
    brokenAssumptionsBehavior: 'If N < 4 (and N != 1), returns empty list indicating no solution is possible.',
  },

  coreIntuition: {
    simpleExplanation: 'Place one queen in row 0. Then go to row 1 and find a spot where the first queen cannot shoot it. Then go to row 2. If you get stuck and cannot place a queen in any column, back up to the previous row, slide that queen to the right, and try again.',
    keyDrivingDecision: 'Safe check: same column (c1 === c2) or same diagonal (|r1 - r2| === |c1 - c2|).',
    whyRepeatedOperationWorks: 'Systematically explores the search tree, guaranteed to find all valid placements without missing any.',
    paradigmSpecificDetail: 'Backtracking: Make choice -> Recurse -> Undo choice (board[row] = -1).',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure solveNQueens(row, board, N, solutions)',
      '  if row = N then',
      '    solutions.append(copy(board))',
      '    return',
      '  end if',
      '  for col from 0 to N - 1 do',
      '    if isSafe(row, col, board) then',
      '      board[row] := col          // Make choice',
      '      solveNQueens(row + 1, board, N, solutions) // Recurse',
      '      board[row] := -1          // Undo choice (Backtrack)',
      '    end if',
      '  end for',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'if row = N then', explanation: 'Base case: successfully placed a queen in all N rows.' },
      { lineIndex: 5, lineText: 'for col from 0 to N - 1 do', explanation: 'Iterate over all column candidates in current row.' },
      { lineIndex: 6, lineText: 'if isSafe(row, col, board)', explanation: 'Pruning: only proceed if no conflict exists.' },
      { lineIndex: 7, lineText: 'board[row] := col', explanation: 'Record placement choice.' },
      { lineIndex: 8, lineText: 'solveNQueens(row + 1, ...)', explanation: 'Advance to next row.' },
      { lineIndex: 9, lineText: 'board[row] := -1', explanation: 'CRITICAL: Restore state so subsequent branches are not corrupted.' },
    ],
    terminationCondition: 'Recursion tree fully traversed.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function nQueens(n: number): number[][] {
  const solutions: number[][] = [];
  const board: number[] = new Array(n).fill(-1);

  function isSafe(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col) return false; // Same column
      if (Math.abs(c - col) === Math.abs(r - row)) return false; // Diagonal
    }
    return true;
  }

  function place(row: number): void {
    if (row === n) {
      solutions.push([...board]); // Found valid configuration
      return;
    }

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row] = col;      // Make choice
        place(row + 1);         // Recurse
        board[row] = -1;       // Backtrack (state restoration)
      }
    }
  }

  place(0);
  return solutions;
}`,
    signature: 'function nQueens(n: number): number[][]',
    inputValidation: 'Returns empty array for n = 2 or n = 3.',
    variables: [
      { name: 'board', type: 'number[]', purpose: 'board[row] = col stores queen position in each row.' },
      { name: 'solutions', type: 'number[][]', purpose: 'List of all valid board arrangements.' },
    ],
    lineByLine: [
      { line: 5, code: 'function isSafe(row, col)', explanation: 'Checks column and diagonal conflicts against previous rows.' },
      { line: 8, code: 'if (Math.abs(c - col) === Math.abs(r - row)) return false;', explanation: 'Slope of 1 or -1 indicates diagonal conflict.' },
      { line: 14, code: 'if (row === n)', explanation: 'Base case: all queens placed.' },
      { line: 21, code: 'board[row] = col; place(row + 1); board[row] = -1;', explanation: 'Choose, recurse, backtrack.' },
    ],
    returnExplanation: 'Returns array of solutions where each solution is an array of column positions per row.',
    commonBugs: [
      'Forgetting to reset board[row] = -1 upon return, leaking state to sibling branches.',
      'Checking all N rows in isSafe instead of only rows 0 to row - 1.',
      'Incorrect diagonal collision check.',
    ],
    edgeCaseHandling: ['n = 1 returns [[0]]; n = 2, 3 return [].'],
  },

  correctness: {
    intuitiveExplanation: 'Because the algorithm tries every safe column in row 0, and for each choice recursively tries every safe column in row 1, and so on, it exhaustively visits every branch of the valid state tree. Pruning only discards branches that already have two attacking queens (which can never become valid). Hence, it finds all solutions without omitting any.',
    formalProof: {
      method: 'Backtracking Completeness',
      invariantOrClaim: 'The recursive procedure place(row) correctly enumerates all valid placements of queens for rows row through n-1 given the safe prefix board[0..row-1].',
      initialization: 'Base case: At row = n, all n queens are placed and isSafe has verified no conflicts exist. board[0..n-1] is a valid solution.',
      maintenance: 'For row < n, the loop tests every column col in [0..n-1]. If isSafe(row, col) is true, placing queen at col maintains the invariant that board[0..row] has no conflicts. By induction, place(row+1) explores all completions. Resetting board[row] = -1 restores state for the next candidate.',
      termination: 'The state tree is finite with maximum depth n and branching factor at most n. The algorithm must terminate.',
      conclusion: 'N-Queens backtracking is complete and correct.',
    },
  },

  complexityAnalysis: {
    bestCase: { complexity: 'O(N)', explanation: 'If only looking for one solution and first path is valid.', condition: 'Single solution mode.' },
    averageCase: { complexity: 'Exponential O(N!)', explanation: 'Pruning reduces state space from N^N to upper bound O(N!).', condition: 'General N.' },
    worstCase: { complexity: 'O(N!)', explanation: 'Row 0 has N choices, row 1 at most N-2, row 2 at most N-4, giving O(N!).', condition: 'All solutions search.' },
    auxiliarySpace: { complexity: 'O(N)', explanation: 'Board array of size N + call stack of depth N.', },
    totalMemory: 'O(N) auxiliary space.',
    bigOExplanation: 'Exponential upper bound O(N!), space O(N).',
    scalingBehavior: 'Rapidly becomes computationally expensive for N > 15.',
  },

  advantagesAndLimitations: {
    strengths: ['Finds all solutions without missing any.', 'Pruning eliminates vast majority of invalid branches.', 'Strictly O(N) memory.'],
    limitations: ['Exponential runtime prevents scaling to large N (N > 25).'],
    memoryTradeOffs: ['O(N) memory overhead.'],
    poorChoiceScenarios: ['Massive N (use Min-Conflicts local search heuristic instead).'],
  },

  comparisons: [
    {
      algorithm: 'Brute Force Generate-and-Test',
      timeComplexity: 'Brute Force: O(N^N) vs Backtracking: O(N!) with massive practical pruning',
      spaceComplexity: 'Both O(N)',
      stabilityOrType: 'Search',
      similarities: 'Both explore possible board configurations.',
      differences: 'Brute force places all N queens before checking safety; Backtracking checks safety at each step and prunes.',
      whenToPreferThis: 'Always prefer Backtracking over Brute Force.',
      whenToPreferAlternative: 'Never use brute force.',
    },
  ],

  commonMistakes: [
    {
      title: 'Forgetting to Undo Placement (Missing Backtrack Step)',
      misconception: 'Assuming the variable will naturally overwrite.',
      badCodeOrApproach: 'board[row] = col; place(row + 1); // missing board[row] = -1',
      correctApproach: 'Always restore state: board[row] = -1 after recursive call.',
    },
  ],

  exercises: [
    {
      id: 'nq-ex-1',
      type: 'conceptual',
      question: 'How many total solutions exist for the 8-Queens problem on a standard 8x8 chessboard?',
      options: ['2 solutions', '12 solutions', '92 solutions', '256 solutions'],
      correctIndex: 2,
      explanation: 'There are exactly 92 distinct solutions to the 8-Queens problem (which reduce to 12 unique fundamental solutions under rotation and reflection symmetry).',
    },
  ],

  summary: {
    coreIdea: 'N-Queens uses recursive backtracking to place queens row by row, testing column and diagonal safety and undoing invalid choices, finding all non-attacking arrangements in O(N!) time and O(N) space.',
    keyConditions: [
      'Diagonal conflict formula: |c1 - c2| === |r1 - r2|.',
      'Must restore state (board[row] = -1) when backtracking.',
      'Valid solutions exist only for N = 1 and N >= 4.',
    ],
    complexitySummary: {
      time: 'O(N!)',
      space: 'O(N) auxiliary memory',
    },
    whenToUse: 'Constraint satisfaction, puzzle solving, scheduling, and circuit placement.',
    prerequisites: ['Recursion', 'Backtracking', 'Chess Queen rules'],
    nextSteps: [
      { id: 'bubble-sort', name: 'Bubble Sort', reason: 'Review the entire curriculum from the beginning or try different categories!' },
    ],
  },
};
