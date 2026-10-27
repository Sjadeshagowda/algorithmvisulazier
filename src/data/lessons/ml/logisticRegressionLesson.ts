import type { AlgorithmLesson } from '../../../types/algorithm';

export const logisticRegressionLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A foundational supervised classification algorithm that estimates the probability of a binary categorical outcome by passing a linear combination of input features through the non-linear sigmoid activation function.',
  mainPurpose:
    'To classify binary instances (0 or 1, False or True) and output calibrated confidence probabilities based on input features.',
  whatIsIt: {
    overview:
      'Despite the word "regression" in its historical name, Logistic Regression is a classification algorithm. While linear regression fits a straight line with unbounded outputs (-∞ to +∞), logistic regression maps any real-valued linear combination z = w·x + b into a bounded probability between 0 and 1 using the standard sigmoid function σ(z) = 1 / (1 + e⁻ᶻ). A decision boundary threshold (typically 0.5) then assigns instances to class 0 or class 1.',
    smallExample:
      'Predicting college admission based on test score: A student scoring 85 has z = 0.1·85 - 7 = 1.5. Passing through sigmoid: σ(1.5) = 1 / (1 + e⁻¹·⁵) ≈ 0.818 (81.8% probability of admission). Since 81.8% ≥ 50%, the model predicts "Admitted" (Class 1).',
  },
  whyUseIt: {
    problemSolved:
      'Predicting discrete outcomes like disease diagnosis (Sick vs Healthy), email spam detection (Spam vs Ham), and financial loan default (Default vs Repaid) while providing true probability scores.',
    whyItMatters:
      'Unlike arbitrary heuristic rules, logistic regression directly models the posterior log-odds ln(p / (1 - p)) = w·x + b. The weights tell practitioners exactly how the odds of an event multiply per unit change in each feature.',
    whenToUse: [
      'The target variable is binary (0 or 1, Yes or No).',
      'The classes are approximately linearly separable in feature space.',
      'Calibrated probability outputs are needed (e.g. risk assessment, cost-sensitive decision thresholds).',
      'High interpretability is legally or operationally required (e.g. credit approvals, medical triage).',
    ],
    whenToAvoid: [
      'The target variable is continuous (use Linear Regression).',
      'Classes are non-linearly separable (e.g. concentric circles or XOR patterns without kernel expansion).',
      'Complex multi-modal distributions where ensemble tree models (Random Forest, XGBoost) perform significantly better.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Credit Card Fraud Detection',
      description:
        'Estimating the probability that a banking transaction is fraudulent based on transaction amount, distance from home, and time elapsed since previous charge.',
      educationalVsProductionNote:
        'Frequently used as a high-throughput, low-latency initial screening model before passing high-risk alerts to downstream forensic systems.',
    },
    {
      title: 'Clinical Disease Diagnosis',
      description:
        'Predicting whether a patient has diabetes based on fasting blood glucose, age, BMI, and family history.',
      educationalVsProductionNote:
        'Standard medical risk scoring tool (e.g. Framingham Heart Study risk score) where each coefficient directly translates into an Odds Ratio.',
    },
    {
      title: 'Customer Churn Prediction',
      description:
        'Subscription services (e.g. streaming platforms, SaaS) estimating the likelihood of a customer cancelling their account next month based on platform engagement.',
      educationalVsProductionNote:
        'Standard retention marketing model used to trigger targeted retention discounts for at-risk accounts.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Compute Linear Combination (Logits)',
      description:
        'Calculate the net input score z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b, representing the unconstrained log-odds.',
    },
    {
      stepNumber: 2,
      title: 'Apply Sigmoid Activation Function',
      description:
        'Squash the score z into an open probability interval (0, 1) using σ(z) = 1 / (1 + e⁻ᶻ), yielding p = P(y = 1 | x).',
    },
    {
      stepNumber: 3,
      title: 'Evaluate Binary Cross-Entropy Loss',
      description:
        'Quantify error using Log Loss: J(w, b) = - (1/n) Σ [yᵢ ln(pᵢ) + (1 - yᵢ) ln(1 - pᵢ)], which penalizes confident wrong predictions with near-infinite loss.',
    },
    {
      stepNumber: 4,
      title: 'Update Parameters via Gradient Descent',
      description:
        'Adjust weights in the direction of steepest loss descent: w := w - η (1/n) Xᵀ(p - y) and b := b - η (1/n) Σ (pᵢ - yᵢ).',
    },
  ],
  workedExample: {
    datasetDescription:
      '3 samples with single feature x and binary label y: (1, 0), (2, 0), (4, 1). Initial weight w = 0.5, b = -1.0, learning rate η = 0.5.',
    initialState: 'w = 0.5, b = -1.0. Decision threshold = 0.5 (boundary at z = 0 => x = -b/w = 2.0).',
    steps: [
      {
        stepNumber: 1,
        operation: 'Forward pass: compute z and predicted probabilities',
        stateDisplay: 'x=1: z=-0.5, p=0.378 (y=0); x=2: z=0.0, p=0.500 (y=0); x=4: z=1.0, p=0.731 (y=1)',
        explanation: 'Applying σ(z) = 1/(1 + e⁻ᶻ) gives predicted probabilities of belonging to Class 1.',
        whyNecessary: 'Probability predictions are required to compute loss and prediction errors.',
        beforeState: 'w = 0.5, b = -1.0',
        afterState: 'p = [0.378, 0.500, 0.731]',
        nextAction: 'Compute individual error residuals e_i = p_i - y_i.',
        intermediateResult: 'Probabilities generated.',
      },
      {
        stepNumber: 2,
        operation: 'Compute prediction errors (p - y)',
        stateDisplay: 'e₁ = 0.378 - 0 = +0.378; e₂ = 0.500 - 0 = +0.500; e₃ = 0.731 - 1 = -0.269',
        explanation: 'Notice that false positives produce positive errors, while false negatives produce negative errors.',
        whyNecessary: 'Prediction errors directly weight the gradients for parameter updates.',
        beforeState: 'Probabilities available',
        afterState: 'Errors: [+0.378, +0.500, -0.269]',
        nextAction: 'Compute gradients ∂J/∂w and ∂J/∂b.',
        intermediateResult: 'Mean error for bias: (+0.378 + 0.500 - 0.269)/3 = +0.203',
      },
      {
        stepNumber: 3,
        operation: 'Calculate gradients',
        stateDisplay: '∂J/∂w = (1/3)[(0.378)(1) + (0.500)(2) + (-0.269)(4)] = (1/3)[0.378 + 1.000 - 1.076] = 0.101. ∂J/∂b = 0.203.',
        explanation: 'The positive gradient shows that increasing w or b increases loss, so we must decrease both.',
        whyNecessary: 'Indicates the direction of steepest increase in loss.',
        beforeState: 'Gradients computed: grad_w = 0.101, grad_b = 0.203',
        afterState: 'Parameter updates ready with η = 0.5',
        nextAction: 'Apply gradient descent step: θ := θ - η · grad',
        intermediateResult: 'Steps: Δw = -0.0505, Δb = -0.1015',
      },
      {
        stepNumber: 4,
        operation: 'Update parameters',
        stateDisplay: 'New w = 0.5 - 0.5(0.101) = 0.4495; New b = -1.0 - 0.5(0.203) = -1.1015',
        explanation: 'The decision boundary shifts to x = -(-1.1015)/0.4495 ≈ 2.45, reducing the probability for sample x=2.',
        whyNecessary: 'Reduces the cross-entropy loss for the next epoch.',
        beforeState: 'Old w = 0.5, b = -1.0',
        afterState: 'Updated w = 0.45, b = -1.10',
        nextAction: 'Continue iterating until convergence.',
        intermediateResult: 'Epoch 1 complete; loss decreased.',
      },
    ],
    finalState: 'Model successfully updated; boundary shifts towards the optimal linear separating threshold.',
  },
  advantages: [
    'Outputs well-calibrated probabilities rather than raw unscaled decision scores.',
    'Fast to train and exceptionally fast during inference: requires only a dot product and scalar exponentiation.',
    'Interpretable coefficients: exponentiated weights eʷ directly yield Odds Ratios.',
    'Convex objective function: Binary Cross-Entropy is guaranteed to have a unique global minimum.',
  ],
  limitations: [
    'Can only learn linear decision boundaries in feature space.',
    'Underperforms when features exhibit complex non-linear interactions.',
    'Suffers from "complete separation": if classes are perfectly separable, weights explode toward infinity without regularization.',
    'Sensitive to high multicollinearity among predictor variables.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(n · d · epochs) when optimizing using iterative batch gradient descent.',
    averageCaseMeaning:
      'O(n · d · epochs); inference requires O(d) operations per query sample.',
    worstCaseMeaning:
      'O(n · d · max_epochs) if the learning rate is chosen poorly or features are unnormalized.',
    spaceComplexityMeaning:
      'O(d) auxiliary memory to store weights w and scalar bias b.',
  },
  relatedAlgorithms: [
    {
      name: 'Linear Regression',
      comparison:
        'Uses an identity activation function for continuous targets instead of a non-linear sigmoid for binary classification.',
    },
    {
      name: 'Support Vector Machines (SVM)',
      comparison:
        'Maximizes the geometric margin between classes using Hinge Loss instead of probabilistic log-likelihood.',
    },
    {
      name: 'Softmax Regression (Multinomial Logistic)',
      comparison:
        'Generalizes binary logistic regression to multi-class classification (K > 2) using the normalized exponential softmax function.',
    },
  ],
  quiz: [
    {
      question: 'What is the range of outputs produced by the standard sigmoid activation function σ(z)?',
      options: ['[-1, 1]', '[0, 1]', '(-∞, +∞)', '[0, +∞)'],
      correctIndex: 1,
      explanation:
        'The sigmoid function σ(z) = 1 / (1 + e⁻ᶻ) strictly compresses any real number z into the open interval (0, 1), making it ideal for probabilities.',
      optionExplanations: [
        '[-1, 1] is the range of the hyperbolic tangent (tanh) activation function.',
        'Correct! σ(z) maps (-∞, +∞) strictly into (0, 1).',
        '(-∞, +∞) is the unbounded range of linear regression.',
        '[0, +∞) is the range of ReLU (Rectified Linear Unit).',
      ],
    },
    {
      question: 'Why is Mean Squared Error (MSE) generally avoided as the loss function for Logistic Regression?',
      options: [
        'MSE is too fast to compute',
        'Combining MSE with the sigmoid function creates a non-convex surface plagued by local minima',
        'MSE cannot handle negative numbers',
        'MSE only works on 3D data',
      ],
      correctIndex: 1,
      explanation:
        'Passing sigmoid predictions through MSE creates a non-convex loss function with flat plateau regions and multiple local traps. Binary Cross-Entropy guarantees a strictly convex bowl.',
      optionExplanations: [
        'Speed is not an issue; loss landscape convexity is the issue.',
        'Correct! Log-loss preserves strict convexity when coupled with the sigmoid link function.',
        'MSE handles negative errors through squaring.',
        'MSE works in arbitrary dimensions.',
      ],
    },
    {
      question: 'Where is the linear decision boundary located in binary logistic regression with default threshold 0.5?',
      options: [
        'Where z = w·x + b = 0',
        'Where z = w·x + b = 1',
        'Where the slope w equals zero',
        'Where x equals the mean of y',
      ],
      correctIndex: 0,
      explanation:
        'When z = 0, σ(0) = 1 / (1 + e⁰) = 1 / 2 = 0.5. Hence the boundary separating class 0 from class 1 is the hyperplane w·x + b = 0.',
      optionExplanations: [
        'Correct! σ(0) = 0.5, so the decision hyperplane is exactly where the logit z = 0.',
        'At z = 1, σ(1) ≈ 0.731, which is well above the 50% threshold.',
        'The slope w defines the angle of the boundary, not its location.',
        'The feature x and label y have different physical units.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Named after the "logistic curve" introduced by Pierre François Verhulst in 1838 to model population growth constraints.',
    problemSolved:
      'Solves binary classification problems by predicting the probability that a given sample belongs to the positive class.',
    problemNotSolved:
      'Does not natively model multi-class problems without One-vs-Rest (OvR) or Softmax generalization, nor arbitrary non-linear boundaries.',
    whyLearn:
      'Logistic regression is the gateway to neural networks: a single artificial neuron with a sigmoid activation is literally a logistic regression model.',
    prerequisites: ['Linear Regression', 'Sigmoid & Exponential functions', 'Partial Derivatives & Chain Rule'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can we classify binary outcomes and quantify our confidence when raw linear regression produces nonsense predictions like -0.4 or +1.7?',
    naiveApproachInefficiency:
      'Fitting linear regression to 0/1 labels produces outputs outside [0, 1] and is severely skewed by outliers located far away from the boundary.',
    coreIdeaUsed:
      'Apply the monotonic sigmoid function to squash linear scores into valid probabilities, optimized via maximum likelihood estimation (Log Loss).',
    utilityExplanation:
      'Guarantees all outputs lie strictly within (0, 1) and provides a convex loss landscape with robust statistical properties.',
    workingConditions: [
      'Binary classification label y ∈ {0, 1}.',
      'Independent training observations.',
      'Little to no multicollinearity among input variables.',
    ],
    whenAnotherIsBetter:
      'Use Decision Trees or Random Forests when features have non-linear relationships or complex threshold interactions.',
    analogyOrRealLifeExample:
      'Like a dimmable light switch: rather than snapping abruptly between OFF and ON, the sigmoid knob turns smoothly, expressing degree of brightness.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Feature matrix X of shape (n, d) and binary ground-truth label vector y ∈ {0, 1}^n.',
    expectedOutput: 'Weight vector w of size d and scalar bias b, producing predicted probabilities p = P(y=1|x).',
    constraints: ['y must contain only two distinct classes (e.g. 0 and 1)', 'Data should not be perfectly separable without L2 regularization'],
    preconditions: ['Continuous features should be standardized (mean=0, std=1) to ensure uniform gradient descent convergence'],
    specialCases: ['Imbalanced classes (requires weighted loss or threshold tuning)', 'Linearly inseparable data'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Unscaled features cause elongated loss valleys and slow zig-zag convergence; complete separation causes weights to diverge toward infinity.',
  },
  coreIntuition: {
    simpleExplanation:
      'Compute a linear score indicating how strongly evidence favors Class 1. Then pass this score through an S-shaped curve that translates positive evidence into high probabilities and negative evidence into near-zero probabilities.',
    keyDrivingDecision:
      'Using the logit function ln(p / (1 - p)) = w·x + b ensures that probabilities are constrained to (0, 1) while parameters remain unconstrained real numbers.',
    whyRepeatedOperationWorks:
      'Gradient descent repeatedly computes prediction errors e = p - y. If p > y, weights decrease; if p < y, weights increase.',
    paradigmSpecificDetail:
      'Supervised Discriminative Probabilistic Classifier: directly estimates P(y|x) without modeling the generative prior distribution P(x).',
  },
  pseudocodeWalkthrough: {
    code: [
      'function logisticRegression(X, y, lr, epochs):',
      '  w := zeros(d), b := 0',
      '  for epoch from 1 to epochs do:',
      '    z := X * w + b',
      '    p := 1 / (1 + exp(-z))',
      '    error := p - y',
      '    grad_w := (1 / n) * X^T * error',
      '    grad_b := (1 / n) * sum(error)',
      '    w := w - lr * grad_w',
      '    b := b - lr * grad_b',
      '  return { w, b }',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'w := zeros(d), b := 0', explanation: 'Initialize weights and bias to zeros.' },
      { lineIndex: 3, lineText: 'z := X * w + b', explanation: 'Compute linear logit scores for all training samples.' },
      { lineIndex: 4, lineText: 'p := 1 / (1 + exp(-z))', explanation: 'Apply sigmoid activation to obtain probability vector p.' },
      { lineIndex: 5, lineText: 'error := p - y', explanation: 'Compute residuals (difference between predicted probabilities and actual labels).' },
      { lineIndex: 6, lineText: 'grad_w := (1 / n) * X^T * error', explanation: 'Calculate gradient of binary cross-entropy with respect to weights.' },
      { lineIndex: 7, lineText: 'grad_b := (1 / n) * sum(error)', explanation: 'Calculate gradient of binary cross-entropy with respect to bias.' },
      { lineIndex: 8, lineText: 'w := w - lr * grad_w', explanation: 'Update weights in negative gradient direction.' },
      { lineIndex: 9, lineText: 'b := b - lr * grad_b', explanation: 'Update bias in negative gradient direction.' },
    ],
    terminationCondition: 'Loop completes specified epochs or terminates early when gradient magnitude falls below ε = 1e-4.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function trainLogisticRegression(points: {x: number, y: number, label: number}[], lr: number, epochs: number)',
    code: `export function trainLogisticRegression(
  points: { x: number; y: number; label: number }[],
  lr = 0.01,
  epochs = 50
) {
  const n = points.length;
  let w1 = 0, w2 = 0, b = 0;

  function sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z))));
  }

  for (let ep = 0; ep < epochs; ep++) {
    let gradW1 = 0, gradW2 = 0, gradB = 0;

    for (const p of points) {
      const z = w1 * p.x + w2 * p.y + b;
      const prob = sigmoid(z);
      const error = prob - (p.label ?? 0);

      gradW1 += error * p.x;
      gradW2 += error * p.y;
      gradB += error;
    }

    w1 -= (lr / n) * gradW1;
    w2 -= (lr / n) * gradW2;
    b -= (lr / n) * gradB;
  }

  return { w1, w2, b };
}`,
    inputValidation: 'Clamps sigmoid exponent between -20 and +20 to avoid floating-point overflow/underflow NaN errors.',
    variables: [
      { name: 'w1, w2', type: 'number', purpose: 'Learned weights for input features x and y' },
      { name: 'b', type: 'number', purpose: 'Learned bias offset' },
      { name: 'prob', type: 'number', purpose: 'Calculated sigmoid probability P(y=1|x)' },
      { name: 'error', type: 'number', purpose: 'Residual difference prob - label' },
      { name: 'gradW1, gradW2', type: 'number', purpose: 'Weight gradient accumulators' },
    ],
    lineByLine: [
      { line: 6, code: 'function sigmoid(z) { ... }', explanation: 'Numerically stable sigmoid implementation.' },
      { line: 14, code: 'const z = w1 * p.x + w2 * p.y + b;', explanation: 'Compute linear log-odds.' },
      { line: 15, code: 'const prob = sigmoid(z);', explanation: 'Compress score into (0, 1) probability.' },
      { line: 16, code: 'const error = prob - (p.label ?? 0);', explanation: 'Compute error term for gradient calculation.' },
      { line: 23, code: 'w1 -= (lr / n) * gradW1;', explanation: 'Perform gradient descent update.' },
    ],
    returnExplanation: 'Returns learned weights and bias defining the linear separating boundary w1·x + w2·y + b = 0.',
    commonBugs: [
      'Using Math.exp(-z) without clipping, resulting in Infinity and NaN.',
      'Forgetting to divide gradients by n (sample size), making the step size dependent on dataset size.',
      'Using labels like -1 and +1 instead of 0 and 1 with binary cross-entropy formulas.',
    ],
    edgeCaseHandling: [
      'Clamps exp(-z) inputs to [-20, 20] preventing NaN overflow.',
      'Handles zero-magnitude errors when predictions are exact.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Binary Cross-Entropy Loss J(w) = -Σ [y ln(p) + (1-y) ln(1-p)] is strictly convex with respect to parameters w and b. This guarantees that gradient descent will never get stuck in a bad local minimum and will always converge to the unique global optimum.',
    formalProof: {
      method: 'Mathematical Optimization Convergence',
      invariantOrClaim: 'The gradient of Binary Cross-Entropy with sigmoid activation simplifies cleanly to ∇J = (1/n) Xᵀ(p - y), which is Lipschitz continuous and convex.',
      initialization: 'Let p_i = σ(wᵀx_i + b). Note that the derivative of sigmoid is dσ/dz = σ(z)(1 - σ(z)) = p(1 - p).',
      maintenance: 'Applying the chain rule: ∂J/∂w_j = ∂J/∂p · ∂p/∂z · ∂z/∂w_j = [-(y/p) + (1-y)/(1-p)] · [p(1-p)] · x_j = (-y(1-p) + (1-y)p) · x_j = (p - y) · x_j.',
      termination: 'The second derivative (Hessian) H = (1/n) XᵀDX where D = diag(p_i(1-p_i)). Because 0 < p_i < 1, D is strictly positive, making H positive semi-definite.',
      conclusion: 'Since H ≥ 0 everywhere, J is globally convex and gradient descent is mathematically proven to converge to the global minimum.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(n · d · epochs)', explanation: 'Full batch gradient descent evaluates all n samples each epoch.', condition: 'Standard gradient descent training.' },
    averageCase: { complexity: 'O(n · d · epochs)', explanation: 'Vectorized matrix multiplication over d features and n samples.', condition: 'Typical classification dataset.' },
    worstCase: { complexity: 'O(n · d · max_epochs)', explanation: 'Slow convergence if learning rate is excessively small.', condition: 'Ill-conditioned features.' },
    auxiliarySpace: { complexity: 'O(d)', explanation: 'Stores d weights and 1 bias scalar in memory.' },
    totalMemory: 'O(n · d) for the feature matrix.',
    bigOExplanation: 'Inference runtime is O(d) — merely computing a dot product and scalar exponentiation.',
    scalingBehavior: 'Scales linearly with number of samples n and dimensions d; ideal for large-scale production deployments.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Outputs genuine calibrated probabilities rather than uncalibrated heuristic scores.',
      'Extremely fast inference suitable for real-time systems (sub-millisecond evaluation).',
      'Resistant to overfitting in low dimensions; easily regularized with L1 (Lasso) or L2 (Ridge) penalties.',
    ],
    limitations: [
      'Cannot model non-linear decision boundaries without manual feature transformations.',
      'Prone to severe coefficient inflation when classes are perfectly linearly separable (requires L2 penalty).',
      'Assumes independent features; highly correlated features degrade coefficient reliability.',
    ],
    memoryTradeOffs: [
      'Minimal memory requirement: only stores d weight coefficients and 1 bias.',
    ],
    poorChoiceScenarios: [
      'Complex image classification or speech recognition.',
      'Datasets with intricate non-linear decision boundaries.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Linear Regression',
      timeComplexity: 'O(n · d + d³)',
      spaceComplexity: 'O(d)',
      stabilityOrType: 'Regression Model',
      similarities: 'Both compute linear combinations of features w·x + b.',
      differences: 'Linear regression predicts continuous targets; logistic regression applies sigmoid for classification.',
      whenToPreferThis: 'When the target is binary categorical (0 vs 1).',
      whenToPreferAlternative: 'When predicting continuous monetary, physical, or numerical values.',
    },
    {
      algorithm: 'Support Vector Machine (Linear SVM)',
      timeComplexity: 'O(n² · d)',
      spaceComplexity: 'O(d)',
      stabilityOrType: 'Max-Margin Classifier',
      similarities: 'Both find a linear separating hyperplane w·x + b = 0.',
      differences: 'SVM maximizes geometric margin using hinge loss; Logistic Regression maximizes likelihood using log loss.',
      whenToPreferThis: 'When calibrated class probabilities P(y|x) are needed.',
      whenToPreferAlternative: 'When maximum margin separation and outlier immunity are prioritized.',
    },
  ],
  commonMistakes: [
    {
      title: 'Treating Logistic Regression as a Pure Numerical Regressor',
      misconception: 'Attempting to predict continuous housing prices or stock valuations with Logistic Regression.',
      correctApproach: 'Logistic Regression is exclusively a classification algorithm for discrete class labels.',
    },
    {
      title: 'Forgetting Feature Normalization',
      misconception: 'Running gradient descent with features on drastically different scales (e.g. Salary in $100k vs Age in 20-60).',
      badCodeOrApproach: 'Training without standardizing features.',
      correctApproach: 'Always standardize features (Z-score normalization) so gradients descend uniformly across all dimensions.',
    },
  ],
  exercises: [
    {
      id: 'logr-ex-1',
      type: 'conceptual',
      question: 'What is the predicted probability σ(z) when the logit z = w·x + b is equal to 0?',
      options: ['0.0', '0.5 (50%)', '1.0', '-1.0'],
      correctIndex: 1,
      explanation: 'σ(0) = 1 / (1 + e⁰) = 1 / (1 + 1) = 0.5. At z = 0, the model is precisely on the 50/50 decision boundary.',
    },
    {
      id: 'logr-ex-2',
      type: 'challenge',
      question: 'What happens to the weights w of an unregularized logistic regression model if the training classes are perfectly linearly separable?',
      options: [
        'Weights diverge toward ±infinity trying to achieve probability 1.0 and 0.0',
        'Weights collapse to zero',
        'Loss increases with every epoch',
        'The learning rate automatically drops to zero',
      ],
      correctIndex: 0,
      explanation:
        'To reach loss = 0 on perfectly separated data, σ(z) must equal 1 or 0, which requires z → ±∞, driving weights toward infinity. L2 regularization prevents this.',
    },
  ],
  summary: {
    coreIdea: 'Predicts the probability of a binary outcome by passing linear feature combinations through the sigmoid function, optimized via log-loss.',
    keyConditions: ['Binary classification target', 'Approximately linear decision boundary', 'Features standardized for gradient descent'],
    complexitySummary: { time: 'O(n · d · epochs) training; O(d) inference', space: 'O(d) for weights' },
    whenToUse: 'Binary classification where probabilistic calibration and explainable feature odds ratios are essential.',
    prerequisites: ['Linear regression', 'Sigmoid function', 'Binary cross-entropy'],
    nextSteps: [
      { id: 'knn', name: 'K-Nearest Neighbors (KNN)', reason: 'Explore non-parametric classification with non-linear decision boundaries.' },
      { id: 'k-means', name: 'K-Means Clustering', reason: 'Transition to unsupervised grouping of data points without labels.' },
    ],
  },
};
