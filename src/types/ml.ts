export interface DataPoint2D {
  x: number;
  y: number;
  label?: number | string;
  predicted?: number;
  residual?: number;
  id?: number;
}

export interface Centroid2D {
  id: number;
  x: number;
  y: number;
  cluster: number;
  color?: string;
}

export interface RegressionSnapshot {
  type: 'regression';
  points: DataPoint2D[];
  slope: number;
  intercept: number;
  r2?: number;
  mse?: number;
  mae?: number;
  epoch?: number;
  lossHistory?: number[];
  showResiduals?: boolean;
}

export interface ClassificationSnapshot {
  type: 'classification';
  points: DataPoint2D[];
  weights?: number[];
  bias?: number;
  decisionBoundary?: {
    slope: number;
    intercept: number;
  };
  queryPoint?: {
    x: number;
    y: number;
    nearestNeighbors?: number[]; // indices of k nearest
    k?: number;
    predictedLabel?: number;
  };
  accuracy?: number;
  loss?: number;
  epoch?: number;
  lossHistory?: number[];
  classes?: number[];
}

export interface ClusteringSnapshot {
  type: 'clustering';
  points: { x: number; y: number; cluster: number; id: number }[];
  centroids: Centroid2D[];
  iteration: number;
  inertia: number;
  converged: boolean;
  k: number;
}

export interface OptimizationSnapshot {
  type: 'optimization';
  currentPoint: { x: number; y: number; loss: number };
  path: { x: number; y: number; loss: number }[];
  gradient: { dx: number; dy: number };
  learningRate: number;
  iteration: number;
  lossHistory: number[];
  converged: boolean;
  targetMinimum: { x: number; y: number; loss: number };
}

export interface DecisionTreeNodeData {
  id: number;
  x?: number;
  y?: number;
  depth: number;
  featureIndex?: number;
  featureName?: string;
  threshold?: number;
  gain?: number;
  impurity: number;
  samples: number;
  distribution: number[];
  predictedClass: number;
  isLeaf: boolean;
  leftId?: number;
  rightId?: number;
  isCurrentEvaluating?: boolean;
  isTraversed?: boolean;
}

export interface DecisionTreeSplitCandidate {
  featureIndex: number;
  featureName: string;
  threshold: number;
  gain: number;
  leftSamples: number;
  rightSamples: number;
  isSelected?: boolean;
}

export interface DecisionTreeSnapshot {
  type: 'decision-tree';
  nodes: DecisionTreeNodeData[];
  rootId: number;
  criterion: 'gini' | 'entropy';
  maxDepth: number;
  minSamplesSplit: number;
  points: DataPoint2D[];
  featureNames: [string, string];
  activeNodeId?: number;
  candidates?: DecisionTreeSplitCandidate[];
  queryPoint?: {
    x: number;
    y: number;
    predictedClass?: number;
    pathNodeIds?: number[];
  };
  decisionBoundaries?: Array<{
    featureIndex: number;
    threshold: number;
    range: [number, number];
  }>;
}

export interface SVMPointData extends DataPoint2D {
  functionalMargin?: number;
  decisionScore?: number;
  hingeLoss?: number;
  isSupportVector?: boolean;
}

export interface SVMSnapshot {
  type: 'svm';
  points: SVMPointData[];
  weights: [number, number];
  bias: number;
  c: number;
  epoch: number;
  totalEpochs: number;
  totalHingeLoss: number;
  regLoss: number;
  objectiveValue: number;
  marginWidth: number;
  supportVectorCount: number;
  decisionBoundary?: {
    slope?: number;
    intercept?: number;
    isVertical?: boolean;
    xIntercept?: number;
  };
  positiveMarginBoundary?: {
    slope?: number;
    intercept?: number;
    isVertical?: boolean;
    xIntercept?: number;
  };
  negativeMarginBoundary?: {
    slope?: number;
    intercept?: number;
    isVertical?: boolean;
    xIntercept?: number;
  };
  queryPoint?: {
    x: number;
    y: number;
    decisionScore?: number;
    marginDistance?: number;
    predictedClass?: number;
  };
  converged?: boolean;
}

export interface PCAPointData {
  id: number;
  original: number[];
  centered: number[];
  projected?: number[];
  reconstructed?: number[];
}

export interface PCASnapshot {
  type: 'pca';
  stage: 'input' | 'centering' | 'covariance' | 'eigensolver' | 'components' | 'projection' | 'reconstruction';
  points: PCAPointData[];
  featureNames: string[];
  means: number[];
  stdDevs?: number[];
  standardized: boolean;
  covarianceMatrix?: number[][];
  eigenvalues: number[];
  eigenvectors: number[][]; // eigenvectors[row][col] where col is component j
  explainedVarianceRatios: number[];
  cumulativeVarianceRatios: number[];
  k: number;
  reconstructionError?: number;
  jacobiIteration?: number;
  maxJacobiIterations?: number;
  converged?: boolean;
}

