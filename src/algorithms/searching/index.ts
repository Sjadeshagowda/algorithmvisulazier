import type { AlgorithmStep, ArrayElement } from '../../types/algorithm';

function makeElements(arr: number[], states?: Record<number, ArrayElement['state']>): ArrayElement[] {
  return arr.map((value, id) => ({
    value,
    state: states?.[id] ?? 'default',
    id,
  }));
}

function formatArr(arr: number[]): string {
  return `[${arr.join(', ')}]`;
}

export function linearSearch(input: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...input];
  let comparisons = 0;

  if (arr.length === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The array is empty. Target cannot be found.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Empty Input',
      comparisonCount: 0,
      beforeState: '[]',
      afterState: '[]',
      reason: 'Empty array has no elements',
      result: 'Search failed',
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr) },
    description: `Starting Linear Search for target = ${target} on array ${formatArr(arr)}. Checking elements sequentially from left to right.`,
    highlightLines: [0],
    operation: 'Initialize',
    phase: 'Scan Start',
    comparisonCount: 0,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    auxiliary: [{ label: 'Target', value: target }],
    lineExplanation: 'procedure linearSearch(A, target): inspect each index i',
  });

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    const states: Record<number, ArrayElement['state']> = {};
    for (let k = 0; k < i; k++) states[k] = 'excluded';
    states[i] = 'comparing';

    const isMatch = arr[i] === target;

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, states) },
      description: `Checking index ${i}: Value = ${arr[i]}. Does ${arr[i]} equal target ${target}? ${isMatch ? 'Yes, match found!' : 'No match, continue scanning.'}`,
      highlightLines: [2, 3],
      comparing: [i],
      operation: 'Compare Element',
      phase: `Index ${i} of ${arr.length - 1}`,
      comparisonCount: comparisons,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      reason: `Compare A[${i}] against target ${target}`,
      result: isMatch ? `Match at index ${i}` : `No match (${arr[i]} ≠ ${target})`,
      nextAction: isMatch ? 'Return index' : `Advance to index ${i + 1}`,
      auxiliary: [{ label: 'Target', value: target }, { label: 'Current [i]', value: arr[i] }],
      lineExplanation: 'if A[i] = target then return i',
    });

    if (isMatch) {
      const foundStates = { ...states };
      foundStates[i] = 'found';
      steps.push({
        data: { type: 'bars', elements: makeElements(arr, foundStates) },
        description: `Target ${target} successfully found at index ${i} after ${comparisons} comparison(s)!`,
        highlightLines: [4],
        operation: 'Target Found',
        phase: 'Success',
        comparisonCount: comparisons,
        beforeState: formatArr(arr),
        afterState: formatArr(arr),
        reason: `${arr[i]} == ${target}`,
        result: `Found at index ${i}`,
        nextAction: 'Search terminated',
        auxiliary: [{ label: 'Target', value: target }, { label: 'Found Index', value: i }],
        lineExplanation: 'return i (index of target element)',
      });
      return steps;
    }
  }

  const allExcluded: Record<number, ArrayElement['state']> = {};
  arr.forEach((_, i) => (allExcluded[i] = 'excluded'));
  steps.push({
    data: { type: 'bars', elements: makeElements(arr, allExcluded) },
    description: `Target ${target} was not found in the array after checking all ${arr.length} elements (${comparisons} comparisons).`,
    highlightLines: [7],
    operation: 'Target Not Found',
    phase: 'Search Complete',
    comparisonCount: comparisons,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    reason: 'Exhausted all indices without finding target',
    result: 'Target absent',
    nextAction: 'Return -1',
    auxiliary: [{ label: 'Target', value: target }, { label: 'Result', value: 'Not Found' }],
    lineExplanation: 'return -1 (target does not exist)',
  });

  return steps;
}

