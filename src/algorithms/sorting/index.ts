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

// ── BUBBLE SORT ──────────────────────────────────────────────
export function bubbleSort(input: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  if (n === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The input array is empty. Nothing to sort.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Complete',
      comparisonCount: 0,
      swapCount: 0,
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr) },
    description: `Starting Bubble Sort on ${formatArr(arr)}. We will make multiple passes, comparing adjacent pairs and bubbling the largest unsorted element to the right.`,
    highlightLines: [0],
    operation: 'Initialize',
    phase: 'Pass 1',
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    comparisonCount: 0,
    swapCount: 0,
    lineExplanation: 'Initialize bubble sort on the array of length ' + n,
  });

  for (let i = 0; i < n - 1; i++) {
    const passNum = i + 1;
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      const val1 = arr[j];
      const val2 = arr[j + 1];

      // Highlight compared pair
      const statesBefore: Record<number, ArrayElement['state']> = {};
      for (let k = n - i; k < n; k++) statesBefore[k] = 'sorted';
      statesBefore[j] = 'comparing';
      statesBefore[j + 1] = 'comparing';

      const needsSwap = val1 > val2;
      const compareDesc = needsSwap
        ? `Compare ${val1} (index ${j}) and ${val2} (index ${j + 1}). Since ${val1} > ${val2}, they are in the wrong order and must be swapped.`
        : `Compare ${val1} (index ${j}) and ${val2} (index ${j + 1}). Since ${val1} ≤ ${val2}, they are already in correct relative order; no swap needed.`;

      steps.push({
        data: { type: 'bars', elements: makeElements(arr, statesBefore) },
        description: compareDesc,
        highlightLines: [3, 4],
        comparing: [j, j + 1],
        operation: 'Compare',
        phase: `Pass ${passNum} of ${n - 1}`,
        comparisonCount: comparisons,
        swapCount: swaps,
        beforeState: formatArr(arr),
        afterState: formatArr(arr),
        reason: needsSwap ? `${val1} > ${val2}: Left value is strictly greater than right value` : `${val1} ≤ ${val2}: In proper relative order`,
        result: needsSwap ? 'Swap required' : 'Elements stay in place',
        nextAction: needsSwap ? `Swap values at index ${j} and ${j + 1}` : (j + 1 < n - i - 1 ? `Advance to compare index ${j + 1} and ${j + 2}` : 'Complete current pass'),
        lineExplanation: 'Check if A[j] > A[j+1] to determine if elements must be swapped',
      });

      if (needsSwap) {
        swaps++;
        swappedInPass = true;
        const prevArr = [...arr];
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        const statesSwap: Record<number, ArrayElement['state']> = {};
        for (let k = n - i; k < n; k++) statesSwap[k] = 'sorted';
        statesSwap[j] = 'swapping';
        statesSwap[j + 1] = 'swapping';

        steps.push({
          data: { type: 'bars', elements: makeElements(arr, statesSwap) },
          description: `Swapped ${val1} and ${val2}. The array changes from ${formatArr(prevArr)} to ${formatArr(arr)}.`,
          highlightLines: [5],
          swapping: [j, j + 1],
          operation: 'Swap',
          phase: `Pass ${passNum} of ${n - 1}`,
          comparisonCount: comparisons,
          swapCount: swaps,
          beforeState: formatArr(prevArr),
          afterState: formatArr(arr),
          reason: `Corrected inversion between index ${j} and ${j + 1}`,
          result: `Index ${j} is now ${arr[j]}, index ${j + 1} is now ${arr[j + 1]}`,
          nextAction: j + 1 < n - i - 1 ? `Advance to compare index ${j + 1} and ${j + 2}` : `Finalize pass ${passNum}`,
          lineExplanation: 'Execute swap(A[j], A[j+1]) to put larger element to the right',
        });
      }
    }

    // Mark element placed at n - i - 1 as sorted
    const statesSorted: Record<number, ArrayElement['state']> = {};
    for (let k = n - i - 1; k < n; k++) statesSorted[k] = 'sorted';
    steps.push({
      data: { type: 'bars', elements: makeElements(arr, statesSorted) },
      description: `Pass ${passNum} complete. Element ${arr[n - i - 1]} has bubbled to its final sorted position at index ${n - i - 1}.`,
      highlightLines: [2],
      operation: 'Pass Complete',
      phase: `Pass ${passNum} Finished`,
      comparisonCount: comparisons,
      swapCount: swaps,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      reason: `The largest remaining element has reached index ${n - i - 1}`,
      result: `Subarray [${n - i - 1}..${n - 1}] is now permanently sorted`,
      nextAction: i + 1 < n - 1 ? `Begin Pass ${passNum + 1}` : 'Finalize sorting',
      lineExplanation: 'Outer loop boundary decrements; suffix of array is sorted',
    });

    if (!swappedInPass) {
      // Early exit if already sorted
      break;
    }
  }

  // All sorted
  steps.push({
    data: { type: 'bars', elements: makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, 'sorted']))) },
    description: `Bubble Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}. Array is fully sorted: ${formatArr(arr)}.`,
    highlightLines: [8],
    operation: 'Complete',
    phase: 'Fully Sorted',
    comparisonCount: comparisons,
    swapCount: swaps,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    reason: 'All passes completed and no unsorted elements remain',
    result: 'Array is in non-decreasing order',
    nextAction: 'Visualization complete',
    lineExplanation: 'Sorting complete: return sorted array',
  });

  return steps;
}

