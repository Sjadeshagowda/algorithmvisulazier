import type { AlgorithmStep } from '../types/algorithm';
import type { DataPoint2D } from '../types/ml';
import { randomArray } from './randomArray';

import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort } from '../algorithms/sorting';
import { linearSearch, binarySearch } from '../algorithms/searching';
import { bfs, dfs, generateSampleGraph, createCustomGraph } from '../algorithms/graph';
import { fibonacciDP, lcs } from '../algorithms/dynamicProgramming';
import { nQueens } from '../algorithms/backtracking';
import { inOrderTraversal, bstSearch, buildBSTFromValues, createSampleBST } from '../algorithms/tree';
import { coinChangeGreedy } from '../algorithms/greedy';
import { runLinearRegression } from '../algorithms/ml/linearRegression';
import { runLogisticRegression } from '../algorithms/ml/logisticRegression';
import { runKNN } from '../algorithms/ml/knn';
import { runKMeans } from '../algorithms/ml/kmeans';
import { runGradientDescent } from '../algorithms/ml/gradientDescent';
import { runDecisionTree } from '../algorithms/ml/decisionTree';
import { runSVM } from '../algorithms/ml/svm';
import { runPCA } from '../algorithms/ml/pca';
import { runNeuralNetwork } from '../algorithms/ml/neuralNetwork';
import { runQLearning, Q_LEARNING_PRESETS } from '../algorithms/ml/qLearning';
import type { GridCoord, SpecialRewardCell } from '../types/ml';
import {
  regressionSampleDatasets,
  classificationSampleDatasets,
  clusteringSampleDatasets,
  decisionTreeSampleDatasets,
  svmSampleDatasets,
  pcaSampleDatasets,
  neuralNetworkSampleDatasets,
} from './ml/datasets';

export interface CustomAlgorithmInput {
  array?: number[];
  target?: number;
  startNode?: number;
  graphNodes?: number;
  graphEdges?: Array<[number, number]>;
  treeValues?: number[];
  treeTarget?: number;
  fibN?: number;
  s1?: string;
  s2?: string;
  coins?: number[];
  amount?: number;
  boardN?: number;
  // ML inputs
  mlPoints?: DataPoint2D[];
  learningRate?: number;
  k?: number;
  queryPoint?: { x: number; y: number };
  startPoint?: { x: number; y: number };
  epochs?: number;
  dtCriterion?: 'gini' | 'entropy';
  maxDepth?: number;
  minSamplesSplit?: number;
  svmC?: number;
  pcaMatrix?: number[][];
  pcaK?: number;
  pcaStandardize?: boolean;
  nnInputs?: number[][];
  nnTargets?: number[];
  nnTask?: 'regression' | 'classification';
  nnHiddenLayers?: number[];
  nnActivation?: 'sigmoid' | 'relu' | 'tanh' | 'linear';
  // RL (Q-Learning) inputs
  qlWidth?: number;
  qlHeight?: number;
  qlStart?: GridCoord;
  qlGoal?: GridCoord;
  qlWalls?: GridCoord[];
  qlSpecialRewards?: SpecialRewardCell[];
  qlStepReward?: number;
  qlGoalReward?: number;
  qlInvalidPenalty?: number;
  qlAlpha?: number;
  qlGamma?: number;
  qlEpsilon?: number;
  qlEpisodes?: number;
  qlMaxSteps?: number;
  qlSeed?: number;
}