export function binarySearch(input: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let comparisons = 0;

  if (input.length === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The input array is empty. Target cannot be found.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Empty Input',
      comparisonCount: 0,
      beforeState: '[]',
      afterState: '[]',
      reason: 'Empty array has no elements',
      result: 'Search failed',
    });
    return steps;
  }

  const isSorted = input.every((val, i) => i === 0 || input[i - 1] <= val);
  const arr = isSorted ? [...input] : [...input].sort((a, b) => a - b);

  if (!isSorted) {
    steps.push({
      data: { type: 'bars', elements: makeElements(arr) },
      description: `Input array was unsorted! Binary Search requires a sorted collection; the array has been automatically sorted to ${formatArr(arr)}. Searching for target = ${target}.`,
      highlightLines: [0],
      operation: 'Pre-sort Array',
      phase: 'Requirement Check',
      comparisonCount: 0,
      beforeState: formatArr(input),
      afterState: formatArr(arr),
      auxiliary: [{ label: 'Target', value: target }, { label: 'Auto-Sorted', value: 'Yes' }],
      lineExplanation: 'Binary Search invariant: array must be sorted in ascending order',
    });
  } else {
    steps.push({
      data: { type: 'bars', elements: makeElements(arr) },
      description: `Starting Binary Search for target = ${target} on sorted array ${formatArr(arr)}. We repeatedly halve the search interval [low..high].`,
      highlightLines: [0],
      operation: 'Initialize',
      phase: 'Initial Range',
      comparisonCount: 0,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      auxiliary: [{ label: 'Target', value: target }, { label: 'Range', value: `[0..${arr.length - 1}]` }],
      lineExplanation: 'low := 0, high := n - 1',
    });
  }

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    comparisons++;
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];

    const states: Record<number, ArrayElement['state']> = {};
    for (let i = 0; i < left; i++) states[i] = 'excluded';
    for (let i = right + 1; i < arr.length; i++) states[i] = 'excluded';
    states[mid] = 'comparing';
    if (left !== mid) states[left] = 'active';
    if (right !== mid) states[right] = 'selected';

    const isMatch = midVal === target;
    const isSmaller = midVal < target;

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, states) },
      description: `Active search space: [${left}..${right}]. Midpoint index = ${mid} (value = ${midVal}). Comparing midpoint ${midVal} with target ${target}.`,
      highlightLines: [3, 4],
      comparing: [mid],
      operation: 'Evaluate Midpoint',
      phase: `Range [${left}..${right}]`,
      comparisonCount: comparisons,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      reason: `Midpoint index = floor((${left} + ${right}) / 2) = ${mid}`,
      result: isMatch ? 'Match!' : isSmaller ? `${midVal} < ${target}` : `${midVal} > ${target}`,
      nextAction: isMatch
        ? `Found at index ${mid}`
        : isSmaller
        ? `Target is larger; search right half [${mid + 1}..${right}]`
        : `Target is smaller; search left half [${left}..${mid - 1}]`,
      auxiliary: [
        { label: 'Target', value: target },
        { label: 'Low', value: left },
        { label: 'Mid', value: mid },
        { label: 'High', value: right },
      ],
      lineExplanation: 'mid := floor((low + high) / 2); check A[mid] = target',
    });

    if (isMatch) {
      const foundStates = { ...states };
      foundStates[mid] = 'found';
      steps.push({
        data: { type: 'bars', elements: makeElements(arr, foundStates) },
        description: `Target ${target} found at index ${mid} in only ${comparisons} comparison(s)!`,
        highlightLines: [5],
        operation: 'Target Found',
        phase: 'Success',
        comparisonCount: comparisons,
        beforeState: formatArr(arr),
        afterState: formatArr(arr),
        reason: `A[${mid}] == ${target}`,
        result: `Found at index ${mid}`,
        auxiliary: [{ label: 'Target', value: target }, { label: 'Found Index', value: mid }, { label: 'Comparisons', value: comparisons }],
        lineExplanation: 'return mid',
      });
      return steps;
    } else if (isSmaller) {
      steps.push({
        data: { type: 'bars', elements: makeElements(arr, states) },
        description: `Since midpoint ${midVal} < target ${target}, the target cannot be in [${left}..${mid}]. Discarding left half. Setting low = ${mid + 1}.`,
        highlightLines: [7],
        operation: 'Discard Left Half',
        phase: `Narrowing Range`,
        comparisonCount: comparisons,
        beforeState: formatArr(arr),
        afterState: formatArr(arr),
        reason: `${midVal} < ${target}: target must be to the right`,
        result: `Eliminated indices [${left}..${mid}]`,
        nextAction: `Set low = ${mid + 1}`,
        auxiliary: [{ label: 'Target', value: target }, { label: 'New Low', value: mid + 1 }],
        lineExplanation: 'low := mid + 1',
      });
      left = mid + 1;
    } else {
      steps.push({
        data: { type: 'bars', elements: makeElements(arr, states) },
        description: `Since midpoint ${midVal} > target ${target}, the target cannot be in [${mid}..${right}]. Discarding right half. Setting high = ${mid - 1}.`,
        highlightLines: [9],
        operation: 'Discard Right Half',
        phase: `Narrowing Range`,
        comparisonCount: comparisons,
        beforeState: formatArr(arr),
        afterState: formatArr(arr),
        reason: `${midVal} > ${target}: target must be to the left`,
        result: `Eliminated indices [${mid}..${right}]`,
        nextAction: `Set high = ${mid - 1}`,
        auxiliary: [{ label: 'Target', value: target }, { label: 'New High', value: mid - 1 }],
        lineExplanation: 'high := mid - 1',
      });
      right = mid - 1;
    }
  }

  const allExcluded: Record<number, ArrayElement['state']> = {};
  arr.forEach((_, i) => (allExcluded[i] = 'excluded'));
  steps.push({
    data: { type: 'bars', elements: makeElements(arr, allExcluded) },
    description: `Search space exhausted (low > high). Target ${target} does not exist in the array after ${comparisons} comparisons.`,
    highlightLines: [11],
    operation: 'Target Not Found',
    phase: 'Search Complete',
    comparisonCount: comparisons,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    reason: `Low (${left}) exceeded High (${right}) without finding target`,
    result: 'Target absent',
    nextAction: 'Return -1',
    auxiliary: [{ label: 'Target', value: target }, { label: 'Result', value: 'Not Found' }],
    lineExplanation: 'return -1 (target does not exist in collection)',
  });

  return steps;
}