// ── SELECTION SORT ───────────────────────────────────────────
export function selectionSort(input: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  if (n === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The input array is empty. Nothing to sort.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Complete',
      comparisonCount: 0,
      swapCount: 0,
      beforeState: '[]',
      afterState: '[]',
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr) },
    description: `Starting Selection Sort on ${formatArr(arr)}. In each pass, we find the minimum element in the unsorted suffix and swap it into place.`,
    highlightLines: [0],
    operation: 'Initialize',
    phase: 'Pass 1',
    comparisonCount: 0,
    swapCount: 0,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'Initialize selection sort across n elements',
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    const sorted: Record<number, ArrayElement['state']> = {};
    for (let k = 0; k < i; k++) sorted[k] = 'sorted';
    sorted[minIdx] = 'active';

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, sorted) },
      description: `Pass ${i + 1}: Initialized current minimum to ${arr[minIdx]} at index ${minIdx}. Searching indices [${i + 1}..${n - 1}] for any smaller value.`,
      highlightLines: [2, 3],
      operation: 'Init Minimum',
      phase: `Pass ${i + 1} of ${n - 1}`,
      comparisonCount: comparisons,
      swapCount: swaps,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      reason: `Assume first unsorted element at index ${i} is current minimum`,
      result: `Candidate minimum = ${arr[minIdx]} at index ${minIdx}`,
      lineExplanation: 'minIdx := i (assume first unsorted element is minimum)',
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const states: Record<number, ArrayElement['state']> = { ...sorted };
      states[minIdx] = 'selected';
      states[j] = 'comparing';

      const isSmaller = arr[j] < arr[minIdx];

      steps.push({
        data: { type: 'bars', elements: makeElements(arr, states) },
        description: `Comparing candidate minimum ${arr[minIdx]} (index ${minIdx}) with ${arr[j]} (index ${j}). ${isSmaller ? `Found smaller element (${arr[j]} < ${arr[minIdx]})!` : `Not smaller (${arr[j]} ≥ ${arr[minIdx]}); keeping candidate.`}`,
        highlightLines: [4, 5],
        comparing: [minIdx, j],
        operation: 'Compare Minimum',
        phase: `Pass ${i + 1} of ${n - 1}`,
        comparisonCount: comparisons,
        swapCount: swaps,
        beforeState: formatArr(arr),
        afterState: formatArr(arr),
        reason: `Examine unsorted element ${arr[j]} against current minimum ${arr[minIdx]}`,
        result: isSmaller ? `New minimum found: ${arr[j]}` : `Retain minimum: ${arr[minIdx]}`,
        nextAction: isSmaller ? `Update minIdx to ${j}` : `Continue scanning index ${j + 1}`,
        lineExplanation: 'if A[j] < A[minIdx] then update minIdx',
      });

      if (isSmaller) {
        minIdx = j;
        const newStates: Record<number, ArrayElement['state']> = {};
        for (let k = 0; k < i; k++) newStates[k] = 'sorted';
        newStates[minIdx] = 'active';

        steps.push({
          data: { type: 'bars', elements: makeElements(arr, newStates) },
          description: `Updated minimum: ${arr[minIdx]} at index ${minIdx}.`,
          highlightLines: [6],
          operation: 'Update Minimum',
          phase: `Pass ${i + 1} of ${n - 1}`,
          comparisonCount: comparisons,
          swapCount: swaps,
          beforeState: formatArr(arr),
          afterState: formatArr(arr),
          reason: `Found new minimum value ${arr[minIdx]}`,
          result: `minIdx set to ${minIdx}`,
          lineExplanation: 'minIdx := j',
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const prevArr = [...arr];
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      const swapStates: Record<number, ArrayElement['state']> = {};
      for (let k = 0; k < i; k++) swapStates[k] = 'sorted';
      swapStates[i] = 'swapping';
      swapStates[minIdx] = 'swapping';

      steps.push({
        data: { type: 'bars', elements: makeElements(arr, swapStates) },
        description: `Swapped minimum element ${arr[i]} into its sorted position at index ${i}. Array: ${formatArr(prevArr)} → ${formatArr(arr)}.`,
        highlightLines: [8],
        swapping: [i, minIdx],
        operation: 'Swap to Position',
        phase: `Pass ${i + 1} of ${n - 1}`,
        comparisonCount: comparisons,
        swapCount: swaps,
        beforeState: formatArr(prevArr),
        afterState: formatArr(arr),
        reason: `Place smallest unsorted element at beginning of unsorted region`,
        result: `Index ${i} now contains ${arr[i]}`,
        lineExplanation: 'swap(A[i], A[minIdx])',
      });
    }

    const afterStates: Record<number, ArrayElement['state']> = {};
    for (let k = 0; k <= i; k++) afterStates[k] = 'sorted';
    steps.push({
      data: { type: 'bars', elements: makeElements(arr, afterStates) },
      description: `Index ${i} permanently finalized with value ${arr[i]}. Prefix [0..${i}] is sorted.`,
      highlightLines: [2],
      operation: 'Position Finalized',
      phase: `Pass ${i + 1} Complete`,
      comparisonCount: comparisons,
      swapCount: swaps,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      lineExplanation: 'Advance to next position in outer loop',
    });
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, 'sorted']))) },
    description: `Selection Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}. Array: ${formatArr(arr)}.`,
    highlightLines: [10],
    operation: 'Complete',
    phase: 'Fully Sorted',
    comparisonCount: comparisons,
    swapCount: swaps,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'Return sorted array',
  });

  return steps;
}

