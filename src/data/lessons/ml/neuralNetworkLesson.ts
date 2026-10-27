import type { AlgorithmLesson } from '../../../types/algorithm';

export const neuralNetworkLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A layered computational learning model that approximates complex non-linear functions by forward-propagating signals through weighted neurons and optimizing parameters via chain-rule backpropagation gradient descent.',
  mainPurpose:
    'To model arbitrary continuous relationships and non-linear classification decision boundaries by automatically discovering hierarchical feature representations across hidden neuron layers.',
  whatIsIt: {
    overview:
      'A Feed-Forward Neural Network (often termed a Multilayer Perceptron or MLP) is an interconnected architecture of artificial computational units organized into an input layer, one or more hidden layers, and an output layer. In the forward pass, each neuron computes an affine linear combination of its incoming inputs plus a learnable bias scalar (z = Σ wᵢxᵢ + b) and passes the result through a non-linear activation function φ(z) (such as Sigmoid, ReLU, or Tanh). In the backward pass (Backpropagation), the network evaluates its prediction error against ground truth targets using a defined loss function (Mean Squared Error for continuous regression or Binary Cross-Entropy for classification). Applying the mathematical calculus chain rule recursively from the output layer back to the input layer yields exact partial derivatives ∂L/∂w and ∂L/∂b, enabling gradient descent to iteratively update all network parameters toward minimum empirical loss.',
    smallExample:
      'The classic XOR (Exclusive OR) logic gate: four points (0,0)→0, (0,1)→1, (1,0)→1, and (1,1)→0. Because a single straight line cannot separate the zeros from the ones, a linear perceptron achieves at most 75% accuracy. A neural network with a single hidden layer of 2 non-linear neurons bends the input feature space into a linearly separable coordinate geometry, allowing a single output neuron to achieve 100% perfect classification.',
  },
  whyUseIt: {
    problemSolved:
      'Overcomes the linear separability barrier of single-layer perceptrons and manual feature engineering by learning hierarchical non-linear representations directly from raw numerical data.',
    whyItMatters:
      'The Universal Approximation Theorem (Hornik et al., 1989; Cybenko, 1989) proves mathematically that a standard feed-forward neural network with a single hidden layer containing a finite number of non-linear neurons can approximate any continuous function on compact subsets of ℝⁿ to arbitrary precision. Neural networks serve as the computational foundation for all modern deep learning architectures.',
    whenToUse: [
      'Complex non-linear relationships exist between inputs and outputs where linear models fail.',
      'Raw numerical inputs require automatic representation learning without manual feature interaction design.',
      'Sufficient training samples exist (e.g. hundreds to millions of examples) to fit weights without immediate overfitting.',
      'Inference speed must be fast: evaluating a forward pass takes microsecond matrix multiplications.',
    ],
    whenToAvoid: [
      'Extremely small datasets (n < 50) where non-linear networks easily overfit training noise (use Linear Regression, Ridge, or SVM).',
      'Strict legal interpretability is required where regulators demand isolated single-variable coefficients (use Logistic Regression or Decision Trees).',
      'Tabular business data where decision tree ensembles (XGBoost, LightGBM, Random Forest) consistently outperform neural networks with less tuning.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Automated Medical Diagnostic Imaging',
      description:
        'Classifying dermatological skin lesions and retinal fundus photographs into malignant versus benign categories by processing pixel intensities through deep convolutional multilayer networks.',
      educationalVsProductionNote:
        'Production clinical decision support systems deployed in diagnostic hospital software following FDA approvals.',
    },
    {
      title: 'Autonomous Vehicle Steering & Perception',
      description:
        'Pioneered by Pomerleau (1989) with ALVINN, feed-forward neural networks map camera image pixels directly to continuous steering wheel angle commands.',
      educationalVsProductionNote:
        'Foundational milestone that demonstrated end-to-end continuous regression learning in safety-critical robotics.',
    },
    {
      title: 'Real-Time Financial Credit Fraud Detection',
      description:
        'Evaluating card transaction vectors (amount, merchant category, time delta, geographic distance) through an MLP to output a probability of fraud within 10 milliseconds.',
      educationalVsProductionNote:
        'Standard high-throughput risk inference engine running inside payment processing gateways (Visa/Mastercard).',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Forward Propagation (Weighted Sum & Activation)',
      description:
        'For each layer l, compute pre-activation z[l] = W[l]·a[l-1] + b[l]. Apply the layer non-linear activation a[l] = φ(z[l]) to produce signals for the next layer.',
    },
    {
      stepNumber: 2,
      title: 'Loss Evaluation',
      description:
        'Compare final network output ŷ with ground truth target y. Compute loss L using Mean Squared Error (Regression) or Binary Cross-Entropy (Classification).',
    },
    {
      stepNumber: 3,
      title: 'Output Layer Error Signal',
      description:
        'Calculate output delta error δ[L] = ∂L/∂z[L]. For regression with linear output, δ = 2(ŷ - y); for binary classification with sigmoid, δ = ŷ - y.',
    },
    {
      stepNumber: 4,
      title: 'Backpropagate Error through Hidden Layers',
      description:
        'Propagate error backward using the chain rule: δ[l] = (W[l+1]ᵀ · δ[l+1]) ⊙ φ\'(z[l]). Each neuron receives responsibility for downstream error proportional to its outgoing weights.',
    },
    {
      stepNumber: 5,
      title: 'Gradient Descent Parameter Update',
      description:
        'Compute parameter derivatives ∂L/∂W[l] = a[l-1]ᵀ · δ[l] and ∂L/∂b[l] = δ[l]. Update weights W := W - η·∇W and biases b := b - η·∇b.',
    },
  ],
  workedExample: {
    datasetDescription:
      'Single training example: input x = [1.0], target y = 1.0 (Regression task, MSE loss). Architecture: 1 Input -> 1 Hidden Neuron -> 1 Output Neuron. Hidden activation: Sigmoid, Output: Linear. Learning rate η = 0.5.',
    initialState:
      'Initial parameters: hidden weight w₁ = 0.5, hidden bias b₁ = 0.0. Output weight w₂ = 0.5, output bias b₂ = 0.0.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Forward Pass: Hidden Neuron',
        stateDisplay:
          'Pre-activation z₁ = w₁·x + b₁ = 0.5(1.0) + 0.0 = 0.500. Activation a₁ = σ(0.5) = 1 / (1 + e⁻⁰·⁵) ≈ 0.6225.',
        explanation: 'The input signal 1.0 is multiplied by weight 0.5 and squashed by the sigmoid function.',
        whyNecessary: 'Introduces non-linearity into the network computation.',
        beforeState: 'x = 1.0',
        afterState: 'z₁ = 0.500, a₁ = 0.6225',
        nextAction: 'Compute output neuron forward pass.',
        intermediateResult: 'a₁ = 0.6225',
      },
      {
        stepNumber: 2,
        operation: 'Forward Pass: Output Neuron & Loss',
        stateDisplay:
          'Pre-activation z₂ = w₂·a₁ + b₂ = 0.5(0.6225) + 0.0 = 0.3113. Linear activation ŷ = 0.3113. Loss L = (ŷ - y)² = (0.3113 - 1.0)² = (-0.6887)² ≈ 0.4744.',
        explanation: 'Output neuron produces prediction 0.3113, resulting in MSE loss of 0.4744.',
        whyNecessary: 'Quantifies prediction error against ground truth target 1.0.',
        beforeState: 'ŷ unknown',
        afterState: 'ŷ = 0.3113, Loss = 0.4744',
        nextAction: 'Compute output error signal δ₂.',
        intermediateResult: 'Error = -0.6887',
      },
      {
        stepNumber: 3,
        operation: 'Backprop: Output Layer Error Signal δ₂',
        stateDisplay:
          '∂L/∂ŷ = 2(ŷ - y) = 2(0.3113 - 1.0) = -1.3775. Linear output φ\'(z₂) = 1.0. Output delta δ₂ = ∂L/∂z₂ = -1.3775(1.0) = -1.3775.',
        explanation: 'The negative error signal indicates that increasing the output will decrease loss.',
        whyNecessary: 'Initializes the chain rule backward pass.',
        beforeState: 'Gradients unknown',
        afterState: 'δ₂ = -1.3775',
        nextAction: 'Backpropagate error to hidden neuron.',
        intermediateResult: 'δ₂ = -1.3775',
      },
      {
        stepNumber: 4,
        operation: 'Backprop: Hidden Layer Error Signal δ₁',
        stateDisplay:
          'Sigmoid derivative σ\'(z₁) = a₁(1 - a₁) = 0.6225(1 - 0.6225) = 0.6225(0.3775) ≈ 0.2350. Hidden delta δ₁ = (w₂ · δ₂) · σ\'(z₁) = (0.5 · -1.3775) · 0.2350 = -0.6887 · 0.2350 ≈ -0.1618.',
        explanation: 'Error propagates backward through weight w₂ and is scaled by the sigmoid derivative.',
        whyNecessary: 'Determines how much hidden neuron pre-activation contributed to overall loss.',
        beforeState: 'δ₁ unknown',
        afterState: 'δ₁ = -0.1618',
        nextAction: 'Calculate parameter gradients and apply update.',
        intermediateResult: 'δ₁ = -0.1618',
      },
      {
        stepNumber: 5,
        operation: 'Parameter Gradients & Gradient Descent Update',
        stateDisplay:
          '∂L/∂w₂ = a₁ · δ₂ = 0.6225(-1.3775) = -0.8575. ∂L/∂b₂ = δ₂ = -1.3775. ∂L/∂w₁ = x · δ₁ = 1.0(-0.1618) = -0.1618. ∂L/∂b₁ = δ₁ = -0.1618. Updates (η = 0.5): w₂ := 0.5 - 0.5(-0.8575) = 0.9288. b₂ := 0.0 - 0.5(-1.3775) = 0.6888. w₁ := 0.5 - 0.5(-0.1618) = 0.5809. b₁ := 0.0 - 0.5(-0.1618) = 0.0809.',
        explanation: 'All weights and biases increase, pulling network prediction closer to 1.0.',
        whyNecessary: 'Completes one full step of backpropagation gradient descent.',
        beforeState: 'w₁=0.5, w₂=0.5',
        afterState: 'Updated w₁=0.5809, w₂=0.9288',
        nextAction: 'Verification: new prediction ŷ_new ≈ 0.844 (Loss drops from 0.474 to 0.024!).',
        intermediateResult: 'Loss reduction > 94%',
      },
    ],
    finalState:
      'After 1 update step, prediction improves from 0.3113 to 0.8440, reducing MSE loss by 94.9%.',
  },
  advantages: [
    'Universal Non-Linear Function Approximation: Can learn complex multi-modal decision boundaries that defeat linear models.',
    'Automatic Latent Feature Extraction: Eliminates need for manual polynomial or trigonometric basis feature expansion.',
    'Highly Scalable Inference: Evaluation is simple O(weights) feed-forward matrix multiplication.',
    'Flexible Task Support: Seamlessly handles continuous regression, binary classification, and multi-class outputs.',
  ],
  limitations: [
    'Black-Box Interpretability: Millions of distributed floating-point weights lack isolated semantic meaning.',
    'Non-Convex Optimization: Loss surface possesses saddle points and local minima, requiring careful initialization and learning rate tuning.',
    'Prone to Overfitting: High capacity models easily memorize training noise without regularization (weight decay, dropout).',
    'Vanishing/Exploding Gradients: Deep networks with saturating activations (Sigmoid) suffer from exponentially decaying gradient signals.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(n · W) forward-backward computation time per epoch, where n is sample count and W is the total number of weights.',
    averageCaseMeaning:
      'O(epochs · n · W) for full-batch gradient descent backpropagation training.',
    worstCaseMeaning:
      'O(epochs · n · W) training time when optimization reaches maximum epoch threshold.',
    spaceComplexityMeaning:
      'O(W + n · N) memory to store network parameters and cached intermediate activations for backpropagation.',
  },
  relatedAlgorithms: [
    {
      name: 'Logistic Regression',
      comparison:
        'Logistic Regression is mathematically equivalent to a single-neuron neural network with sigmoid activation and no hidden layers.',
    },
    {
      name: 'Support Vector Machine (SVM)',
      comparison:
        'Linear SVM finds a maximum-margin linear hyperplane via convex quadratic programming; neural networks find non-linear representations via non-convex gradient descent.',
    },
    {
      name: 'Decision Trees',
      comparison:
        'Decision trees create orthogonal axis-aligned rectangular steps; neural networks produce smooth continuous curved decision surfaces.',
    },
  ],
  quiz: [
    {
      question: 'What is the role of non-linear activation functions (like Sigmoid, ReLU, or Tanh) in a Neural Network?',
      options: [
        'To allow the network to approximate non-linear functions; without them, stacking multiple linear layers collapses mathematically into a single linear transformation',
        'To ensure all network weights remain strictly positive',
        'To increase the speed of disk storage',
        'To prevent the computer CPU from overheating',
      ],
      correctIndex: 0,
      explanation:
        'A composition of linear functions is always strictly linear: W₂ · (W₁ · x + b₁) + b₂ = (W₂W₁) · x + (W₂b₁ + b₂). Without non-linear activations, any deep network is mathematically equivalent to a single-layer linear model.',
      optionExplanations: [
        'Correct! Non-linear activations prevent deep layers from collapsing into a trivial single linear matrix.',
        'Weights can be positive or negative regardless of activation functions.',
        'Activations compute in CPU/GPU memory, unrelated to disk speed.',
        'Activations provide mathematical representation capacity, not thermal management.',
      ],
    },
    {
      question: 'How does Backpropagation calculate gradients through multiple hidden layers?',
      options: [
        'By applying the calculus chain rule recursively backward from the output layer to the input layer',
        'By randomly guessing weight changes until loss decreases',
        'By sorting all weights from largest to smallest',
        'By converting all numbers into binary text strings',
      ],
      correctIndex: 0,
      explanation:
        'Backpropagation is an efficient implementation of the calculus chain rule: ∂L/∂w = (∂L/∂a) · (∂a/∂z) · (∂z/∂w). Computing error signals δ backward avoids recomputing downstream derivatives.',
      optionExplanations: [
        'Correct! Backpropagation uses the chain rule to propagate error gradients backward through layers.',
        'Random guessing describes random search, which is exponentially inefficient in high dimensions.',
        'Sorting weights has no bearing on mathematical gradient calculation.',
        'Neural computations use double-precision floating point numbers.',
      ],
    },
    {
      question: 'What is the "Vanishing Gradient Problem" commonly observed with Sigmoid activations in deep networks?',
      options: [
        'The sigmoid derivative maxes out at 0.25; multiplying these small fractions across many layers causes gradients to shrink exponentially toward zero',
        'The weights disappear from computer RAM',
        'The learning rate is automatically multiplied by zero',
        'The output prediction becomes infinity',
      ],
      correctIndex: 0,
      explanation:
        'Because σ\'(z) = σ(z)(1 - σ(z)) has a maximum value of 0.25 (at z=0), backpropagating through 5 layers multiplies gradients by (0.25)⁵ ≈ 0.00097. Early hidden layers receive virtually zero gradient updates, halting learning. This led to the adoption of ReLU.',
      optionExplanations: [
        'Correct! The derivative of sigmoid is bounded in [0, 0.25], causing exponential gradient decay across deep layers.',
        'Weights remain allocated in memory.',
        'Learning rate is a fixed hyperparameter not modified by the activation.',
        'Gradients vanish toward zero rather than exploding to infinity.',
      ],
    },
    {
      question: 'Why does a continually decreasing training loss NOT guarantee that a neural network will perform well on future real-world data?',
      options: [
        'The network may be overfitting (memorizing training sample noise and outliers) rather than learning generalizable patterns',
        'Because neural networks only work on Tuesdays',
        'Because training loss is always completely fake',
        'Because gradient descent only moves in circles',
      ],
      correctIndex: 0,
      explanation:
        'A high-capacity neural network can achieve near-zero training loss by memorizing individual training points (overfitting). On unseen test data, errors can spike dramatically. Generalization requires validation monitoring and regularization.',
      optionExplanations: [
        'Correct! Overfitting allows a model to achieve zero training error while failing completely on unseen test data.',
        'Temporal superstition is irrelevant to statistical learning.',
        'Training loss is a genuine mathematical evaluation of training error.',
        'Gradient descent follows the direction of steepest loss decrease.',
      ],
    },
    {
      question: 'Why should neural network weights NOT be initialized to all zeros?',
      options: [
        'All neurons in the same layer would calculate identical outputs and receive identical gradients, preventing symmetry breaking',
        'Because zero causes a division by zero in the computer ALU',
        'Because the operating system crashes on zero weights',
        'Because zero weights force the learning rate to zero',
      ],
      correctIndex: 0,
      explanation:
        'If all weights are initialized to zero, every neuron in a hidden layer computes z = 0 and produces identical activations. During backpropagation, all neurons receive identical gradients and update to identical values (symmetry). Small random weights break this symmetry.',
      optionExplanations: [
        'Correct! Zero initialization creates symmetry where all neurons learn identical redundant features.',
        'Zero is a valid floating point number; no division occurs in forward affine sums.',
        'Operating systems have no problem processing zero values.',
        'The learning rate is an independent scalar hyperparameter.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Inspired by biological neurobiology models (McCulloch & Pitts, 1943; Rosenblatt\'s Perceptron, 1958) and generalized to multilayer architectures via backpropagation popularized by Rumelhart, Hinton, and Williams in 1986. Named for its network graph of interconnected artificial neurons.',
    problemSolved:
      'Solves arbitrary non-linear supervised pattern recognition, regression, and classification tasks without hand-crafting explicit mathematical formulas.',
    problemNotSolved:
      'Does not provide deductive logical proofs for its predictions and cannot extrapolate reliably far beyond the bounding box of its training distribution.',
    whyLearn:
      'Neural networks are the foundational algorithmic engine powering modern artificial intelligence, computer vision, natural language transformers, and autonomous systems.',
    prerequisites: ['Vector Dot Products & Matrix Multiplication', 'Derivative Chain Rule in Calculus', 'Gradient Descent Optimization'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can an algorithm learn non-linear decision boundaries and complex multi-variable interactions directly from data without requiring humans to guess the exact polynomial formulas?',
    naiveApproachInefficiency:
      'Linear models fail completely on non-linear problems like XOR. Manually creating polynomial terms (x₁², x₁x₂, x₂³) causes combinatorial explosion in high dimensions (d features produces O(dᵖ) terms).',
    coreIdeaUsed:
      'Hierarchical Representation Learning: layer multiple stages of non-linear squashing functions, allowing early layers to learn simple features (edges) and later layers to compose them into complex concepts.',
    utilityExplanation:
      'Backpropagation provides an efficient O(weights) algorithm to compute exact gradients for every parameter simultaneously.',
    workingConditions: [
      'Continuous numerical inputs.',
      'Sufficient representative training examples.',
      'Appropriate learning rate and activation function.',
    ],
    whenAnotherIsBetter:
      'For small tabular datasets with missing values, Gradient Boosted Trees (XGBoost/LightGBM) train faster and require less hyperparameter tuning.',
    analogyOrRealLifeExample:
      'Assembly line manufacturing: the first worker cuts raw metal into basic shapes (Input/Hidden 1), the second worker welds shapes into components (Hidden 2), and the inspector stamps the final product (Output). If the final product has a defect, feedback is sent back down the line to adjust each worker\'s tool settings.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Training dataset of feature vectors x ∈ ℝᵈ with numerical targets y (continuous for regression, binary {0, 1} for classification).',
    expectedOutput: 'Trained weight matrices W and bias vectors b that map any query vector to a predicted output ŷ.',
    constraints: ['Input features must be finite real numbers', 'Binary classification targets must be in {0, 1}', 'No ragged rows'],
    preconditions: ['Inputs should be standardized (zero mean, unit variance) to avoid saturated activations and vanishing gradients'],
    specialCases: ['Zero variance constant features', 'Identical duplicate inputs with conflicting labels', 'Single sample datasets'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Excessive learning rates or unstandardized inputs cause exploding gradients, triggering the built-in divergence guard.',
  },
  coreIntuition: {
    simpleExplanation:
      'Imagine tuning a giant radio with dozens of dials to pick up a clear song. Each dial is a weight. Forward pass plays the current sound; backpropagation tells you exactly which way and how much to turn each individual dial to reduce static.',
    keyDrivingDecision:
      'Using the calculus chain rule to calculate the exact gradient ∂L/∂w for every single parameter simultaneously in a single backward pass.',
    whyRepeatedOperationWorks:
      'Each gradient descent step moves the parameter vector in the direction of steepest loss descent on the empirical loss landscape.',
    paradigmSpecificDetail:
      'End-to-End Differentiable Optimization: every layer operation must have an analytical derivative to allow gradient flow from loss back to inputs.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function trainNeuralNetwork(X, y, layers, lr, epochs):',
      '  weights, biases := initializeGlorot(layers)',
      '  for epoch from 1 to epochs do:',
      '    grad_W := zeros_like(weights)',
      '    grad_b := zeros_like(biases)',
      '    for each (x_i, y_i) in dataset do:',
      '      // 1. Forward Pass',
      '      activations, z_values := forward(x_i, weights, biases)',
      '      // 2. Output Error Signal',
      '      delta[L] := outputDelta(activations[L], y_i)',
      '      // 3. Backpropagate Hidden Deltas',
      '      for l from L-1 down to 1 do:',
      '        delta[l] := (weights[l].T * delta[l+1]) * phi_prime(z_values[l])',
      '      // 4. Accumulate Sample Gradients',
      '      grad_W += outerProduct(activations[l-1], delta[l])',
      '      grad_b += delta[l]',
      '    // 5. Parameter Update',
      '    weights := weights - lr * (grad_W / n)',
      '    biases := biases - lr * (grad_b / n)',
      '  return weights, biases',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'weights, biases := initializeGlorot(layers)', explanation: 'Random initialization with variance scaled by fan-in and fan-out.' },
      { lineIndex: 6, lineText: 'activations, z_values := forward(...)', explanation: 'Forward propagate input through each layer.' },
      { lineIndex: 8, lineText: 'delta[L] := outputDelta(...)', explanation: 'Compute output error signal from loss derivative.' },
      { lineIndex: 11, lineText: 'delta[l] := (weights[l].T * delta[l+1]) * phi_prime(...)', explanation: 'Recursive chain rule backpropagation.' },
      { lineIndex: 15, lineText: 'weights := weights - lr * (grad_W / n)', explanation: 'Full-batch gradient descent parameter update.' },
    ],
    terminationCondition: 'Training completes when designated epochs elapse or when loss stabilizes within convergence tolerance.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function runNeuralNetwork(customInputs?: number[][], customTargets?: number[], config?: NeuralNetworkConfig): AlgorithmStep[]',
    code: `export function forwardPropagate(
  x: number[],
  network: NetworkWeights,
  layerConfigs: NetworkLayerConfig[]
): ForwardPassResult {
  const activations: number[][] = [[...x]];
  const zValues: number[][] = [[]];
  let currentA = [...x];

  for (let l = 0; l < network.weights.length; l++) {
    const W = network.weights[l];
    const b = network.biases[l];
    const actType = layerConfigs[l + 1].activation;
    const nOut = W[0].length;

    const zLayer: number[] = new Array<number>(nOut);
    const aLayer: number[] = new Array<number>(nOut);

    for (let j = 0; j < nOut; j++) {
      let sum = b[j];
      for (let i = 0; i < currentA.length; i++) {
        sum += currentA[i] * W[i][j];
      }
      zLayer[j] = sum;
      aLayer[j] = activate(sum, actType);
    }
    zValues.push(zLayer);
    activations.push(aLayer);
    currentA = aLayer;
  }
  return { activations, zValues, output: currentA[0] };
}`,
    inputValidation: 'Enforces n >= 2, non-empty features, validates binary targets {0, 1} for classification, and catches non-finite values.',
    variables: [
      { name: 'currentA', type: 'number[]', purpose: 'Activation vector output from the previous layer' },
      { name: 'W', type: 'number[][]', purpose: 'Weight matrix connecting layer l to layer l+1' },
      { name: 'b', type: 'number[]', purpose: 'Bias vector for layer l+1' },
      { name: 'zLayer', type: 'number[]', purpose: 'Affine pre-activation weighted sums' },
    ],
    lineByLine: [
      { line: 7, code: 'let currentA = [...x];', explanation: 'Initializes activation with raw input vector.' },
      { line: 18, code: 'sum += currentA[i] * W[i][j];', explanation: 'Computes inner product between activations and column weight vector.' },
      { line: 22, code: 'aLayer[j] = activate(sum, actType);', explanation: 'Applies non-linear activation (Sigmoid, ReLU, or Tanh).' },
    ],
    returnExplanation: 'Returns complete step snapshots tracking weights, biases, activations, error deltas, and loss history.',
    commonBugs: [
      'Initializing all weights to zero, causing symmetry and preventing learning.',
      'Using linear output for classification instead of Sigmoid, producing uncalibrated predictions outside [0, 1].',
      'Applying un-clamped log in cross-entropy, causing NaN when p=0 or p=1.',
    ],
    edgeCaseHandling: [
      'Clamps Sigmoid input z to [-40, 40] to avoid floating point overflow in exp(-z).',
      'Divergence guard safely terminates training if loss exceeds 1e6 or becomes non-finite.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Because every component of the feed-forward network (weighted sums, activations, and loss functions) is continuously differentiable almost everywhere, the multivariable calculus chain rule guarantees that backpropagation computes the exact gradient of the loss function with respect to every weight and bias. Moving in the negative gradient direction is mathematically proven to decrease loss locally on any smooth surface.',
    formalProof: {
      method: 'Convex Loss Minimization',
      invariantOrClaim: 'The backpropagation error signal δ[l] = ∂L/∂z[l] satisfies the recursive backward recurrence relation δ[l] = (W[l+1]ᵀ · δ[l+1]) ⊙ φ\'(z[l]).',
      initialization: 'For output layer L, by chain rule ∂L/∂z_j[L] = (∂L/∂a_j[L]) · (∂a_j[L]/∂z_j[L]) = (∂L/∂a_j[L]) · φ\'(z_j[L]). This matches the base case definition of δ[L].',
      maintenance: 'For hidden neuron i in layer l, its output a_i[l] influences loss L exclusively through the pre-activations z_j[l+1] of all neurons j in layer l+1. By multivariable chain rule: ∂L/∂a_i[l] = Σ_j (∂L/∂z_j[l+1]) · (∂z_j[l+1]/∂a_i[l]) = Σ_j δ_j[l+1] · W_{i,j}[l+1]. Multiplying by ∂a_i[l]/∂z_i[l] = φ\'(z_i[l]) yields δ_i[l] = [Σ_j W_{i,j}[l+1] · δ_j[l+1]] · φ\'(z_i[l]).',
      termination: 'Recurrence proceeds backward until l = 1 (first hidden layer). Parameter gradients ∂L/∂W_{i,j}[l] = a_i[l-1] · δ_j[l] are exact partial derivatives.',
      conclusion: 'Backpropagation computes the exact analytical gradient of empirical loss with respect to all network weights and biases.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(n · W)', explanation: 'Single epoch forward-backward pass through n samples and W weights.', condition: 'Fast convergence on linearly separable data.' },
    averageCase: { complexity: 'O(epochs · n · W)', explanation: 'Full-batch backpropagation gradient descent over fixed epochs.', condition: 'Standard non-linear optimization.' },
    worstCase: { complexity: 'O(epochs · n · W)', explanation: 'Full epoch budget exhausted on complex loss surface.', condition: 'Ill-conditioned non-convex landscape.' },
    auxiliarySpace: { complexity: 'O(W + n · N)', explanation: 'Storage for W network weights, biases, and cached forward activations.', },
    totalMemory: 'O(n · d) for dataset + O(W) for weights + O(epochs) for loss history.',
    bigOExplanation: 'Forward pass inference is O(W) operations, executing in microseconds per sample.',
    scalingBehavior: 'Linear in sample size n and weight count W; scales well on matrix hardware accelerators.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Universal function approximation capability.',
      'Flexible architecture configurable to any problem domain.',
      'Automatic representation learning without manual feature engineering.',
      'Continuous probabilistic outputs via Sigmoid.',
    ],
    limitations: [
      'Non-convex loss surface with risk of getting trapped in poor local minima.',
      'Black box nature makes auditing and regulation challenging.',
      'Requires substantial hyperparameter tuning (learning rate, layers, activations).',
    ],
    memoryTradeOffs: [
      'Tiny educational networks (W < 100) consume negligible memory (< 100 KB).',
    ],
    poorChoiceScenarios: [
      'Simple linear problems where Logistic Regression provides identical accuracy with 100% transparency.',
      'Tabular business datasets with categorical columns where gradient boosted trees excel.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Logistic Regression',
      timeComplexity: 'O(epochs · n · d)',
      spaceComplexity: 'O(d)',
      stabilityOrType: 'Convex Single-Neuron Linear Classifier',
      similarities: 'Both optimize weights via gradient descent on loss functions.',
      differences: 'Logistic regression has no hidden layers and can only learn linear boundaries; MLPs add hidden non-linear layers to solve non-linear problems.',
      whenToPreferThis: 'When data is non-linearly separable (like XOR).',
      whenToPreferAlternative: 'When data is linearly separable and interpretability is required.',
    },
    {
      algorithm: 'Support Vector Machine (SVM)',
      timeComplexity: 'O(n² · d) to O(n³)',
      spaceComplexity: 'O(d) or O(n_sv · d)',
      stabilityOrType: 'Convex Maximum-Margin Classifier',
      similarities: 'Both learn complex decision boundaries in feature space.',
      differences: 'SVM optimizes geometric margin via convex quadratic programming; Neural Networks optimize empirical loss via non-convex gradient descent.',
      whenToPreferThis: 'When streaming data or very large sample sizes favor SGD training.',
      whenToPreferAlternative: 'When mathematical guarantees against local minima are mandatory.',
    },
  ],
  commonMistakes: [
    {
      title: 'Initializing All Weights to Zero',
      misconception: 'Assuming zero is a safe neutral starting point for network weights.',
      badCodeOrApproach: 'Setting weights = zeros() in layer initialization.',
      correctApproach: 'Always use random initialization (Glorot/Xavier or He) to break symmetry so neurons learn distinct features.',
    },
    {
      title: 'Setting Learning Rate Too High',
      misconception: 'Believing higher learning rates always make the model learn faster.',
      badCodeOrApproach: 'Setting learning rate η = 10.0 or higher.',
      correctApproach: 'Use moderate learning rates (e.g. 0.01 to 0.2); excessively high rates cause gradient explosion and divergence.',
    },
  ],
  exercises: [
    {
      id: 'nn-ex-1',
      type: 'conceptual',
      question: 'A neuron has input x = [2, -1], weights w = [0.5, 2.0], bias b = 1.0. What is its pre-activation weighted sum z?',
      options: ['0.0', '1.0', '-1.0', '2.0'],
      correctIndex: 0,
      explanation: 'z = (2 · 0.5) + (-1 · 2.0) + 1.0 = 1.0 - 2.0 + 1.0 = 0.0.',
    },
    {
      id: 'nn-ex-2',
      type: 'challenge',
      question: 'What is the activation of the neuron above if it uses the standard Sigmoid function σ(z)?',
      options: ['0.50', '1.00', '0.00', '0.25'],
      correctIndex: 0,
      explanation: 'σ(0.0) = 1 / (1 + e⁰) = 1 / (1 + 1) = 1 / 2 = 0.50.',
    },
  ],
  summary: {
    coreIdea: 'Maps inputs to predictions through weighted layers and non-linear squashing activations, updating parameters via chain-rule backpropagation gradient descent.',
    keyConditions: ['Inputs standardized', 'Non-zero random weight initialization', 'Appropriate learning rate to avoid divergence'],
    complexitySummary: { time: 'O(epochs · n · W)', space: 'O(W + n · N)' },
    whenToUse: 'When modeling complex non-linear relationships with continuous differentiable parameters.',
    prerequisites: ['Calculus Chain Rule', 'Matrix Dot Products', 'Gradient Descent'],
    nextSteps: [
      { id: 'gradient-descent', name: 'Gradient Descent', reason: 'Review standalone mathematical loss optimization.' },
      { id: 'logistic-regression', name: 'Logistic Regression', reason: 'Compare single-neuron model with multi-layer networks.' },
    ],
  },
};
