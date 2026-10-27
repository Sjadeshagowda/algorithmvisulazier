import type { AlgorithmStep, DPCell } from '../../types/algorithm';

export function fibonacciDP(n: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const clampedN = Math.max(0, Math.min(15, isNaN(n) ? 8 : Math.floor(n)));

  if (clampedN === 0) {
    steps.push({
      data: {
        type: 'dp',
        table: [[{ row: 0, col: 0, value: 0, state: 'sorted' }]],
        labels: { rows: ['F(n)'], cols: ['n=0'] },
      },
      description: 'Computing Fibonacci(0). Base case by definition: F(0) = 0.',
      highlightLines: [2],
      operation: 'Base Case F(0)',
      phase: 'Complete',
      auxiliary: [{ label: 'F(0)', value: 0 }],
      lineExplanation: 'F(0) := 0',
    });
    return steps;
  }

  if (clampedN === 1) {
    steps.push({
      data: {
        type: 'dp',
        table: [[
          { row: 0, col: 0, value: 0, state: 'sorted' },
          { row: 0, col: 1, value: 1, state: 'sorted' },
        ]],
        labels: { rows: ['F(n)'], cols: ['n=0', 'n=1'] },
      },
      description: 'Computing Fibonacci(1). Base cases by definition: F(0) = 0, F(1) = 1.',
      highlightLines: [2, 3],
      operation: 'Base Case F(1)',
      phase: 'Complete',
      auxiliary: [{ label: 'F(1)', value: 1 }],
      lineExplanation: 'F(0) := 0; F(1) := 1',
    });
    return steps;
  }

  const dp: number[] = new Array(clampedN + 1).fill(0);

  const makeTable = (states?: Record<number, DPCell['state']>): DPCell[][] => {
    return [
      dp.map((val, i) => ({
        row: 0,
        col: i,
        value: val === 0 && i > 1 ? '?' : val,
        state: states?.[i] ?? 'default',
      })),
    ];
  };

  steps.push({
    data: {
      type: 'dp',
      table: makeTable(),
      labels: { rows: ['F(n)'], cols: Array.from({ length: clampedN + 1 }, (_, i) => `n=${i}`) },
    },
    description: `Computing Fibonacci(${clampedN}) with Dynamic Programming (Bottom-Up Tabulation). Instead of exponential $O(2^n)$ re-computations, we cache subproblems in a table for linear $O(n)$ time.`,
    highlightLines: [0],
    operation: 'Initialize Table',
    phase: 'Base Cases',
    auxiliary: [{ label: 'Subproblems', value: clampedN + 1 }],
    lineExplanation: 'Initialize dp table of size n+1',
  });

  dp[0] = 0;
  dp[1] = 1;

  steps.push({
    data: {
      type: 'dp',
      table: makeTable({ 0: 'sorted', 1: 'sorted' }),
      labels: { rows: ['F(n)'], cols: Array.from({ length: clampedN + 1 }, (_, i) => `n=${i}`) },
    },
    description: 'Populating base cases: F(0) = 0, F(1) = 1. These are known values that bootstrap the recurrence.',
    highlightLines: [2, 3],
    operation: 'Set Base Cases',
    phase: 'Base Cases Ready',
    reason: 'Fibonacci sequence definition: F(0)=0 and F(1)=1',
    result: 'dp[0]=0, dp[1]=1',
    nextAction: 'Calculate F(2) from F(1) and F(0)',
    auxiliary: [{ label: 'F(0)', value: 0 }, { label: 'F(1)', value: 1 }],
    lineExplanation: 'dp[0] := 0; dp[1] := 1',
  });

  for (let i = 2; i <= clampedN; i++) {
    steps.push({
      data: {
        type: 'dp',
        table: makeTable({ [i - 1]: 'comparing', [i - 2]: 'comparing', [i]: 'active' }),
        labels: { rows: ['F(n)'], cols: Array.from({ length: clampedN + 1 }, (_, j) => `n=${j}`) },
      },
      description: `Computing cell F(${i}) by summing its two previous dependencies: F(${i - 1}) [${dp[i - 1]}] + F(${i - 2}) [${dp[i - 2]}].`,
      highlightLines: [5],
      operation: 'Sum Dependencies',
      phase: `Computing n=${i}`,
      reason: `Recurrence relation: F(n) = F(n-1) + F(n-2)`,
      result: `Sum = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i - 1] + dp[i - 2]}`,
      nextAction: `Store in dp[${i}]`,
      auxiliary: [
        { label: 'F(i-1)', value: dp[i - 1] },
        { label: 'F(i-2)', value: dp[i - 2] },
        { label: 'F(i)', value: dp[i - 1] + dp[i - 2] },
      ],
      lineExplanation: 'dp[i] := dp[i-1] + dp[i-2]',
    });

    dp[i] = dp[i - 1] + dp[i - 2];

    steps.push({
      data: {
        type: 'dp',
        table: makeTable({ [i]: 'sorted' }),
        labels: { rows: ['F(n)'], cols: Array.from({ length: clampedN + 1 }, (_, j) => `n=${j}`) },
      },
      description: `Cached F(${i}) = ${dp[i]} in the DP table. This result is now available in $O(1)$ time for subsequent calculations.`,
      highlightLines: [6],
      operation: 'Store Result',
      phase: `Saved n=${i}`,
      reason: `Save computation permanently to prevent redundant branching`,
      result: `dp[${i}] = ${dp[i]}`,
      nextAction: i < clampedN ? `Advance to compute F(${i + 1})` : 'Tabulation complete',
      auxiliary: [{ label: `dp[${i}]`, value: dp[i] }],
      lineExplanation: 'Store calculated value in table',
    });
  }

  steps.push({
    data: {
      type: 'dp',
      table: makeTable(Object.fromEntries(dp.map((_, i) => [i, 'sorted']))),
      labels: { rows: ['F(n)'], cols: Array.from({ length: clampedN + 1 }, (_, i) => `n=${i}`) },
    },
    description: `Dynamic Programming complete! Fibonacci(${clampedN}) = ${dp[clampedN]}. Computed in linear $O(n)$ time using $O(n)$ space.`,
    highlightLines: [8],
    operation: 'Complete',
    phase: 'Finished',
    auxiliary: [{ label: `Answer F(${clampedN})`, value: dp[clampedN] }],
    lineExplanation: 'return dp[n]',
  });

  return steps;
}

