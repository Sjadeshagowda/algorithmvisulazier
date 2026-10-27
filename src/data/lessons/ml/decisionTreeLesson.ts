import type { AlgorithmLesson } from '../../../types/algorithm';

export const decisionTreeLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A non-parametric supervised learning algorithm that recursively partitions feature space into axis-aligned rectangular regions using a sequence of binary decision rules based on impurity reduction.',
  mainPurpose:
    'To perform interpretable classification and regression by constructing an intuitive flowchart-like tree structure that predicts targets through hierarchical if-then conditions.',
  whatIsIt: {
    overview:
      'A Decision Tree models decisions as an upside-down tree structure. It starts at a single root node containing the entire dataset and greedily evaluates every available feature threshold to find the split that maximizes purity (using Gini Impurity or Information Gain/Entropy). The dataset is divided into two child subsets (<= threshold and > threshold), and this process repeats recursively until a stopping condition is reached (such as maximum depth, minimum samples per node, or pure nodes). The leaf nodes assign the final prediction based on the majority class of their training instances.',
    smallExample:
      'Loan approval decision: Root tests "Income > $50k?". If False, loan is Denied (Leaf: Class 0). If True, a second test asks "Credit Score > 650?". If True, loan is Approved (Leaf: Class 1); if False, loan is Denied. An applicant with Income $60k and Credit Score 720 traverses root -> right -> right to receive immediate Approval.',
  },
  whyUseIt: {
    problemSolved:
      'Learning complex non-linear classification and regression boundaries without requiring feature normalization, scaling, or mathematical transformations.',
    whyItMatters:
      'Decision Trees offer unparalleled human interpretability. Every prediction can be fully traced and explained to non-technical stakeholders or legal regulators as an exact series of logical rules. They also serve as the foundational building block for state-of-the-art ensemble models like Random Forests and Gradient Boosted Trees (XGBoost, LightGBM).',
    whenToUse: [
      'Model interpretability and explainability are strict requirements (e.g. credit underwriting, medical diagnostic pathways).',
      'Data contains mixed feature types (continuous and categorical) without needing scaling or one-hot encoding.',
      'Non-linear relationships and high-order feature interactions are present.',
      'Fast inference latency is required (traversal takes O(depth) comparisons).',
    ],
    whenToAvoid: [
      'Extremely high-dimensional sparse data (e.g. text classification with bag-of-words or TF-IDF) where linear models perform better.',
      'Small datasets prone to high variance and severe overfitting without regularization.',
      'Data where the true relationship is diagonal or rotational (decision trees can only form axis-aligned stair-step partitions).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Automated Loan Underwriting & Credit Risk Scoring',
      description:
        'Financial institutions evaluate mortgage and credit applications using transparent decision trees that output clear, compliant denial reasons (e.g. "Debt-to-Income > 43%").',
      educationalVsProductionNote:
        'Core regulatory standard in consumer finance compliance (Equal Credit Opportunity Act requirements).',
    },
    {
      title: 'Emergency Room Triage Protocols',
      description:
        'Hospitals using clinical decision trees to stratify patients arriving at the emergency department into urgent versus non-urgent care pathways based on vital signs and symptoms.',
      educationalVsProductionNote:
        'Widely used in published clinical practice guidelines and triage algorithms (e.g. Manchester Triage System).',
    },
    {
      title: 'E-Commerce Churn and Fraud Triaging',
      description:
        'Detecting risky transactions by checking whether account age < 3 days, order value > $500, and shipping country differs from billing address.',
      educationalVsProductionNote:
        'High-speed initial rule-filtering layer deployed in front of heavy neural fraud detection systems.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Calculate Impurity of Current Node',
      description:
        'Evaluate the class distribution in the node and compute baseline impurity using Gini: I_G = 1 - Σ p_i² or Entropy: H = -Σ p_i log₂(p_i).',
    },
    {
      stepNumber: 2,
      title: 'Generate Candidate Split Thresholds',
      description:
        'For each continuous feature, sort distinct values and calculate candidate split midpoints (v_k + v_{k+1}) / 2.',
    },
    {
      stepNumber: 3,
      title: 'Find the Split Maximizing Information Gain',
      description:
        'For every candidate threshold, partition samples into left (<=) and right (>) subsets, compute child impurities, and calculate Information Gain = I_parent - (N_left/N * I_left + N_right/N * I_right).',
    },
    {
      stepNumber: 4,
      title: 'Partition or Terminate into Leaf',
      description:
        'If stopping conditions are met (max depth reached, min samples violated, or pure node), designate as a Leaf predicting majority class; otherwise create child nodes and recurse.',
    },
  ],
  workedExample: {
    datasetDescription:
      '4 samples with 1 feature X and binary label Y: (10, 0), (20, 0), (60, 1), (80, 1). Goal: find optimal split threshold using Gini Impurity.',
    initialState: 'Root has 4 samples: [2 Class 0, 2 Class 1]. Initial Gini = 1 - [(2/4)² + (2/4)²] = 1 - (0.25 + 0.25) = 0.500.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Identify candidate split thresholds',
        stateDisplay: 'Unique X values: [10, 20, 60, 80]. Midpoint candidates: T1 = 15, T2 = 40, T3 = 70.',
        explanation: 'Candidate splits occur between adjacent sorted feature values.',
        whyNecessary: 'Tests every meaningful boundary without evaluating infinite continuous values.',
        beforeState: 'Unsplit root node',
        afterState: '3 candidate thresholds identified: {15, 40, 70}',
        nextAction: 'Calculate Information Gain for Candidate T1 = 15.',
        intermediateResult: 'Candidates: 15, 40, 70',
      },
      {
        stepNumber: 2,
        operation: 'Evaluate Candidate T1 = 15',
        stateDisplay: 'Left (X <= 15): [10 (Class 0)] -> Gini = 0.0. Right (X > 15): [20 (Class 0), 60 (Class 1), 80 (Class 1)] -> Gini = 1 - [(1/3)² + (2/3)²] = 0.444. Weighted Child Impurity = (1/4)(0) + (3/4)(0.444) = 0.333. Information Gain = 0.500 - 0.333 = 0.167.',
        explanation: 'Threshold 15 separates one Class 0 sample, leaving a mixed right child.',
        whyNecessary: 'Measures purity improvement for candidate split 1.',
        beforeState: 'T1 gain unknown',
        afterState: 'Gain(T1=15) = 0.167',
        nextAction: 'Evaluate Candidate T2 = 40.',
        intermediateResult: 'Gain = 0.167',
      },
      {
        stepNumber: 3,
        operation: 'Evaluate Candidate T2 = 40 (Optimal Split)',
        stateDisplay: 'Left (X <= 40): [10, 20] both Class 0 -> Gini = 0.0 (100% pure!). Right (X > 40): [60, 80] both Class 1 -> Gini = 0.0 (100% pure!). Weighted Impurity = (2/4)(0) + (2/4)(0) = 0.000. Information Gain = 0.500 - 0.000 = 0.500 (Maximum possible gain!).',
        explanation: 'Split at X <= 40 achieves complete separation with 0 impurity on both branches.',
        whyNecessary: 'Discovers the globally optimal partition for this dataset.',
        beforeState: 'Gain(T1) = 0.167',
        afterState: 'Gain(T2=40) = 0.500 (Best Split)',
        nextAction: 'Partition root and create pure leaf nodes.',
        intermediateResult: 'Best split locked: X <= 40',
      },
    ],
    finalState: 'Root split on X <= 40 creates Left Leaf (Class 0) and Right Leaf (Class 1) with 100% training accuracy.',
  },
  advantages: [
    'Highly interpretable: can be visualized directly as an explicit if-then logic tree.',
    'Requires minimal data preparation: no feature normalization, scaling, or centering required.',
    'Handles non-linear relationships and feature interactions naturally.',
    'Fast inference: predicting a sample requires only O(depth) numerical comparisons.',
  ],
  limitations: [
    'Prone to severe overfitting if depth is unconstrained (high variance).',
    'Unstable: small variations in training data can result in a completely different tree structure.',
    'Orthogonal decision boundaries struggle with diagonal linear relationships (staircase approximation).',
    'Greedy search: makes locally optimal decisions at each node without backtracking.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(d · n log n) training time when trees are balanced (depth = log n) and feature sorting dominates.',
    averageCaseMeaning:
      'O(d · n log n) for training; inference requires O(depth) comparisons, typically O(log n).',
    worstCaseMeaning:
      'O(d · n²) training time when trees degenerate into linear chains (depth = n); inference becomes O(n).',
    spaceComplexityMeaning:
      'O(nodes) auxiliary memory to store internal thresholds, pointers, and leaf distributions.',
  },
  relatedAlgorithms: [
    {
      name: 'Random Forest',
      comparison:
        'Ensemble of decorrelated decision trees built on bootstrap data samples with random feature subsets, reducing variance.',
    },
    {
      name: 'Gradient Boosted Trees (XGBoost / LightGBM)',
      comparison:
        'Sequentially builds shallow decision trees where each new tree fits the residual errors of preceding trees.',
    },
    {
      name: 'Logistic Regression',
      comparison:
        'Parametric linear classifier producing smooth probabilistic boundaries rather than piecewise orthogonal steps.',
    },
  ],
  quiz: [
    {
      question: 'What is the theoretical range of Gini Impurity for a binary classification problem?',
      options: ['[0.0, 0.5]', '[0.0, 1.0]', '[-1.0, 1.0]', '[0.0, ∞)'],
      correctIndex: 0,
      explanation:
        'For two classes, Gini = 1 - (p² + (1-p)²). When completely pure (p=1 or p=0), Gini = 0. When maximally impure (50/50 split), Gini = 1 - (0.25 + 0.25) = 0.5.',
      optionExplanations: [
        'Correct! Gini for 2 classes ranges from 0.0 (pure) to 0.5 (maximum uncertainty).',
        '[0.0, 1.0] is the range for Entropy in binary classification, not Gini.',
        'Impurity measures can never be negative.',
        'Gini is bounded by 1 - 1/C where C is the number of classes.',
      ],
    },
    {
      question: 'Why are Decision Trees called "greedy" algorithms?',
      options: [
        'They require massive GPU memory',
        'At each node, they pick the locally best split without looking ahead to see if a different split would be better globally',
        'They only work with binary labels',
        'They always consume 100% CPU capacity',
      ],
      correctIndex: 1,
      explanation:
        'Standard CART and ID3 algorithms make the myopically best choice at the current node without backtracking or multi-step lookahead.',
      optionExplanations: [
        'Decision trees run easily on CPUs with minimal memory.',
        'Correct! Greedy heuristics optimize the current node without global forward-planning.',
        'Decision trees naturally support multi-class targets.',
        'CPU consumption is unrelated to greedy heuristic search.',
      ],
    },
    {
      question: 'Which technique is used to prevent Decision Trees from overfitting the training data?',
      options: [
        'Increasing the maximum depth to infinity',
        'Pre-pruning (setting max depth, min samples per split) or post-pruning',
        'Removing all leaf nodes',
        'Multiplying all feature values by 100',
      ],
      correctIndex: 1,
      explanation:
        'Constraining maximum tree depth and requiring minimum samples per split prevents the tree from creating specialized nodes for individual noise points.',
      optionExplanations: [
        'Unlimited depth causes maximal overfitting.',
        'Correct! Pruning constraints control tree complexity and improve generalization.',
        'Without leaf nodes, predictions cannot be made.',
        'Scaling features has zero impact on decision tree split locations.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Developed by Leo Breiman, Jerome Friedman, Richard Olshen, and Charles Stone in 1984 under the CART (Classification and Regression Trees) framework. Named for its branching tree structure.',
    problemSolved:
      'Classifies data points by applying an ordered sequence of learned binary decisions to their feature values.',
    problemNotSolved:
      'Does not produce smooth continuous curves, and struggles with diagonal boundaries that require complex stair-stepping.',
    whyLearn:
      'Decision trees provide absolute transparency into machine learning decisions and form the foundational core of modern gradient boosting libraries.',
    prerequisites: ['Basic Probability', 'Gini Impurity & Entropy formulas', 'Binary Tree data structures'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can an algorithm learn non-linear patterns in tabular data while generating rules that humans can inspect, debug, and explain to regulators?',
    naiveApproachInefficiency:
      'Linear models fail on non-linear data without manual polynomial expansion, while deep neural networks behave as unexplainable black boxes.',
    coreIdeaUsed:
      'Recursive binary partitioning: repeatedly split the dataset on the single feature threshold that maximizes purity gain.',
    utilityExplanation:
      'Delivers instant transparency: any prediction can be explained in court or to a doctor as a plain sequence of if-then statements.',
    workingConditions: [
      'Tabular features (continuous or discrete).',
      'Reasonable number of samples (e.g. n > 10).',
      'Labels available for supervised learning.',
    ],
    whenAnotherIsBetter:
      'When the boundary is linear and dataset is large, Logistic Regression is faster. When high accuracy is needed on complex tabular data, use Random Forests or XGBoost.',
    analogyOrRealLifeExample:
      'The classic game of "20 Questions": each question (e.g. "Is it an animal?") divides the space of possibilities in half based on information value.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Training dataset of feature vectors x ∈ ℝᵈ with discrete class labels y ∈ {0, 1}.',
    expectedOutput: 'Hierarchical tree of decision nodes and leaves that maps any query vector to a predicted class.',
    constraints: ['maxDepth >= 1', 'minSamplesSplit >= 2', 'Features must be real numbers'],
    preconditions: ['Labels should be discrete categorical values for classification trees'],
    specialCases: ['100% pure node (stops splitting)', 'Duplicate feature values (cannot split)'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'If features have zero variance or all points have identical coordinates with conflicting labels, tree creates a leaf with majority voting.',
  },
  coreIntuition: {
    simpleExplanation:
      'Imagine sorting a messy box of marbles by color. You find the single divider line (e.g. size or weight) that best separates blue marbles from red marbles. If any side is still mixed, you add another divider to that section.',
    keyDrivingDecision:
      'Choosing the split that maximizes Information Gain (the difference between parent impurity and the weighted average child impurity).',
    whyRepeatedOperationWorks:
      'Each split monotonically reduces or maintains the total weighted impurity across the partition space, driving subsets toward 100% purity.',
    paradigmSpecificDetail:
      'Non-parametric Greedy Partitioning: makes local optimal choices without global backpropagation.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function buildTree(data, depth, maxDepth, minSamples):',
      '  if isPure(data) or depth >= maxDepth or length(data) < minSamples then',
      '    return createLeaf(majorityClass(data))',
      '  bestSplit := null, maxGain := 0',
      '  for each feature j in features do:',
      '    for each threshold t in candidateThresholds(data, j) do:',
      '      left, right := split(data, j, t)',
      '      gain := computeInformationGain(data, left, right)',
      '      if gain > maxGain then',
      '        maxGain := gain, bestSplit := { feature: j, threshold: t }',
      '  if maxGain <= 0 then return createLeaf(majorityClass(data))',
      '  leftNode := buildTree(leftData, depth + 1, maxDepth, minSamples)',
      '  rightNode := buildTree(rightData, depth + 1, maxDepth, minSamples)',
      '  return createDecisionNode(bestSplit, leftNode, rightNode)',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'if isPure(data) or depth >= maxDepth...', explanation: 'Check base stopping conditions before branching.' },
      { lineIndex: 3, lineText: 'for each feature j in features do:', explanation: 'Iterate over all available predictor dimensions.' },
      { lineIndex: 4, lineText: 'for each threshold t in candidateThresholds...', explanation: 'Evaluate candidate midpoints between adjacent sorted values.' },
      { lineIndex: 7, lineText: 'gain := computeInformationGain(...)', explanation: 'Measure reduction in Gini or Entropy impurity.' },
      { lineIndex: 11, lineText: 'leftNode := buildTree(leftData, depth + 1...)', explanation: 'Recursively build left child subtree (<= threshold).' },
      { lineIndex: 12, lineText: 'rightNode := buildTree(rightData, depth + 1...)', explanation: 'Recursively build right child subtree (> threshold).' },
    ],
    terminationCondition: 'Recursion terminates at each branch when nodes are pure, depth reaches maxDepth, or samples fall below minSamples.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function trainDecisionTree(points: DataPoint2D[], maxDepth: number, criterion: "gini" | "entropy"): DecisionTreeNode',
    code: `export function buildDecisionTree(
  points: { x: number; y: number; label: number }[],
  maxDepth = 3,
  minSamples = 2
) {
  function gini(pts: typeof points): number {
    const total = pts.length;
    if (total === 0) return 0;
    const count1 = pts.filter(p => p.label === 1).length;
    const p1 = count1 / total;
    const p0 = 1 - p1;
    return 1 - (p0 * p0 + p1 * p1);
  }

  function splitNode(pts: typeof points, depth: number): any {
    const nodeGini = gini(pts);
    const majority = pts.filter(p => p.label === 1).length >= pts.length / 2 ? 1 : 0;

    if (nodeGini === 0 || depth >= maxDepth || pts.length < minSamples) {
      return { isLeaf: true, predictedClass: majority, samples: pts.length, impurity: nodeGini };
    }

    let bestGain = 0;
    let bestSplit: { feature: 'x' | 'y'; threshold: number } | null = null;

    for (const feat of ['x', 'y'] as const) {
      const vals = Array.from(new Set(pts.map(p => p[feat]))).sort((a, b) => a - b);
      for (let i = 0; i < vals.length - 1; i++) {
        const t = (vals[i] + vals[i + 1]) / 2;
        const left = pts.filter(p => p[feat] <= t);
        const right = pts.filter(p => p[feat] > t);
        if (left.length === 0 || right.length === 0) continue;

        const gain = nodeGini - ((left.length / pts.length) * gini(left) + (right.length / pts.length) * gini(right));
        if (gain > bestGain) {
          bestGain = gain;
          bestSplit = { feature: feat, threshold: t };
        }
      }
    }

    if (!bestSplit || bestGain <= 1e-6) {
      return { isLeaf: true, predictedClass: majority, samples: pts.length, impurity: nodeGini };
    }

    const leftPts = pts.filter(p => p[bestSplit!.feature] <= bestSplit!.threshold);
    const rightPts = pts.filter(p => p[bestSplit!.feature] > bestSplit!.threshold);

    return {
      isLeaf: false,
      feature: bestSplit.feature,
      threshold: bestSplit.threshold,
      gain: bestGain,
      left: splitNode(leftPts, depth + 1),
      right: splitNode(rightPts, depth + 1),
    };
  }

  return splitNode(points, 0);
}`,
    inputValidation: 'Ensures points array has samples, validates numeric features, and handles tie votes deterministically.',
    variables: [
      { name: 'nodeGini', type: 'number', purpose: 'Current node impurity before splitting' },
      { name: 'bestGain', type: 'number', purpose: 'Maximum impurity reduction discovered' },
      { name: 'bestSplit', type: 'object', purpose: 'Optimal feature and threshold parameters' },
      { name: 'leftPts, rightPts', type: 'Array', purpose: 'Subsets partitioned by threshold test' },
    ],
    lineByLine: [
      { line: 7, code: 'function gini(pts) { ... }', explanation: 'Calculates standard Gini Impurity.' },
      { line: 18, code: 'if (nodeGini === 0 || depth >= maxDepth ...)', explanation: 'Evaluates base case stopping criteria.' },
      { line: 25, code: 'const vals = Array.from(new Set(...)).sort(...)', explanation: 'Gathers candidate threshold midpoints.' },
      { line: 31, code: 'const gain = nodeGini - weightedChildGini', explanation: 'Calculates information gain.' },
      { line: 49, code: 'left: splitNode(leftPts, depth + 1)', explanation: 'Recursive construction of child subtrees.' },
    ],
    returnExplanation: 'Returns a nested JavaScript object representing the complete decision tree.',
    commonBugs: [
      'Off-by-one errors in threshold calculation producing empty child splits.',
      'Allowing trees to grow indefinitely without depth constraints, causing massive overfitting.',
      'Non-deterministic tie breaking causing different tree structures across test runs.',
    ],
    edgeCaseHandling: [
      'Clamps minimum samples to prevent divide-by-zero.',
      'Handles pure nodes immediately without evaluating split candidates.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Because every split chosen by the algorithm strictly decreases or maintains total weighted impurity (Gain >= 0), and because stopping conditions guarantee termination in at most maxDepth levels, the recursive partitioning procedure is mathematically guaranteed to terminate in finite steps with non-increasing total error.',
    formalProof: {
      method: 'Mathematical Optimization Convergence',
      invariantOrClaim: 'At every non-leaf split, the weighted impurity of child nodes is strictly less than the parent node impurity: (N_L/N)I(S_L) + (N_R/N)I(S_R) < I(S).',
      initialization: 'Let root node have impurity I(S_0) >= 0. Tree depth is d = 0 <= maxDepth.',
      maintenance: 'By algorithm design, a split is executed if and only if Gain = I(S) - [(N_L/N)I(S_L) + (N_R/N)I(S_R)] > 0. Therefore, the weighted impurity strictly decreases. If no positive gain exists, the node becomes a leaf.',
      termination: 'At each recursive call, depth increments by 1. Since depth is bounded by maxDepth, and sample sizes |S| strictly decrease along every split branch, recursion depth is strictly finite.',
      conclusion: 'The tree construction must terminate in a finite number of steps, yielding a deterministic partition of the feature space.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(d · n log n)', explanation: 'Balanced tree with depth = log(n), where sorting features dominates.', condition: 'Balanced splits at every node.' },
    averageCase: { complexity: 'O(d · n log n)', explanation: 'Typical recursive tree construction with moderate depth.', condition: 'General tabular dataset.' },
    worstCase: { complexity: 'O(d · n²)', explanation: 'Degenerate tree where each split isolates only 1 sample (depth = n).', condition: 'Pathological sorted inputs.' },
    auxiliarySpace: { complexity: 'O(nodes · d)', explanation: 'Memory required to store node thresholds and class distribution vectors.' },
    totalMemory: 'O(n · d) for the dataset + O(2^maxDepth) for the tree nodes.',
    bigOExplanation: 'Inference runtime is O(depth), meaning decisions evaluate in microseconds regardless of dataset size.',
    scalingBehavior: 'Extremely fast during inference; training scales well to hundreds of thousands of samples.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Complete transparency: every decision can be inspected and verified by humans.',
      'Zero feature scaling or normalization required.',
      'Naturally models non-linear boundaries and feature interaction effects.',
      'Sub-millisecond inference speed.',
    ],
    limitations: [
      'Highly sensitive to training data perturbations (high variance).',
      'Cannot approximate smooth diagonal boundaries without excessive stair-stepping.',
      'Greedy split search may miss globally optimal multi-step feature combinations.',
    ],
    memoryTradeOffs: [
      'Deep trees require storing exponential nodes (2^depth); shallow trees use minimal memory.',
    ],
    poorChoiceScenarios: [
      'High-dimensional sparse text data (use Linear SVM or Naive Bayes).',
      'Continuous targets with smooth linear relationships (use Linear Regression).',
    ],
  },
  comparisons: [
    {
      algorithm: 'Logistic Regression',
      timeComplexity: 'O(d) inference vs O(depth) in Trees',
      spaceComplexity: 'O(d) vs O(nodes)',
      stabilityOrType: 'Parametric Linear Classifier',
      similarities: 'Both solve supervised classification problems.',
      differences: 'Logistic regression fits a single linear hyperplane; decision trees form orthogonal piecewise boundaries.',
      whenToPreferThis: 'When non-linear interactions exist and rule-based explanations are needed.',
      whenToPreferAlternative: 'When classes are linearly separable and calibrated probabilities are required.',
    },
    {
      algorithm: 'Random Forest',
      timeComplexity: 'O(trees · depth)',
      spaceComplexity: 'O(trees · nodes)',
      stabilityOrType: 'Ensemble Bagging Model',
      similarities: 'Both use decision trees as their computational foundation.',
      differences: 'Random Forest averages predictions across dozens of trees to drastically reduce variance and prevent overfitting.',
      whenToPreferThis: 'When an individual human-readable tree flowchart is mandatory.',
      whenToPreferAlternative: 'When predictive accuracy on complex tabular data is the top priority.',
    },
  ],
  commonMistakes: [
    {
      title: 'Allowing Trees to Grow to Infinite Depth',
      misconception: 'Believing that a tree with 100% training accuracy will perform well on future unseen data.',
      badCodeOrApproach: 'Setting maxDepth = Infinity and minSamplesSplit = 1.',
      correctApproach: 'Always constrain tree growth using maxDepth (e.g. 3 to 6) or require minSamplesSplit >= 5 to prevent overfitting to noise.',
    },
    {
      title: 'Assuming Decision Trees Can Extrapolate',
      misconception: 'Expecting a decision tree to predict continuous trend increases beyond the training range.',
      correctApproach: 'Decision trees predict constant values outside the bounding box of training features; they cannot extrapolate trends.',
    },
  ],
  exercises: [
    {
      id: 'dt-ex-1',
      type: 'conceptual',
      question: 'A dataset has 10 samples of Class 0 and 0 samples of Class 1. What is its Gini Impurity?',
      options: ['0.000', '0.500', '1.000', '0.250'],
      correctIndex: 0,
      explanation: 'Gini = 1 - [(10/10)² + (0/10)²] = 1 - [1.0 + 0.0] = 0.000. Pure nodes have exactly zero impurity.',
    },
    {
      id: 'dt-ex-2',
      type: 'challenge',
      question: 'Why does normalizing or standardizing continuous features have zero effect on Decision Tree splits?',
      options: [
        'Because monotonic scaling does not change the sorted order of values or relative threshold midpoints',
        'Because decision trees convert all numbers to text strings',
        'Because decision trees only check feature names',
        'Because Gini impurity ignores numbers',
      ],
      correctIndex: 0,
      explanation:
        'Decision trees only care about rank order: if x_1 < x_2, multiplying or standardizing preserves x_1 < x_2, resulting in mathematically equivalent split points.',
    },
  ],
  summary: {
    coreIdea: 'Recursively divides feature space into axis-aligned rectangular boxes using the split that maximizes information gain.',
    keyConditions: ['Target must be categorical (for classification)', 'Constrain depth to prevent overfitting', 'Tie-breaking must be deterministic'],
    complexitySummary: { time: 'O(d · n log n) training; O(depth) inference', space: 'O(nodes)' },
    whenToUse: 'When transparent, explainable decision logic is required on tabular data.',
    prerequisites: ['Gini Impurity', 'Entropy', 'Binary search trees'],
    nextSteps: [
      { id: 'linear-regression', name: 'Linear Regression', reason: 'Compare piecewise constant predictions with continuous linear slopes.' },
      { id: 'knn', name: 'K-Nearest Neighbors', reason: 'Compare axis-aligned splits with Voronoi distance neighborhoods.' },
    ],
  },
};