// ── INSERTION SORT ───────────────────────────────────────────
export function insertionSort(input: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0;
  let shifts = 0;

  if (n === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The input array is empty. Nothing to sort.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Complete',
      comparisonCount: 0,
      swapCount: 0,
      beforeState: '[]',
      afterState: '[]',
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr, { 0: 'sorted' }) },
    description: `Starting Insertion Sort on ${formatArr(arr)}. A single element ([${arr[0]}]) is trivially sorted. We will insert subsequent elements one by one.`,
    highlightLines: [0],
    operation: 'Initialize',
    phase: 'Initialize',
    comparisonCount: 0,
    swapCount: 0,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'Single element A[0] is already sorted',
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    const insertStates: Record<number, ArrayElement['state']> = {};
    for (let k = 0; k < i; k++) insertStates[k] = 'sorted';
    insertStates[i] = 'active';

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, insertStates) },
      description: `Selected key = ${key} at index ${i}. Comparing backwards against sorted prefix [0..${i - 1}] to find its insertion spot.`,
      highlightLines: [2, 3],
      operation: 'Select Key',
      phase: `Insert Element ${i} of ${n - 1}`,
      comparisonCount: comparisons,
      swapCount: shifts,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      reason: `Key ${key} needs to be inserted into the sorted subarray`,
      result: `Key stored as ${key}`,
      lineExplanation: 'key := A[i], j := i - 1',
    });

    while (j >= 0) {
      comparisons++;
      const cmpStates: Record<number, ArrayElement['state']> = {};
      for (let k = 0; k < i; k++) cmpStates[k] = 'sorted';
      cmpStates[j] = 'comparing';
      cmpStates[j + 1] = 'active';

      if (arr[j] > key) {
        shifts++;
        steps.push({
          data: { type: 'bars', elements: makeElements(arr, cmpStates) },
          description: `Comparing sorted element ${arr[j]} with key ${key}. Since ${arr[j]} > ${key}, shift ${arr[j]} one position right to index ${j + 1}.`,
          highlightLines: [4, 5],
          comparing: [j, j + 1],
          operation: 'Shift Right',
          phase: `Inserting ${key}`,
          comparisonCount: comparisons,
          swapCount: shifts,
          beforeState: formatArr(arr),
          afterState: formatArr(arr),
          reason: `${arr[j]} > ${key}: larger elements must make room`,
          result: `Shifting ${arr[j]} from [${j}] to [${j + 1}]`,
          lineExplanation: 'A[j+1] := A[j], j := j - 1',
        });

        arr[j + 1] = arr[j];
        j--;
      } else {
        steps.push({
          data: { type: 'bars', elements: makeElements(arr, cmpStates) },
          description: `Comparing sorted element ${arr[j]} with key ${key}. Since ${arr[j]} ≤ ${key}, we have found the correct insertion boundary.`,
          highlightLines: [4],
          comparing: [j, j + 1],
          operation: 'Spot Found',
          phase: `Inserting ${key}`,
          comparisonCount: comparisons,
          swapCount: shifts,
          beforeState: formatArr(arr),
          afterState: formatArr(arr),
          reason: `${arr[j]} <= ${key}: key belongs after index ${j}`,
          result: 'Stop backward scan',
          lineExplanation: 'Condition A[j] > key is false; break loop',
        });
        break;
      }
    }

    arr[j + 1] = key;
    const doneStates: Record<number, ArrayElement['state']> = {};
    for (let k = 0; k <= i; k++) doneStates[k] = 'sorted';
    doneStates[j + 1] = 'swapping';

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, doneStates) },
      description: `Placed key ${key} into position ${j + 1}. Sorted prefix is now [0..${i}]: ${formatArr(arr.slice(0, i + 1))}.`,
      highlightLines: [6],
      operation: 'Insert Key',
      phase: `Inserted ${key}`,
      comparisonCount: comparisons,
      swapCount: shifts,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      reason: `Slot ${j + 1} is open for key`,
      result: `Subarray [0..${i}] is sorted`,
      lineExplanation: 'A[j+1] := key',
    });
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, 'sorted']))) },
    description: `Insertion Sort complete! Total comparisons: ${comparisons}, Total shifts: ${shifts}. Sorted array: ${formatArr(arr)}.`,
    highlightLines: [8],
    operation: 'Complete',
    phase: 'Fully Sorted',
    comparisonCount: comparisons,
    swapCount: shifts,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'Sorting complete',
  });

  return steps;
}

