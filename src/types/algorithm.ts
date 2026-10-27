import type { MLVisualizationData } from './ml';

export type Category =
  | 'sorting'
  | 'searching'
  | 'graph'
  | 'tree'
  | 'dynamic-programming'
  | 'greedy'
  | 'backtracking'
  | 'supervised'
  | 'unsupervised'
  | 'optimization'
  | 'neural-networks'
  | 'reinforcement-learning'
  | 'nlp'
  | 'ai-search';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ElementState =
  | 'default'
  | 'comparing'
  | 'active'
  | 'swapping'
  | 'selected'
  | 'sorted'
  | 'visited'
  | 'current'
  | 'path'
  | 'pivot'
  | 'found'
  | 'excluded';

export interface ArrayElement {
  value: number;
  state: ElementState;
  id: number;
}

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
  state: ElementState;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
  state: ElementState;
}

export interface TreeNode {
  id: number;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  state: ElementState;
  x?: number;
  y?: number;
}

export interface DPCell {
  row: number;
  col: number;
  value: number | string;
  state: ElementState;
}

export type VisualizationData =
  | { type: 'array'; elements: ArrayElement[] }
  | { type: 'graph'; nodes: GraphNode[]; edges: GraphEdge[] }
  | { type: 'tree'; root: TreeNode | null }
  | { type: 'dp'; table: DPCell[][]; labels?: { rows: string[]; cols: string[] } }
  | { type: 'grid'; cells: ElementState[][]; queens?: number[] }
  | { type: 'bars'; elements: ArrayElement[] }
  | MLVisualizationData;

export interface AlgorithmStep {
  data: VisualizationData;
  description: string;
  highlightLines: number[];
  comparing?: number[];
  swapping?: number[];
  operation?: string;
  phase?: string;
  comparisonCount?: number;
  swapCount?: number;
  beforeState?: string;
  afterState?: string;
  reason?: string;
  result?: string;
  nextAction?: string;
  lineExplanation?: string;
  auxiliary?: { label: string; value: string | number | (string | number)[] }[];
  pointers?: { name: string; index: number; color?: string }[];
}

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
}

export interface WorkedExampleStep {
  stepNumber: number;
  operation: string;
  stateDisplay: string;
  explanation: string;
  whyNecessary?: string;
  beforeState?: string;
  afterState?: string;
  nextAction?: string;
  intermediateResult?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  optionExplanations?: string[];
}

export interface CodeLineExplanation {
  line: number;
  code: string;
  explanation: string;
  variableRoles?: string;
}

export interface SourceCodeSection {
  language: 'typescript' | 'javascript';
  code: string;
  signature: string;
  inputValidation: string;
  variables: Array<{ name: string; type: string; purpose: string }>;
  lineByLine: CodeLineExplanation[];
  returnExplanation: string;
  commonBugs: string[];
  edgeCaseHandling: string[];
}

export interface CorrectnessSection {
  intuitiveExplanation: string;
  formalProof: {
    method:
      | 'Loop Invariant'
      | 'Induction'
      | 'Exchange Argument'
      | 'Graph-Search Invariant'
      | 'Dynamic Programming Recurrence'
      | 'Backtracking Completeness'
      | 'Mathematical Optimization Convergence'
      | 'Convex Loss Minimization'
      | 'Geometric Monotonicity';
    invariantOrClaim: string;
    initialization: string;
    maintenance: string;
    termination: string;
    conclusion: string;
  };
}

export interface CommonMistake {
  title: string;
  misconception: string;
  badCodeOrApproach?: string;
  correctApproach: string;
}

export interface ComparisonItem {
  algorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  stabilityOrType?: string;
  similarities: string;
  differences: string;
  whenToPreferThis: string;
  whenToPreferAlternative: string;
}

export interface ExerciseQuestion {
  id: string;
  type: 'conceptual' | 'step-tracing' | 'find-the-bug' | 'complexity' | 'challenge';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  optionExplanations?: string[];
}

export interface LessonSummary {
  coreIdea: string;
  keyConditions: string[];
  complexitySummary: {
    time: string;
    space: string;
  };
  whenToUse: string;
  prerequisites: string[];
  nextSteps: Array<{ id: string; name: string; reason: string }>;
}

