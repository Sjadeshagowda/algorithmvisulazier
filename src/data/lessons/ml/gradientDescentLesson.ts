import type { AlgorithmLesson } from '../../../types/algorithm';

export const gradientDescentLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A fundamental first-order iterative optimization algorithm that finds local or global minima of a differentiable objective function by repeatedly taking steps proportional to the negative of the function\'s gradient at the current parameter position.',
  mainPurpose:
    'To train machine learning models and neural networks by adjusting parameters to minimize their loss function when closed-form analytical solutions are intractable.',
  whatIsIt: {
    overview:
      'Gradient Descent is the universal workhorse of modern machine learning and artificial intelligence. Whenever a model (from simple linear regression to trillion-parameter Large Language Models) needs to "learn", it measures how wrong its predictions are using a loss function J(θ). Gradient Descent computes the partial derivatives (the gradient vector ∇J) of the loss with respect to every weight parameter, and updates the parameters in the opposite direction (-∇J) scaled by a step size called the learning rate (η).',
    smallExample:
      'Imagine standing blindfolded on a foggy mountainside. To reach the valley bottom, you feel the slope of the ground beneath your feet with your foot. Whichever direction slopes downward most steeply, you take a controlled step in that direction. Repeating this process brings you to the bottom of the valley.',
  },
  whyUseIt: {
    problemSolved:
      'Optimizing complex multi-dimensional functions where finding an analytical algebraic solution (like setting derivative to zero) is computationally impossible or too expensive.',
    whyItMatters:
      'Deep learning, transformers, reinforcement learning, and logistic regression all rely on gradient descent (and its variants like Adam and SGD). Without gradient descent, modern AI would not exist.',
    whenToUse: [
      'Training parametric machine learning models (linear regression, logistic regression, neural nets).',
      'The objective loss function is differentiable with respect to its parameters.',
      'Dataset size is large, making analytical matrix inversion O(d³) computationally prohibitive.',
      'Online or streaming learning environments where parameters update continuously.',
    ],
    whenToAvoid: [
      'The loss function is non-differentiable or discontinuous everywhere (use Genetic Algorithms or Simulated Annealing).',
      'Small datasets with simple linear models where closed-form OLS is instant.',
      'Integer or discrete combinatorial optimization problems (use Dynamic Programming or Branch & Bound).',
    ],
  },
  realWorldApplications: [
    {
      title: 'Training Deep Neural Networks & Large Language Models',
      description:
        'Optimizing hundreds of billions of transformer weights in models like GPT-4, Claude, and Gemini using Mini-Batch Stochastic Gradient Descent with AdamW.',
      educationalVsProductionNote:
        'Universal industry standard across all modern deep learning frameworks (PyTorch, TensorFlow, JAX).',
    },
    {
      title: 'Autonomous Vehicle Path Planning & Trajectory Tracking',
      description:
        'Minimizing path deviation, passenger jerk, and obstacle proximity cost functions in real-time model predictive control (MPC).',
      educationalVsProductionNote:
        'Used in real-time trajectory optimization running on vehicle onboard computers.',
    },
    {
      title: 'Computational Biology & Protein Folding',
      description:
        'Minimizing free energy landscapes to predict 3D folded molecular structures of proteins (AlphaFold).',
      educationalVsProductionNote:
        'Core algorithmic engine in molecular dynamics simulations and structural bioinformatics.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Parameter Initialization',
      description:
        'Initialize model weights θ (e.g. at random small values or zeros) and pick a learning rate hyperparameter η > 0.',
    },
    {
      stepNumber: 2,
      title: 'Compute Objective Loss & Gradient Vector',
      description:
        'Evaluate the loss function J(θ) and calculate the vector of partial derivatives ∇J(θ) = [∂J/∂θ₁, ∂J/∂θ₂, ...].',
    },
    {
      stepNumber: 3,
      title: 'Take Step in Negative Gradient Direction',
      description:
        'Update parameters using the rule: θ := θ - η · ∇J(θ). Because the gradient points in the direction of steepest ascent, negative gradient points to steepest descent.',
    },
    {
      stepNumber: 4,
      title: 'Evaluate Convergence',
      description:
        'Check if the gradient magnitude ||∇J|| is below tolerance ε, or if the change in loss |J_{t} - J_{t-1}| has flattened.',
    },
  ],
  workedExample: {
    datasetDescription:
      'Objective function: f(x) = x² - 4x + 7. Derivative: f\'(x) = 2x - 4. Initial point: x₀ = 6.0. Learning rate: η = 0.3. Global minimum is at x* = 2.0 (loss = 3.0).',
    initialState: 'Starting at x = 6.0, f(6.0) = 36 - 24 + 7 = 19.0. Gradient f\'(6.0) = 2(6) - 4 = +8.0.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Iteration 1 - Compute step and update parameter',
        stateDisplay: 'Gradient: f\'(6.0) = 8.0. Update: x₁ = 6.0 - 0.3 * (8.0) = 6.0 - 2.4 = 3.6',
        explanation: 'The positive slope indicates that moving right increases loss; stepping left (-8.0) decreases loss.',
        whyNecessary: 'Moves parameter closer to the minimum at x = 2.0.',
        beforeState: 'x = 6.0, loss = 19.0',
        afterState: 'x = 3.6, loss = (3.6)² - 4(3.6) + 7 = 5.56',
        nextAction: 'Re-evaluate gradient at x = 3.6.',
        intermediateResult: 'Loss plummeted from 19.0 down to 5.56.',
      },
      {
        stepNumber: 2,
        operation: 'Iteration 2 - Follow shallower slope',
        stateDisplay: 'Gradient: f\'(3.6) = 2(3.6) - 4 = 3.2. Update: x₂ = 3.6 - 0.3 * (3.2) = 3.6 - 0.96 = 2.64',
        explanation: 'As we approach the bottom, the slope flattens (from 8.0 to 3.2), automatically reducing step size.',
        whyNecessary: 'Prevents overshooting the valley floor.',
        beforeState: 'x = 3.6, loss = 5.56',
        afterState: 'x = 2.64, loss = (2.64)² - 4(2.64) + 7 = 3.41',
        nextAction: 'Take step 3 from x = 2.64.',
        intermediateResult: 'x is now within 0.64 of the optimal value 2.0.',
      },
      {
        stepNumber: 3,
        operation: 'Iteration 3 - Fine convergence step',
        stateDisplay: 'Gradient: f\'(2.64) = 2(2.64) - 4 = 1.28. Update: x₃ = 2.64 - 0.3 * (1.28) = 2.64 - 0.384 = 2.256',
        explanation: 'x reaches 2.256, with loss = 3.065 (extremely close to theoretical minimum of 3.0).',
        whyNecessary: 'Exponential convergence toward the exact analytical minimum.',
        beforeState: 'x = 2.64, loss = 3.41',
        afterState: 'x = 2.256, loss = 3.065',
        nextAction: 'Continue until gradient magnitude is virtually zero.',
        intermediateResult: 'Gradient is now small (0.512).',
      },
    ],
    finalState: 'Converged near global minimum x* = 2.0, f(x*) = 3.0 within a few rapid iterations.',
  },
  advantages: [
    'Universally applicable to any differentiable loss function in arbitrary dimensions.',
    'Scales effortlessly to millions or billions of parameters where matrix inversion is impossible.',
    'Stochastic and Mini-Batch variants allow training on massive datasets that exceed system RAM.',
    'Naturally adaptable with momentum, adaptive learning rates (Adam, RMSprop), and learning rate schedules.',
  ],
  limitations: [
    'Highly sensitive to learning rate selection (too large diverges; too small takes forever).',
    'Can get trapped in suboptimal local minima or plateaus on non-convex loss surfaces.',
    'Slow convergence along elongated ravine contours (ravines) without momentum.',
    'Requires computing gradients for every parameter at every step.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(d · iterations) for Batch Gradient Descent per epoch with d parameters; O(d) per step for SGD.',
    averageCaseMeaning:
      'O(n · d · epochs) for full batch processing over n training samples.',
    worstCaseMeaning:
      'Slow sub-linear convergence O(1/t) on non-strongly convex functions without acceleration.',
    spaceComplexityMeaning:
      'O(d) auxiliary memory to store parameter weights and gradient vectors.',
  },
  relatedAlgorithms: [
    {
      name: 'Stochastic Gradient Descent (SGD)',
      comparison:
        'Updates weights after evaluating a single randomly chosen training sample, creating noisy but fast exploratory updates.',
    },
    {
      name: 'Mini-Batch Gradient Descent',
      comparison:
        'The gold standard compromise: updates weights on small batches (e.g. 32 to 512 samples), maximizing GPU matrix parallelism.',
    },
    {
      name: 'Adam (Adaptive Moment Estimation)',
      comparison:
        'Maintains running exponential moving averages of both gradients (first moment) and squared gradients (second moment) for per-parameter adaptive learning rates.',
    },
  ],
  quiz: [
    {
      question: 'What happens if the learning rate η is set too high in Gradient Descent?',
      options: [
        'The algorithm runs faster and guarantees a better minimum',
        'Parameters overshoot the minimum, oscillate wildly, and may diverge to infinity (NaN)',
        'The gradients automatically turn to zero',
        'Memory usage doubles',
      ],
      correctIndex: 1,
      explanation:
        'An excessively large learning rate causes the updates to overshoot the valley floor and land on higher ground on the opposite side, triggering catastrophic divergence.',
      optionExplanations: [
        'Higher learning rates do not guarantee better convergence.',
        'Correct! Overshooting leads to exploding gradients and divergent loss.',
        'Gradients grow exponentially larger during divergence, not zero.',
        'Memory footprint is strictly independent of the learning rate value.',
      ],
    },
    {
      question: 'In which direction does the negative gradient vector -∇J(θ) point?',
      options: [
        'The direction of steepest loss ascent',
        'The direction of steepest loss descent',
        'Tangential to the contour line',
        'Directly toward the origin (0, 0)',
      ],
      correctIndex: 1,
      explanation:
        'By definition of multivariable calculus, the gradient ∇J points in the direction of greatest rate of increase. Therefore, its negation -∇J points in the direction of steepest descent.',
      optionExplanations: [
        '+∇J points toward steepest ascent.',
        'Correct! -∇J is the direction of maximally rapid decrease in function value.',
        'Orthogonal to contour lines, not tangential.',
        'It points toward local minima, which are rarely located at the origin.',
      ],
    },
    {
      question: 'What is the primary advantage of Mini-Batch Gradient Descent over Full-Batch Gradient Descent?',
      options: [
        'It eliminates the need for calculating derivatives',
        'It allows efficient GPU tensor parallelism and fits inside memory while providing smoother updates than pure single-sample SGD',
        'It guarantees 100% training accuracy',
        'It removes the learning rate hyperparameter',
      ],
      correctIndex: 1,
      explanation:
        'Mini-batching leverages vectorized SIMD/GPU hardware for fast matrix multiplication while decoupling memory limits from massive total dataset sizes.',
      optionExplanations: [
        'Derivatives are still computed via backpropagation.',
        'Correct! Modern deep learning hardware is optimized specifically for mini-batch tensor operations.',
        'No optimization method guarantees 100% accuracy.',
        'A learning rate is still required for mini-batching.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Proposed by Augustin-Louis Cauchy in 1847 to solve astronomical orbits. "Gradient" is the vector of partial derivatives; "Descent" means stepping downhill.',
    problemSolved:
      'Finds parameter values that minimize an arbitrary differentiable objective function.',
    problemNotSolved:
      'Cannot guarantee global optimality on non-convex landscapes (can settle in local minima or saddle points).',
    whyLearn:
      'It is the foundational algorithmic mechanism that powers all of deep learning, modern machine learning, and AI parameter estimation.',
    prerequisites: ['Partial derivatives', 'Vectors and dot products', 'Convex functions'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can an algorithm discover the optimal configuration of millions of parameters when solving for them algebraically is impossible?',
    naiveApproachInefficiency:
      'Random search or grid search in high dimensions requires testing 10¹⁰⁰ points, which would take longer than the age of the universe.',
    coreIdeaUsed:
      'Follow the calculus gradient: the local slope tells you exactly which way is downhill, allowing purposeful steps toward the minimum.',
    utilityExplanation:
      'Transforms an impossible global search into a fast, guided local descent that reliably reduces loss with every step.',
    workingConditions: [
      'Continuous, differentiable loss function J(θ).',
      'Reasonably chosen learning rate or adaptive optimizer.',
      'Sufficient compute for backpropagation.',
    ],
    whenAnotherIsBetter:
      'When the function is a simple quadratic with few features, closed-form matrix math is faster. For discontinuous functions, use evolutionary algorithms.',
    analogyOrRealLifeExample:
      'Like a skateboarder rolling down a curved half-pipe: gravity pulls the board in the direction of steepest incline until it settles at the bottom.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Differentiable function f(θ), initial starting coordinate θ₀, learning rate η, and convergence tolerance ε.',
    expectedOutput: 'Optimized parameter vector θ* corresponding to minimum loss.',
    constraints: ['η > 0', 'Function f must have computable partial derivatives'],
    preconditions: ['Features should be standardized so that loss contours are circular rather than squished elliptical ravines'],
    specialCases: ['Zero gradient (saddle point or local minimum reached)', 'Gradient exploding to Infinity/NaN'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Excessive learning rate triggers explosive oscillation; unscaled features cause slow zig-zagging perpendicular to the valley.',
  },
  coreIntuition: {
    simpleExplanation:
      'Check the slope under your feet. If the ground slopes up to the right, take a step to the left. If it slopes up to the left, take a step to the right. Take smaller steps as the ground gets flatter.',
    keyDrivingDecision:
      'Moving opposite to the gradient (-∇f) guarantees that for an infinitesimal step, the objective value strictly decreases (Taylor series expansion).',
    whyRepeatedOperationWorks:
      'Because each step moves closer to the point where slope is zero (the minimum), continuous iteration systematically reduces the remaining error.',
    paradigmSpecificDetail:
      'First-Order Mathematical Optimization: utilizes only first-order derivative information without computing costly second-order Hessian matrices.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function gradientDescent(initial_theta, lr, max_iters, tolerance):',
      '  theta := initial_theta',
      '  for iter from 1 to max_iters do:',
      '    grad := computeGradient(theta)',
      '    if norm(grad) < tolerance then break',
      '    theta := theta - lr * grad',
      '  return theta',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'theta := initial_theta', explanation: 'Set initial candidate parameters.' },
      { lineIndex: 3, lineText: 'grad := computeGradient(theta)', explanation: 'Evaluate vector of partial derivatives at current point.' },
      { lineIndex: 4, lineText: 'if norm(grad) < tolerance then break', explanation: 'Stop if the slope is nearly flat (minimum reached).' },
      { lineIndex: 5, lineText: 'theta := theta - lr * grad', explanation: 'Take descent step proportional to learning rate.' },
    ],
    terminationCondition: 'Terminates when gradient magnitude ||grad|| < ε or maximum iterations reached.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function optimizeGradientDescent(start: {x: number, y: number}, lr: number, iters: number)',
    code: `export function optimizeGradientDescent(
  start = { x: 4, y: 3.5 },
  lr = 0.15,
  iters = 20
) {
  // Paraboloid loss bowl: f(x, y) = x^2 + 2*y^2 (Minimum at (0, 0))
  let currX = start.x;
  let currY = start.y;
  const path: Array<{ x: number; y: number; loss: number }> = [];

  for (let i = 0; i < iters; i++) {
    const loss = currX * currX + 2 * (currY * currY);
    path.push({ x: currX, y: currY, loss });

    // Partial derivatives: df/dx = 2x, df/dy = 4y
    const gradX = 2 * currX;
    const gradY = 4 * currY;

    const gradNorm = Math.sqrt(gradX * gradX + gradY * gradY);
    if (gradNorm < 1e-4) break;

    currX -= lr * gradX;
    currY -= lr * gradY;
  }

  return { finalPoint: { x: currX, y: currY }, path };
}`,
    inputValidation: 'Guards against non-convergent runaway loops by capping iterations at max iters.',
    variables: [
      { name: 'currX, currY', type: 'number', purpose: 'Current parameter estimates' },
      { name: 'gradX, gradY', type: 'number', purpose: 'Evaluated partial derivatives' },
      { name: 'path', type: 'Array', purpose: 'History of points visited along the trajectory' },
    ],
    lineByLine: [
      { line: 10, code: 'const loss = currX * currX + 2 * (currY * currY);', explanation: 'Compute current objective loss.' },
      { line: 14, code: 'const gradX = 2 * currX;', explanation: 'Evaluate analytical derivative ∂f/∂x.' },
      { line: 15, code: 'const gradY = 4 * currY;', explanation: 'Evaluate analytical derivative ∂f/∂y.' },
      { line: 20, code: 'currX -= lr * gradX;', explanation: 'Update parameter x in negative gradient direction.' },
    ],
    returnExplanation: 'Returns the optimized parameters and full convergence trajectory.',
    commonBugs: [
      'Adding the gradient instead of subtracting it (Gradient Ascent, which diverges to infinity).',
      'Choosing a learning rate larger than 2 / L where L is Lipschitz constant of the gradient.',
      'Assuming zero gradient always means a global minimum (could be a saddle point).',
    ],
    edgeCaseHandling: [
      'Early termination when gradient norm < 1e-4.',
      'Saves trajectory path for visualization verification.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'For a convex function with L-Lipschitz continuous gradients, choosing a learning rate η < 2/L guarantees that each step strictly decreases the function value until the gradient becomes zero at the unique global minimum.',
    formalProof: {
      method: 'Mathematical Optimization Convergence',
      invariantOrClaim: 'Under L-smoothness (||∇f(x) - ∇f(y)|| ≤ L||x - y||), setting η = 1/L guarantees f(θ_{t+1}) ≤ f(θ_t) - (1/2L)||∇f(θ_t)||².',
      initialization: 'By the Descent Lemma from multivariate calculus: f(y) ≤ f(x) + ∇f(x)ᵀ(y - x) + (L/2)||y - x||².',
      maintenance: 'Substitute the gradient descent step y = θ_{t+1} = θ_t - η∇f(θ_t): f(θ_{t+1}) ≤ f(θ_t) - η||∇f(θ_t)||² + (Lη²/2)||∇f(θ_t)||² = f(θ_t) - η(1 - Lη/2)||∇f(θ_t)||².',
      termination: 'Setting η = 1/L yields f(θ_{t+1}) ≤ f(θ_t) - (1/2L)||∇f(θ_t)||². Summing over T steps shows Σ ||∇f(θ_t)||² ≤ 2L(f(θ₀) - f*) < ∞.',
      conclusion: 'As T → ∞, ||∇f(θ_t)|| → 0, proving convergence to a critical stationary point.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(d · I)', explanation: 'Direct convergence in I iterations on well-conditioned circular contours.', condition: 'Condition number near 1.' },
    averageCase: { complexity: 'O(d · I)', explanation: 'Linear convergence rate O(log(1/ε)) for strongly convex functions.', condition: 'Standard convex landscape.' },
    worstCase: { complexity: 'O(d / ε)', explanation: 'Sub-linear convergence on non-strongly convex or ill-conditioned narrow valleys.', condition: 'High curvature disparity.' },
    auxiliarySpace: { complexity: 'O(d)', explanation: 'Stores d-dimensional gradient and weight vectors.' },
    totalMemory: 'O(d) for parameters and momentum buffers.',
    bigOExplanation: 'Per-iteration runtime is strictly linear O(d) in the number of model parameters.',
    scalingBehavior: 'Dominates modern machine learning because it bypasses the O(d³) matrix inversion required by exact solutions.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Scales to arbitrary parameter dimensions (billions of weights).',
      'Works with any differentiable cost function.',
      'Foundation for all advanced optimizers (SGD, Adam, RMSprop).',
      'Low memory overhead per iteration.',
    ],
    limitations: [
      'Choosing the optimal learning rate requires manual tuning or schedules.',
      'Vulnerable to saddle points and flat plateaus on non-convex surfaces.',
      'Oscillates in ill-conditioned ravines without momentum.',
    ],
    memoryTradeOffs: [
      'Basic GD requires O(d) memory; Adam requires O(3d) memory for first and second momentum buffers.',
    ],
    poorChoiceScenarios: [
      'Discontinuous or non-differentiable step loss functions.',
      'Purely convex problems with small d where closed-form solutions compute in 1ms.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Newton-Raphson Method (Second-Order Optimization)',
      timeComplexity: 'O(d³) per iteration (Hessian inversion)',
      spaceComplexity: 'O(d²)',
      stabilityOrType: 'Second-Order Optimization',
      similarities: 'Both find local minima of differentiable functions.',
      differences: 'Newton\'s method computes the full curvature Hessian matrix H to jump to the minimum in fewer steps; Gradient Descent uses only first derivatives.',
      whenToPreferThis: 'When d is large (d > 1,000) where computing/inverting a d×d matrix is impossible.',
      whenToPreferAlternative: 'When d is very small (d < 50) and quadratic convergence in 3-5 steps is required.',
    },
    {
      algorithm: 'Adam Optimizer',
      timeComplexity: 'O(d) per iteration',
      spaceComplexity: 'O(3d)',
      stabilityOrType: 'Adaptive First-Order Optimizer',
      similarities: 'Both use the gradient vector ∇J to update parameters.',
      differences: 'Adam computes individual adaptive learning rates for each parameter using exponentially smoothed first and second moments.',
      whenToPreferThis: 'For teaching fundamentals and verifying convex optimization theory.',
      whenToPreferAlternative: 'For training deep neural networks and complex non-convex architectures.',
    },
  ],
  commonMistakes: [
    {
      title: 'Setting an Excessive Learning Rate',
      misconception: 'Believing larger learning rates always reach the goal faster.',
      badCodeOrApproach: 'Setting lr = 10.0 without inspecting gradient magnitude.',
      correctApproach: 'Start with a conservative learning rate (e.g. 0.01 or 0.001) and use learning rate decay or adaptive optimizers.',
    },
    {
      title: 'Forgetting Feature Scaling Before Optimization',
      misconception: 'Running gradient descent on raw features spanning vastly different scales.',
      correctApproach: 'Always standardize features so loss contour lines are spherical, allowing straight-line descent toward the center.',
    },
  ],
  exercises: [
    {
      id: 'gd-ex-1',
      type: 'conceptual',
      question: 'What is the value of the gradient ∇f(θ) when the parameter θ reaches an unconstrained local minimum?',
      options: [
        'The zero vector [0, 0, ... 0]',
        'The identity vector [1, 1, ... 1]',
        'Infinity',
        'Equal to the learning rate',
      ],
      correctIndex: 0,
      explanation: 'At any local minimum of a differentiable function, the slope is horizontal (tangent plane is flat), meaning all partial derivatives equal zero: ∇f = 0.',
    },
    {
      id: 'gd-ex-2',
      type: 'challenge',
      question: 'Why does adding a "Momentum" term help Gradient Descent navigate narrow valleys?',
      options: [
        'It accumulates velocity along persistent downhill directions while canceling out oscillating cross-valley oscillations',
        'It makes the learning rate zero',
        'It converts the problem to integer programming',
        'It removes the need for gradients',
      ],
      correctIndex: 0,
      explanation:
        'Momentum acts like a heavy ball rolling down the landscape: inertia builds up in consistent directions (down the canyon) while opposing oscillations across steep canyon walls cancel out.',
    },
  ],
  summary: {
    coreIdea: 'Iteratively updates parameters in the direction of the negative gradient θ := θ - η∇J to minimize the loss function.',
    keyConditions: ['Differentiable loss function', 'Carefully chosen learning rate η', 'Features standardized'],
    complexitySummary: { time: 'O(d · iterations)', space: 'O(d)' },
    whenToUse: 'Whenever training machine learning models or neural networks on large datasets.',
    prerequisites: ['Partial derivatives', 'Vectors', 'Loss functions'],
    nextSteps: [
      { id: 'linear-regression', name: 'Linear Regression', reason: 'See how gradient descent fits a best-fit regression line on continuous data.' },
      { id: 'logistic-regression', name: 'Logistic Regression', reason: 'Observe gradient descent optimizing binary cross-entropy loss.' },
    ],
  },
};