// ── MERGE SORT ───────────────────────────────────────────────
export function mergeSort(input: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...input];
  let comparisons = 0;
  let merges = 0;

  if (arr.length === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The input array is empty. Nothing to sort.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Complete',
      comparisonCount: 0,
      swapCount: 0,
      beforeState: '[]',
      afterState: '[]',
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr) },
    description: `Starting Merge Sort on ${formatArr(arr)}. We recursively split the array into halves until singletons remain, then merge sorted halves.`,
    highlightLines: [0],
    operation: 'Initialize',
    phase: 'Divide',
    comparisonCount: 0,
    swapCount: 0,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'mergeSort(A, 0, n-1)',
  });

  function mergeSortHelper(left: number, right: number, workArr: number[]) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    const divStates: Record<number, ArrayElement['state']> = {};
    for (let k = left; k <= mid; k++) divStates[k] = 'active';
    for (let k = mid + 1; k <= right; k++) divStates[k] = 'comparing';

    steps.push({
      data: { type: 'bars', elements: makeElements(workArr, divStates) },
      description: `Dividing range [${left}..${right}]: Left half [${left}..${mid}], Right half [${mid + 1}..${right}].`,
      highlightLines: [2, 3],
      operation: 'Divide',
      phase: `Range [${left}..${right}]`,
      comparisonCount: comparisons,
      swapCount: merges,
      beforeState: formatArr(workArr),
      afterState: formatArr(workArr),
      reason: 'Split problem in half to conquer smaller subproblems',
      result: `Subarrays created: [${workArr.slice(left, mid + 1).join(', ')}] and [${workArr.slice(mid + 1, right + 1).join(', ')}]`,
      lineExplanation: 'mid := (left + right) / 2; recurse on both halves',
    });

    mergeSortHelper(left, mid, workArr);
    mergeSortHelper(mid + 1, right, workArr);

    // Merge
    merges++;
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      comparisons++;
      const cmpStates: Record<number, ArrayElement['state']> = {};
      cmpStates[i] = 'comparing';
      cmpStates[j] = 'comparing';

      const takeLeft = workArr[i] <= workArr[j];

      steps.push({
        data: { type: 'bars', elements: makeElements(workArr, cmpStates) },
        description: `Merging: Comparing left head ${workArr[i]} (index ${i}) with right head ${workArr[j]} (index ${j}). Picking smaller: ${takeLeft ? workArr[i] : workArr[j]}.`,
        highlightLines: [6, 7],
        comparing: [i, j],
        operation: 'Merge Compare',
        phase: `Merge [${left}..${right}]`,
        comparisonCount: comparisons,
        swapCount: merges,
        beforeState: formatArr(workArr),
        afterState: formatArr(workArr),
        reason: 'Pick the smaller of the two heads to maintain ascending order',
        result: `Appended ${takeLeft ? workArr[i] : workArr[j]} to temporary buffer`,
        lineExplanation: 'Compare heads of both sorted halves and pick smaller',
      });

      if (takeLeft) {
        temp.push(workArr[i++]);
      } else {
        temp.push(workArr[j++]);
      }
    }

    while (i <= mid) temp.push(workArr[i++]);
    while (j <= right) temp.push(workArr[j++]);

    const prevArr = [...workArr];
    for (let k = 0; k < temp.length; k++) {
      workArr[left + k] = temp[k];
    }

    const mergedStates: Record<number, ArrayElement['state']> = {};
    for (let k = left; k <= right; k++) mergedStates[k] = 'sorted';

    steps.push({
      data: { type: 'bars', elements: makeElements(workArr, mergedStates) },
      description: `Merged range [${left}..${right}] into sorted sequence: [${temp.join(', ')}].`,
      highlightLines: [9],
      operation: 'Subarray Merged',
      phase: `Merge Complete`,
      comparisonCount: comparisons,
      swapCount: merges,
      beforeState: formatArr(prevArr),
      afterState: formatArr(workArr),
      reason: 'Copied sorted merged buffer back to original array',
      result: `Subarray [${left}..${right}] is sorted`,
      lineExplanation: 'Copy merged elements back into main array A',
    });
  }

  const workArr = [...arr];
  mergeSortHelper(0, arr.length - 1, workArr);

  steps.push({
    data: { type: 'bars', elements: makeElements(workArr, Object.fromEntries(workArr.map((_, i) => [i, 'sorted']))) },
    description: `Merge Sort complete! Total comparisons: ${comparisons}. Fully sorted: ${formatArr(workArr)}.`,
    highlightLines: [11],
    operation: 'Complete',
    phase: 'Fully Sorted',
    comparisonCount: comparisons,
    swapCount: merges,
    beforeState: formatArr(workArr),
    afterState: formatArr(workArr),
    lineExplanation: 'All recursive calls completed',
  });

  return steps;
}

