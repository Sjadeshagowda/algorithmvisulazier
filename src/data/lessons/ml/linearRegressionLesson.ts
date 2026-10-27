import type { AlgorithmLesson } from '../../../types/algorithm';

export const linearRegressionLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A supervised learning algorithm that models the linear relationship between a dependent target variable and one or more independent explanatory features by minimizing the sum of squared residuals.',
  mainPurpose:
    'To predict continuous numerical outcomes and quantify the direction and strength of relationships between measurable variables.',
  whatIsIt: {
    overview:
      'Linear Regression is the foundation of predictive statistical modeling and supervised machine learning. Given a dataset of pairs (x, y), it finds the optimal straight line ŷ = w·x + b (or hyperplane in multiple dimensions) that best fits the data points. The optimal parameters are chosen by minimizing an objective loss function called Mean Squared Error (MSE), either analytically via the closed-form Ordinary Least Squares (OLS) Normal Equation or iteratively via Gradient Descent.',
    smallExample:
      'Predicting house price from square footage: If house sizes are [1000, 1500, 2000] sq ft with prices [$200k, $300k, $400k], linear regression identifies the exact slope w = 0.2 ($200 per sq ft) and intercept b = 0, allowing an immediate prediction that an 1800 sq ft house is worth $360k.',
  },
  whyUseIt: {
    problemSolved:
      'Estimating future continuous values (e.g. sales, prices, temperatures, stock trends) and establishing the empirical effect of changing an input variable on the output variable.',
    whyItMatters:
      'Unlike opaque "black box" models like deep neural networks, Linear Regression provides 100% interpretability: every coefficient directly represents the marginal change in the target variable per unit increase in the input feature.',
    whenToUse: [
      'The target variable to predict is continuous and real-valued.',
      'A reasonably linear relationship exists between inputs and output.',
      'Explainability and regulatory compliance require clear coefficients (e.g. credit underwriting, medical risk scores).',
      'As an initial baseline model before testing complex non-linear models.',
    ],
    whenToAvoid: [
      'The target is categorical (e.g. Spam vs Not Spam) — use Logistic Regression instead.',
      'The underlying physical process is strongly non-linear (e.g. exponential growth, cyclical oscillations).',
      'The data suffers from severe multicollinearity (features strongly correlated with each other).',
      'Severe extreme outliers exist that disproportionately skew squared error metrics.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Real Estate Valuation & Pricing Engines',
      description:
        'Estimating property market valuations based on square footage, bedroom count, lot size, and neighborhood transit proximity indices.',
      educationalVsProductionNote:
        'Commercial automated valuation models (AVMs) like Zillow Zestimate use regularized multivariable regression as a core baseline estimator.',
    },
    {
      title: 'Econometric Demand Forecasting',
      description:
        'Retailers predicting product demand and sales volume as a function of shelf price, promotional discount percentages, and seasonal advertising spend.',
      educationalVsProductionNote:
        'Standard practice across supply chain management and retail pricing optimization teams.',
    },
    {
      title: 'Medical Risk Factor Analysis',
      description:
        'Quantifying the correlation between systolic blood pressure and patient age, BMI, and daily sodium intake.',
      educationalVsProductionNote:
        'Widely used in clinical epidemiology and biostatistics for hypothesis testing and confidence interval reporting.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Formulate the Hypothesis Function',
      description:
        'Define the predicted output as a linear combination of inputs: ŷ = w · x + b, where w is the weight (slope) and b is the bias (intercept).',
    },
    {
      stepNumber: 2,
      title: 'Define the Loss Function (Mean Squared Error)',
      description:
        'Quantify prediction errors using MSE: J(w, b) = (1/n) Σ (y_i - ŷ_i)², which heavily penalizes large deviations due to the squaring operation.',
    },
    {
      stepNumber: 3,
      title: 'Compute Optimal Parameters',
      description:
        'Derive the weights either analytically using the Normal Equation (w = (XᵀX)⁻¹Xᵀy) or iteratively via Gradient Descent updates: w := w - η(∂J/∂w).',
    },
    {
      stepNumber: 4,
      title: 'Evaluate Model Fit with R² & Residuals',
      description:
        'Calculate the Coefficient of Determination R² = 1 - (SS_res / SS_tot) to determine the percentage of variance explained by the model.',
    },
  ],
  workedExample: {
    datasetDescription:
      '3 data points: (1, 2), (2, 4), (3, 5). Target is finding best-fit line ŷ = w·x + b.',
    initialState: 'Points: {(1, 2), (2, 4), (3, 5)}. Means: x̄ = 2.0, ȳ = 3.667.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Compute means of X and Y',
        stateDisplay: 'x̄ = (1+2+3)/3 = 2.0; ȳ = (2+4+5)/3 = 3.667',
        explanation: 'The regression line is mathematically guaranteed to pass through the centroid (x̄, ȳ).',
        whyNecessary: 'Required to compute deviations for covariance and variance.',
        beforeState: 'Raw points',
        afterState: 'Centroid (2.0, 3.667) identified',
        nextAction: 'Compute covariance numerator and variance denominator.',
        intermediateResult: 'Centroid ready.',
      },
      {
        stepNumber: 2,
        operation: 'Compute slope w using OLS formula',
        stateDisplay: 'Numerator: (1-2)(2-3.67) + (2-2)(4-3.67) + (3-2)(5-3.67) = 1.67 + 0 + 1.33 = 3.0. Denominator: (-1)² + 0² + 1² = 2.0.',
        explanation: 'w = Cov(X, Y) / Var(X) = 3.0 / 2.0 = 1.5.',
        whyNecessary: 'Optimal slope that zeroes the derivative of squared error.',
        beforeState: 'Numerator = 3.0, Denom = 2.0',
        afterState: 'Slope w = 1.5',
        nextAction: 'Solve for bias intercept b.',
        intermediateResult: 'w = 1.5',
      },
      {
        stepNumber: 3,
        operation: 'Calculate Intercept b = ȳ - w·x̄',
        stateDisplay: 'b = 3.667 - (1.5 * 2.0) = 3.667 - 3.0 = 0.667',
        explanation: 'Ensures the line passes directly through the centroid of the sample data.',
        whyNecessary: 'Sets the baseline vertical offset when x = 0.',
        beforeState: 'w = 1.5, b unknown',
        afterState: 'ŷ = 1.5x + 0.667',
        nextAction: 'Calculate residuals and R².',
        intermediateResult: 'Formula: ŷ = 1.5x + 0.667',
      },
      {
        stepNumber: 4,
        operation: 'Evaluate Predictions & Residuals',
        stateDisplay: 'x=1: ŷ=2.167 (res=-0.167); x=2: ŷ=3.667 (res=+0.333); x=3: ŷ=5.167 (res=-0.167)',
        explanation: 'Sum of residuals is exactly (-0.167 + 0.333 - 0.167) = 0, proving mathematical optimality.',
        whyNecessary: 'Confirms that OLS first-order conditions are satisfied.',
        beforeState: 'Predictions computed',
        afterState: 'MSE = 0.0556, R² = 96.4%',
        nextAction: 'Deploy model for inference.',
        intermediateResult: 'R² = 96.4%',
      },
    ],
    finalState: 'Best-fit regression equation: ŷ = 1.50x + 0.67 with R² = 96.4%',
  },
  advantages: [
    'Highly interpretable: direct, tangible meaning for every learned parameter.',
    'Computationally lightweight: closed-form solution computes in milliseconds.',
    'Provides statistical guarantees: Best Linear Unbiased Estimator (BLUE) under Gauss-Markov assumptions.',
    'Serves as the foundational baseline against which all complex non-linear architectures are measured.',
  ],
  limitations: [
    'Assumes a strictly linear relationship between predictors and the target.',
    'Extremely vulnerable to outliers: squaring errors amplifies the influence of rogue data points.',
    'Susceptible to multicollinearity when feature columns are correlated.',
    'Underfits complex patterns with curved boundaries or interaction effects.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(n · d) when using iterative Gradient Descent on pre-scaled inputs across a small fixed number of epochs.',
    averageCaseMeaning:
      'O(d³ + n · d²) when solving the analytical Normal Equation with d features and n samples (dominated by d×d matrix inversion).',
    worstCaseMeaning:
      'O(d³) matrix inversion when d is large; O(n · d · epochs) for slow gradient descent convergence on ill-conditioned data.',
    spaceComplexityMeaning:
      'O(d) auxiliary memory to store weights and intercept parameters during inference.',
  },
  relatedAlgorithms: [
    {
      name: 'Ridge & Lasso Regression (L2 / L1 Regularization)',
      comparison:
        'Adds penalty terms to the loss function to prevent overfitting and handle multicollinearity by shrinking weights.',
    },
    {
      name: 'Polynomial Regression',
      comparison:
        'Transforms features into higher-order powers (x², x³) while retaining the linear optimization formulation.',
    },
    {
      name: 'Logistic Regression',
      comparison:
        'Applies a non-linear sigmoid activation function to map linear outputs into probabilities for classification.',
    },
  ],
  quiz: [
    {
      question: 'What loss function does Ordinary Least Squares (OLS) Linear Regression minimize?',
      options: [
        'Sum of absolute errors (MAE)',
        'Sum of squared differences between actual and predicted values (MSE)',
        'Cross-entropy log loss',
        'Hinge loss',
      ],
      correctIndex: 1,
      explanation:
        'OLS minimizes the sum of squared residuals: Σ (y_i - ŷ_i)². Squaring ensures positive error penalties and penalizes large errors heavily.',
      optionExplanations: [
        'MAE is used in Median/L1 regression, not standard OLS.',
        'Correct! Squaring the residuals yields a convex quadratic bowl with a unique global minimum.',
        'Cross-entropy is the loss function for Logistic Regression classification.',
        'Hinge loss is the objective function for Support Vector Machines (SVMs).',
      ],
    },
    {
      question: 'What does an R² (coefficient of determination) score of 0.85 indicate?',
      options: [
        'The model prediction error is 85%',
        '85% of the total variance in the target variable is explained by the model',
        'The slope of the line is exactly 0.85',
        '85% of the data points lie precisely on the line',
      ],
      correctIndex: 1,
      explanation:
        'R² measures the proportion of total variance in the dependent variable explained by the independent feature(s).',
      optionExplanations: [
        'R² is a goodness-of-fit metric, not an error percentage.',
        'Correct! R² = 1 - (SS_res / SS_tot), so 0.85 means 85% of variance is accounted for.',
        'R² is dimensionless and independent of the physical slope w.',
        'Individual points will still deviate with non-zero residuals even with high R².',
      ],
    },
    {
      question: 'Why does Ordinary Least Squares require that the design matrix XᵀX be invertible?',
      options: [
        'To compute the closed-form Normal Equation w = (XᵀX)⁻¹Xᵀy',
        'To prevent memory overflow',
        'To ensure all data values are positive',
        'To compute the learning rate',
      ],
      correctIndex: 0,
      explanation:
        'The analytical solution requires (XᵀX)⁻¹. If features are collinear, the matrix is singular and cannot be inverted without regularization.',
      optionExplanations: [
        'Correct! If X has linearly dependent columns, XᵀX is not full rank and lacks an inverse.',
        'Invertibility is an algebraic requirement, not a memory buffer constraint.',
        'Regression operates equally well on negative and zero values.',
        'The closed-form solution does not use a learning rate.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'The term "regression" was coined by Sir Francis Galton in 1886 when observing that children of tall parents "regressed" toward the population mean height. "Linear" denotes the equation form y = wx + b.',
    problemSolved:
      'Finds the continuous functional mapping f(x) that minimizes squared discrepancy across historical observations.',
    problemNotSolved:
      'Does not inherently model complex non-linear curves without manual feature expansion, and does not establish true causality.',
    whyLearn:
      'Linear regression is the foundational stepping stone of machine learning: weights, biases, cost functions, and gradient descent all originate here.',
    prerequisites: ['Basic Algebra (lines, slopes)', 'Descriptive Statistics (mean, variance)', 'Derivatives & Gradients'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'Given pairs of input measurements and output targets, how can we mathematically predict future unseen targets with minimal aggregate error?',
    naiveApproachInefficiency:
      'Manually drawing an eye-balled line or using the sample average ȳ yields massive error and fails to utilize input feature correlations.',
    coreIdeaUsed:
      'Ordinary Least Squares (OLS): formulate a convex quadratic loss function whose derivative equals zero at exactly one global minimum.',
    utilityExplanation:
      'Provides instantaneous closed-form calculation or fast iterative convergence with full statistical interpretability.',
    workingConditions: [
      'Continuous dependent variable y.',
      'Linearity in parameters.',
      'Homoscedasticity (constant variance of residuals).',
      'Independence of error terms.',
    ],
    whenAnotherIsBetter:
      'When the outcome is discrete categories, use Logistic Regression or Random Forests. When relationships are non-linear, use Polynomial Regression or Neural Networks.',
    analogyOrRealLifeExample:
      'Like fitting a stiff wooden ruler through a scattering of metal beads so that the total tension of elastic bands connecting beads to the ruler is minimized.',
  },
  inputOutputAssumptions: {
    expectedInput: 'A 2D matrix of shape (n, d) representing n samples with d numerical features, plus a target vector y of shape (n).',
    expectedOutput: 'Weight vector w of length d and scalar intercept bias b.',
    constraints: ['n >= d + 1 (more samples than features to avoid underdetermined systems)', 'Features must not be perfectly collinear'],
    preconditions: ['Features should ideally be standardized or normalized if utilizing iterative gradient descent'],
    specialCases: ['Single feature (Simple Linear Regression)', 'Zero variance feature (causes division by zero)'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Collinear features produce non-invertible singular matrices in OLS; unscaled features cause gradient descent oscillations.',
  },
  coreIntuition: {
    simpleExplanation:
      'Imagine stringing a taut wire through a cloud of points. Every point pulls the wire toward itself with a force proportional to its vertical distance. The wire comes to rest where the net torque and forces cancel to zero.',
    keyDrivingDecision:
      'Using squared error rather than absolute error because the derivative of x² is continuous and linear (2x), giving a clean closed-form optimum.',
    whyRepeatedOperationWorks:
      'In Gradient Descent, stepping in the direction of the negative gradient -∇J always decreases loss on a convex quadratic surface.',
    paradigmSpecificDetail:
      'Supervised Parametric Modeling: assumes an explicit linear structure y = wᵀx + b and directly solves for parameters θ = {w, b}.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function linearRegressionOLS(X, y):',
      '  n := length(y)',
      '  meanX := sum(X) / n',
      '  meanY := sum(y) / n',
      '  numerator := sum((X[i] - meanX) * (y[i] - meanY) for i in 0..n-1)',
      '  denominator := sum((X[i] - meanX)^2 for i in 0..n-1)',
      '  slope := numerator / denominator',
      '  intercept := meanY - (slope * meanX)',
      '  return { slope, intercept }',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'n := length(y)', explanation: 'Count the total number of training sample pairs.' },
      { lineIndex: 2, lineText: 'meanX := sum(X) / n', explanation: 'Compute the sample mean of the independent feature x̄.' },
      { lineIndex: 3, lineText: 'meanY := sum(y) / n', explanation: 'Compute the sample mean of the dependent target ȳ.' },
      { lineIndex: 4, lineText: 'numerator := sum(...)', explanation: 'Compute the sample covariance between feature X and target y.' },
      { lineIndex: 5, lineText: 'denominator := sum(...)', explanation: 'Compute the sample variance of feature X.' },
      { lineIndex: 6, lineText: 'slope := numerator / denominator', explanation: 'Calculate optimal weight w = Cov(X, y) / Var(X).' },
      { lineIndex: 7, lineText: 'intercept := meanY - (slope * meanX)', explanation: 'Calculate bias b ensuring line passes through (x̄, ȳ).' },
    ],
    terminationCondition: 'OLS calculates parameters directly in a single pass without iterative looping.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function trainLinearRegression(points: {x: number, y: number}[]): { slope: number, intercept: number, r2: number }',
    code: `export function trainLinearRegression(points: { x: number; y: number }[]) {
  const n = points.length;
  if (n < 2) throw new Error("At least 2 points required");

  let sumX = 0, sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0, den = 0;
  for (const p of points) {
    const dx = p.x - meanX;
    num += dx * (p.y - meanY);
    den += dx * dx;
  }

  if (den === 0) throw new Error("Variance of X is zero; vertical line cannot be fitted");

  const slope = num / den;
  const intercept = meanY - slope * meanX;

  // Calculate R²
  let ssRes = 0, ssTot = 0;
  for (const p of points) {
    const pred = slope * p.x + intercept;
    ssRes += (p.y - pred) ** 2;
    ssTot += (p.y - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);

  return { slope, intercept, r2 };
}`,
    inputValidation: 'Ensures at least 2 points exist and verifies denominator > 0 (variance of X is non-zero).',
    variables: [
      { name: 'n', type: 'number', purpose: 'Number of observations' },
      { name: 'meanX', type: 'number', purpose: 'Centroid X coordinate' },
      { name: 'meanY', type: 'number', purpose: 'Centroid Y coordinate' },
      { name: 'num', type: 'number', purpose: 'Covariance accumulator' },
      { name: 'den', type: 'number', purpose: 'Variance of X accumulator' },
      { name: 'slope', type: 'number', purpose: 'Calculated optimal weight w' },
      { name: 'intercept', type: 'number', purpose: 'Calculated optimal bias b' },
      { name: 'r2', type: 'number', purpose: 'Coefficient of determination' },
    ],
    lineByLine: [
      { line: 1, code: 'const n = points.length;', explanation: 'Verify dataset has valid size.' },
      { line: 5, code: 'let sumX = 0, sumY = 0;', explanation: 'Accumulators for computing means.' },
      { line: 16, code: 'const slope = num / den;', explanation: 'Analytical closed-form OLS solution.' },
      { line: 17, code: 'const intercept = meanY - slope * meanX;', explanation: 'Centroid alignment step.' },
      { line: 26, code: 'const r2 = 1 - (ssRes / ssTot);', explanation: 'R² goodness-of-fit formula.' },
    ],
    returnExplanation: 'Returns the slope, intercept, and R² score of the best-fit line.',
    commonBugs: [
      'Dividing by zero when all X values are identical (vertical line).',
      'Forgetting to subtract mean values when computing covariance.',
      'Failing to scale features when training with gradient descent instead of OLS.',
    ],
    edgeCaseHandling: [
      'Throws descriptive error when fewer than 2 points are provided.',
      'Handles zero total variance (horizontal line) gracefully by capping R² at 1.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Because the MSE loss function J(w, b) = Σ(y_i - (wx_i + b))² is a strictly convex paraboloid bowl, setting its partial derivatives ∂J/∂w = 0 and ∂J/∂b = 0 produces a unique, global minimum.',
    formalProof: {
      method: 'Convex Loss Minimization',
      invariantOrClaim: 'The closed-form OLS parameters w = Cov(X, y)/Var(X) and b = ȳ - w·x̄ uniquely minimize total squared error.',
      initialization: 'Define J(w, b) = (1/n) Σ [y_i - (w·x_i + b)]².',
      maintenance: 'Differentiating with respect to b yields ∂J/∂b = -(2/n) Σ [y_i - w·x_i - b] = 0, leading to b = ȳ - w·x̄.',
      termination: 'Substituting b into ∂J/∂w = -(2/n) Σ x_i[y_i - w·x_i - (ȳ - w·x̄)] = 0 isolates w = Σ(x_i - x̄)(y_i - ȳ) / Σ(x_i - x̄)².',
      conclusion: 'Because the Hessian matrix of second partial derivatives is positive definite, this critical point is the unique global minimum.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(n)', explanation: 'Single feature closed-form OLS scans the n items twice.', condition: 'Single independent feature (d=1).' },
    averageCase: { complexity: 'O(n · d + d³)', explanation: 'Multivariable regression computes XᵀX in O(nd²) and inverts in O(d³).', condition: 'General tabular dataset.' },
    worstCase: { complexity: 'O(d³)', explanation: 'Dominated by matrix inversion when d is large relative to n.', condition: 'High-dimensional feature space.' },
    auxiliarySpace: { complexity: 'O(d)', explanation: 'Stores d weights and 1 intercept bias scalar.' },
    totalMemory: 'O(n · d) to store the training dataset matrix.',
    bigOExplanation: 'In simple linear regression, runtime scales strictly linearly with the number of samples n.',
    scalingBehavior: 'Extremely fast for hundreds of thousands of samples when d is small (e.g. d < 20).',
  },
  advantagesAndLimitations: {
    strengths: [
      'Mathematically exact closed-form solution with zero hyperparameter tuning required.',
      'Maximum transparency: every weight has an immediate, explainable real-world unit interpretation.',
      'Provides confidence intervals, p-values, and standard errors for hypothesis testing.',
    ],
    limitations: [
      'Cannot capture non-linear patterns without manual polynomial or spline transformations.',
      'Extremely sensitive to leverage points and extreme outliers due to squared penalty.',
      'Collinear features destabilize parameter estimates.',
    ],
    memoryTradeOffs: [
      'Normal Equation requires storing d×d matrix in memory; Gradient Descent uses O(d) memory and processes minibatches.',
    ],
    poorChoiceScenarios: [
      'Categorical classification problems (use Logistic Regression).',
      'Images, audio, or text where hierarchical non-linear representations are required.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Polynomial Regression',
      timeComplexity: 'O(n · d^p)',
      spaceComplexity: 'O(d^p)',
      stabilityOrType: 'Parametric Regression',
      similarities: 'Minimizes the same Mean Squared Error loss using linear algebra.',
      differences: 'Expands input features into polynomial powers (x, x², x³) to fit curved lines.',
      whenToPreferThis: 'When the relationship is fundamentally linear and interpretability is critical.',
      whenToPreferAlternative: 'When residual scatter plots clearly exhibit curved parabolic or sinusoidal trends.',
    },
    {
      algorithm: 'Ridge Regression (L2 Regularization)',
      timeComplexity: 'O(n · d + d³)',
      spaceComplexity: 'O(d)',
      stabilityOrType: 'Regularized Linear Model',
      similarities: 'Fits a linear equation y = w·x + b by minimizing squared error.',
      differences: 'Adds penalty λ Σ w_j² to prevent coefficients from exploding when features are correlated.',
      whenToPreferThis: 'When sample size n is large and features are independent.',
      whenToPreferAlternative: 'When features suffer from multicollinearity or when n < d.',
    },
  ],
  commonMistakes: [
    {
      title: 'Confusing Correlation with Causation',
      misconception: 'Assuming that because feature X has a positive slope w, increasing X directly causes Y to rise.',
      correctApproach: 'Linear regression measures statistical association, not physical causation. Confounding variables must be controlled.',
    },
    {
      title: 'Evaluating Models Solely with R²',
      misconception: 'Believing an R² of 0.95 means the linear model is automatically correct.',
      badCodeOrApproach: 'Looking only at R² without inspecting residual scatter plots.',
      correctApproach: 'Always plot residuals (y - ŷ). If residuals exhibit a curved pattern, the linear assumption is violated despite a high R².',
    },
  ],
  exercises: [
    {
      id: 'lr-ex-1',
      type: 'conceptual',
      question: 'What happens to the OLS regression slope if every Y value in the dataset is multiplied by 3?',
      options: ['The slope is multiplied by 3', 'The slope remains unchanged', 'The slope is multiplied by 9', 'The slope becomes 1/3'],
      correctIndex: 0,
      explanation: 'Slope w = Cov(X, 3Y)/Var(X) = 3·Cov(X, Y)/Var(X) = 3w. The slope scales linearly with changes in Y scale.',
    },
    {
      id: 'lr-ex-2',
      type: 'challenge',
      question: 'Why does the sum of residuals Σ (y_i - ŷ_i) always equal zero in an OLS model with an intercept?',
      options: [
        'Because the partial derivative with respect to intercept b sets Σ(y_i - ŷ_i) = 0',
        'Because of floating point rounding errors',
        'Only when all points lie exactly on the line',
        'Because the data was normalized',
      ],
      correctIndex: 0,
      explanation: 'Differentiating J with respect to b yields ∂J/∂b = -2 Σ(y_i - ŷ_i). Setting this derivative to zero proves the sum of residuals is identically zero.',
    },
  ],
  summary: {
    coreIdea: 'Fits an optimal line ŷ = w·x + b by minimizing the sum of squared vertical residuals between actual and predicted values.',
    keyConditions: ['Target must be continuous', 'Relationship should be approximately linear', 'No severe multicollinearity'],
    complexitySummary: { time: 'O(n) for 1D closed-form; O(nd² + d³) for multivariable OLS', space: 'O(d) for learned weights' },
    whenToUse: 'Predicting continuous numerical metrics where model interpretability and mathematical simplicity are paramount.',
    prerequisites: ['Basic algebra', 'Mean and variance', 'Derivatives'],
    nextSteps: [
      { id: 'logistic-regression', name: 'Logistic Regression', reason: 'Extend linear models to binary classification using the sigmoid function.' },
      { id: 'gradient-descent', name: 'Gradient Descent', reason: 'Learn how to optimize linear models when datasets are too massive for closed-form matrix inversion.' },
    ],
  },
};