export function lcs(s1: string = 'ABCBDAB', s2: string = 'BDCAB'): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  const makeTable = (highlightRow?: number, highlightCol?: number): DPCell[][] => {
    return dp.map((row, r) =>
      row.map((val, c) => ({
        row: r,
        col: c,
        value: val,
        state:
          r === highlightRow && c === highlightCol
            ? 'active'
            : r === highlightRow || c === highlightCol
            ? 'comparing'
            : r === 0 || c === 0
            ? 'sorted'
            : 'default',
      }))
    );
  };

  steps.push({
    data: {
      type: 'dp',
      table: makeTable(),
      labels: {
        rows: ['Ø', ...s1.split('')],
        cols: ['Ø', ...s2.split('')],
      },
    },
    description: `Computing Longest Common Subsequence between "${s1}" (length ${m}) and "${s2}" (length ${n}). Initialized (m+1)×(n+1) table with zeros for empty prefixes.`,
    highlightLines: [0],
    operation: 'Initialize Matrix',
    phase: 'Base Prefix Ø',
    auxiliary: [{ label: 'String 1', value: s1 }, { label: 'String 2', value: s2 }],
    lineExplanation: 'Initialize dp table with dimensions (m+1) × (n+1)',
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const char1 = s1[i - 1];
      const char2 = s2[j - 1];
      const isMatch = char1 === char2;

      steps.push({
        data: {
          type: 'dp',
          table: makeTable(i, j),
          labels: { rows: ['Ø', ...s1.split('')], cols: ['Ø', ...s2.split('')] },
        },
        description: `Comparing s1[${i - 1}]='${char1}' with s2[${j - 1}]='${char2}'. ${isMatch ? `Characters match! Extending diagonal sequence: dp[${i - 1}][${j - 1}] + 1.` : `Characters differ. Inherit max of top and left neighbours: max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]).`}`,
        highlightLines: [3, 4],
        operation: isMatch ? 'Character Match' : 'Mismatch',
        phase: `Cell (${i}, ${j})`,
        reason: isMatch ? `'${char1}' == '${char2}'` : `'${char1}' ≠ '${char2}'`,
        result: isMatch ? `Extend previous LCS length` : `Take best previous match`,
        auxiliary: [
          { label: 's1 char', value: char1 },
          { label: 's2 char', value: char2 },
          { label: 'Match', value: isMatch ? 'Yes' : 'No' },
        ],
        lineExplanation: 'if s1[i-1] = s2[j-1] then dp[i][j] := dp[i-1][j-1] + 1 else max(top, left)',
      });

      if (isMatch) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  steps.push({
    data: {
      type: 'dp',
      table: makeTable(m, n),
      labels: { rows: ['Ø', ...s1.split('')], cols: ['Ø', ...s2.split('')] },
    },
    description: `LCS Computation complete! The length of the Longest Common Subsequence between "${s1}" and "${s2}" is ${dp[m][n]}.`,
    highlightLines: [9],
    operation: 'Complete',
    phase: 'LCS Found',
    auxiliary: [{ label: 'LCS Length', value: dp[m][n] }],
    lineExplanation: 'return dp[m][n]',
  });

  return steps;
}