// ── QUICK SORT ───────────────────────────────────────────────
export function quickSort(input: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...input];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;

  if (arr.length === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The input array is empty. Nothing to sort.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Complete',
      comparisonCount: 0,
      swapCount: 0,
      beforeState: '[]',
      afterState: '[]',
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr) },
    description: `Starting Quick Sort on ${formatArr(arr)}. We choose a pivot element, partition smaller elements to its left and larger to its right, and recurse.`,
    highlightLines: [0],
    operation: 'Initialize',
    phase: 'Partition',
    comparisonCount: 0,
    swapCount: 0,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'quickSort(A, 0, n-1)',
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    const pivotStates: Record<number, ArrayElement['state']> = {};
    sorted.forEach(k => pivotStates[k] = 'sorted');
    pivotStates[high] = 'pivot';

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, pivotStates) },
      description: `Partitioning range [${low}..${high}]: Chosen pivot = ${pivot} at index ${high}. Elements ≤ ${pivot} will move left; elements > ${pivot} stay right.`,
      highlightLines: [2],
      operation: 'Choose Pivot',
      phase: `Partition [${low}..${high}]`,
      comparisonCount: comparisons,
      swapCount: swaps,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      reason: `Pivot ${pivot} acts as benchmark for partitioning`,
      result: `Pivot selected at index ${high}`,
      lineExplanation: 'pivot := A[high], i := low - 1',
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      const cmpStates: Record<number, ArrayElement['state']> = { ...pivotStates };
      cmpStates[j] = 'comparing';

      const isLessEqual = arr[j] <= pivot;

      steps.push({
        data: { type: 'bars', elements: makeElements(arr, cmpStates) },
        description: `Comparing element ${arr[j]} (index ${j}) with pivot ${pivot}. ${isLessEqual ? `${arr[j]} ≤ ${pivot}: move to the left partition.` : `${arr[j]} > ${pivot}: keep in right partition.`}`,
        highlightLines: [5, 6],
        comparing: [j, high],
        operation: 'Partition Compare',
        phase: `Partitioning [${low}..${high}]`,
        comparisonCount: comparisons,
        swapCount: swaps,
        beforeState: formatArr(arr),
        afterState: formatArr(arr),
        reason: `Classify element relative to pivot ${pivot}`,
        result: isLessEqual ? `Include in smaller partition` : `Belongs in larger partition`,
        nextAction: isLessEqual ? `Increment smaller boundary and swap` : `Advance index ${j}`,
        lineExplanation: 'if A[j] <= pivot then i++, swap(A[i], A[j])',
      });

      if (isLessEqual) {
        i++;
        if (i !== j) {
          swaps++;
          const prevArr = [...arr];
          [arr[i], arr[j]] = [arr[j], arr[i]];
          const swapStates: Record<number, ArrayElement['state']> = { ...pivotStates };
          swapStates[i] = 'swapping';
          swapStates[j] = 'swapping';

          steps.push({
            data: { type: 'bars', elements: makeElements(arr, swapStates) },
            description: `Swapped ${arr[i]} and ${arr[j]} to expand the left partition [${low}..${i}]. Array: ${formatArr(prevArr)} → ${formatArr(arr)}.`,
            highlightLines: [7],
            swapping: [i, j],
            operation: 'Partition Swap',
            phase: `Partitioning [${low}..${high}]`,
            comparisonCount: comparisons,
            swapCount: swaps,
            beforeState: formatArr(prevArr),
            afterState: formatArr(arr),
            reason: `Move value ≤ pivot into smaller partition`,
            result: `Index ${i} is ${arr[i]}`,
            lineExplanation: 'swap(A[i], A[j])',
          });
        }
      }
    }

    swaps++;
    const prevArr = [...arr];
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    sorted.add(i + 1);

    const finalStates: Record<number, ArrayElement['state']> = {};
    sorted.forEach(k => finalStates[k] = 'sorted');

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, finalStates) },
      description: `Pivot ${pivot} placed into its final sorted position at index ${i + 1}. All elements to the left are ≤ ${pivot}; all to the right are > ${pivot}. Array: ${formatArr(prevArr)} → ${formatArr(arr)}.`,
      highlightLines: [8],
      operation: 'Pivot Placed',
      phase: `Pivot Finalized`,
      comparisonCount: comparisons,
      swapCount: swaps,
      beforeState: formatArr(prevArr),
      afterState: formatArr(arr),
      reason: 'Place pivot between smaller and larger partitions',
      result: `Pivot ${pivot} permanently fixed at index ${i + 1}`,
      lineExplanation: 'swap(A[i+1], A[high]); return i + 1',
    });

    return i + 1;
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sorted.add(low);
    }
  }

  quickSortHelper(0, arr.length - 1);

  steps.push({
    data: { type: 'bars', elements: makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, 'sorted']))) },
    description: `Quick Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}. Fully sorted: ${formatArr(arr)}.`,
    highlightLines: [11],
    operation: 'Complete',
    phase: 'Fully Sorted',
    comparisonCount: comparisons,
    swapCount: swaps,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'All partitions sorted',
  });

  return steps;
}

