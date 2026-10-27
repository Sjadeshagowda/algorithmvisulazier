import type { AlgorithmLesson } from '../../../types/algorithm';

export const svmLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A supervised learning algorithm that finds the optimal maximum-margin separating hyperplane between classes by minimizing regularized weight norm and hinge loss on support vectors.',
  mainPurpose:
    'To find a linear or non-linear decision boundary that maximizes the geometric distance (street width) to the nearest training instances of each class, ensuring robust generalization to unseen data.',
  whatIsIt: {
    overview:
      'Support Vector Machine (SVM) is a mathematically rigorous binary classification algorithm. Given training points labeled y ∈ {-1, +1}, SVM searches for the hyperplane w · x + b = 0 that separates the two classes while maximizing the geometric margin (street width) 2/||w|| between them. When data cannot be perfectly linearly separated, the soft-margin formulation allows controlled boundary violations by introducing slack variables and a regularization hyperparameter C that balances margin width against classification errors. Points that lie directly on the margin boundaries (w · x + b = ±1) or violate them are called support vectors — only these critical samples determine the orientation and position of the separating hyperplane.',
    smallExample:
      'Classifying credit transactions as legitimate (y = -1) or fraudulent (y = +1) based on transaction velocity and dollar amount. Rather than selecting an arbitrary separating line that grazes legitimate transactions, SVM places the decision hyperplane directly midway between the most borderline fraudulent transaction and the most borderline legitimate transaction (the support vectors), creating a maximal safety margin that resists noise.',
  },
  whyUseIt: {
    problemSolved:
      'Eliminates arbitrary decision boundary selection in linear classification by identifying the unique hyperplane with the maximum mathematical safety margin.',
    whyItMatters:
      'By maximizing the margin between classes, SVM minimizes the theoretical upper bound on generalization error according to Vapnik-Chervonenkis (VC) dimension theory. Furthermore, SVM is exceptionally memory-efficient because only support vectors are needed to store and evaluate the model during inference, ignoring redundant interior samples.',
    whenToUse: [
      'High-dimensional feature spaces where the number of features d approaches or exceeds sample count n (e.g. bioinformatics, genomics, text categorization).',
      'Binary classification where clean geometric margins or tunable soft margins are desired.',
      'Memory-constrained embedded devices where storing only support vectors reduces deployment footprint.',
      'Small to medium-sized datasets where convex optimization guarantees finding the global optimum without local minima traps.',
    ],
    whenToAvoid: [
      'Massive datasets (n > 100,000) where dual quadratic programming solver runtimes scale as O(n²) to O(n³).',
      'Heavily overlapping noisy datasets where no distinct margin boundary exists.',
      'Applications requiring well-calibrated posterior class probabilities P(Y=1|X) without costly Platt scaling calibration.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Genomic Cancer Subtype Classification',
      description:
        'Classifying tumor biopsy tissue using DNA microarray gene expression data where features (d ≈ 20,000 genes) far outnumber patient samples (n ≈ 100). Linear SVM excels in such high-dimensional spaces without overfitting.',
      educationalVsProductionNote:
        'Standard benchmark in computational biology published in landmark oncology studies (e.g. leukemia subtype discovery).',
    },
    {
      title: 'Spam Detection and Text Categorization',
      description:
        'Filtering email text by converting documents into high-dimensional TF-IDF or bag-of-words vectors and classifying them with a linear SVM.',
      educationalVsProductionNote:
        'Historically powered early commercial spam engines (SpamAssassin) before deep recurrent neural nets.',
    },
    {
      title: 'Optical Character Recognition & Pedestrian Detection',
      description:
        'Detecting pedestrians in computer vision by extracting Histogram of Oriented Gradients (HOG) features and classifying sliding windows using a linear SVM.',
      educationalVsProductionNote:
        'The Dalal & Triggs (2005) HOG+SVM architecture served as the industry standard in automotive safety before CNNs.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Map Labels to Binary Bipolar Convention',
      description:
        'Format dataset labels into bipolar targets y_i ∈ {-1, +1} rather than {0, 1}. This enables the compact margin condition y_i(w · x_i + b) >= 1.',
    },
    {
      stepNumber: 2,
      title: 'Define Hyperplane and Geometric Margin',
      description:
        'A linear hyperplane is defined by w · x + b = 0. The signed perpendicular distance from any point x_i to the hyperplane is (w · x_i + b) / ||w||. The total margin width between the positive and negative margin boundaries (w · x + b = ±1) is 2 / ||w||.',
    },
    {
      stepNumber: 3,
      title: 'Formulate the Soft-Margin Primal Objective',
      description:
        'Maximizing margin 2/||w|| is equivalent to minimizing ½||w||². In the presence of noise, penalize margin violations using Hinge Loss: max(0, 1 - y_i(w · x_i + b)). The complete objective is J(w,b) = ½||w||² + C Σ max(0, 1 - y_i(w · x_i + b)).',
    },
    {
      stepNumber: 4,
      title: 'Optimize via Subgradient Descent',
      description:
        'Compute the subgradient of the hinge loss with respect to w and b. Points with functional margin y_i(w · x_i + b) < 1 contribute -C · y_i · x_i to the weight subgradient. Parameters are updated iteratively with learning rate decaying over epochs.',
    },
  ],
  workedExample: {
    datasetDescription:
      '4 samples on a 1D feature axis: x_1 = 2 (y=-1), x_2 = 4 (y=-1), x_3 = 8 (y=+1), x_4 = 10 (y=+1). Goal: find optimal separating hyperplane w·x + b = 0 maximizing margin.',
    initialState:
      'Points: Class -1 at {2, 4}, Class +1 at {8, 10}. The separating region lies between x = 4 and x = 8.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Identify Support Vector candidates',
        stateDisplay:
          'Nearest negative point is x_2 = 4 (y = -1). Nearest positive point is x_3 = 8 (y = +1). All other points (x=2, x=10) lie further away.',
        explanation: 'The decision boundary is governed strictly by the closest points from either class.',
        whyNecessary: 'Support vectors define the maximum-margin street boundary.',
        beforeState: 'Street boundary unknown',
        afterState: 'Candidates identified: x_2=4 and x_3=8',
        nextAction: 'Calculate optimal midpoint hyperplane.',
        intermediateResult: 'Midpoint x* = (4 + 8) / 2 = 6',
      },
      {
        stepNumber: 2,
        operation: 'Derive Hyperplane Parameters (w, b)',
        stateDisplay:
          'Midpoint is x = 6. Set decision boundary at x = 6: w · (6) + b = 0 => b = -6w. On positive support vector x=8: w · (8) + b = +1. Substituting b = -6w: 8w - 6w = 1 => 2w = 1 => w = 0.5. Bias b = -6(0.5) = -3. Hyperplane equation: 0.5x - 3 = 0.',
        explanation: 'Solves linear system for canonical margin equations w·x + b = ±1 on support vectors.',
        whyNecessary: 'Determines unique maximum-margin scale parameters.',
        beforeState: 'w and b unknown',
        afterState: 'w = 0.5, b = -3',
        nextAction: 'Calculate margin width 2/||w||.',
        intermediateResult: 'w = 0.5, b = -3',
      },
      {
        stepNumber: 3,
        operation: 'Calculate Geometric Margin Width',
        stateDisplay:
          'Margin width = 2 / ||w|| = 2 / 0.5 = 4.0 units. The positive margin line is at 0.5x - 3 = 1 => x = 8. The negative margin line is at 0.5x - 3 = -1 => x = 4. Distance between margins is 8 - 4 = 4.0 units.',
        explanation: 'Verifies canonical margin spacing matches physical distance between support vectors.',
        whyNecessary: 'Confirms maximum margin optimality.',
        beforeState: 'Margin width unverified',
        afterState: 'Margin width = 4.0 units (Maximum possible street width)',
        nextAction: 'Verify functional margin on non-support vectors.',
        intermediateResult: 'Margin = 4.0',
      },
      {
        stepNumber: 4,
        operation: 'Verify Non-Support Vectors',
        stateDisplay:
          'For x_1 = 2 (y=-1): y_1(0.5(2) - 3) = -1(-2) = 2.0 >= 1 (Safely outside margin). For x_4 = 10 (y=+1): y_4(0.5(10) - 3) = 1(2) = 2.0 >= 1 (Safely outside margin). Both have zero hinge loss!',
        explanation: 'Points further away do not affect the hyperplane position or orientation.',
        whyNecessary: 'Demonstrates sparsity and memory efficiency of SVM.',
        beforeState: 'Loss on exterior points uncomputed',
        afterState: 'Hinge loss = 0 on all non-support vectors',
        nextAction: 'Model training complete.',
        intermediateResult: 'Objective J = ½(0.5)² + 0 = 0.125',
      },
    ],
    finalState:
      'Optimal hyperplane 0.5x - 3 = 0 with margin width 4.0. Support vectors: x=4 and x=8. 100% training accuracy with maximal safety buffer.',
  },
  advantages: [
    'Guaranteed Global Optimum: Convex quadratic objective ensures optimization cannot get trapped in local minima.',
    'Maximum Margin Robustness: Maximizing geometric distance reduces sensitivity to random training sample noise.',
    'Effective in High Dimensions: Performs remarkably well even when feature count exceeds sample count (d > n).',
    'Sparse Memory Footprint: Model storage depends only on the number of support vectors, not the total training set size.',
  ],
  limitations: [
    'Computational Complexity on Large Datasets: Quadratic programming dual solvers scale poorly on datasets exceeding 100k samples.',
    'Sensitive to Feature Scales: If features have differing variances, the Euclidean norm ||w|| is distorted; scaling is strictly required.',
    'No Direct Probability Outputs: Outputs raw uncalibrated signed distances f(x) rather than true posterior probabilities.',
    'Hyperparameter Sensitivity: Requires tuning of regularization parameter C and kernel parameters.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(n · d) training time per epoch using linear subgradient descent on standardized features.',
    averageCaseMeaning:
      'O(epochs · n · d) for primal subgradient descent; O(n² · d) for dual sequential minimal optimization (SMO).',
    worstCaseMeaning:
      'O(n³) training time for exact dual quadratic programming solvers when support vector count approaches n.',
    spaceComplexityMeaning:
      'O(d) auxiliary memory for primal linear weights w and bias b; O(n_sv · d) if storing dual support vector vectors.',
  },
  relatedAlgorithms: [
    {
      name: 'Logistic Regression',
      comparison:
        'Smooth probabilistic classification minimizing log-loss across all samples, whereas SVM minimizes hinge loss focused primarily on margin boundary samples.',
    },
    {
      name: 'Perceptron',
      comparison:
        'Finds any arbitrary separating hyperplane that classifies points correctly, without optimizing margin width or handling non-separable data.',
    },
    {
      name: 'Decision Trees',
      comparison:
        'Constructs orthogonal axis-aligned rectangular partitions rather than arbitrary angled continuous linear hyperplanes.',
    },
  ],
  quiz: [
    {
      question: 'What is the geometric meaning of the SVM margin width formula 2 / ||w||?',
      options: [
        'The perpendicular distance between the positive margin hyperplane (w·x+b = +1) and the negative margin hyperplane (w·x+b = -1)',
        'The average distance of all training points to the center of the dataset',
        'The ratio of true positives to false positives',
        'The number of support vectors divided by the total number of features',
      ],
      correctIndex: 0,
      explanation:
        'For two parallel hyperplanes w·x+b = +1 and w·x+b = -1, the perpendicular geometric distance between them is (1 - (-1)) / ||w|| = 2 / ||w||. Maximizing this street width is equivalent to minimizing ||w|| or ½||w||².',
      optionExplanations: [
        'Correct! The margin width is the perpendicular distance between positive and negative margin hyperplanes.',
        'The margin width is independent of dataset centroid calculations.',
        'Margin is a spatial geometric metric, not a confusion matrix ratio.',
        'Margin width is determined by the norm of the weight vector, not sample counts.',
      ],
    },
    {
      question: 'What happens to the SVM decision boundary when the regularization parameter C is set to a very large value (C -> ∞)?',
      options: [
        'The model tolerates many margin errors to maximize the margin width',
        'The model acts as a hard-margin SVM, heavily penalizing any margin violation and risking overfitting',
        'The weights w automatically decay to zero',
        'The hyperplane becomes completely vertical',
      ],
      correctIndex: 1,
      explanation:
        'In the objective J(w,b) = ½||w||² + C Σ hinge, a huge C gives massive weight to the classification penalty, forcing hinge loss to zero (hard-margin). This creates a narrow margin that may overfit to noise.',
      optionExplanations: [
        'Tolerating errors occurs when C is very small, not large.',
        'Correct! High C heavily penalizes slack violations, creating a rigid hard margin.',
        'Weights decay to zero when regularization dominates (C -> 0).',
        'Hyperplane orientation depends on data geometry, not arbitrarily vertical.',
      ],
    },
    {
      question: 'Why are non-support vectors irrelevant to the final SVM decision boundary?',
      options: [
        'Because their functional margin y·f(x) > 1 gives zero hinge loss, contributing zero derivative to the optimization condition',
        'Because their feature coordinates are deleted from RAM during training',
        'Because SVM only reads the first 5 rows of any dataset',
        'Because they have negative coordinates',
      ],
      correctIndex: 0,
      explanation:
        'Points with y_i(w·x_i+b) > 1 are situated safely outside the margin street. Their hinge loss is max(0, 1 - y_i·f(x_i)) = 0 and their subgradient is 0. Moving them further away does not alter the optimal hyperplane.',
      optionExplanations: [
        'Correct! Points outside the margin have zero hinge loss and zero subgradient impact.',
        'Coordinates are not deleted; their mathematical contribution is simply zero.',
        'SVM inspects the entire dataset during training.',
        'Coordinate sign has no bearing on support vector status.',
      ],
    },
    {
      question: 'What is the Hinge Loss for a point with true label y = +1 and model prediction score f(x) = 0.4?',
      options: ['0.0', '0.6', '1.0', '-0.6'],
      correctIndex: 1,
      explanation:
        'Hinge loss = max(0, 1 - y · f(x)) = max(0, 1 - 1 · 0.4) = max(0, 0.6) = 0.6. Even though the classification is correct (score > 0), the point lies inside the margin street (score < 1), incurring a margin penalty of 0.6.',
      optionExplanations: [
        'Hinge loss is only 0.0 when y·f(x) >= 1.0.',
        'Correct! 1 - (1)(0.4) = 0.6 margin penalty.',
        'Loss would be 1.0 if f(x) were exactly 0.0 on the decision boundary.',
        'Hinge loss is bounded below by 0; it cannot be negative.',
      ],
    },
    {
      question: 'Why is feature normalization/standardization critical before training an SVM?',
      options: [
        'Because margin width is defined by Euclidean distance ||w||, so features with larger raw magnitudes unfairly dominate the margin orientation',
        'Because SVM cannot process floating point decimals',
        'Because labels must be converted to binary strings',
        'Because without scaling, the objective function produces imaginary numbers',
      ],
      correctIndex: 0,
      explanation:
        'The geometric margin is Euclidean distance. If feature 1 has range [0, 1000] and feature 2 has range [0, 1], the weight norm ||w|| will be dominated by feature 1, distorting the geometric street orientation.',
      optionExplanations: [
        'Correct! Euclidean margin geometry requires uniform feature scales.',
        'SVM natively calculates continuous real floating-point numbers.',
        'Labels in SVM are numeric scalars {-1, +1}.',
        'The objective remains real-valued regardless of scale, but weights become severely distorted.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Introduced by Vladimir Vapnik and Alexey Chervonenkis in 1963 for linear classifiers, and extended to the soft-margin formulation by Corinna Cortes and Vladimir Vapnik in 1995. Named "Support Vector Machine" because the decision boundary is geometrically supported solely by critical vector samples lying on the margin boundaries.',
    problemSolved:
      'Finds the optimal separating hyperplane that maximizes generalization by maximizing the geometric margin between two classes.',
    problemNotSolved:
      'Does not natively provide multi-class probabilities (requires one-vs-rest or Platt scaling) and does not scale well to millions of samples without stochastic approximations.',
    whyLearn:
      'SVM represents the pinnacle of classical statistical learning theory before deep learning. Understanding margins, duality, convex optimization, and hinge loss is essential machine learning literacy.',
    prerequisites: ['Vector Dot Products & Norms', 'Linear Hyperplanes (w·x+b=0)', 'Convex Optimization & Gradient Descent'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'Given linearly separable or near-separable data, infinitely many valid separating lines exist. Which line is mathematically optimal and provides the greatest resistance to future classification errors?',
    naiveApproachInefficiency:
      'The Perceptron algorithm stops at the very first separating line it finds. That line often passes within a fraction of a millimeter of training points, making it brittle and prone to high test-set error under slight noise.',
    coreIdeaUsed:
      'Maximum Margin Principle: place the decision boundary as far away as possible from the nearest data points of both classes, creating a wide "no-man\'s-land" street.',
    utilityExplanation:
      'Maximizing margin width minimizes theoretical generalization error. Outliers are handled gracefully via soft-margin slack variables governed by parameter C.',
    workingConditions: [
      'Binary classification targets encoded as {-1, +1}.',
      'Features standardized or normalized to comparable scales.',
      'Sufficient samples to define representative boundary vectors.',
    ],
    whenAnotherIsBetter:
      'When calibrated class probabilities are strictly needed, use Logistic Regression. When dataset size n exceeds 100,000 samples, use Stochastic Gradient Descent linear models or LightGBM.',
    analogyOrRealLifeExample:
      'Building a fence between two rival neighbors: you don\'t place the fence 1 inch from one neighbor\'s porch just because it technically separates the lots; you place it directly down the middle to maximize space and minimize friction.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Training dataset of feature vectors x ∈ ℝᵈ with bipolar labels y ∈ {-1, +1}.',
    expectedOutput: 'Weight vector w ∈ ℝᵈ and scalar bias b ∈ ℝ defining decision hyperplane w·x + b = 0.',
    constraints: ['Regularization parameter C > 0', 'Features must be finite real numbers', 'At least one sample from each class (+1 and -1)'],
    preconditions: ['Continuous features should be standardized (mean=0, variance=1) for isotropic margin geometry'],
    specialCases: ['Single-class data (cannot train)', 'Zero variance features', 'Collinear data points'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Unscaled features produce skewed margins dominated by high-magnitude dimensions. Single-class datasets return an error step.',
  },
  coreIntuition: {
    simpleExplanation:
      'Imagine drawing a road between two clusters of houses (red and blue). You want to make the road as wide as possible without paving over any houses. The road edges are the margin lines, the center line is the decision boundary, and the houses touching the road shoulders are the support vectors.',
    keyDrivingDecision:
      'Minimizing ½||w||² subject to margin violation penalties: finding the weight vector with smallest magnitude (widest street) that classifies training points with minimal margin encroachment.',
    whyRepeatedOperationWorks:
      'Subgradient descent iteratively penalizes weights whenever a sample encroaches within the unit margin (y·(w·x+b) < 1), gradually rotating and shifting the hyperplane until the regularized trade-off is balanced.',
    paradigmSpecificDetail:
      'Primal Convex Optimization with Hinge Loss: guarantees convergence to the global minimum without local optima.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function trainLinearSVM(X, y, C, learningRate, epochs):',
      '  w := initializeWeights(d), b := 0',
      '  for epoch from 1 to epochs do:',
      '    lr_t := learningRate / (1 + 0.05 * epoch)',
      '    subgrad_w := w  // regularization gradient from 0.5*||w||^2',
      '    subgrad_b := 0',
      '    for each sample (x_i, y_i) in dataset do:',
      '      functional_margin := y_i * (w · x_i + b)',
      '      if functional_margin < 1.0 then  // margin violator or support vector',
      '        subgrad_w := subgrad_w - C * y_i * x_i',
      '        subgrad_b := subgrad_b - C * y_i',
      '    w := w - lr_t * subgrad_w',
      '    b := b - lr_t * subgrad_b',
      '  return { w, b, marginWidth: 2 / norm(w) }',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'w := initializeWeights(d), b := 0', explanation: 'Initialize weight vector and bias in feature space.' },
      { lineIndex: 3, lineText: 'lr_t := learningRate / (1 + 0.05 * epoch)', explanation: 'Decay learning rate over time to guarantee subgradient convergence.' },
      { lineIndex: 4, lineText: 'subgrad_w := w', explanation: 'Derivative of ½||w||² regularizer with respect to w.' },
      { lineIndex: 7, lineText: 'functional_margin := y_i * (w · x_i + b)', explanation: 'Evaluate margin condition: points with margin >= 1 are safe.' },
      { lineIndex: 8, lineText: 'if functional_margin < 1.0 then...', explanation: 'Hinge loss is non-zero only for points within or violating the margin.' },
      { lineIndex: 11, lineText: 'w := w - lr_t * subgrad_w', explanation: 'Update weights in opposite direction of total subgradient.' },
    ],
    terminationCondition: 'Terminates after specified epochs or when change in objective value drops below convergence tolerance.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function runSVM(customPoints?: DataPoint2D[], config?: SVMConfig): AlgorithmStep[]',
    code: `export function computeHingeLoss(yTrue: number, decisionScore: number): number {
  return Math.max(0, 1 - yTrue * decisionScore);
}

export function computeSVMObjective(
  weights: [number, number],
  bias: number,
  points: { x: number; y: number; label?: number }[],
  c: number
): { regLoss: number; totalHingeLoss: number; totalObjective: number } {
  const normSq = weights[0] ** 2 + weights[1] ** 2;
  const regLoss = 0.5 * normSq;

  let totalHingeLoss = 0;
  for (const p of points) {
    const rawLabel = Number(p.label ?? 1);
    const y = rawLabel === 0 ? -1 : rawLabel === -1 ? -1 : 1;
    const score = weights[0] * p.x + weights[1] * p.y + bias;
    totalHingeLoss += computeHingeLoss(y, score);
  }

  const totalObjective = regLoss + c * totalHingeLoss;
  return { regLoss, totalHingeLoss, totalObjective };
}

export function predictSVM(
  weights: [number, number],
  bias: number,
  point: { x: number; y: number }
): { decisionScore: number; predictedClass: number; marginDistance: number } {
  const decisionScore = weights[0] * point.x + weights[1] * point.y + bias;
  const predictedClass = decisionScore >= 0 ? 1 : -1;
  const norm = Math.sqrt(weights[0] ** 2 + weights[1] ** 2);
  const marginDistance = norm > 1e-7 ? decisionScore / norm : 0;
  return { decisionScore, predictedClass, marginDistance };
}`,
    inputValidation: 'Validates at least 2 samples exist, verifies finite numbers, and enforces presence of both positive and negative classes.',
    variables: [
      { name: 'weights', type: '[number, number]', purpose: 'Normal vector perpendicular to the separating hyperplane' },
      { name: 'bias', type: 'number', purpose: 'Scalar offset determining hyperplane distance from coordinate origin' },
      { name: 'c', type: 'number', purpose: 'Soft-margin regularization trade-off between margin width and violation penalty' },
      { name: 'decisionScore', type: 'number', purpose: 'Linear projection value w·x + b whose sign determines class' },
    ],
    lineByLine: [
      { line: 1, code: 'computeHingeLoss(...)', explanation: 'Calculates max(0, 1 - y * score).' },
      { line: 10, code: 'const regLoss = 0.5 * normSq;', explanation: 'Penalizes large weight norms to maximize geometric margin 2/||w||.' },
      { line: 20, code: 'totalHingeLoss += computeHingeLoss(y, score);', explanation: 'Sums slack penalties for all margin encroachers.' },
      { line: 31, code: 'const marginDistance = decisionScore / norm;', explanation: 'Calculates true geometric perpendicular distance to hyperplane.' },
    ],
    returnExplanation: 'Returns full snapshot steps with weights, bias, boundary geometry, and support vector candidate markers.',
    commonBugs: [
      'Using {0, 1} labels directly instead of bipolar {-1, +1}, causing positive class margin to fail.',
      'Omitting feature normalization, resulting in subgradient oscillation and skewed margin lines.',
      'Dividing by zero when norm ||w|| is approximately 0 during initialization.',
    ],
    edgeCaseHandling: [
      'Vertical boundary detection when w_2 ≈ 0 to prevent division by zero in slope calculation.',
      'Divergence guard that terminates if objective value exceeds numerical bounds.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Because the primal SVM objective J(w,b) is a sum of a convex quadratic function (½||w||²) and a sum of convex piecewise-linear functions (hinge loss), the entire objective function is strictly convex. Subgradient descent with a diminishing step size is mathematically proven to converge to the global minimum, guaranteeing that no local optima exist.',
    formalProof: {
      method: 'Convex Loss Minimization',
      invariantOrClaim: 'The primal objective function J(w,b) = ½||w||² + C Σ max(0, 1 - y_i(w·x_i + b)) is strictly convex in (w, b).',
      initialization: 'Let (w_0, b_0) be initial finite parameter values. The objective value J_0 is finite and bounded below by 0.',
      maintenance: 'The subgradient g_t ∈ ∂J(w_t, b_t) satisfies the subgradient inequality J(u) >= J(v) + g^T(u - v) for all parameter vectors u, v. With step size sequence satisfying Σ lr_t = ∞ and Σ lr_t² < ∞, subgradient updates w_{t+1} = w_t - lr_t g_t monotonically decrease distance to the optimal set.',
      termination: 'As t -> ∞, the sequence of objectives converges to inf_{(w,b)} J(w,b) within arbitrary ε > 0.',
      conclusion: 'Linear SVM subgradient descent is guaranteed to find the global soft-margin optimum.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(n · d)', explanation: 'Single epoch subgradient evaluation when classes are cleanly separated.', condition: 'Linearly separable data with small C.' },
    averageCase: { complexity: 'O(epochs · n · d)', explanation: 'Fixed epoch subgradient descent over n samples of d dimensions.', condition: 'Standard soft-margin optimization.' },
    worstCase: { complexity: 'O(n³)', explanation: 'Exact quadratic programming interior-point solvers when almost all points are support vectors.', condition: 'Heavily overlapping noisy datasets.' },
    auxiliarySpace: { complexity: 'O(d)', explanation: 'Memory required to store d weights and 1 bias scalar during training and inference.' },
    totalMemory: 'O(n · d) for dataset storage + O(d) for model parameters.',
    bigOExplanation: 'Prediction is O(d) vector dot product w·x + b, taking nanoseconds per inference sample.',
    scalingBehavior: 'Linear in sample size n for subgradient descent; scales well to high dimension d.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Theoretically sound maximum margin guarantees against overfitting.',
      'Convex optimization: no local minima traps like in deep neural networks.',
      'High-dimensional effectiveness: performs well when d > n.',
      'Sparsity: only support vectors dictate the decision boundary.',
    ],
    limitations: [
      'Sensitive to unscaled features; standardization is strictly mandatory.',
      'No native posterior probability outputs without Platt scaling.',
      'Subgradient descent requires hyperparameter tuning for learning rate and C.',
    ],
    memoryTradeOffs: [
      'Primal linear SVM requires only d float parameters, making it extremely lightweight.',
    ],
    poorChoiceScenarios: [
      'Massive web-scale datasets with hundreds of millions of rows where linear models like logistic regression with simple SGD train faster.',
      'Multi-class problems with hundreds of output categories.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Logistic Regression',
      timeComplexity: 'O(epochs · n · d)',
      spaceComplexity: 'O(d)',
      stabilityOrType: 'Probabilistic Maximum Likelihood Classifier',
      similarities: 'Both find linear hyperplanes separating binary classes.',
      differences: 'Logistic regression minimizes log-loss across all samples; SVM minimizes hinge loss on margin encroachers.',
      whenToPreferThis: 'When maximum geometric margin buffer and outlier tolerance are desired.',
      whenToPreferAlternative: 'When well-calibrated class probabilities P(y=1|x) are needed.',
    },
    {
      algorithm: 'Decision Trees',
      timeComplexity: 'O(d · n log n) training vs O(epochs · n · d) in SVM',
      spaceComplexity: 'O(nodes) vs O(d)',
      stabilityOrType: 'Non-parametric Recursive Partitioning',
      similarities: 'Both solve supervised classification tasks.',
      differences: 'Decision trees create axis-aligned stair-step splits; SVM creates continuous angled hyperplanes.',
      whenToPreferThis: 'When continuous linear combinations or diagonal separations best divide the classes.',
      whenToPreferAlternative: 'When human-readable if-then decision flowchart rules are mandatory.',
    },
  ],
  commonMistakes: [
    {
      title: 'Forgetting to Standardize Features',
      misconception: 'Assuming SVM automatically handles features with vastly different scales (e.g. Income [0, 100000] vs Age [0, 100]).',
      badCodeOrApproach: 'Passing raw unscaled tabular columns directly into SVM optimizer.',
      correctApproach: 'Always apply StandardScaler (z-score normalization) before training so Euclidean distance ||w|| is isotropic.',
    },
    {
      title: 'Encoding Labels as {0, 1} Instead of {-1, +1}',
      misconception: 'Treating SVM labels identically to Logistic Regression binary cross-entropy.',
      badCodeOrApproach: 'Computing functional margin as y * (w · x + b) with y ∈ {0, 1}, which zeros out negative class penalties.',
      correctApproach: 'Always normalize labels: y = raw === 0 ? -1 : raw === -1 ? -1 : 1.',
    },
  ],
  exercises: [
    {
      id: 'svm-ex-1',
      type: 'conceptual',
      question: 'In a 2D feature space, the learned SVM hyperplane is 3x₁ + 4x₂ - 10 = 0. What is the norm ||w|| and the margin width 2/||w||?',
      options: [
        '||w|| = 5, Margin Width = 0.4',
        '||w|| = 7, Margin Width = 0.28',
        '||w|| = 25, Margin Width = 0.08',
        '||w|| = 5, Margin Width = 10.0',
      ],
      correctIndex: 0,
      explanation:
        'The weight vector is w = [3, 4]. Its Euclidean norm is ||w|| = √(3² + 4²) = √(9 + 16) = √25 = 5. The total margin width is 2 / ||w|| = 2 / 5 = 0.4.',
    },
    {
      id: 'svm-ex-2',
      type: 'challenge',
      question: 'What is the effect of decreasing the regularization parameter C toward zero (e.g. C = 0.001)?',
      options: [
        'Prioritizes a wide margin width (small ||w||), tolerating more training classification errors (higher bias, lower variance)',
        'Forces the model to achieve 100% training accuracy with zero margin violations',
        'Turns off all regularization',
        'Causes weights to diverge to infinity',
      ],
      correctIndex: 0,
      explanation:
        'Small C diminishes the penalty on hinge loss, allowing the optimizer to prioritize minimizing ½||w||² (maximizing margin width 2/||w||). This yields a wider street that tolerates training errors, increasing bias and preventing overfitting.',
    },
  ],
  summary: {
    coreIdea: 'Finds the maximum-margin linear hyperplane w·x + b = 0 by minimizing regularized weight norm and hinge loss on margin encroachers.',
    keyConditions: ['Labels encoded as bipolar {-1, +1}', 'Features standardized', 'Regularization C tuned to balance margin width vs slack penalty'],
    complexitySummary: { time: 'O(epochs · n · d) primal training; O(d) inference', space: 'O(d) parameters' },
    whenToUse: 'When robust maximum-margin linear boundaries are needed in medium-to-high dimensional spaces.',
    prerequisites: ['Euclidean Norm', 'Linear Hyperplanes', 'Convex Optimization'],
    nextSteps: [
      { id: 'logistic-regression', name: 'Logistic Regression', reason: 'Compare geometric margin optimization with probabilistic cross-entropy likelihood.' },
      { id: 'decision-tree', name: 'Decision Tree', reason: 'Compare continuous linear hyperplanes with axis-aligned orthogonal partitions.' },
    ],
  },
};
