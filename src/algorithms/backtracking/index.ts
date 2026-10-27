import type { AlgorithmStep, ElementState } from '../../types/algorithm';

export function nQueens(n: number): AlgorithmStep[] {
  const clampedN = Math.max(1, Math.min(8, isNaN(n) ? 4 : Math.floor(n)));
  const steps: AlgorithmStep[] = [];
  const board: number[] = new Array(clampedN).fill(-1); // board[row] = col
  let attempts = 0;
  let backtracks = 0;

  const makeGrid = (extras?: Record<string, 'comparing' | 'active' | 'found' | 'excluded'>): ElementState[][] => {
    return Array.from({ length: clampedN }, (_, row) =>
      Array.from({ length: clampedN }, (_, col) => {
        const key = `${row},${col}`;
        if (extras?.[key]) return extras[key];
        if (board[row] === col) return 'selected';
        return 'default';
      })
    );
  };

  steps.push({
    data: { type: 'grid', cells: makeGrid() },
    description: `Solving ${clampedN}-Queens puzzle on a ${clampedN}×${clampedN} board. Goal: Place ${clampedN} queens so that no two attack each other (no shared row, column, or diagonal).`,
    highlightLines: [0],
    operation: 'Initialize Board',
    phase: 'Setup',
    auxiliary: [{ label: 'Board Size', value: `${clampedN}×${clampedN}` }, { label: 'Queens Placed', value: '0' }],
    lineExplanation: 'Initialize empty n×n chessboard',
  });

  function getConflictReason(row: number, col: number): string | null {
    for (let r = 0; r < row; r++) {
      if (board[r] === col) return `Shares column ${col} with queen at row ${r}`;
      if (Math.abs(board[r] - col) === Math.abs(r - row)) {
        return `Shares diagonal with queen at (${r}, ${board[r]})`;
      }
    }
    return null;
  }

  function solve(row: number): boolean {
    if (row === clampedN) return true;

    for (let col = 0; col < clampedN; col++) {
      attempts++;
      const key = `${row},${col}`;
      const conflict = getConflictReason(row, col);

      steps.push({
        data: { type: 'grid', cells: makeGrid({ [key]: 'comparing' }) },
        description: `Row ${row}: Testing candidate square (${row}, ${col}). Checking attacks against existing queens.`,
        highlightLines: [3, 4],
        operation: 'Test Square',
        phase: `Row ${row} of ${clampedN - 1}`,
        reason: `Examine if square (${row}, ${col}) is threatened`,
        result: conflict ? `Conflict: ${conflict}` : 'Square is safe!',
        nextAction: conflict ? 'Try next column' : `Place queen at (${row}, ${col})`,
        auxiliary: [
          { label: 'Testing', value: `(${row}, ${col})` },
          { label: 'Queens Placed', value: row },
        ],
        lineExplanation: 'for col from 0 to n-1: check isSafe(row, col)',
      });

      if (!conflict) {
        board[row] = col;
        steps.push({
          data: { type: 'grid', cells: makeGrid({ [key]: 'active' }) },
          description: `Safe! Placed Queen at row ${row}, column ${col}. No attacks found. Advancing to row ${row + 1}.`,
          highlightLines: [5],
          operation: 'Place Queen',
          phase: `Row ${row} Placed`,
          reason: `No row, column, or diagonal conflicts with placed queens`,
          result: `Queen ${row + 1} positioned`,
          nextAction: `Recurse to row ${row + 1}`,
          auxiliary: [
            { label: 'Placed', value: `(${row}, ${col})` },
            { label: 'Queens Placed', value: row + 1 },
          ],
          lineExplanation: 'board[row] := col; recurse solve(row + 1)',
        });

        if (solve(row + 1)) return true;

        // Backtrack
        backtracks++;
        board[row] = -1;
        steps.push({
          data: { type: 'grid', cells: makeGrid({ [key]: 'excluded' }) },
          description: `Backtrack from row ${row + 1}: Subsequent rows could not find a valid solution. Removing queen from (${row}, ${col}) and trying column ${col + 1}.`,
          highlightLines: [7],
          operation: 'Backtrack Remove',
          phase: `Backtracking at Row ${row}`,
          reason: `No valid placement was possible in subsequent rows`,
          result: `Removed queen from (${row}, ${col})`,
          nextAction: `Advance to column ${col + 1} at row ${row}`,
          auxiliary: [
            { label: 'Removed', value: `(${row}, ${col})` },
            { label: 'Total Backtracks', value: backtracks },
          ],
          lineExplanation: 'board[row] := -1 (undo placement and backtrack)',
        });
      } else {
        steps.push({
          data: { type: 'grid', cells: makeGrid({ [key]: 'excluded' }) },
          description: `Cannot place at (${row}, ${col}): ${conflict}. Moving to next column.`,
          highlightLines: [9],
          operation: 'Conflict Rejected',
          phase: `Row ${row}`,
          reason: conflict,
          result: 'Square rejected',
          nextAction: col + 1 < clampedN ? `Try column ${col + 1}` : `Backtrack to row ${row - 1}`,
          auxiliary: [
            { label: 'Conflict', value: conflict },
            { label: 'Attempts', value: attempts },
          ],
          lineExplanation: 'Square is attacked; skip to next candidate',
        });
      }
    }

    return false;
  }

  const success = solve(0);

  steps.push({
    data: { type: 'grid', cells: makeGrid() },
    description: success
      ? `Solution found for ${clampedN}-Queens! Placed all ${clampedN} queens successfully: columns [${board.join(', ')}]. Total attempts: ${attempts}, Backtracks: ${backtracks}.`
      : `No solution found for ${clampedN}-Queens after ${attempts} attempts.`,
    highlightLines: [11],
    operation: success ? 'Solution Found' : 'Unsolvable',
    phase: 'Complete',
    auxiliary: [
      { label: 'Status', value: success ? 'Success' : 'Failed' },
      { label: 'Total Placements', value: attempts },
      { label: 'Backtracks', value: backtracks },
    ],
    lineExplanation: success ? 'All queens placed safely without conflicts' : 'No valid configuration exists',
  });

  return steps;
}
