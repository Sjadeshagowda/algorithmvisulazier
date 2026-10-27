import type { AlgorithmStep, ArrayElement } from '../../types/algorithm';

function makeElements(arr: number[], states?: Record<number, ArrayElement['state']>): ArrayElement[] {
  return arr.map((value, id) => ({
    value,
    state: states?.[id] ?? 'default',
    id,
  }));
}

/**
 * Greedy Coin Change problem
 * Coins are sorted in descending order. At each step, pick the largest coin <= remaining amount.
 */
export function coinChangeGreedy(coins: number[] = [25, 10, 5, 1], amount: number = 63): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const sortedCoins = [...coins].filter(c => !isNaN(c) && c > 0).sort((a, b) => b - a);
  const targetAmount = Math.max(0, isNaN(amount) ? 0 : Math.floor(amount));
  let rem = targetAmount;
  const picked: number[] = [];

  if (sortedCoins.length === 0 || targetAmount === 0) {
    steps.push({
      data: { type: 'bars', elements: makeElements(sortedCoins) },
      description: targetAmount === 0
        ? 'Target amount is 0. No coins needed (0 coins dispensed).'
        : 'No valid coin denominations provided. Cannot make change.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Complete',
      auxiliary: [{ label: 'Total Amount', value: targetAmount }, { label: 'Coins Picked', value: '0' }],
      lineExplanation: 'Return empty change solution',
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(sortedCoins) },
    description: `Greedy Coin Change: Make change for ${rem} using denominations [${sortedCoins.join(', ')}]. Strategy: Always greedily pick the largest available denomination that does not exceed the remaining balance.`,
    highlightLines: [0],
    operation: 'Initialize Problem',
    phase: 'Setup',
    auxiliary: [{ label: 'Total Amount', value: rem }, { label: 'Coins Picked', value: 'None' }],
    lineExplanation: 'Sort coins descending; set remaining := amount',
  });

  for (let i = 0; i < sortedCoins.length; i++) {
    const coin = sortedCoins[i];

    steps.push({
      data: {
        type: 'bars',
        elements: makeElements(sortedCoins, { [i]: 'comparing' }),
      },
      description: `Testing largest remaining coin: ${coin}. Remaining amount to dispense: ${rem}. Checking if ${coin} ≤ ${rem}.`,
      highlightLines: [2, 3],
      operation: 'Inspect Denomination',
      phase: `Denomination ${coin}`,
      reason: `Greedy choice property: try largest denomination first`,
      result: coin <= rem ? `${coin} fits into ${rem}` : `${coin} is too large (${coin} > ${rem})`,
      nextAction: coin <= rem ? `Take as many ${coin}s as possible` : 'Skip to smaller denomination',
      auxiliary: [
        { label: 'Coin Value', value: coin },
        { label: 'Remaining', value: rem },
        { label: 'Fits', value: coin <= rem ? 'Yes' : 'No' },
      ],
      lineExplanation: 'count := floor(remaining / coin)',
    });

    const count = Math.floor(rem / coin);
    if (count > 0) {
      for (let k = 0; k < count; k++) {
        picked.push(coin);
      }
      rem -= count * coin;

      steps.push({
        data: {
          type: 'bars',
          elements: makeElements(sortedCoins, { [i]: 'active' }),
        },
        description: `Greedily selected ${count} coin(s) of value ${coin}. Deducted ${count * coin}. Remaining balance is now ${rem}. Total coins collected so far: [${picked.join(', ')}].`,
        highlightLines: [4, 5],
        operation: 'Collect Coins',
        phase: `Took ${count}x ${coin}`,
        reason: `${coin} fits into remaining amount ${rem + count * coin}`,
        result: `Balance reduced to ${rem}`,
        nextAction: rem === 0 ? 'Change completely made!' : 'Proceed to next coin',
        auxiliary: [
          { label: 'Added', value: `${count}x ${coin}` },
          { label: 'Remaining', value: rem },
          { label: 'Coin Count', value: picked.length },
        ],
        lineExplanation: 'Take maximum coins of this denomination and deduct from balance',
      });
    } else {
      steps.push({
        data: {
          type: 'bars',
          elements: makeElements(sortedCoins, { [i]: 'excluded' }),
        },
        description: `Coin ${coin} exceeds the remaining balance (${rem}). Skipping this denomination and trying smaller coins.`,
        highlightLines: [6],
        operation: 'Skip Coin',
        phase: `Skipped ${coin}`,
        reason: `${coin} > remaining balance ${rem}`,
        result: '0 coins taken',
        nextAction: i + 1 < sortedCoins.length ? `Inspect next coin ${sortedCoins[i + 1]}` : 'Done',
        auxiliary: [
          { label: 'Coin', value: coin },
          { label: 'Remaining', value: rem },
        ],
        lineExplanation: 'Coin is too large; cannot be used',
      });
    }

    if (rem === 0) break;
  }

  const exactChange = rem === 0;
  steps.push({
    data: {
      type: 'bars',
      elements: makeElements(sortedCoins, Object.fromEntries(sortedCoins.map((_, i) => [i, 'sorted']))),
    },
    description: exactChange
      ? `Greedy Coin Change complete! Dispensed total amount ${targetAmount} using ${picked.length} coin(s): [${picked.join(', ')}].`
      : `Greedy Coin Change finished. Dispensed ${targetAmount - rem} using ${picked.length} coin(s): [${picked.join(', ')}]. Remaining unchangeable balance: ${rem}. Note: Greedy cannot always achieve exact change with non-canonical denominations.`,
    highlightLines: [7],
    operation: exactChange ? 'Complete' : 'Partial / Incomplete Change',
    phase: 'Finished',
    auxiliary: [
      { label: 'Total Coins', value: picked.length },
      { label: 'Coins', value: picked },
      { label: 'Remaining Balance', value: rem },
    ],
    lineExplanation: 'Return coin change solution',
  });

  return steps;
}