export interface AlgorithmLesson {
  // Legacy / convenience shortcuts for backwards compatibility:
  oneSentenceDefinition: string;
  mainPurpose: string;
  whatIsIt: {
    overview: string;
    smallExample: string;
  };
  whyUseIt: {
    problemSolved: string;
    whyItMatters: string;
    whenToUse: string[];
    whenToAvoid: string[];
  };
  realWorldApplications: Array<{
    title: string;
    description: string;
    educationalVsProductionNote?: string;
  }>;
  howItWorksSteps: Array<{
    stepNumber: number;
    title: string;
    description: string;
  }>;
  workedExample: {
    initialState: string;
    steps: WorkedExampleStep[];
    finalState: string;
    datasetDescription?: string;
  };
  advantages: string[];
  limitations: string[];
  complexityDetailed: {
    bestCaseMeaning: string;
    averageCaseMeaning: string;
    worstCaseMeaning: string;
    spaceComplexityMeaning: string;
  };
  relatedAlgorithms: Array<{
    name: string;
    comparison: string;
  }>;
  quiz: QuizQuestion[];

  // ── 16 COMPREHENSIVE SECTIONS ─────────────────────────────────────────
  // Section 1: Introduction
  introduction: {
    nameOriginAndMeaning: string;
    problemSolved: string;
    problemNotSolved: string;
    whyLearn: string;
    prerequisites: string[];
  };

  // Section 2: Why Do We Need It?
  whyDoWeNeedIt: {
    problemStatement: string;
    naiveApproachInefficiency: string;
    coreIdeaUsed: string;
    utilityExplanation: string;
    workingConditions: string[];
    whenAnotherIsBetter: string;
    analogyOrRealLifeExample: string;
  };

  // Section 3: Input, Output, and Assumptions
  inputOutputAssumptions: {
    expectedInput: string;
    expectedOutput: string;
    constraints: string | string[];
    preconditions: string | string[];
    specialCases: string[];
    isSortedRequired: boolean | string;
    graphWeightsRequirement?: string;
    brokenAssumptionsBehavior: string;
  };

  // Section 4: Core Intuition
  coreIntuition: {
    simpleExplanation: string;
    keyDrivingDecision: string;
    whyRepeatedOperationWorks: string;
    paradigmSpecificDetail: string;
  };

  // Section 7: Pseudocode & Line Explanations
  pseudocodeWalkthrough: {
    code: string[];
    lineExplanations: Array<{ lineIndex: number; lineText: string; explanation: string; variableRoles?: string }>;
    terminationCondition: string;
  };

  // Section 8: Source Code Walkthrough
  sourceCodeWalkthrough: SourceCodeSection;

  // Section 9: Correctness
  correctness: CorrectnessSection;

  // Section 10: Time and Space Complexity
  complexityAnalysis: {
    bestCase: { complexity: string; explanation: string; condition: string };
    averageCase: { complexity: string; explanation: string; condition: string };
    worstCase: { complexity: string; explanation: string; condition: string };
    auxiliarySpace: { complexity: string; explanation: string };
    totalMemory: string;
    bigOExplanation: string;
    scalingBehavior: string;
  };

  // Section 11: Advantages and Limitations
  advantagesAndLimitations: {
    strengths: string[];
    limitations: string[];
    memoryTradeOffs: string[];
    poorChoiceScenarios: string[];
  };

  // Section 13: Comparison with Other Algorithms
  comparisons: ComparisonItem[];

  // Section 14: Common Mistakes
  commonMistakes: CommonMistake[];

  // Section 15: Exercises and Knowledge Check
  exercises: ExerciseQuestion[];

  // Section 16: Summary and Next Steps
  summary: LessonSummary;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  description: string;
  longDescription: string;
  complexity: ComplexityInfo;
  pseudocode: string[];
  tags: string[];
  stable?: boolean;
  inPlace?: boolean;
  lesson?: AlgorithmLesson;
  sourceCode?: {
    javascript?: string;
    python?: string;
  };
}

export interface VisualizationState {
  steps: AlgorithmStep[];
  currentStep: number;
  isPlaying: boolean;
  isPaused: boolean;
  speed: number; // ms per step
  inputSize: number;
}