export function getDefaultAlgorithmInput(algorithmId: string): CustomAlgorithmInput {
  switch (algorithmId) {
    case 'bubble-sort':
    case 'selection-sort':
    case 'insertion-sort':
    case 'merge-sort':
    case 'quick-sort':
    case 'heap-sort':
      return { array: [7, 4, 6, 2, 9, 1, 5] };
    case 'linear-search':
      return { array: [7, 4, 6, 2, 9, 1, 5], target: 6 };
    case 'binary-search':
      return { array: [1, 2, 4, 5, 6, 7, 9], target: 6 };
    case 'bfs':
    case 'dfs':
      return {
        startNode: 0,
        graphNodes: 7,
        graphEdges: [
          [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 4], [5, 6],
        ],
      };
    case 'fibonacci-dp':
      return { fibN: 7 };
    case 'lcs':
      return { s1: 'ABCBDAB', s2: 'BDCAB' };
    case 'coin-change-greedy':
      return { coins: [25, 10, 5, 1], amount: 36 };
    case 'n-queens':
      return { boardN: 4 };
    case 'inorder-traversal':
      return { treeValues: [50, 30, 70, 20, 40, 60, 80] };
    case 'bst-search':
      return { treeValues: [50, 30, 70, 20, 40, 60, 80], treeTarget: 60 };
    case 'linear-regression':
      return { mlPoints: regressionSampleDatasets[0].points, learningRate: 0.01, epochs: 5 };
    case 'logistic-regression':
      return { mlPoints: classificationSampleDatasets[0].points, learningRate: 0.005, epochs: 6 };
    case 'knn':
      return { mlPoints: classificationSampleDatasets[0].points, k: 3, queryPoint: { x: 55, y: 55 } };
    case 'k-means':
      return { mlPoints: clusteringSampleDatasets[0].points, k: 3 };
    case 'gradient-descent':
      return { startPoint: { x: 4, y: 3.5 }, learningRate: 0.15 };
    case 'decision-tree':
      return {
        mlPoints: decisionTreeSampleDatasets[0].points,
        dtCriterion: 'gini',
        maxDepth: 3,
        minSamplesSplit: 2,
        queryPoint: { x: 50, y: 60 },
      };
    case 'svm':
      return {
        mlPoints: svmSampleDatasets[0].points,
        svmC: 1.0,
        learningRate: 0.005,
        epochs: 10,
        queryPoint: { x: 50, y: 50 },
      };
    case 'pca':
      return {
        pcaMatrix: pcaSampleDatasets[0].rawMatrix,
        pcaK: 1,
        pcaStandardize: false,
      };
    case 'neural-network':
      return {
        nnInputs: neuralNetworkSampleDatasets[1].rawMatrix,
        nnTargets: neuralNetworkSampleDatasets[1].targets,
        nnTask: 'classification',
        nnHiddenLayers: [3],
        nnActivation: 'tanh',
        learningRate: 0.1,
        epochs: 15,
      };
    case 'q-learning':
      return {
        qlWidth: Q_LEARNING_PRESETS[0].config.width,
        qlHeight: Q_LEARNING_PRESETS[0].config.height,
        qlStart: Q_LEARNING_PRESETS[0].config.start,
        qlGoal: Q_LEARNING_PRESETS[0].config.goal,
        qlWalls: Q_LEARNING_PRESETS[0].config.walls,
        qlSpecialRewards: Q_LEARNING_PRESETS[0].config.specialRewards,
        qlStepReward: Q_LEARNING_PRESETS[0].config.stepReward,
        qlGoalReward: Q_LEARNING_PRESETS[0].config.goalReward,
        qlInvalidPenalty: Q_LEARNING_PRESETS[0].config.invalidMovePenalty,
        qlAlpha: Q_LEARNING_PRESETS[0].config.learningRate,
        qlGamma: Q_LEARNING_PRESETS[0].config.discountFactor,
        qlEpsilon: Q_LEARNING_PRESETS[0].config.epsilon,
        qlEpisodes: Q_LEARNING_PRESETS[0].config.episodes,
        qlMaxSteps: Q_LEARNING_PRESETS[0].config.maxStepsPerEpisode,
        qlSeed: Q_LEARNING_PRESETS[0].config.seed,
      };
    default:
      return {};
  }
}