// ── HEAP SORT ────────────────────────────────────────────────
export function heapSort(input: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...input];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  if (n === 0) {
    steps.push({
      data: { type: 'bars', elements: [] },
      description: 'The input array is empty. Nothing to sort.',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Complete',
      comparisonCount: 0,
      swapCount: 0,
      beforeState: '[]',
      afterState: '[]',
    });
    return steps;
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr) },
    description: `Starting Heap Sort on ${formatArr(arr)}. Step 1: Build a Max-Heap where every parent is greater than or equal to its children. Step 2: Repeatedly extract the maximum element to the end.`,
    highlightLines: [0],
    operation: 'Initialize',
    phase: 'Build Max-Heap',
    comparisonCount: 0,
    swapCount: 0,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'heapSort(A, n)',
  });

  let currentSortedFrom = n;

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    const states: Record<number, ArrayElement['state']> = {};
    for (let k = currentSortedFrom; k < arr.length; k++) states[k] = 'sorted';
    states[i] = 'active';
    if (left < size) states[left] = 'comparing';
    if (right < size) states[right] = 'comparing';

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, states) },
      description: `Heapifying root ${arr[i]} at index ${i} with left child ${left < size ? arr[left] : 'none'} and right child ${right < size ? arr[right] : 'none'}.`,
      highlightLines: [4, 5],
      operation: 'Heapify Check',
      phase: currentSortedFrom === n ? 'Build Heap' : 'Restore Heap',
      comparisonCount: comparisons,
      swapCount: swaps,
      beforeState: formatArr(arr),
      afterState: formatArr(arr),
      lineExplanation: 'Compare parent with left and right children to find largest',
    });

    if (left < size) {
      comparisons++;
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < size) {
      comparisons++;
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      swaps++;
      const prevArr = [...arr];
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      const swapStates: Record<number, ArrayElement['state']> = {};
      for (let k = currentSortedFrom; k < arr.length; k++) swapStates[k] = 'sorted';
      swapStates[i] = 'swapping';
      swapStates[largest] = 'swapping';

      steps.push({
        data: { type: 'bars', elements: makeElements(arr, swapStates) },
        description: `Swapped parent ${arr[largest]} with larger child ${arr[i]}. Array: ${formatArr(prevArr)} → ${formatArr(arr)}. Recursing to maintain heap property downward.`,
        highlightLines: [7],
        swapping: [i, largest],
        operation: 'Heapify Swap',
        phase: 'Maintain Max-Heap',
        comparisonCount: comparisons,
        swapCount: swaps,
        beforeState: formatArr(prevArr),
        afterState: formatArr(arr),
        reason: 'Parent must be greater than or equal to both children',
        result: `Swapped index ${i} and ${largest}`,
        lineExplanation: 'swap(A[i], A[largest]); heapify(A, n, largest)',
      });

      heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr, { 0: 'pivot' }) },
    description: `Max-heap constructed! The maximum element (${arr[0]}) is at root index 0. Now repeatedly extracting max to the sorted suffix.`,
    highlightLines: [2],
    operation: 'Heap Ready',
    phase: 'Extract Maximums',
    comparisonCount: comparisons,
    swapCount: swaps,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'Max heap built; root contains maximum value',
  });

  // Extract
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    const prevArr = [...arr];
    [arr[0], arr[i]] = [arr[i], arr[0]];
    currentSortedFrom = i;

    const states: Record<number, ArrayElement['state']> = {};
    for (let k = i; k < n; k++) states[k] = 'sorted';
    states[0] = 'swapping';

    steps.push({
      data: { type: 'bars', elements: makeElements(arr, states) },
      description: `Extracted max element ${arr[i]} from root to final position at index ${i}. Array: ${formatArr(prevArr)} → ${formatArr(arr)}. Re-heapifying root at index 0.`,
      highlightLines: [9, 10],
      swapping: [0, i],
      operation: 'Extract Max',
      phase: `Extracted ${arr[i]}`,
      comparisonCount: comparisons,
      swapCount: swaps,
      beforeState: formatArr(prevArr),
      afterState: formatArr(arr),
      reason: 'Swap root (maximum) to the end of unsorted array',
      result: `Index ${i} permanently finalized with ${arr[i]}`,
      lineExplanation: 'swap(A[0], A[i]); heapify(A, i, 0)',
    });

    heapify(i, 0);
  }

  steps.push({
    data: { type: 'bars', elements: makeElements(arr, Object.fromEntries(arr.map((_, i) => [i, 'sorted']))) },
    description: `Heap Sort complete! Total comparisons: ${comparisons}, Total swaps: ${swaps}. Fully sorted: ${formatArr(arr)}.`,
    highlightLines: [12],
    operation: 'Complete',
    phase: 'Fully Sorted',
    comparisonCount: comparisons,
    swapCount: swaps,
    beforeState: formatArr(arr),
    afterState: formatArr(arr),
    lineExplanation: 'Array sorted in non-decreasing order',
  });

  return steps;
}
