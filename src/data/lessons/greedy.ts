import type { AlgorithmLesson } from '../../types/algorithm';

// ============================================================================
// 1. GREEDY COIN CHANGE LESSON
// ============================================================================
export const coinChangeGreedyLesson: AlgorithmLesson = {
  oneSentenceDefinition: 'A greedy heuristic algorithm that makes change for an amount by repeatedly selecting the largest available coin denomination that does not exceed the remaining balance.',
  mainPurpose: 'To minimize the total count of physical coins dispensed using immediate, locally optimal choices without backtracking.',
  whatIsIt: {
    overview: 'The Greedy approach solves optimization problems by always choosing the best immediate, local option without looking ahead or considering future consequences. For the coin change problem, it sorts available denominations from largest to smallest. It divides the remaining balance by the largest coin, takes that many coins, subtracts their value, and moves to the next smaller denomination until the balance reaches zero.',
    smallExample: 'To make 63¢ with US coins [25¢, 10¢, 5¢, 1¢]: Take two 25¢ coins (50¢, remainder 13¢). Next largest is 10¢: take one 10¢ (10¢, remainder 3¢). 5¢ is too large. Take three 1¢ coins (3¢, remainder 0¢). Total: 6 coins [25, 25, 10, 1, 1, 1].',
  },
  whyUseIt: {
    problemSolved: 'Dispensing change with the minimum count of physical coins or bills in canonical currency systems.',
    whyItMatters: 'It illustrates the Greedy Choice Property: when a problem exhibits both optimal substructure and the greedy choice property, local decisions produce globally optimal solutions with O(n) speed, avoiding the complexity of dynamic programming.',
    whenToUse: [
      'Canonical coin systems (US Dollar, Euro, British Pound) where the greedy choice is mathematically proven to be optimal.',
      'Vending machines, cash registers, and ATM bill dispensing mechanisms.',
      'Resource allocation problems where greedily taking the largest chunk is provably optimal.',
    ],
    whenToAvoid: [
      'Non-canonical coin systems (e.g. denominations [1, 3, 4] for amount 6: greedy takes 4 + 1 + 1 = 3 coins, whereas optimal is 3 + 3 = 2 coins!). Dynamic Programming must be used for arbitrary coins!',
      'Systems without a 1-unit coin (greedy might fail to make change entirely, e.g. coins [5, 2] for amount 6 takes 5 and gets stuck with 1 remainder).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Automated Teller Machines (ATMs)',
      description: 'Dispensing bills in bank ATMs ($100, $50, $20, $10) to minimize the total number of paper notes dispensed.',
      educationalVsProductionNote: 'Direct production standard in ATM cash dispensers.',
    },
    {
      title: 'Vending Machines & Self-Checkout Kiosks',
      description: 'Calculating physical coins returned as change to prevent coin hoppers from depleting quickly.',
      educationalVsProductionNote: 'Standard embedded firmware logic in point-of-sale hardware.',
    },
    {
      title: 'Data Compression (Huffman Coding)',
      description: 'Greedily combining the two least frequent characters into tree nodes to build an optimal prefix-free code.',
      educationalVsProductionNote: 'Production standard in JPEG, MP3, and GZIP compression.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Sort Denominations Descending',
      description: 'Arrange available coin denominations from largest to smallest (e.g. [25, 10, 5, 1]).',
    },
    {
      stepNumber: 2,
      title: 'Calculate Coin Count',
      description: 'For current coin value, compute count = floor(remainingAmount / coinValue).',
    },
    {
      stepNumber: 3,
      title: 'Take Coins and Reduce Balance',
      description: 'If count > 0, record count coins and subtract (count * coinValue) from the remaining balance.',
    },
    {
      stepNumber: 4,
      title: 'Check Termination',
      description: 'If remainingAmount === 0, stop and return. Otherwise, move to the next smaller coin denomination.',
    },
  ],
  workedExample: {
    datasetDescription: 'Making change for 36¢ with denominations [25, 10, 5, 1]',
    initialState: 'Coins: [25, 10, 5, 1], Amount: 36',
    steps: [
      {
        stepNumber: 1,
        operation: 'Evaluate coin 25¢: floor(36 / 25) = 1',
        stateDisplay: 'Coins: [25], Remaining: 11',
        explanation: '36 / 25 gives 1 coin of 25¢. Remaining balance = 36 - 25 = 11.',
        whyNecessary: 'Greedy choice selects the largest possible denomination.',
        beforeState: 'Amount: 36',
        afterState: 'Amount: 11',
        nextAction: 'Move to coin 10¢.',
        intermediateResult: '1x 25¢ coin selected.',
      },
      {
        stepNumber: 2,
        operation: 'Evaluate coin 10¢: floor(11 / 10) = 1',
        stateDisplay: 'Coins: [25, 10], Remaining: 1',
        explanation: '11 / 10 gives 1 coin of 10¢. Remaining balance = 11 - 10 = 1.',
        whyNecessary: 'Greedy choice selects next largest denomination.',
        beforeState: 'Amount: 11',
        afterState: 'Amount: 1',
        nextAction: 'Move to coin 5¢.',
        intermediateResult: '1x 25¢, 1x 10¢ selected.',
      },
      {
        stepNumber: 3,
        operation: 'Evaluate coin 5¢: floor(1 / 5) = 0',
        stateDisplay: 'Coins: [25, 10], Remaining: 1',
        explanation: '5 is larger than remaining balance 1. Skip 5¢.',
        whyNecessary: 'Cannot take a coin that exceeds remaining balance.',
        beforeState: 'Amount: 1',
        afterState: 'Amount: 1',
        nextAction: 'Move to coin 1¢.',
        intermediateResult: '0x 5¢ coins selected.',
      },
      {
        stepNumber: 4,
        operation: 'Evaluate coin 1¢: floor(1 / 1) = 1',
        stateDisplay: 'Coins: [25, 10, 1], Remaining: 0',
        explanation: 'Take 1 coin of 1¢. Remaining balance reaches 0. Process complete.',
        whyNecessary: 'Final penny exhausts balance.',
        beforeState: 'Amount: 1',
        afterState: 'Amount: 0',
        nextAction: 'Return coin change solution.',
        intermediateResult: 'Solution: [25, 10, 1] (Total 3 coins).',
      },
    ],
    finalState: 'Picked 3 coins: [25, 10, 1]',
  },
  advantages: [
    'Extremely fast: runs in O(d) time where d is the number of coin denominations.',
    'Uses strictly O(1) auxiliary memory.',
    'Intuitive and directly matches human mental arithmetic.',
    'Provably optimal for standard world currencies (canonical coin systems).',
  ],
  limitations: [
    'Fails to produce the optimal answer for non-canonical coin systems (e.g. coins [1, 3, 4] for amount 6).',
    'Cannot recover from dead ends if denominations do not include a 1-unit coin (requires DP or Backtracking).',
  ],
  complexityDetailed: {
    bestCaseMeaning: 'O(1) time when the amount is a multiple of the largest coin denomination.',
    averageCaseMeaning: 'O(d) time where d is the number of denominations.',
    worstCaseMeaning: 'O(d) time after sorting denominations (or O(d log d) to sort them once).',
    spaceComplexityMeaning: 'O(1) auxiliary space (excluding array of returned coins).',
  },
  relatedAlgorithms: [
    {
      name: 'Dynamic Programming Coin Change',
      comparison: 'DP explores all combinations using dp[i] = min(dp[i], 1 + dp[i - c]), guaranteeing the absolute minimum coin count for ANY coin system in O(amount * d) time.',
    },
  ],
  quiz: [
    {
      question: 'For which coin denomination system does the Greedy Coin Change algorithm produce a SUBOPTIMAL result for target amount 6?',
      options: [
        'Coins: [25, 10, 5, 1]',
        'Coins: [4, 3, 1]',
        'Coins: [50, 20, 10, 5, 2, 1]',
        'Coins: [100, 50, 25, 10, 5, 1]',
      ],
      correctIndex: 1,
      explanation: 'For amount 6 with coins [4, 3, 1], greedy takes 4 + 1 + 1 (3 coins). However, the optimal answer is 3 + 3 (only 2 coins)!',
    },
  ],

  introduction: {
    nameOriginAndMeaning: 'Greedy Coin Change is named because it greedily snatches the largest possible coin denomination at every single step without considering the future.',
    problemSolved: 'Makes change for a target amount using the minimum number of coins for canonical currency systems.',
    problemNotSolved: 'Does NOT guarantee optimal coin counts for non-canonical or arbitrary coin systems.',
    whyLearn: 'It is the quintessential example of when a greedy algorithm works, and the classic counterexample illustrating when greedy strategies fail and Dynamic Programming is required.',
    prerequisites: ['Basic integer division and modulo', 'Greedy choice property concept'],
  },

  whyDoWeNeedIt: {
    problemStatement: 'Given coin denominations and an amount, return the fewest coins that sum to that amount.',
    naiveApproachInefficiency: 'Checking all subsets of coins takes exponential time. DP takes O(amount * d) time. Greedy takes O(d) time.',
    coreIdeaUsed: 'Greedy choice: always subtract the largest denomination that fits into the remaining balance.',
    utilityExplanation: 'Extremely fast O(d) runtime with zero table allocations.',
    workingConditions: ['Canonical coin systems (e.g. US, Euro, UK currencies).', 'Presence of a 1-unit coin to guarantee feasibility.'],
    whenAnotherIsBetter: 'When coin denominations are non-canonical (e.g. [1, 3, 4] or [2, 5]), Dynamic Programming MUST be used.',
    analogyOrRealLifeExample: 'Paying someone $63 in cash: you instinctively give two $20s, a $10, a $5, and three $1s, always picking the largest bill you can from your wallet first.',
  },

  inputOutputAssumptions: {
    expectedInput: 'An array of positive coin denominations and a non-negative integer amount.',
    expectedOutput: 'A list or count of coins used to make change.',
    constraints: 'amount >= 0, coin values > 0.',
    preconditions: 'Coins should be sorted descending.',
    specialCases: ['amount = 0 returns 0 coins.'],
    isSortedRequired: true,
    brokenAssumptionsBehavior: 'If coins are not canonical, output may use more coins than mathematically necessary.',
  },

  coreIntuition: {
    simpleExplanation: 'Always grab the biggest coin or bill that is not bigger than what you owe. Keep doing that until you owe nothing.',
    keyDrivingDecision: 'count = floor(remaining / coin); remaining %= coin;',
    whyRepeatedOperationWorks: 'For canonical coin systems, a larger denomination is always more efficient than the combination of smaller denominations that could replace it.',
    paradigmSpecificDetail: 'Greedy Choice Property: a globally optimal solution can be reached by making locally optimal choices at each stage.',
  },

  pseudocodeWalkthrough: {
    code: [
      'procedure greedyCoinChange(coins, amount)',
      '  sort coins in descending order',
      '  result := []',
      '  for each coin in coins do',
      '    while amount >= coin do',
      '      result.append(coin)',
      '      amount := amount - coin',
      '    end while',
      '  end for',
      '  return result',
      'end procedure',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'sort coins in descending order', explanation: 'Ensure largest coins are evaluated first.' },
      { lineIndex: 4, lineText: 'while amount >= coin do', explanation: 'Take as many of this coin as possible.' },
      { lineIndex: 6, lineText: 'amount := amount - coin', explanation: 'Reduce remaining balance.' },
    ],
    terminationCondition: 'Terminates when all coin denominations have been evaluated.',
  },

  sourceCodeWalkthrough: {
    language: 'typescript',
    code: `export function coinChangeGreedy(coins: number[], amount: number): { count: number; coinsUsed: number[] } {
  const sorted = [...coins].sort((a, b) => b - a);
  const coinsUsed: number[] = [];
  let remaining = amount;

  for (const coin of sorted) {
    if (remaining === 0) break;
    const numCoins = Math.floor(remaining / coin);
    if (numCoins > 0) {
      for (let i = 0; i < numCoins; i++) {
        coinsUsed.push(coin);
      }
      remaining -= numCoins * coin;
    }
  }

  return { count: coinsUsed.length, coinsUsed };
}`,
    signature: 'function coinChangeGreedy(coins: number[], amount: number): { count: number; coinsUsed: number[] }',
    inputValidation: 'If amount <= 0, returns count 0.',
    variables: [
      { name: 'sorted', type: 'number[]', purpose: 'Denominations arranged in descending order.' },
      { name: 'remaining', type: 'number', purpose: 'Remaining monetary balance to dispense.' },
      { name: 'coinsUsed', type: 'number[]', purpose: 'List of individual coins selected.' },
    ],
    lineByLine: [
      { line: 2, code: 'const sorted = [...coins].sort((a, b) => b - a);', explanation: 'Sort descending.' },
      { line: 8, code: 'const numCoins = Math.floor(remaining / coin);', explanation: 'Compute quotient.' },
      { line: 13, code: 'remaining -= numCoins * coin;', explanation: 'Subtract value.' },
    ],
    returnExplanation: 'Returns total count and array of coins used.',
    commonBugs: [
      'Assuming greedy coin change works on all coin systems without checking canonical properties.',
      'Forgetting to sort denominations descending first.',
    ],
    edgeCaseHandling: ['amount = 0 returns 0 coins immediately.'],
  },

  correctness: {
    intuitiveExplanation: 'In a canonical currency like US coins, 2 dimes and a nickel (25¢) are always better replaced by a single quarter (1 coin vs 3 coins). Thus, you can never improve a solution by choosing smaller coins when a larger coin fits.',
    formalProof: {
      method: 'Exchange Argument',
      invariantOrClaim: 'For canonical coin systems, there exists an optimal solution that includes the greedy choice (the largest coin <= amount).',
      initialization: 'Let Opt be an optimal solution. If Opt contains the largest coin c, then the greedy choice is part of an optimal solution.',
      maintenance: 'If Opt does not contain c, then the coins in Opt that sum to at least c can be exchanged for coin c without increasing the total coin count. For example, in US currency, any combination of nickels and dimes summing to >= 25 uses at least 2 coins, which can be replaced by one 25¢ coin, strictly decreasing or maintaining the coin count.',
      termination: 'By induction on amount, repeatedly taking the largest coin maintains optimality until amount reaches 0.',
      conclusion: 'The greedy choice is provably optimal for canonical coin systems.',
    },
  },

  complexityAnalysis: {
    bestCase: { complexity: 'O(d)', explanation: 'd is the number of coin denominations.', condition: 'Amount is multiple of largest coin.' },
    averageCase: { complexity: 'O(d)', explanation: 'Inspects each denomination once.', condition: 'General input.' },
    worstCase: { complexity: 'O(d log d)', explanation: 'O(d log d) to sort denominations if unsorted; O(d) iterations.', condition: 'Unsorted denominations.' },
    auxiliarySpace: { complexity: 'O(1)', explanation: 'Excluding the output list.', },
    totalMemory: 'O(d) for coins list.',
    bigOExplanation: 'Theta(d) where d is denomination count.',
    scalingBehavior: 'Independent of the target amount value (unlike DP which is O(amount * d)).',
  },

  advantagesAndLimitations: {
    strengths: ['Blazingly fast: O(d) runtime independent of amount size.', 'O(1) memory overhead.'],
    limitations: ['Fails on non-canonical coin sets (e.g. [1, 3, 4] for 6).'],
    memoryTradeOffs: ['O(1) memory vs DP O(amount) table.'],
    poorChoiceScenarios: ['Non-canonical coin systems (requires DP).'],
  },

  comparisons: [
    {
      algorithm: 'Dynamic Programming Coin Change',
      timeComplexity: 'Greedy: O(d) vs DP: O(amount * d)',
      spaceComplexity: 'Greedy: O(1) vs DP: O(amount)',
      stabilityOrType: 'Optimization',
      similarities: 'Both solve coin change.',
      differences: 'Greedy makes irrevocable local choices and only works on canonical systems. DP guarantees global optimum on ALL coin systems.',
      whenToPreferThis: 'Standard real-world currencies (US, Euro, etc.).',
      whenToPreferAlternative: 'Arbitrary custom coin systems or puzzle problems.',
    },
  ],

  commonMistakes: [
    {
      title: 'Assuming Greedy Works on Arbitrary Denominations',
      misconception: 'Believing greedy works for any set of numbers.',
      badCodeOrApproach: 'Using greedy coin change on [1, 3, 4] with amount 6.',
      correctApproach: 'Use Dynamic Programming for non-canonical coin systems.',
    },
  ],

  exercises: [
    {
      id: 'cc-ex-1',
      type: 'challenge',
      question: 'What coins does the greedy algorithm pick for amount 6 with denominations [4, 3, 1], and how many coins is optimal?',
      options: [
        'Greedy picks [4, 1, 1] (3 coins); Optimal is [3, 3] (2 coins).',
        'Greedy picks [3, 3] (2 coins); Optimal is [4, 1, 1] (3 coins).',
        'Greedy and optimal both pick [3, 3].',
        'Greedy cannot make change.',
      ],
      correctIndex: 0,
      explanation: 'Greedy chooses the largest coin 4 first, leaving 2, which requires two 1s (total 3 coins). Optimal is two 3s (total 2 coins). This is the classic counterexample.',
    },
  ],

  summary: {
    coreIdea: 'Greedy Coin Change repeatedly selects the largest available denomination that fits into the remaining balance, running in O(d) time and provably optimal for canonical currencies like US and Euro.',
    keyConditions: [
      'Denominations must be sorted descending.',
      'Only optimal for canonical coin systems.',
      'Use DP for arbitrary coin systems.',
    ],
    complexitySummary: {
      time: 'O(d)',
      space: 'O(1) auxiliary space',
    },
    whenToUse: 'Cash registers, vending machines, and canonical currency change dispensing.',
    prerequisites: ['Greedy choice property', 'Basic arithmetic'],
    nextSteps: [
      { id: 'n-queens', name: 'N-Queens (Backtracking)', reason: 'Learn Backtracking to systematically explore decision trees and undo invalid choices.' },
    ],
  },
};