export type ActivationFunctionType = 'sigmoid' | 'relu' | 'tanh' | 'linear';
export type TaskType = 'regression' | 'classification';

export interface NeuronVisualState {
  layerIndex: number;
  neuronIndex: number;
  label: string;
  z: number; // weighted sum
  a: number; // activation output
  delta?: number; // backprop error gradient
  bias: number;
  biasGradient?: number;
}

export interface WeightConnectionVisualState {
  sourceLayer: number;
  sourceNeuron: number;
  targetLayer: number;
  targetNeuron: number;
  weight: number;
  gradient?: number;
  oldWeight?: number;
}

export interface LayerVisualState {
  layerIndex: number;
  name: string;
  activation: ActivationFunctionType;
  neuronCount: number;
  neurons: NeuronVisualState[];
}

export interface NeuralNetworkSnapshot {
  type: 'neural-network';
  task: TaskType;
  layers: LayerVisualState[];
  connections: WeightConnectionVisualState[];
  currentEpoch: number;
  totalEpochs: number;
  currentLoss: number;
  lossHistory: number[];
  inputSample: number[];
  targetValue: number;
  predictedValue: number;
  activeLayer?: number;
  activeNeuron?: { layerIndex: number; neuronIndex: number };
  backpropStage?: 'forward' | 'output-error' | 'backprop-hidden' | 'gradient-update' | 'epoch-summary' | 'diverged';
  learningRate: number;
  converged?: boolean;
}

export type ActionType = 'up' | 'down' | 'left' | 'right';

export interface GridCoord {
  r: number;
  c: number;
}

export interface SpecialRewardCell {
  r: number;
  c: number;
  reward: number;
  label?: string;
}

export interface BellmanUpdateInfo {
  state: GridCoord;
  action: ActionType;
  nextState: GridCoord;
  reward: number;
  isTerminal: boolean;
  isInvalidMove: boolean;
  oldQ: number;
  maxNextQ: number;
  alpha: number;
  gamma: number;
  tdTarget: number;
  tdError: number;
  newQ: number;
}

export interface QLearningEpisodeMetric {
  episode: number;
  totalReward: number;
  stepCount: number;
  reachedGoal: boolean;
  explorationCount: number;
  exploitationCount: number;
}

export interface GreedyPathStep {
  state: GridCoord;
  action: ActionType | 'stop';
  reward: number;
  qValues: Record<ActionType, number>;
}

export interface GreedyRolloutResult {
  path: GridCoord[];
  actions: ActionType[];
  totalReward: number;
  reachedGoal: boolean;
  stepLimitHit: boolean;
  steps: GreedyPathStep[];
}

export interface QTableEntry {
  stateKey: string;
  r: number;
  c: number;
  actions: Record<ActionType, number>;
  bestAction: ActionType;
  isTied: boolean;
  visitCount: number;
}

export interface QLearningSnapshot {
  type: 'q-learning';
  gridWidth: number;
  gridHeight: number;
  start: GridCoord;
  goal: GridCoord;
  walls: GridCoord[];
  specialRewards?: SpecialRewardCell[];
  stepReward: number;
  goalReward: number;
  invalidMovePenalty: number;
  learningRate: number; // alpha
  discountFactor: number; // gamma
  epsilon: number;
  totalEpisodes: number;
  currentEpisode: number;
  currentStepInEpisode: number;
  agentPosition: GridCoord;
  previousPosition?: GridCoord;
  selectedAction?: ActionType;
  actionType?: 'exploration' | 'exploitation';
  isTiedAction?: boolean;
  visitedStates: GridCoord[];
  qTable: Record<string, Record<ActionType, number>>;
  visitCounts: Record<string, number>;
  bellmanUpdate?: BellmanUpdateInfo;
  episodeMetrics: QLearningEpisodeMetric[];
  cumulativeExploration: number;
  cumulativeExploitation: number;
  greedyRollout?: GreedyRolloutResult;
  stage: 'env-init' | 'episode-start' | 'action-chosen' | 'transition-update' | 'episode-end' | 'training-complete' | 'greedy-rollout';
  isTerminal?: boolean;
}

export type MLVisualizationData =
  | RegressionSnapshot
  | ClassificationSnapshot
  | ClusteringSnapshot
  | OptimizationSnapshot
  | DecisionTreeSnapshot
  | SVMSnapshot
  | PCASnapshot
  | NeuralNetworkSnapshot
  | QLearningSnapshot;

export interface SampleMLDataset {
  id: string;
  name: string;
  category: 'regression' | 'classification' | 'clustering' | 'optimization' | 'dimensionality-reduction' | 'unsupervised' | 'neural-network';
  description: string;
  points: DataPoint2D[];
  rawMatrix?: number[][];
  targets?: number[];
  featureNames: string[];
  targetName: string;
  isSynthetic: boolean;
}