export function generateAlgorithmSteps(
  algorithmId: string,
  size = 7,
  customInput?: CustomAlgorithmInput
): AlgorithmStep[] {
  const defaultArr = [7, 4, 6, 2, 9, 1, 5];
  const arr = customInput?.array && customInput.array.length > 0
    ? [...customInput.array]
    : size === 7 ? defaultArr : randomArray(size, 5, 99);

  const target = customInput?.target !== undefined
    ? customInput.target
    : arr[Math.floor(Math.random() * arr.length)];

  switch (algorithmId) {
    case 'bubble-sort':
      return bubbleSort(arr);
    case 'selection-sort':
      return selectionSort(arr);
    case 'insertion-sort':
      return insertionSort(arr);
    case 'merge-sort':
      return mergeSort(arr);
    case 'quick-sort':
      return quickSort(arr);
    case 'heap-sort':
      return heapSort(arr);
    case 'linear-search':
      return linearSearch(arr, target);
    case 'binary-search': {
      // Ensure sorted for binary search
      const isSorted = arr.every((v, i, a) => !i || a[i - 1] <= v);
      const searchArr = isSorted ? arr : [...arr].sort((a, b) => a - b);
      return binarySearch(searchArr, target);
    }
    case 'bfs': {
      const graph = customInput?.graphEdges && customInput.graphEdges.length > 0
        ? createCustomGraph(customInput.graphNodes || 7, customInput.graphEdges)
        : generateSampleGraph();
      const start = Math.max(0, Math.min(graph.nodes.length - 1, customInput?.startNode ?? 0));
      return bfs(graph, start);
    }
    case 'dfs': {
      const graph = customInput?.graphEdges && customInput.graphEdges.length > 0
        ? createCustomGraph(customInput.graphNodes || 7, customInput.graphEdges)
        : generateSampleGraph();
      const start = Math.max(0, Math.min(graph.nodes.length - 1, customInput?.startNode ?? 0));
      return dfs(graph, start);
    }
    case 'fibonacci-dp': {
      const n = customInput?.fibN !== undefined ? Math.max(0, Math.min(15, customInput.fibN)) : Math.min(size, 10);
      return fibonacciDP(n);
    }
    case 'lcs': {
      const s1 = customInput?.s1 !== undefined ? customInput.s1 : 'ABCBDAB';
      const s2 = customInput?.s2 !== undefined ? customInput.s2 : 'BDCAB';
      return lcs(s1, s2);
    }
    case 'n-queens': {
      const n = customInput?.boardN !== undefined
        ? Math.max(1, Math.min(8, customInput.boardN))
        : 4;
      return nQueens(n);
    }
    case 'inorder-traversal': {
      const root = customInput?.treeValues && customInput.treeValues.length > 0
        ? buildBSTFromValues(customInput.treeValues)
        : createSampleBST();
      return inOrderTraversal(root);
    }
    case 'bst-search': {
      const root = customInput?.treeValues && customInput.treeValues.length > 0
        ? buildBSTFromValues(customInput.treeValues)
        : createSampleBST();
      const searchTarget = customInput?.treeTarget !== undefined
        ? customInput.treeTarget
        : (customInput?.target !== undefined ? customInput.target : 60);
      return bstSearch(root, searchTarget);
    }
    case 'coin-change-greedy': {
      const coins = customInput?.coins && customInput.coins.length > 0 ? customInput.coins : [25, 10, 5, 1];
      const amount = customInput?.amount !== undefined ? customInput.amount : 36;
      return coinChangeGreedy(coins, amount);
    }
    case 'linear-regression':
      return runLinearRegression(customInput?.mlPoints, customInput?.learningRate, customInput?.epochs);
    case 'logistic-regression':
      return runLogisticRegression(customInput?.mlPoints, customInput?.learningRate, customInput?.epochs);
    case 'knn':
      return runKNN(customInput?.mlPoints, customInput?.queryPoint, customInput?.k);
    case 'k-means':
      return runKMeans(customInput?.mlPoints, customInput?.k);
    case 'gradient-descent':
      return runGradientDescent(customInput?.startPoint, customInput?.learningRate);
    case 'decision-tree':
      return runDecisionTree(customInput?.mlPoints, {
        criterion: customInput?.dtCriterion,
        maxDepth: customInput?.maxDepth,
        minSamplesSplit: customInput?.minSamplesSplit,
        queryPoint: customInput?.queryPoint,
      });
    case 'svm':
      return runSVM(customInput?.mlPoints, {
        c: customInput?.svmC,
        learningRate: customInput?.learningRate,
        epochs: customInput?.epochs,
        queryPoint: customInput?.queryPoint,
      });
    case 'pca':
      return runPCA(customInput?.pcaMatrix, {
        k: customInput?.pcaK,
        standardize: customInput?.pcaStandardize,
      });
    case 'neural-network':
      return runNeuralNetwork(customInput?.nnInputs, customInput?.nnTargets, {
        task: customInput?.nnTask,
        hiddenLayers: customInput?.nnHiddenLayers,
        activation: customInput?.nnActivation,
        learningRate: customInput?.learningRate,
        epochs: customInput?.epochs,
      });
    case 'q-learning':
      return runQLearning({
        width: customInput?.qlWidth,
        height: customInput?.qlHeight,
        start: customInput?.qlStart,
        goal: customInput?.qlGoal,
        walls: customInput?.qlWalls,
        specialRewards: customInput?.qlSpecialRewards,
        stepReward: customInput?.qlStepReward,
        goalReward: customInput?.qlGoalReward,
        invalidMovePenalty: customInput?.qlInvalidPenalty,
        learningRate: customInput?.qlAlpha,
        discountFactor: customInput?.qlGamma,
        epsilon: customInput?.qlEpsilon,
        episodes: customInput?.qlEpisodes,
        maxStepsPerEpisode: customInput?.qlMaxSteps,
        seed: customInput?.qlSeed,
      });
    default:
      return bubbleSort(arr);
  }
}
