import { createServer } from 'vite';

async function runCorrectnessVerification() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — DEEP ALGORITHM CORRECTNESS & REFERENCE VERIFICATION');
  console.log('='.repeat(75));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const sorting = await vite.ssrLoadModule('/src/algorithms/sorting/index.ts');
  const searching = await vite.ssrLoadModule('/src/algorithms/searching/index.ts');
  const graphMod = await vite.ssrLoadModule('/src/algorithms/graph/index.ts');
  const treeMod = await vite.ssrLoadModule('/src/algorithms/tree/index.ts');
  const dpMod = await vite.ssrLoadModule('/src/algorithms/dynamicProgramming/index.ts');
  const greedyMod = await vite.ssrLoadModule('/src/algorithms/greedy/index.ts');
  const backtrackingMod = await vite.ssrLoadModule('/src/algorithms/backtracking/index.ts');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
    } else {
      failed++;
      console.error(`  ✗ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
    }
  }

  // 1. SORTING ALGORITHMS
  console.log('\n[1] Verifying Sorting Algorithms against Independent Trusted Reference (Array.prototype.sort):');
  const sortFuncs = [
    { name: 'Bubble Sort', fn: sorting.bubbleSort },
    { name: 'Selection Sort', fn: sorting.selectionSort },
    { name: 'Insertion Sort', fn: sorting.insertionSort },
    { name: 'Merge Sort', fn: sorting.mergeSort },
    { name: 'Quick Sort', fn: sorting.quickSort },
    { name: 'Heap Sort', fn: sorting.heapSort },
  ];

  const testDatasets = [
    { label: 'Empty array', input: [] },
    { label: 'Single element', input: [42] },
    { label: 'Already sorted', input: [1, 2, 3, 4, 5, 6, 7] },
    { label: 'Reverse sorted', input: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
    { label: 'Duplicate values', input: [5, 2, 8, 2, 5, 1, 8, 2] },
    { label: 'Negative values', input: [-10, 5, -2, 0, 15, -20, 8] },
    { label: 'Random arbitrary numbers', input: [64, 34, 25, 12, 22, 11, 90, 88, 45, 50] },
  ];

  for (const { name, fn } of sortFuncs) {
    for (const dataset of testDatasets) {
      const expected = [...dataset.input].sort((a, b) => a - b);
      const steps = fn([...dataset.input]);
      const lastStep = steps[steps.length - 1];
      const actual = lastStep.data.elements.map(e => e.value);

      const isMatch = actual.length === expected.length && actual.every((val, i) => val === expected[i]);
      assert(isMatch, `${name} - ${dataset.label}`, `Input: [${dataset.input.join(', ')}] -> Output: [${actual.join(', ')}]`);
    }
  }

  // 2. SEARCHING ALGORITHMS
  console.log('\n[2] Verifying Searching Algorithms (Linear & Binary Search):');
  // Linear Search
  {
    const emptySteps = searching.linearSearch([], 42);
    assert(emptySteps[emptySteps.length - 1].description.includes('empty'), 'Linear Search: empty array handling');

    const arr = [10, 20, 30, 40, 50];
    const hitFirst = searching.linearSearch(arr, 10);
    assert(hitFirst[hitFirst.length - 1].auxiliary.some(a => a.label === 'Found Index' && a.value === 0), 'Linear Search: target at first index 0');

    const hitLast = searching.linearSearch(arr, 50);
    assert(hitLast[hitLast.length - 1].auxiliary.some(a => a.label === 'Found Index' && a.value === 4), 'Linear Search: target at last index 4');

    const miss = searching.linearSearch(arr, 99);
    assert(miss[miss.length - 1].operation === 'Target Not Found', 'Linear Search: target not found (99)');

    const dupArr = [-5, 10, -5, 20];
    const hitNeg = searching.linearSearch(dupArr, -5);
    assert(hitNeg[hitNeg.length - 1].auxiliary.some(a => a.label === 'Found Index' && a.value === 0), 'Linear Search: negative target found at index 0');
  }

  // Binary Search
  {
    const emptySteps = searching.binarySearch([], 42);
    assert(emptySteps[emptySteps.length - 1].description.includes('empty'), 'Binary Search: empty array handling');

    const sortedArr = [1, 3, 5, 7, 9, 11, 13];
    const hitMid = searching.binarySearch(sortedArr, 7);
    assert(hitMid[hitMid.length - 1].auxiliary.some(a => a.label === 'Found Index' && a.value === 3), 'Binary Search: target in middle (index 3)');

    const hitBoundary = searching.binarySearch(sortedArr, 1);
    assert(hitBoundary[hitBoundary.length - 1].auxiliary.some(a => a.label === 'Found Index' && a.value === 0), 'Binary Search: target at left boundary (index 0)');

    const missSmall = searching.binarySearch(sortedArr, 0);
    assert(missSmall[missSmall.length - 1].operation === 'Target Not Found', 'Binary Search: target smaller than min absent');

    const missBetween = searching.binarySearch(sortedArr, 4);
    assert(missBetween[missBetween.length - 1].operation === 'Target Not Found', 'Binary Search: target between elements absent');

    const unsorted = [9, 1, 7, 3, 5];
    const autoSortHit = searching.binarySearch(unsorted, 7);
    assert(autoSortHit[0].operation === 'Pre-sort Array' && autoSortHit[autoSortHit.length - 1].operation === 'Target Found', 'Binary Search: auto-sorts unsorted input and finds target');
  }

  // 3. GRAPH ALGORITHMS (BFS & DFS)
  console.log('\n[3] Verifying Graph Algorithms (BFS & DFS):');
  {
    const sampleGraph = graphMod.generateSampleGraph();
    const bfsSteps = graphMod.bfs(sampleGraph, 0);
    const lastBfs = bfsSteps[bfsSteps.length - 1];
    assert(lastBfs.auxiliary.some(a => a.label === 'Visited Total' && a.value === 7), 'BFS: visits all 7 nodes of connected sample graph');

    const dfsSteps = graphMod.dfs(sampleGraph, 0);
    assert(dfsSteps[dfsSteps.length - 1].description.includes('DFS complete'), 'DFS: completes exploration of connected sample graph');

    // Disconnected graph with isolated node
    const disconnectedGraph = graphMod.createCustomGraph(5, [[0, 1], [1, 2], [2, 3]]); // node 4 is isolated
    const discBfs = graphMod.bfs(disconnectedGraph, 0);
    const discLast = discBfs[discBfs.length - 1];
    assert(discLast.auxiliary.some(a => a.label === 'Visited Total' && a.value === 4), 'BFS: correctly handles disconnected graph (visits 4 of 5 nodes, node 4 untouched)');

    // Cyclic graph
    const cycleGraph = graphMod.createCustomGraph(4, [[0, 1], [1, 2], [2, 3], [3, 0]]);
    const cycleDfs = graphMod.dfs(cycleGraph, 0);
    assert(cycleDfs.length > 0 && cycleDfs[cycleDfs.length - 1].operation === undefined || cycleDfs[cycleDfs.length - 1].description.includes('complete'), 'DFS: handles graph cycles without infinite recursion');
  }

  // 4. TREE ALGORITHMS (In-Order & BST Search)
  console.log('\n[4] Verifying Tree Algorithms (In-Order Traversal & BST Search):');
  {
    // In-Order Traversal on sample BST
    const inOrderSteps = treeMod.inOrderTraversal();
    const inOrderLast = inOrderSteps[inOrderSteps.length - 1];
    const order = inOrderLast.auxiliary.find(a => a.label === 'Sorted Output')?.value;
    const isSortedAsc = JSON.stringify(order) === JSON.stringify([20, 30, 40, 50, 60, 70, 80]);
    assert(isSortedAsc, 'In-Order Traversal: strictly ascends [20, 30, 40, 50, 60, 70, 80]');

    // Custom constructed BST
    const customTree = treeMod.buildBSTFromValues([55, 22, 77, 11, 33, 66, 88]);
    const customInOrder = treeMod.inOrderTraversal(customTree);
    const customOrder = customInOrder[customInOrder.length - 1].auxiliary.find(a => a.label === 'Sorted Output')?.value;
    assert(JSON.stringify(customOrder) === JSON.stringify([11, 22, 33, 55, 66, 77, 88]), 'In-Order Traversal: custom constructed BST outputs sorted keys');

    // Empty tree
    const emptyTreeSteps = treeMod.inOrderTraversal(null);
    assert(emptyTreeSteps[0].operation === 'Idle', 'In-Order Traversal: empty tree returns idle step');

    // BST Search hit
    const bstHit = treeMod.bstSearch(customTree, 33);
    assert(bstHit[bstHit.length - 1].operation === 'Target Located', 'BST Search: finds target 33 in custom BST');

    // BST Search miss
    const bstMiss = treeMod.bstSearch(customTree, 99);
    assert(bstMiss[bstMiss.length - 1].operation === 'Target Not Found', 'BST Search: target 99 absent');

    // BST Search on empty tree
    const bstEmpty = treeMod.bstSearch(null, 50);
    assert(bstEmpty[0].operation === 'Target Not Found', 'BST Search: empty tree handled gracefully');
  }

  // 5. DYNAMIC PROGRAMMING (Fibonacci & LCS)
  console.log('\n[5] Verifying Dynamic Programming (Fibonacci & LCS):');
  {
    // Fibonacci reference
    function fibRef(n) {
      if (n <= 0) return 0;
      if (n === 1) return 1;
      let a = 0, b = 1;
      for (let i = 2; i <= n; i++) {
        const c = a + b;
        a = b;
        b = c;
      }
      return b;
    }

    for (const n of [0, 1, 2, 5, 7, 10, 12]) {
      const steps = dpMod.fibonacciDP(n);
      const last = steps[steps.length - 1];
      const answer = last.auxiliary.find(a => a.label.includes('Answer') || a.label.includes('F('))?.value;
      assert(answer === fibRef(n), `Fibonacci DP: F(${n}) = ${fibRef(n)}`, `Computed: ${answer}`);
    }

    // LCS reference
    function lcsRef(s1, s2) {
      const m = s1.length, n = s2.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
          else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
      return dp[m][n];
    }

    const lcsCases = [
      { s1: 'ABCBDAB', s2: 'BDCAB' },
      { s1: 'AGGTAB', s2: 'GXTXAYB' },
      { s1: 'ALGORITHM', s2: 'ALGORITHM' },
      { s1: 'AAAA', s2: 'AA' },
      { s1: 'ABC', s2: 'XYZ' },
      { s1: '', s2: 'ABC' },
    ];

    for (const { s1, s2 } of lcsCases) {
      const expected = lcsRef(s1, s2);
      const steps = dpMod.lcs(s1, s2);
      const last = steps[steps.length - 1];
      const actual = last.auxiliary.find(a => a.label === 'LCS Length')?.value ?? 0;
      assert(actual === expected, `LCS("${s1}", "${s2}") = ${expected}`, `Actual: ${actual}`);
    }
  }

  // 6. GREEDY ALGORITHMS (Coin Change)
  console.log('\n[6] Verifying Greedy Coin Change:');
  {
    // Canonical US coins
    const canonicalSteps = greedyMod.coinChangeGreedy([25, 10, 5, 1], 36);
    const canLast = canonicalSteps[canonicalSteps.length - 1];
    const canCoins = canLast.auxiliary.find(a => a.label === 'Coins')?.value;
    assert(JSON.stringify(canCoins) === JSON.stringify([25, 10, 1]), 'Greedy Coin Change: US [25, 10, 5, 1] for 36 yields [25, 10, 1] (3 coins)');

    // Zero amount
    const zeroSteps = greedyMod.coinChangeGreedy([25, 10, 5, 1], 0);
    assert(zeroSteps[0].operation === 'Idle', 'Greedy Coin Change: amount 0 requires 0 coins');

    // Non-canonical system where greedy is suboptimal
    // Denominations [4, 3, 1] for amount 6:
    // Greedy takes 4, then 1, 1 (total 3 coins).
    // Optimal is 3, 3 (total 2 coins).
    const nonCanSteps = greedyMod.coinChangeGreedy([4, 3, 1], 6);
    const nonCanLast = nonCanSteps[nonCanSteps.length - 1];
    const nonCanCoins = nonCanLast.auxiliary.find(a => a.label === 'Coins')?.value;
    assert(
      JSON.stringify(nonCanCoins) === JSON.stringify([4, 1, 1]),
      'Greedy Coin Change: Demonstrates suboptimal greedy choice on [4, 3, 1] for 6 (Greedy takes [4, 1, 1] = 3 coins vs optimal [3, 3] = 2 coins)'
    );

    // Incomplete change (cannot make exact change)
    const partialSteps = greedyMod.coinChangeGreedy([10, 5], 7);
    const partialLast = partialSteps[partialSteps.length - 1];
    const rem = partialLast.auxiliary.find(a => a.label === 'Remaining Balance')?.value;
    assert(rem === 2 && partialLast.operation === 'Partial / Incomplete Change', 'Greedy Coin Change: reports unchangeable remainder (2) when exact change impossible (dispensed 5, remainder 2)');
  }

  // 7. BACKTRACKING (N-Queens)
  console.log('\n[7] Verifying Backtracking (N-Queens):');
  {
    function verifyNonAttacking(board) {
      const n = board.length;
      for (let r1 = 0; r1 < n; r1++) {
        for (let r2 = r1 + 1; r2 < n; r2++) {
          const c1 = board[r1], c2 = board[r2];
          if (c1 === c2) return false; // same column
          if (Math.abs(r1 - r2) === Math.abs(c1 - c2)) return false; // diagonal attack
        }
      }
      return true;
    }

    // N = 4
    const n4Steps = backtrackingMod.nQueens(4);
    const n4Last = n4Steps[n4Steps.length - 1];
    assert(n4Last.operation === 'Solution Found', 'N-Queens: N=4 finds valid solution');
    // Extract queen placements from final grid cells
    const n4Grid = n4Last.data.cells;
    const n4Placements = [];
    for (let r = 0; r < 4; r++) {
      const c = n4Grid[r].findIndex(cell => cell === 'selected');
      if (c !== -1) n4Placements.push(c);
    }
    assert(n4Placements.length === 4 && verifyNonAttacking(n4Placements), 'N-Queens: N=4 placement has zero mutual attacks', `Cols: [${n4Placements.join(', ')}]`);

    // N = 8
    const n8Steps = backtrackingMod.nQueens(8);
    const n8Last = n8Steps[n8Steps.length - 1];
    assert(n8Last.operation === 'Solution Found', 'N-Queens: N=8 finds valid solution');
    const n8Grid = n8Last.data.cells;
    const n8Placements = [];
    for (let r = 0; r < 8; r++) {
      const c = n8Grid[r].findIndex(cell => cell === 'selected');
      if (c !== -1) n8Placements.push(c);
    }
    assert(n8Placements.length === 8 && verifyNonAttacking(n8Placements), 'N-Queens: N=8 placement has zero mutual attacks', `Cols: [${n8Placements.join(', ')}]`);

    // N = 2 and N = 3 (Mathematically unsolvable)
    const n2Steps = backtrackingMod.nQueens(2);
    const n2Last = n2Steps[n2Steps.length - 1];
    assert(n2Last.operation === 'Unsolvable', 'N-Queens: N=2 correctly terminates as Unsolvable (0 valid configurations)');

    const n3Steps = backtrackingMod.nQueens(3);
    const n3Last = n3Steps[n3Steps.length - 1];
    assert(n3Last.operation === 'Unsolvable', 'N-Queens: N=3 correctly terminates as Unsolvable (0 valid configurations)');

    // N = 1
    const n1Steps = backtrackingMod.nQueens(1);
    const n1Last = n1Steps[n1Steps.length - 1];
    assert(n1Last.operation === 'Solution Found', 'N-Queens: N=1 finds trivial single queen solution');
  }

  await vite.close();

  console.log('\n' + '='.repeat(75));
  console.log(`CORRECTNESS VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('='.repeat(75));

  if (failed > 0) {
    process.exit(1);
  }
}

runCorrectnessVerification().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
