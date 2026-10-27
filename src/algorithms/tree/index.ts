import type { AlgorithmStep, TreeNode } from '../../types/algorithm';

export function createSampleBST(): TreeNode {
  return {
    id: 1,
    value: 50,
    state: 'default',
    left: {
      id: 2,
      value: 30,
      state: 'default',
      left: { id: 4, value: 20, state: 'default' },
      right: { id: 5, value: 40, state: 'default' },
    },
    right: {
      id: 3,
      value: 70,
      state: 'default',
      left: { id: 6, value: 60, state: 'default' },
      right: { id: 7, value: 80, state: 'default' },
    },
  };
}

function cloneTree(node: TreeNode | null, states: Record<number, TreeNode['state']> = {}): TreeNode | null {
  if (!node) return null;
  return {
    ...node,
    state: states[node.id] ?? node.state ?? 'default',
    left: cloneTree(node.left ?? null, states) ?? undefined,
    right: cloneTree(node.right ?? null, states) ?? undefined,
  };
}

export function buildBSTFromValues(values: number[]): TreeNode | null {
  const nums = values.filter(v => !isNaN(v));
  if (nums.length === 0) return null;
  let nextId = 1;
  const root: TreeNode = { id: nextId++, value: nums[0], state: 'default' };

  function insert(node: TreeNode, val: number) {
    if (val < node.value) {
      if (node.left) insert(node.left, val);
      else node.left = { id: nextId++, value: val, state: 'default' };
    } else if (val > node.value) {
      if (node.right) insert(node.right, val);
      else node.right = { id: nextId++, value: val, state: 'default' };
    }
  }

  for (let i = 1; i < nums.length; i++) {
    insert(root, nums[i]);
  }
  return root;
}

export function inOrderTraversal(root: TreeNode | null = createSampleBST()): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  if (!root) {
    steps.push({
      data: { type: 'tree', root: null },
      description: 'The binary tree is empty. Traversal produces an empty sequence [].',
      highlightLines: [0],
      operation: 'Idle',
      phase: 'Empty Tree',
      auxiliary: [{ label: 'Order', value: '[]' }],
    });
    return steps;
  }
  const visitedStates: Record<number, TreeNode['state']> = {};
  const traversalOrder: number[] = [];

  steps.push({
    data: { type: 'tree', root: cloneTree(root, visitedStates) },
    description: 'In-order Traversal (L-N-R): Visit left subtree, visit current node, then visit right subtree. For any Binary Search Tree, this systematically outputs values in ascending order.',
    highlightLines: [0],
    operation: 'Initialize Traversal',
    phase: 'Start',
    auxiliary: [{ label: 'Order', value: 'Empty' }],
    lineExplanation: 'procedure inOrder(node): depth-first symmetric traversal',
  });

  function traverse(node: TreeNode | null) {
    if (!node) return;

    visitedStates[node.id] = 'comparing';
    steps.push({
      data: { type: 'tree', root: cloneTree(root, visitedStates) },
      description: `At node ${node.value}: Recursing left to explore its entire left subtree first.`,
      highlightLines: [1, 2],
      operation: 'Traverse Left',
      phase: `Node ${node.value}`,
      reason: 'In-order rule: left subtree must be processed before the current node',
      result: node.left ? `Moving to left child (${node.left.value})` : 'Left child is null; returning',
      auxiliary: [{ label: 'Current Node', value: node.value }, { label: 'Path', value: traversalOrder }],
      lineExplanation: 'if node is not null: inOrder(node.left)',
    });

    if (node.left) {
      traverse(node.left);
    }

    // Process node
    visitedStates[node.id] = 'active';
    traversalOrder.push(node.value);

    steps.push({
      data: { type: 'tree', root: cloneTree(root, visitedStates) },
      description: `Left subtree of node ${node.value} completed. Now visiting current node ${node.value}. Appended to traversal order: [${traversalOrder.join(', ')}].`,
      highlightLines: [3],
      operation: 'Visit Node',
      phase: `Visit ${node.value}`,
      reason: 'All nodes smaller than this key have been processed',
      result: `Node ${node.value} officially visited`,
      nextAction: node.right ? `Recurse to right child (${node.right.value})` : 'Return to parent',
      auxiliary: [
        { label: 'Visited Value', value: node.value },
        { label: 'Ascending Sequence', value: traversalOrder },
      ],
      lineExplanation: 'visit(node) - process value',
    });

    visitedStates[node.id] = 'sorted';

    if (node.right) {
      steps.push({
        data: { type: 'tree', root: cloneTree(root, visitedStates) },
        description: `Now exploring right subtree of node ${node.value} (values greater than ${node.value}).`,
        highlightLines: [4],
        operation: 'Traverse Right',
        phase: `Right of ${node.value}`,
        reason: 'In-order rule: process right subtree after current node',
        result: `Moving to right child (${node.right.value})`,
        auxiliary: [{ label: 'Current Node', value: node.value }, { label: 'Right Child', value: node.right.value }],
        lineExplanation: 'inOrder(node.right)',
      });
      traverse(node.right);
    }
  }

  traverse(root);

  steps.push({
    data: { type: 'tree', root: cloneTree(root, visitedStates) },
    description: `In-order Traversal complete! Final ascending sequence: [${traversalOrder.join(', ')}]. All ${traversalOrder.length} BST nodes visited.`,
    highlightLines: [5],
    operation: 'Complete',
    phase: 'Finished',
    auxiliary: [{ label: 'Sorted Output', value: traversalOrder }],
    lineExplanation: 'Traversal complete',
  });

  return steps;
}

