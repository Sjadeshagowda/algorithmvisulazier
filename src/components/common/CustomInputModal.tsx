import React, { useState } from 'react';
import { Modal } from './Modal';
import type { CustomAlgorithmInput } from '../../utils/stepGenerator';
import { getDefaultAlgorithmInput } from '../../utils/stepGenerator';
import { decisionTreeSampleDatasets, svmSampleDatasets, pcaSampleDatasets, neuralNetworkSampleDatasets } from '../../utils/ml/datasets';
import { Q_LEARNING_PRESETS, validateGridEnvironment } from '../../algorithms/ml/qLearning';
import type { GridCoord, SpecialRewardCell } from '../../types/ml';
import { RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CustomInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  algorithmId: string;
  onApply: (input: CustomAlgorithmInput) => void;
}

export const CustomInputModal: React.FC<CustomInputModalProps> = ({
  isOpen,
  onClose,
  algorithmId,
  onApply,
}) => {
  const defaultInput = getDefaultAlgorithmInput(algorithmId);

  const [arrayText, setArrayText] = useState(() => defaultInput.array ? defaultInput.array.join(', ') : '7, 4, 6, 2, 9, 1, 5');
  const [targetVal, setTargetVal] = useState<number>(() => defaultInput.target ?? 6);
  const [startNode, setStartNode] = useState<number>(() => defaultInput.startNode ?? 0);
  const [graphNodes, setGraphNodes] = useState<number>(() => defaultInput.graphNodes ?? 7);
  const [edgeListText, setEdgeListText] = useState(() => defaultInput.graphEdges ? defaultInput.graphEdges.map(([u, v]) => `${u}-${v}`).join(', ') : '0-1, 0-2, 1-3, 1-4, 2-5, 2-6, 3-4, 5-6');
  const [treeValuesText, setTreeValuesText] = useState(() => defaultInput.treeValues ? defaultInput.treeValues.join(', ') : '50, 30, 70, 20, 40, 60, 80');
  const [treeTarget, setTreeTarget] = useState<number>(() => defaultInput.treeTarget ?? 60);
  const [fibN, setFibN] = useState<number>(() => defaultInput.fibN ?? 7);
  const [s1, setS1] = useState(() => defaultInput.s1 ?? 'ABCBDAB');
  const [s2, setS2] = useState(() => defaultInput.s2 ?? 'BDCAB');
  const [coinsText, setCoinsText] = useState(() => defaultInput.coins ? defaultInput.coins.join(', ') : '25, 10, 5, 1');
  const [amount, setAmount] = useState<number>(() => defaultInput.amount ?? 36);
  const [boardN, setBoardN] = useState<number>(() => defaultInput.boardN ?? 4);
  // ML States
  const [learningRate, setLearningRate] = useState<number>(() => defaultInput.learningRate ?? (algorithmId === 'gradient-descent' ? 0.15 : algorithmId === 'logistic-regression' ? 0.005 : 0.01));
  const [kParam, setKParam] = useState<number>(() => defaultInput.k ?? 3);
  const [queryX, setQueryX] = useState<number>(() => defaultInput.queryPoint?.x ?? 55);
  const [queryY, setQueryY] = useState<number>(() => defaultInput.queryPoint?.y ?? 55);
  const [startX, setStartX] = useState<number>(() => defaultInput.startPoint?.x ?? 4);
  const [startY, setStartY] = useState<number>(() => defaultInput.startPoint?.y ?? 3.5);
  // Decision Tree States
  const [dtCriterion, setDtCriterion] = useState<'gini' | 'entropy'>(() => defaultInput.dtCriterion ?? 'gini');
  const [dtMaxDepth, setDtMaxDepth] = useState<number>(() => defaultInput.maxDepth ?? 3);
  const [dtMinSamples, setDtMinSamples] = useState<number>(() => defaultInput.minSamplesSplit ?? 2);
  const [dtDatasetIdx, setDtDatasetIdx] = useState<number>(0);
  // SVM States
  const [svmC, setSvmC] = useState<number>(() => defaultInput.svmC ?? 1.0);
  const [svmEpochs, setSvmEpochs] = useState<number>(() => defaultInput.epochs ?? 10);
  const [svmDatasetIdx, setSvmDatasetIdx] = useState<number>(0);
  // PCA States
  const [pcaDatasetIdx, setPcaDatasetIdx] = useState<number>(0);
  const [pcaK, setPcaK] = useState<number>(() => defaultInput.pcaK ?? 1);
  const [pcaStandardize, setPcaStandardize] = useState<boolean>(() => defaultInput.pcaStandardize ?? false);
  const [pcaMatrixText, setPcaMatrixText] = useState<string>(() =>
    defaultInput.pcaMatrix
      ? defaultInput.pcaMatrix.map(r => r.join(', ')).join('\n')
      : '15, 18\n25, 28\n35, 33\n45, 47\n55, 53\n65, 67\n75, 73\n85, 88'
  );
  const [pcaInputMode, setPcaInputMode] = useState<'preset' | 'custom'>('preset');
  // Neural Network States
  const [nnDatasetIdx, setNnDatasetIdx] = useState<number>(1);
  const [nnTask, setNnTask] = useState<'classification' | 'regression'>(() => defaultInput.nnTask ?? 'classification');
  const [nnHiddenLayersCount, setNnHiddenLayersCount] = useState<number>(() => defaultInput.nnHiddenLayers ? defaultInput.nnHiddenLayers.length : 1);
  const [nnHiddenNeurons, setNnHiddenNeurons] = useState<number>(() => defaultInput.nnHiddenLayers?.[0] ?? 3);
  const [nnActivation, setNnActivation] = useState<'sigmoid' | 'relu' | 'tanh'>(() => (defaultInput.nnActivation as 'sigmoid' | 'relu' | 'tanh') ?? 'tanh');
  const [nnLearningRate, setNnLearningRate] = useState<number>(() => defaultInput.learningRate ?? 0.1);
  const [nnEpochs, setNnEpochs] = useState<number>(() => defaultInput.epochs ?? 15);
  // Q-Learning States
  const [qlPresetIdx, setQlPresetIdx] = useState<number>(0);
  const [qlWidth, setQlWidth] = useState<number>(() => defaultInput.qlWidth ?? 4);
  const [qlHeight, setQlHeight] = useState<number>(() => defaultInput.qlHeight ?? 4);
  const [qlStartR, setQlStartR] = useState<number>(() => defaultInput.qlStart?.r ?? 0);
  const [qlStartC, setQlStartC] = useState<number>(() => defaultInput.qlStart?.c ?? 0);
  const [qlGoalR, setQlGoalR] = useState<number>(() => defaultInput.qlGoal?.r ?? 0);
  const [qlGoalC, setQlGoalC] = useState<number>(() => defaultInput.qlGoal?.c ?? 3);
  const [qlWallsText, setQlWallsText] = useState<string>(() =>
    defaultInput.qlWalls ? defaultInput.qlWalls.map(w => `${w.r},${w.c}`).join('; ') : '1,0; 1,1; 1,2'
  );
  const [qlSpecialRewardsText, setQlSpecialRewardsText] = useState<string>(() =>
    defaultInput.qlSpecialRewards ? defaultInput.qlSpecialRewards.map(sr => `${sr.r},${sr.c},${sr.reward}`).join('; ') : ''
  );
  const [qlStepReward, setQlStepReward] = useState<number>(() => defaultInput.qlStepReward ?? -1);
  const [qlGoalReward, setQlGoalReward] = useState<number>(() => defaultInput.qlGoalReward ?? 10);
  const [qlInvalidPenalty, setQlInvalidPenalty] = useState<number>(() => defaultInput.qlInvalidPenalty ?? -5);
  const [qlAlpha, setQlAlpha] = useState<number>(() => defaultInput.qlAlpha ?? 0.2);
  const [qlGamma, setQlGamma] = useState<number>(() => defaultInput.qlGamma ?? 0.9);
  const [qlEpsilon, setQlEpsilon] = useState<number>(() => defaultInput.qlEpsilon ?? 0.2);
  const [qlEpisodes, setQlEpisodes] = useState<number>(() => defaultInput.qlEpisodes ?? 25);
  const [qlMaxSteps, setQlMaxSteps] = useState<number>(() => defaultInput.qlMaxSteps ?? 30);
  const [qlSeed, setQlSeed] = useState<number>(() => defaultInput.qlSeed ?? 42);

  const handleSelectQlPreset = (idx: number) => {
    setQlPresetIdx(idx);
    const preset = Q_LEARNING_PRESETS[idx];
    if (preset) {
      setQlWidth(preset.config.width);
      setQlHeight(preset.config.height);
      setQlStartR(preset.config.start.r);
      setQlStartC(preset.config.start.c);
      setQlGoalR(preset.config.goal.r);
      setQlGoalC(preset.config.goal.c);
      setQlWallsText((preset.config.walls || []).map(w => `${w.r},${w.c}`).join('; '));
      setQlSpecialRewardsText((preset.config.specialRewards || []).map(sr => `${sr.r},${sr.c},${sr.reward}`).join('; '));
      if (preset.config.stepReward !== undefined) setQlStepReward(preset.config.stepReward);
      if (preset.config.goalReward !== undefined) setQlGoalReward(preset.config.goalReward);
      if (preset.config.invalidMovePenalty !== undefined) setQlInvalidPenalty(preset.config.invalidMovePenalty);
      if (preset.config.learningRate !== undefined) setQlAlpha(preset.config.learningRate);
      if (preset.config.discountFactor !== undefined) setQlGamma(preset.config.discountFactor);
      if (preset.config.epsilon !== undefined) setQlEpsilon(preset.config.epsilon);
      if (preset.config.episodes !== undefined) setQlEpisodes(preset.config.episodes);
      if (preset.config.maxStepsPerEpisode !== undefined) setQlMaxSteps(preset.config.maxStepsPerEpisode);
      if (preset.config.seed !== undefined) setQlSeed(preset.config.seed);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleRestoreDefault = () => {
    setError(null);
    const def = defaultInput;
    if (def.array) setArrayText(def.array.join(', '));
    if (def.target !== undefined) setTargetVal(def.target);
    if (def.startNode !== undefined) setStartNode(def.startNode);
    if (def.graphNodes !== undefined) setGraphNodes(def.graphNodes);
    if (def.graphEdges) setEdgeListText(def.graphEdges.map(([u, v]) => `${u}-${v}`).join(', '));
    if (def.treeValues) setTreeValuesText(def.treeValues.join(', '));
    if (def.treeTarget !== undefined) setTreeTarget(def.treeTarget);
    if (def.fibN !== undefined) setFibN(def.fibN);
    if (def.s1) setS1(def.s1);
    if (def.s2) setS2(def.s2);
    if (def.coins) setCoinsText(def.coins.join(', '));
    if (def.amount !== undefined) setAmount(def.amount);
    if (def.boardN !== undefined) setBoardN(def.boardN);
    if (def.learningRate !== undefined) setLearningRate(def.learningRate);
    if (def.k !== undefined) setKParam(def.k);
    if (def.queryPoint) {
      setQueryX(def.queryPoint.x);
      setQueryY(def.queryPoint.y);
    }
    if (def.startPoint) {
      setStartX(def.startPoint.x);
      setStartY(def.startPoint.y);
    }
    if (def.dtCriterion) setDtCriterion(def.dtCriterion);
    if (def.maxDepth !== undefined) setDtMaxDepth(def.maxDepth);
    if (def.minSamplesSplit !== undefined) setDtMinSamples(def.minSamplesSplit);
    setDtDatasetIdx(0);
    if (def.svmC !== undefined) setSvmC(def.svmC);
    if (def.epochs !== undefined) setSvmEpochs(def.epochs);
    setSvmDatasetIdx(0);
    if (def.pcaK !== undefined) setPcaK(def.pcaK);
    if (def.pcaStandardize !== undefined) setPcaStandardize(def.pcaStandardize);
    setPcaDatasetIdx(0);
    setPcaInputMode('preset');
    if (def.pcaMatrix) {
      setPcaMatrixText(def.pcaMatrix.map(r => r.join(', ')).join('\n'));
    }
    if (def.nnTask) setNnTask(def.nnTask);
    if (def.nnHiddenLayers) {
      setNnHiddenLayersCount(def.nnHiddenLayers.length);
      setNnHiddenNeurons(def.nnHiddenLayers[0]);
    }
    if (def.nnActivation) setNnActivation(def.nnActivation as 'sigmoid' | 'relu' | 'tanh');
    if (def.learningRate !== undefined) setNnLearningRate(def.learningRate);
    if (def.epochs !== undefined) setNnEpochs(def.epochs);
    setNnDatasetIdx(1);
    if (def.qlWidth !== undefined) setQlWidth(def.qlWidth);
    if (def.qlHeight !== undefined) setQlHeight(def.qlHeight);
    if (def.qlStart) {
      setQlStartR(def.qlStart.r);
      setQlStartC(def.qlStart.c);
    }
    if (def.qlGoal) {
      setQlGoalR(def.qlGoal.r);
      setQlGoalC(def.qlGoal.c);
    }
    if (def.qlWalls) setQlWallsText(def.qlWalls.map(w => `${w.r},${w.c}`).join('; '));
    if (def.qlSpecialRewards) setQlSpecialRewardsText(def.qlSpecialRewards.map(sr => `${sr.r},${sr.c},${sr.reward}`).join('; '));
    if (def.qlStepReward !== undefined) setQlStepReward(def.qlStepReward);
    if (def.qlGoalReward !== undefined) setQlGoalReward(def.qlGoalReward);
    if (def.qlInvalidPenalty !== undefined) setQlInvalidPenalty(def.qlInvalidPenalty);
    if (def.qlAlpha !== undefined) setQlAlpha(def.qlAlpha);
    if (def.qlGamma !== undefined) setQlGamma(def.qlGamma);
    if (def.qlEpsilon !== undefined) setQlEpsilon(def.qlEpsilon);
    if (def.qlEpisodes !== undefined) setQlEpisodes(def.qlEpisodes);
    if (def.qlMaxSteps !== undefined) setQlMaxSteps(def.qlMaxSteps);
    if (def.qlSeed !== undefined) setQlSeed(def.qlSeed);
    setQlPresetIdx(0);
  };

  const handleApply = () => {
    setError(null);
    const nextInput: CustomAlgorithmInput = {};

    // 1. Sorting algorithms
    if (['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort'].includes(algorithmId)) {
      const parts = arrayText.split(/[\s,]+/).filter(s => s.trim().length > 0);
      if (parts.length === 0) {
        setError('Please enter at least 1 number.');
        return;
      }
      const nums = parts.map(s => Number(s.trim()));
      if (nums.some(n => isNaN(n))) {
        setError('All array items must be valid numbers.');
        return;
      }
      if (nums.length > 30) {
        setError('Maximum array size for visualizer is 30 elements.');
        return;
      }
      nextInput.array = nums;
    }
    // 2. Searching
    else if (algorithmId === 'linear-search' || algorithmId === 'binary-search') {
      const parts = arrayText.split(/[\s,]+/).filter(s => s.trim().length > 0);
      if (parts.length === 0) {
        setError('Please enter at least 1 number in the array.');
        return;
      }
      const nums = parts.map(s => Number(s.trim()));
      if (nums.some(n => isNaN(n))) {
        setError('Array contains invalid non-numeric entries.');
        return;
      }
      if (isNaN(Number(targetVal))) {
        setError('Please specify a valid numeric search target.');
        return;
      }
      nextInput.array = nums;
      nextInput.target = Number(targetVal);
    }
    // 3. Graph
    else if (algorithmId === 'bfs' || algorithmId === 'dfs') {
      const nodeCount = Math.max(2, Math.min(8, Number(graphNodes)));
      if (isNaN(nodeCount)) {
        setError('Node count must be an integer between 2 and 8.');
        return;
      }
      const start = Number(startNode);
      if (isNaN(start) || start < 0 || start >= nodeCount) {
        setError(`Start node must be between 0 and ${nodeCount - 1}.`);
        return;
      }
      const edgePairs: Array<[number, number]> = [];
      const edgeTokens = edgeListText.split(/[\s,]+/).filter(s => s.trim().length > 0);
      for (const token of edgeTokens) {
        const parts = token.split('-');
        if (parts.length !== 2) {
          setError(`Invalid edge format "${token}". Format edges as "u-v" (e.g. 0-1, 1-2).`);
          return;
        }
        const u = parseInt(parts[0].trim());
        const v = parseInt(parts[1].trim());
        if (isNaN(u) || isNaN(v) || u < 0 || u >= nodeCount || v < 0 || v >= nodeCount) {
          setError(`Edge "${token}" references nodes outside [0..${nodeCount - 1}].`);
          return;
        }
        edgePairs.push([u, v]);
      }
      nextInput.graphNodes = nodeCount;
      nextInput.startNode = start;
      nextInput.graphEdges = edgePairs;
    }
    // 4. Tree
    else if (algorithmId === 'inorder-traversal' || algorithmId === 'bst-search') {
      const parts = treeValuesText.split(/[\s,]+/).filter(s => s.trim().length > 0);
      if (parts.length === 0) {
        setError('Please provide at least 1 node value.');
        return;
      }
      const nums = parts.map(s => Number(s.trim()));
      if (nums.some(n => isNaN(n))) {
        setError('All tree values must be valid numbers.');
        return;
      }
      nextInput.treeValues = nums;
      if (algorithmId === 'bst-search') {
        if (isNaN(Number(treeTarget))) {
          setError('Please provide a valid numeric search target.');
          return;
        }
        nextInput.treeTarget = Number(treeTarget);
      }
    }
    // 5. Dynamic Programming
    else if (algorithmId === 'fibonacci-dp') {
      const n = Math.floor(Number(fibN));
      if (isNaN(n) || n < 0 || n > 15) {
        setError('Fibonacci N must be an integer between 0 and 15.');
        return;
      }
      nextInput.fibN = n;
    } else if (algorithmId === 'lcs') {
      const cleanS1 = s1.trim();
      const cleanS2 = s2.trim();
      if (cleanS1.length > 12 || cleanS2.length > 12) {
        setError('Maximum string length is 12 characters for clean matrix rendering.');
        return;
      }
      nextInput.s1 = cleanS1;
      nextInput.s2 = cleanS2;
    }
    // 6. Greedy
    else if (algorithmId === 'coin-change-greedy') {
      const parts = coinsText.split(/[\s,]+/).filter(s => s.trim().length > 0);
      if (parts.length === 0) {
        setError('Please enter at least 1 coin denomination.');
        return;
      }
      const coins = parts.map(s => Number(s.trim()));
      if (coins.some(c => isNaN(c) || c <= 0)) {
        setError('Coin denominations must be positive numbers (> 0).');
        return;
      }
      const targetAmount = Number(amount);
      if (isNaN(targetAmount) || targetAmount < 0) {
        setError('Target amount must be a non-negative number (≥ 0).');
        return;
      }
      nextInput.coins = coins;
      nextInput.amount = targetAmount;
    }
    // 7. Backtracking
    else if (algorithmId === 'n-queens') {
      const n = Math.floor(Number(boardN));
      if (isNaN(n) || n < 1 || n > 8) {
        setError('Board size N must be between 1 and 8.');
        return;
      }
      nextInput.boardN = n;
    }
    // 8. ML: Linear Regression & Logistic Regression
    else if (algorithmId === 'linear-regression' || algorithmId === 'logistic-regression') {
      const lr = Number(learningRate);
      if (isNaN(lr) || lr <= 0 || lr > 1.0) {
        setError('Learning rate must be between 0.0001 and 1.0.');
        return;
      }
      nextInput.learningRate = lr;
    }
    // 9. ML: KNN
    else if (algorithmId === 'knn') {
      const k = Math.floor(Number(kParam));
      if (isNaN(k) || k < 1 || k > 15) {
        setError('K value must be between 1 and 15.');
        return;
      }
      const qx = Number(queryX);
      const qy = Number(queryY);
      if (isNaN(qx) || isNaN(qy)) {
        setError('Query point X and Y must be valid numbers.');
        return;
      }
      nextInput.k = k;
      nextInput.queryPoint = { x: qx, y: qy };
    }
    // 10. ML: K-Means
    else if (algorithmId === 'k-means') {
      const k = Math.floor(Number(kParam));
      if (isNaN(k) || k < 2 || k > 5) {
        setError('Cluster count K must be between 2 and 5.');
        return;
      }
      nextInput.k = k;
    }
    // 11. ML: Gradient Descent
    else if (algorithmId === 'gradient-descent') {
      const lr = Number(learningRate);
      if (isNaN(lr) || lr <= 0 || lr > 0.5) {
        setError('Learning rate η must be between 0.01 and 0.5.');
        return;
      }
      const sx = Number(startX);
      const sy = Number(startY);
      if (isNaN(sx) || isNaN(sy)) {
        setError('Start point coordinates must be valid numbers.');
        return;
      }
      nextInput.learningRate = lr;
      nextInput.startPoint = { x: sx, y: sy };
    }
    // 12. ML: Decision Tree
    else if (algorithmId === 'decision-tree') {
      const depth = Math.floor(Number(dtMaxDepth));
      if (isNaN(depth) || depth < 1 || depth > 5) {
        setError('Maximum depth must be between 1 and 5.');
        return;
      }
      const minSamples = Math.floor(Number(dtMinSamples));
      if (isNaN(minSamples) || minSamples < 2 || minSamples > 10) {
        setError('Minimum samples per split must be between 2 and 10.');
        return;
      }
      const qx = Number(queryX);
      const qy = Number(queryY);
      if (isNaN(qx) || isNaN(qy)) {
        setError('Query coordinates must be valid numbers.');
        return;
      }
      nextInput.dtCriterion = dtCriterion;
      nextInput.maxDepth = depth;
      nextInput.minSamplesSplit = minSamples;
      nextInput.queryPoint = { x: qx, y: qy };
      nextInput.mlPoints = decisionTreeSampleDatasets[dtDatasetIdx]?.points;
    }
    // 13. ML: SVM
    else if (algorithmId === 'svm') {
      const c = Number(svmC);
      if (isNaN(c) || c < 0.01 || c > 100) {
        setError('Regularization C must be between 0.01 and 100.');
        return;
      }
      const lr = Number(learningRate);
      if (isNaN(lr) || lr < 0.0001 || lr > 0.5) {
        setError('Learning rate must be between 0.0001 and 0.5.');
        return;
      }
      const ep = Math.floor(Number(svmEpochs));
      if (isNaN(ep) || ep < 1 || ep > 50) {
        setError('Epochs must be between 1 and 50.');
        return;
      }
      const qx = Number(queryX);
      const qy = Number(queryY);
      if (isNaN(qx) || isNaN(qy)) {
        setError('Query coordinates must be valid numbers.');
        return;
      }
      nextInput.svmC = c;
      nextInput.learningRate = lr;
      nextInput.epochs = ep;
      nextInput.queryPoint = { x: qx, y: qy };
      nextInput.mlPoints = svmSampleDatasets[svmDatasetIdx]?.points;
    }
    // 14. ML: PCA
    else if (algorithmId === 'pca') {
      let matrix: number[][];

      if (pcaInputMode === 'preset') {
        const selectedPreset = pcaSampleDatasets[pcaDatasetIdx];
        if (!selectedPreset) {
          setError('Please select a valid preset dataset.');
          return;
        }
        matrix = selectedPreset.rawMatrix !== undefined
          ? selectedPreset.rawMatrix.map(row => [...row])
          : selectedPreset.points.map(p => [p.x, p.y]);
      } else {
        // Parse custom matrix from text lines
        const lines = pcaMatrixText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (lines.length < 2) {
          setError('PCA requires at least 2 sample rows.');
          return;
        }
        const parsedRows: number[][] = [];
        for (let i = 0; i < lines.length; i++) {
          const parts = lines[i].split(/[,\s\t]+/).filter(s => s.trim().length > 0);
          if (parts.length === 0) continue;
          const nums = parts.map(s => Number(s.trim()));
          if (nums.some(n => isNaN(n) || !isFinite(n))) {
            setError(`Row ${i + 1} contains non-numeric or non-finite values.`);
            return;
          }
          parsedRows.push(nums);
        }

        if (parsedRows.length < 2) {
          setError('PCA requires at least 2 sample rows.');
          return;
        }

        const d = parsedRows[0].length;
        if (d < 1) {
          setError('Feature dimensions must be at least 1.');
          return;
        }
        if (parsedRows.some(row => row.length !== d)) {
          setError('Ragged matrix error: All rows must have the same number of features/columns.');
          return;
        }
        matrix = parsedRows;
      }

      const numFeatures = matrix[0].length;
      const kVal = Math.floor(Number(pcaK));
      if (isNaN(kVal) || kVal < 1 || kVal > numFeatures) {
        setError(`Target components k must be between 1 and ${numFeatures} (number of features).`);
        return;
      }

      nextInput.pcaMatrix = matrix;
      nextInput.pcaK = kVal;
      nextInput.pcaStandardize = pcaStandardize;
    }
    // 15. ML: Neural Network
    else if (algorithmId === 'neural-network') {
      const selectedDs = neuralNetworkSampleDatasets[nnDatasetIdx];
      if (!selectedDs) {
        setError('Please select a valid dataset preset.');
        return;
      }

      const hiddenSize = Math.floor(Number(nnHiddenNeurons));
      if (isNaN(hiddenSize) || hiddenSize < 1 || hiddenSize > 8) {
        setError('Neurons per hidden layer must be between 1 and 8.');
        return;
      }

      const layerCount = Math.floor(Number(nnHiddenLayersCount));
      const hiddenLayers = layerCount === 2 ? [hiddenSize, Math.max(1, Math.floor(hiddenSize / 2))] : [hiddenSize];

      const lr = Number(nnLearningRate);
      if (isNaN(lr) || lr < 0.001 || lr > 1.0) {
        setError('Learning rate η must be between 0.001 and 1.0.');
        return;
      }

      const ep = Math.floor(Number(nnEpochs));
      if (isNaN(ep) || ep < 1 || ep > 100) {
        setError('Training epochs must be between 1 and 100.');
        return;
      }

      nextInput.nnInputs = selectedDs.rawMatrix;
      nextInput.nnTargets = selectedDs.targets;
      nextInput.nnTask = nnTask;
      nextInput.nnHiddenLayers = hiddenLayers;
      nextInput.nnActivation = nnActivation;
      nextInput.learningRate = lr;
      nextInput.epochs = ep;
    }
    // 16. RL: Q-Learning
    else if (algorithmId === 'q-learning') {
      const w = Math.floor(Number(qlWidth));
      const h = Math.floor(Number(qlHeight));
      if (isNaN(w) || w < 3 || w > 8 || isNaN(h) || h < 3 || h > 8) {
        setError('Grid width and height must be integers between 3 and 8.');
        return;
      }

      const sr = Math.floor(Number(qlStartR));
      const sc = Math.floor(Number(qlStartC));
      if (isNaN(sr) || sr < 0 || sr >= h || isNaN(sc) || sc < 0 || sc >= w) {
        setError(`Start coordinate (${sr}, ${sc}) is out of bounds for ${w}x${h} grid.`);
        return;
      }

      const gr = Math.floor(Number(qlGoalR));
      const gc = Math.floor(Number(qlGoalC));
      if (isNaN(gr) || gr < 0 || gr >= h || isNaN(gc) || gc < 0 || gc >= w) {
        setError(`Goal coordinate (${gr}, ${gc}) is out of bounds for ${w}x${h} grid.`);
        return;
      }

      if (sr === gr && sc === gc) {
        setError('Start position and goal position must be distinct.');
        return;
      }

      // Parse walls
      const walls: GridCoord[] = [];
      if (qlWallsText.trim()) {
        const wallTokens = qlWallsText.split(/[;\n]+/).map(s => s.trim()).filter(Boolean);
        for (const token of wallTokens) {
          const parts = token.split(',').map(s => s.trim());
          if (parts.length !== 2) {
            setError(`Invalid wall specification "${token}". Expected "r,c".`);
            return;
          }
          const wr = Math.floor(Number(parts[0]));
          const wc = Math.floor(Number(parts[1]));
          if (isNaN(wr) || wr < 0 || wr >= h || isNaN(wc) || wc < 0 || wc >= w) {
            setError(`Wall (${wr}, ${wc}) is outside the grid bounds.`);
            return;
          }
          if ((wr === sr && wc === sc) || (wr === gr && wc === gc)) {
            setError(`Wall (${wr}, ${wc}) cannot overlap start or goal.`);
            return;
          }
          if (!walls.some(item => item.r === wr && item.c === wc)) {
            walls.push({ r: wr, c: wc });
          }
        }
      }

      // Parse special rewards
      const specialRewards: SpecialRewardCell[] = [];
      if (qlSpecialRewardsText.trim()) {
        const tokens = qlSpecialRewardsText.split(/[;\n]+/).map(s => s.trim()).filter(Boolean);
        for (const token of tokens) {
          const parts = token.split(',').map(s => s.trim());
          if (parts.length < 3) {
            setError(`Invalid special reward "${token}". Expected "r,c,reward".`);
            return;
          }
          const rr = Math.floor(Number(parts[0]));
          const rc = Math.floor(Number(parts[1]));
          const rwd = Number(parts[2]);
          if (isNaN(rr) || rr < 0 || rr >= h || isNaN(rc) || rc < 0 || rc >= w || isNaN(rwd)) {
            setError(`Special reward "${token}" has invalid coordinates or reward value.`);
            return;
          }
          if ((rr === sr && rc === sc) || (rr === gr && rc === gc) || walls.some(item => item.r === rr && item.c === rc)) {
            setError(`Special reward (${rr}, ${rc}) cannot overlap start, goal, or walls.`);
            return;
          }
          specialRewards.push({ r: rr, c: rc, reward: rwd, label: parts[3] || 'Bonus' });
        }
      }

      // Validate hyperparameters
      const alpha = Number(qlAlpha);
      if (isNaN(alpha) || alpha <= 0 || alpha > 1) {
        setError('Learning rate α must be in (0, 1].');
        return;
      }

      const gamma = Number(qlGamma);
      if (isNaN(gamma) || gamma < 0 || gamma > 1) {
        setError('Discount factor γ must be in [0, 1].');
        return;
      }

      const epsilon = Number(qlEpsilon);
      if (isNaN(epsilon) || epsilon < 0 || epsilon > 1) {
        setError('Exploration probability ε must be in [0, 1].');
        return;
      }

      const episodes = Math.floor(Number(qlEpisodes));
      if (isNaN(episodes) || episodes < 1 || episodes > 500) {
        setError('Training episodes must be between 1 and 500.');
        return;
      }

      const maxSteps = Math.floor(Number(qlMaxSteps));
      if (isNaN(maxSteps) || maxSteps < 1 || maxSteps > 200) {
        setError('Max steps per episode must be between 1 and 200.');
        return;
      }

      // Check environment reachability using validateGridEnvironment
      try {
        validateGridEnvironment({
          width: w,
          height: h,
          start: { r: sr, c: sc },
          goal: { r: gr, c: gc },
          walls,
          specialRewards,
        });
      } catch (err: any) {
        setError(err.message || 'Grid configuration is invalid.');
        return;
      }

      nextInput.qlWidth = w;
      nextInput.qlHeight = h;
      nextInput.qlStart = { r: sr, c: sc };
      nextInput.qlGoal = { r: gr, c: gc };
      nextInput.qlWalls = walls;
      nextInput.qlSpecialRewards = specialRewards;
      nextInput.qlStepReward = Number(qlStepReward);
      nextInput.qlGoalReward = Number(qlGoalReward);
      nextInput.qlInvalidPenalty = Number(qlInvalidPenalty);
      nextInput.qlAlpha = alpha;
      nextInput.qlGamma = gamma;
      nextInput.qlEpsilon = epsilon;
      nextInput.qlEpisodes = episodes;
      nextInput.qlMaxSteps = maxSteps;
      nextInput.qlSeed = Math.floor(Number(qlSeed)) || 42;
    }

    onApply(nextInput);
    onClose();
  };

  const isSorting = ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort'].includes(algorithmId);
  const isSearching = algorithmId === 'linear-search' || algorithmId === 'binary-search';
  const isGraph = algorithmId === 'bfs' || algorithmId === 'dfs';
  const isTree = algorithmId === 'inorder-traversal' || algorithmId === 'bst-search';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Custom Input" className="max-w-lg">
      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Sorting Inputs */}
        {isSorting && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Comma-separated Numbers (up to 30 elements)
              </label>
              <textarea
                value={arrayText}
                onChange={e => setArrayText(e.target.value)}
                rows={2}
                placeholder="e.g. 7, 4, 6, 2, 9, 1, 5"
                className="input-base font-mono text-xs w-full resize-none"
              />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Default', val: '7, 4, 6, 2, 9, 1, 5' },
                  { label: 'Nearly Sorted', val: '1, 2, 4, 3, 5, 6, 7' },
                  { label: 'Reverse Sorted', val: '9, 8, 7, 6, 5, 4, 3' },
                  { label: 'Duplicates & Negatives', val: '-5, 12, 3, -5, 0, 8, 12' },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setArrayText(p.val)}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Searching Inputs */}
        {isSearching && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Dataset Array (comma-separated numbers)
              </label>
              <input
                type="text"
                value={arrayText}
                onChange={e => setArrayText(e.target.value)}
                placeholder="e.g. 1, 2, 4, 5, 6, 7, 9"
                className="input-base font-mono text-xs w-full"
              />
              {algorithmId === 'binary-search' && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                  * Note: Binary Search automatically sorts unsorted input to satisfy the binary search invariant.
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Search Target Value
              </label>
              <input
                type="number"
                value={targetVal}
                onChange={e => setTargetVal(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Quick Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Target Present (6)', arr: '1, 2, 4, 5, 6, 7, 9', tgt: 6 },
                  { label: 'Target Absent (99)', arr: '1, 2, 4, 5, 6, 7, 9', tgt: 99 },
                  { label: 'Target at First (1)', arr: '1, 2, 4, 5, 6, 7, 9', tgt: 1 },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => { setArrayText(p.arr); setTargetVal(p.tgt); }}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Graph Inputs */}
        {isGraph && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Total Nodes (2 to 8)
                </label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={graphNodes}
                  onChange={e => setGraphNodes(Math.max(2, Math.min(8, Number(e.target.value))))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Start Node ID
                </label>
                <input
                  type="number"
                  min={0}
                  max={graphNodes - 1}
                  value={startNode}
                  onChange={e => setStartNode(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Edge Connections (comma-separated, format: u-v)
              </label>
              <input
                type="text"
                value={edgeListText}
                onChange={e => setEdgeListText(e.target.value)}
                placeholder="e.g. 0-1, 0-2, 1-3, 2-4"
                className="input-base font-mono text-xs w-full"
              />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Graph Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Sample Tree Graph', n: 7, start: 0, edges: '0-1, 0-2, 1-3, 1-4, 2-5, 2-6, 3-4, 5-6' },
                  { label: 'Cycle Graph', n: 5, start: 0, edges: '0-1, 1-2, 2-3, 3-4, 4-0' },
                  { label: 'Disconnected (Node 4 isolated)', n: 5, start: 0, edges: '0-1, 1-2, 2-3' },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => { setGraphNodes(p.n); setStartNode(p.start); setEdgeListText(p.edges); }}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Tree Inputs */}
        {isTree && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                BST Node Values (comma-separated numbers)
              </label>
              <input
                type="text"
                value={treeValuesText}
                onChange={e => setTreeValuesText(e.target.value)}
                placeholder="e.g. 50, 30, 70, 20, 40, 60, 80"
                className="input-base font-mono text-xs w-full"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                A Binary Search Tree will be generated dynamically from these values.
              </p>
            </div>
            {algorithmId === 'bst-search' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Search Target Value
                </label>
                <input
                  type="number"
                  value={treeTarget}
                  onChange={e => setTreeTarget(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            )}
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Tree Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Balanced BST', vals: '50, 30, 70, 20, 40, 60, 80', tgt: 60 },
                  { label: 'Target Missing (99)', vals: '50, 30, 70, 20, 40, 60, 80', tgt: 99 },
                  { label: 'Small Tree', vals: '10, 5, 15', tgt: 15 },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => { setTreeValuesText(p.vals); setTreeTarget(p.tgt); }}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. Dynamic Programming Inputs */}
        {algorithmId === 'fibonacci-dp' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Fibonacci Number N (0 to 15)
              </label>
              <input
                type="number"
                min={0}
                max={15}
                value={fibN}
                onChange={e => setFibN(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Boundary Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Base Case N=0', n: 0 },
                  { label: 'Base Case N=1', n: 1 },
                  { label: 'N=7 (F(7)=13)', n: 7 },
                  { label: 'N=12 (F(12)=144)', n: 12 },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setFibN(p.n)}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {algorithmId === 'lcs' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  String 1 (up to 12 chars)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={s1}
                  onChange={e => setS1(e.target.value.toUpperCase())}
                  className="input-base font-mono text-xs w-full uppercase"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  String 2 (up to 12 chars)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  value={s2}
                  onChange={e => setS2(e.target.value.toUpperCase())}
                  className="input-base font-mono text-xs w-full uppercase"
                />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">String Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Canonical ("ABCBDAB", "BDCAB")', s1: 'ABCBDAB', s2: 'BDCAB' },
                  { label: 'Genomics ("AGGTAB", "GXTXAYB")', s1: 'AGGTAB', s2: 'GXTXAYB' },
                  { label: 'Identical ("ALGORITHM", "ALGORITHM")', s1: 'ALGORITHM', s2: 'ALGORITHM' },
                  { label: 'No Match ("ABC", "XYZ")', s1: 'ABC', s2: 'XYZ' },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => { setS1(p.s1); setS2(p.s2); }}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Greedy Coin Change */}
        {algorithmId === 'coin-change-greedy' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Coin Denominations (comma-separated positive numbers)
              </label>
              <input
                type="text"
                value={coinsText}
                onChange={e => setCoinsText(e.target.value)}
                placeholder="e.g. 25, 10, 5, 1"
                className="input-base font-mono text-xs w-full"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Target Amount to Dispense
              </label>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Coin Change Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'US Coins (36¢)', c: '25, 10, 5, 1', a: 36 },
                  { label: 'Non-Canonical Suboptimal (4, 3, 1 for 6)', c: '4, 3, 1', a: 6 },
                  { label: 'Euro (50, 20, 10, 5, 2, 1 for 48)', c: '50, 20, 10, 5, 2, 1', a: 48 },
                  { label: 'Zero Amount (0)', c: '25, 10, 5, 1', a: 0 },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => { setCoinsText(p.c); setAmount(p.a); }}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. Backtracking N-Queens */}
        {algorithmId === 'n-queens' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Board Dimension N (1 to 8)
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={boardN}
                onChange={e => setBoardN(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Sizes 4 to 8 have non-attacking queen solutions. Sizes 2 and 3 show exhaustive backtracking failure.
              </p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block mb-1">Board Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Classic 4-Queens', n: 4 },
                  { label: '5-Queens Board', n: 5 },
                  { label: 'Standard 8-Queens', n: 8 },
                  { label: 'Unsolvable 3-Queens', n: 3 },
                ].map(p => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setBoardN(p.n)}
                    className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-surface-700 hover:bg-slate-200 dark:hover:bg-surface-600 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. Machine Learning: Linear & Logistic Regression */}
        {(algorithmId === 'linear-regression' || algorithmId === 'logistic-regression') && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Learning Rate (η)
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                max="0.5"
                value={learningRate}
                onChange={e => setLearningRate(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Controls the gradient descent step magnitude for each iteration.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 text-[11px] text-slate-600 dark:text-slate-300">
              💡 <b>Dataset:</b> Uses authenticated training sets with analytical OLS closed-form fit and gradient step tracking.
            </div>
          </div>
        )}

        {/* 9. Machine Learning: KNN */}
        {algorithmId === 'knn' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Number of Neighbors (K)
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={kParam}
                onChange={e => setKParam(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                An odd K (1, 3, 5, 7) is recommended to prevent tie votes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Query Point X
                </label>
                <input
                  type="number"
                  value={queryX}
                  onChange={e => setQueryX(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Query Point Y
                </label>
                <input
                  type="number"
                  value={queryY}
                  onChange={e => setQueryY(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* 10. Machine Learning: K-Means */}
        {algorithmId === 'k-means' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Cluster Count (K)
              </label>
              <input
                type="number"
                min={2}
                max={5}
                value={kParam}
                onChange={e => setKParam(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Choose between 2 and 5 clusters to partition the sample feature space.
              </p>
            </div>
          </div>
        )}

        {/* 11. Machine Learning: Gradient Descent */}
        {algorithmId === 'gradient-descent' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Learning Rate (η)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.3"
                value={learningRate}
                onChange={e => setLearningRate(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Step size along the loss surface f(x, y) = x² + 2y². Too large may oscillate; too small is slow.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Initial X Coordinate
                </label>
                <input
                  type="number"
                  value={startX}
                  onChange={e => setStartX(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Initial Y Coordinate
                </label>
                <input
                  type="number"
                  value={startY}
                  onChange={e => setStartY(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* 12. Machine Learning: Decision Tree */}
        {algorithmId === 'decision-tree' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Training Dataset Preset
              </label>
              <select
                value={dtDatasetIdx}
                onChange={e => setDtDatasetIdx(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              >
                {decisionTreeSampleDatasets.map((ds, i) => (
                  <option key={ds.id} value={i}>
                    {ds.name} ({ds.points.length} samples)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Split Criterion
                </label>
                <div className="flex rounded-lg bg-slate-100 dark:bg-surface-700 p-0.5 border border-slate-200 dark:border-surface-600">
                  <button
                    type="button"
                    onClick={() => setDtCriterion('gini')}
                    className={`flex-1 py-1 text-xs rounded-md font-medium transition-all ${
                      dtCriterion === 'gini'
                        ? 'bg-primary-600 text-white shadow'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Gini
                  </button>
                  <button
                    type="button"
                    onClick={() => setDtCriterion('entropy')}
                    className={`flex-1 py-1 text-xs rounded-md font-medium transition-all ${
                      dtCriterion === 'entropy'
                        ? 'bg-primary-600 text-white shadow'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Entropy
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Max Depth (1 to 5)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={dtMaxDepth}
                  onChange={e => setDtMaxDepth(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Min Samples Per Split (2 to 10)
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={dtMinSamples}
                onChange={e => setDtMinSamples(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Query Point X
                </label>
                <input
                  type="number"
                  value={queryX}
                  onChange={e => setQueryX(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Query Point Y
                </label>
                <input
                  type="number"
                  value={queryY}
                  onChange={e => setQueryY(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* 13. SVM Inputs */}
        {algorithmId === 'svm' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Sample Dataset Preset
              </label>
              <select
                value={svmDatasetIdx}
                onChange={e => setSvmDatasetIdx(Number(e.target.value))}
                className="input-base text-xs w-full"
              >
                {svmSampleDatasets.map((ds, idx) => (
                  <option key={ds.id} value={idx}>
                    {ds.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {svmSampleDatasets[svmDatasetIdx]?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Regularization C (0.01 to 100)
                </label>
                <input
                  type="number"
                  min={0.01}
                  max={100}
                  step={0.1}
                  value={svmC}
                  onChange={e => setSvmC(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Learning Rate η
                </label>
                <input
                  type="number"
                  min={0.0001}
                  max={0.1}
                  step={0.001}
                  value={learningRate}
                  onChange={e => setLearningRate(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Epochs (1 to 50)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={svmEpochs}
                onChange={e => setSvmEpochs(Number(e.target.value))}
                className="input-base font-mono text-xs w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Query Point X
                </label>
                <input
                  type="number"
                  value={queryX}
                  onChange={e => setQueryX(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Query Point Y
                </label>
                <input
                  type="number"
                  value={queryY}
                  onChange={e => setQueryY(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* 14. PCA Inputs */}
        {algorithmId === 'pca' && (
          <div className="space-y-3">
            {/* Mode Toggle: Preset vs Custom */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Input Mode
              </label>
              <div className="flex rounded-lg bg-slate-100 dark:bg-surface-800 p-0.5 border border-slate-200 dark:border-surface-700">
                <button
                  type="button"
                  onClick={() => setPcaInputMode('preset')}
                  className={`flex-1 py-1 text-xs rounded-md font-medium transition-all ${
                    pcaInputMode === 'preset'
                      ? 'bg-primary-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Built-in Preset Datasets
                </button>
                <button
                  type="button"
                  onClick={() => setPcaInputMode('custom')}
                  className={`flex-1 py-1 text-xs rounded-md font-medium transition-all ${
                    pcaInputMode === 'custom'
                      ? 'bg-primary-600 text-white shadow'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Custom Numeric Matrix
                </button>
              </div>
            </div>

            {pcaInputMode === 'preset' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Select Preset Dataset
                </label>
                <select
                  value={pcaDatasetIdx}
                  onChange={e => {
                    const idx = Number(e.target.value);
                    setPcaDatasetIdx(idx);
                    const ds = pcaSampleDatasets[idx];
                    if (ds?.rawMatrix) {
                      setPcaMatrixText(ds.rawMatrix.map(r => r.join(', ')).join('\n'));
                    }
                  }}
                  className="input-base text-xs w-full"
                >
                  {pcaSampleDatasets.map((ds, idx) => (
                    <option key={ds.id} value={idx}>
                      {ds.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {pcaSampleDatasets[pcaDatasetIdx]?.description}
                </p>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Matrix Rows (one sample per line, comma or space separated)
                </label>
                <textarea
                  rows={5}
                  value={pcaMatrixText}
                  onChange={e => setPcaMatrixText(e.target.value)}
                  placeholder="15, 18&#10;25, 28&#10;35, 33&#10;45, 47"
                  className="input-base font-mono text-xs w-full resize-none"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Enter at least 2 rows with matching feature counts.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Target Components (k)
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={pcaK}
                  onChange={e => setPcaK(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={pcaStandardize}
                    onChange={e => setPcaStandardize(e.target.checked)}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>Standardize (Z-score)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 15. Neural Network Inputs */}
        {algorithmId === 'neural-network' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Sample Dataset Preset
              </label>
              <select
                value={nnDatasetIdx}
                onChange={e => {
                  const idx = Number(e.target.value);
                  setNnDatasetIdx(idx);
                  const ds = neuralNetworkSampleDatasets[idx];
                  if (ds) {
                    setNnTask(ds.id.includes('regression') ? 'regression' : 'classification');
                  }
                }}
                className="input-base text-xs w-full"
              >
                {neuralNetworkSampleDatasets.map((ds, idx) => (
                  <option key={ds.id} value={idx}>
                    {ds.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {neuralNetworkSampleDatasets[nnDatasetIdx]?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Task Type
                </label>
                <div className="flex rounded-lg bg-slate-100 dark:bg-surface-800 p-0.5 border border-slate-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={() => setNnTask('classification')}
                    className={`flex-1 py-1 text-xs rounded-md font-medium transition-all ${
                      nnTask === 'classification'
                        ? 'bg-primary-600 text-white shadow'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Binary Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setNnTask('regression')}
                    className={`flex-1 py-1 text-xs rounded-md font-medium transition-all ${
                      nnTask === 'regression'
                        ? 'bg-primary-600 text-white shadow'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Regression
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Hidden Activation
                </label>
                <select
                  value={nnActivation}
                  onChange={e => setNnActivation(e.target.value as 'sigmoid' | 'relu' | 'tanh')}
                  className="input-base text-xs w-full"
                >
                  <option value="tanh">Tanh (Hyperbolic Tangent)</option>
                  <option value="relu">ReLU (Rectified Linear Unit)</option>
                  <option value="sigmoid">Sigmoid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Hidden Layers
                </label>
                <select
                  value={nnHiddenLayersCount}
                  onChange={e => setNnHiddenLayersCount(Number(e.target.value))}
                  className="input-base text-xs w-full"
                >
                  <option value={1}>1 Hidden Layer</option>
                  <option value={2}>2 Hidden Layers</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Neurons per Hidden Layer
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={nnHiddenNeurons}
                  onChange={e => setNnHiddenNeurons(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Learning Rate η
                </label>
                <input
                  type="number"
                  min={0.001}
                  max={1.0}
                  step={0.05}
                  value={nnLearningRate}
                  onChange={e => setNnLearningRate(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Epochs (1 to 100)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={nnEpochs}
                  onChange={e => setNnEpochs(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* 16. Q-Learning (RL) Inputs */}
        {algorithmId === 'q-learning' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Grid Environment Preset
              </label>
              <select
                value={qlPresetIdx}
                onChange={e => handleSelectQlPreset(Number(e.target.value))}
                className="input-base text-xs w-full"
              >
                {Q_LEARNING_PRESETS.map((preset, idx) => (
                  <option key={preset.id} value={idx}>
                    {preset.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {Q_LEARNING_PRESETS[qlPresetIdx]?.description}
              </p>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Grid Width (3 to 8)
                </label>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={qlWidth}
                  onChange={e => setQlWidth(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Grid Height (3 to 8)
                </label>
                <input
                  type="number"
                  min={3}
                  max={8}
                  value={qlHeight}
                  onChange={e => setQlHeight(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>

            {/* Start and Goal Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Start (Row, Col)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={qlHeight - 1}
                    value={qlStartR}
                    onChange={e => setQlStartR(Number(e.target.value))}
                    placeholder="Row"
                    className="input-base font-mono text-xs w-1/2"
                  />
                  <input
                    type="number"
                    min={0}
                    max={qlWidth - 1}
                    value={qlStartC}
                    onChange={e => setQlStartC(Number(e.target.value))}
                    placeholder="Col"
                    className="input-base font-mono text-xs w-1/2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Goal (Row, Col)
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={qlHeight - 1}
                    value={qlGoalR}
                    onChange={e => setQlGoalR(Number(e.target.value))}
                    placeholder="Row"
                    className="input-base font-mono text-xs w-1/2"
                  />
                  <input
                    type="number"
                    min={0}
                    max={qlWidth - 1}
                    value={qlGoalC}
                    onChange={e => setQlGoalC(Number(e.target.value))}
                    placeholder="Col"
                    className="input-base font-mono text-xs w-1/2"
                  />
                </div>
              </div>
            </div>

            {/* Walls and Special Rewards */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Walls (e.g. "1,0; 1,1; 2,2")
              </label>
              <input
                type="text"
                value={qlWallsText}
                onChange={e => setQlWallsText(e.target.value)}
                placeholder="r,c; r,c"
                className="input-base font-mono text-xs w-full"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Optional Reward Cells (e.g. "3,2,8; 2,0,-3")
              </label>
              <input
                type="text"
                value={qlSpecialRewardsText}
                onChange={e => setQlSpecialRewardsText(e.target.value)}
                placeholder="r,c,reward; ..."
                className="input-base font-mono text-xs w-full"
              />
            </div>

            {/* Rewards and Penalties */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Step Cost
                </label>
                <input
                  type="number"
                  step={0.5}
                  value={qlStepReward}
                  onChange={e => setQlStepReward(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Goal Reward
                </label>
                <input
                  type="number"
                  step={1}
                  value={qlGoalReward}
                  onChange={e => setQlGoalReward(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Wall Penalty
                </label>
                <input
                  type="number"
                  step={1}
                  value={qlInvalidPenalty}
                  onChange={e => setQlInvalidPenalty(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>

            {/* Hyperparameters: Alpha, Gamma, Epsilon */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Alpha α (0, 1]
                </label>
                <input
                  type="number"
                  min={0.01}
                  max={1.0}
                  step={0.05}
                  value={qlAlpha}
                  onChange={e => setQlAlpha(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Gamma γ [0, 1]
                </label>
                <input
                  type="number"
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={qlGamma}
                  onChange={e => setQlGamma(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Epsilon ε [0, 1]
                </label>
                <input
                  type="number"
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={qlEpsilon}
                  onChange={e => setQlEpsilon(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>

            {/* Episodes, Max Steps, Seed */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Episodes (1-500)
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={qlEpisodes}
                  onChange={e => setQlEpisodes(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Max Steps / Ep
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={qlMaxSteps}
                  onChange={e => setQlMaxSteps(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Random Seed
                </label>
                <input
                  type="number"
                  value={qlSeed}
                  onChange={e => setQlSeed(Number(e.target.value))}
                  className="input-base font-mono text-xs w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-surface-700">
          <button
            type="button"
            onClick={handleRestoreDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-surface-700 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Restore Default Example</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1.5"
            >
              <CheckCircle2 size={13} />
              <span>Apply Input</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