export function bstSearch(root: TreeNode | null = createSampleBST(), target: number = 60): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  if (!root) {
    steps.push({
      data: { type: 'tree', root: null },
      description: `Target ${target} cannot be found because the tree is empty.`,
      highlightLines: [0],
      operation: 'Target Not Found',
      phase: 'Empty Tree',
      auxiliary: [{ label: 'Target', value: target }, { label: 'Result', value: 'Empty Tree' }],
      lineExplanation: 'Tree is empty; return null',
    });
    return steps;
  }
  const states: Record<number, TreeNode['state']> = {};
  let comparisons = 0;

  steps.push({
    data: { type: 'tree', root: cloneTree(root, states) },
    description: `Searching for target value ${target} in the Binary Search Tree. BST Invariant: Left subtree < Root < Right subtree.`,
    highlightLines: [0],
    operation: 'Initialize BST Search',
    phase: 'Root Inspection',
    auxiliary: [{ label: 'Target', value: target }, { label: 'Root Value', value: root.value }],
    lineExplanation: 'procedure bstSearch(root, target): set current := root',
  });

  let current: TreeNode | null = root;
  let found = false;

  while (current) {
    comparisons++;
    states[current.id] = 'comparing';
    const currVal = current.value;

    steps.push({
      data: { type: 'tree', root: cloneTree(root, states) },
      description: `Comparing target ${target} with current node ${currVal}.`,
      highlightLines: [1, 2],
      operation: 'Compare Node',
      phase: `Node ${currVal}`,
      reason: `Inspect node to decide whether target is found, left, or right`,
      result: target === currVal ? 'Match!' : target < currVal ? `${target} < ${currVal}` : `${target} > ${currVal}`,
      nextAction: target === currVal ? 'Return node' : target < currVal ? 'Branch Left' : 'Branch Right',
      auxiliary: [
        { label: 'Target', value: target },
        { label: 'Current', value: currVal },
        { label: 'Comparisons', value: comparisons },
      ],
      lineExplanation: 'if target = current.value then return current',
    });

    if (currVal === target) {
      states[current.id] = 'found';
      found = true;
      steps.push({
        data: { type: 'tree', root: cloneTree(root, states) },
        description: `Target ${target} found at node ID ${current.id} in only ${comparisons} comparison(s)!`,
        highlightLines: [3],
        operation: 'Target Located',
        phase: 'Success',
        auxiliary: [{ label: 'Target', value: target }, { label: 'Node Found', value: current.id }],
        lineExplanation: 'return current',
      });
      break;
    } else if (target < currVal) {
      states[current.id] = 'visited';
      steps.push({
        data: { type: 'tree', root: cloneTree(root, states) },
        description: `Since ${target} < ${currVal}, the target must be in the left subtree. Discarding right branch.`,
        highlightLines: [4, 5],
        operation: 'Branch Left',
        phase: `Move Left from ${currVal}`,
        reason: `${target} < ${currVal}: smaller values reside on left`,
        result: current.left ? `Moving to node ${current.left.value}` : 'No left child exists',
        auxiliary: [{ label: 'Target', value: target }, { label: 'Next Node', value: current.left?.value ?? 'null' }],
        lineExplanation: 'current := current.left',
      });
      current = current.left ?? null;
    } else {
      states[current.id] = 'visited';
      steps.push({
        data: { type: 'tree', root: cloneTree(root, states) },
        description: `Since ${target} > ${currVal}, the target must be in the right subtree. Discarding left branch.`,
        highlightLines: [6, 7],
        operation: 'Branch Right',
        phase: `Move Right from ${currVal}`,
        reason: `${target} > ${currVal}: larger values reside on right`,
        result: current.right ? `Moving to node ${current.right.value}` : 'No right child exists',
        auxiliary: [{ label: 'Target', value: target }, { label: 'Next Node', value: current.right?.value ?? 'null' }],
        lineExplanation: 'current := current.right',
      });
      current = current.right ?? null;
    }
  }

  if (!found) {
    steps.push({
      data: { type: 'tree', root: cloneTree(root, states) },
      description: `Target ${target} does not exist in this BST. Reached null leaf node after ${comparisons} comparisons.`,
      highlightLines: [8],
      operation: 'Target Not Found',
      phase: 'Search Complete',
      auxiliary: [{ label: 'Target', value: target }, { label: 'Result', value: 'Not Found' }],
      lineExplanation: 'return null (target not found in BST)',
    });
  }

  return steps;
}
