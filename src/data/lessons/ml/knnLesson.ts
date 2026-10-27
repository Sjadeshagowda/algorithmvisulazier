import type { AlgorithmLesson } from '../../../types/algorithm';

export const knnLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A non-parametric, lazy supervised learning algorithm that classifies a new query sample based on the plurality vote of its K closest neighbors in feature space according to a distance metric.',
  mainPurpose:
    'To perform non-linear classification or regression without making any prior assumptions about the underlying data distribution.',
  whatIsIt: {
    overview:
      'K-Nearest Neighbors (KNN) is one of the most intuitive algorithms in machine learning, embodying the proverb "birds of a feather flock together." It stores all historical training instances without fitting an explicit parametric equation. When a new query point arrives, KNN calculates the distance between the query and every stored point, isolates the K closest points, and predicts the majority class among those neighbors.',
    smallExample:
      'Given an unknown fruit with weight 150g and diameter 7cm, KNN measures distances to all labeled fruits. If K=3 and the 3 nearest neighbors are [Apple, Apple, Orange], the algorithm predicts "Apple" by a 2-to-1 majority vote.',
  },
  whyUseIt: {
    problemSolved:
      'Classifying complex, irregular, or non-linearly shaped distributions without needing to train parameters, design complex equations, or tune neural architectures.',
    whyItMatters:
      'KNN provides an instant, zero-training baseline. It can learn intricate non-linear decision boundaries simply through the geometric layout of neighboring data points.',
    whenToUse: [
      'The decision boundary between classes is irregular, curved, or non-linear.',
      'Training data is relatively small to medium-sized (e.g. n < 50,000 samples).',
      'Feature dimensionality is modest (e.g. d < 20) to avoid the curse of dimensionality.',
      'Zero training time is desired (real-time ingestion of labeled points).',
    ],
    whenToAvoid: [
      'High-dimensional datasets (e.g. text TF-IDF vectors or raw image pixels with thousands of features).',
      'Ultra-low-latency real-time inference systems on massive datasets (querying requires scanning all n points).',
      'Severely imbalanced classes where the dominant class overwhelms local neighborhoods.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Personalized Recommender Systems',
      description:
        'Recommending movies or music to users by finding the K other users with the highest cosine similarity in listening history (collaborative filtering).',
      educationalVsProductionNote:
        'Standard user-based collaborative filtering pattern, often accelerated using Approximate Nearest Neighbor (ANN) indexers like FAISS or HNSW.',
    },
    {
      title: 'Handwritten Digit Recognition (MNIST)',
      description:
        'Classifying digitized 28x28 handwritten numerals by measuring pixel-wise Euclidean distance to reference digit templates.',
      educationalVsProductionNote:
        'Achieved historical 95%+ accuracy on MNIST before convolutional networks, serving as the canonical non-parametric benchmark.',
    },
    {
      title: 'Credit Scoring & Anomaly Detection',
      description:
        'Assessing new loan applicants by comparing their financial profiles against the repayment histories of the K most similar historical borrowers.',
      educationalVsProductionNote:
        'Frequently used in case-based reasoning systems in underwriting and insurance claims auditing.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Store Labeled Training Dataset (Lazy Learning)',
      description:
        'KNN does not learn weights or compute gradients; it simply stores the training feature vectors and their associated class labels.',
    },
    {
      stepNumber: 2,
      title: 'Compute Distance from Query to All Points',
      description:
        'Measure distance using Euclidean metric: d(x, q) = √[ Σ (xᵢ - qᵢ)² ] or Manhattan metric across all n training observations.',
    },
    {
      stepNumber: 3,
      title: 'Sort Distances and Identify Top K Neighbors',
      description:
        'Sort all n distances in ascending order and select the K instances with the smallest geometric distance to the query.',
    },
    {
      stepNumber: 4,
      title: 'Conduct Majority Vote (or Distance-Weighted Vote)',
      description:
        'Tally the class labels of the K neighbors. The query point is assigned to the class with the most votes (or highest weighted vote).',
    },
  ],
  workedExample: {
    datasetDescription:
      '5 training points: A(10, 20, Class 0), B(15, 25, Class 0), C(40, 50, Class 1), D(45, 55, Class 1), E(50, 60, Class 1). Query Q = (20, 30), K = 3.',
    initialState: 'Query Q(20, 30), K = 3 neighbors to find.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Calculate Euclidean distance to all 5 points',
        stateDisplay: 'd(A) = √[(10-20)² + (20-30)²] = √200 ≈ 14.14; d(B) = √[(15-20)² + (25-30)²] = √50 ≈ 7.07; d(C) = √[(40-20)² + (50-30)²] = √800 ≈ 28.28; d(D) = √[(45-20)² + (55-30)²] = √1250 ≈ 35.36; d(E) = √[(50-20)² + (60-30)²] = √1800 ≈ 42.43',
        explanation: 'Compute straight-line distance from query (20, 30) to every point in the feature space.',
        whyNecessary: 'Proximity in feature space corresponds to similarity under the KNN assumption.',
        beforeState: 'Unmeasured distances',
        afterState: 'All 5 distances computed',
        nextAction: 'Sort points by distance ascending.',
        intermediateResult: 'Distances: B(7.07), A(14.14), C(28.28), D(35.36), E(42.43)',
      },
      {
        stepNumber: 2,
        operation: 'Select top K = 3 nearest neighbors',
        stateDisplay: 'Top 3 closest: 1. B (dist=7.07, Class 0), 2. A (dist=14.14, Class 0), 3. C (dist=28.28, Class 1)',
        explanation: 'Filter down to the 3 instances with minimal distance.',
        whyNecessary: 'Isolates the local neighborhood around query point Q.',
        beforeState: '5 sorted distances',
        afterState: 'Top 3 neighbors selected: {B, A, C}',
        nextAction: 'Count class votes among the 3 neighbors.',
        intermediateResult: 'Neighborhood: 2 points from Class 0, 1 point from Class 1.',
      },
      {
        stepNumber: 3,
        operation: 'Perform majority voting',
        stateDisplay: 'Class 0: 2 votes (B, A). Class 1: 1 vote (C).',
        explanation: 'Class 0 has 2 votes out of 3 (66.7% majority).',
        whyNecessary: 'Resolves consensus decision.',
        beforeState: 'Tallying votes',
        afterState: 'Class 0 wins vote',
        nextAction: 'Assign predicted label to query point Q.',
        intermediateResult: 'Prediction = Class 0',
      },
    ],
    finalState: 'Query (20, 30) classified as Class 0 with 66.7% confidence (2 of 3 neighbors).',
  },
  advantages: [
    'Zero training phase (O(1) model training): simply store points in memory.',
    'Naturally models non-linear, multi-modal decision boundaries without mathematical assumptions.',
    'Equally applicable to classification (majority vote) and regression (local average).',
    'Easily accommodates new training data on-the-fly without retraining.',
  ],
  limitations: [
    'Computationally expensive inference: O(n · d) per query point.',
    'Curse of dimensionality: in high dimensions, Euclidean distances become equidistant and lose discriminative power.',
    'Highly sensitive to feature scale: features with larger numerical ranges dominate distance calculations.',
    'Large memory footprint: must keep entire training dataset in RAM.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(1) training time (storing data); O(log n) query time if indexed using spatial trees like KD-Tree or Ball-Tree in low dimensions (d < 10).',
    averageCaseMeaning:
      'O(n · d) query time using brute-force search over n points with d features.',
    worstCaseMeaning:
      'O(n · d + n log K) brute-force query time with heap-based nearest neighbor selection.',
    spaceComplexityMeaning:
      'O(n · d) memory required to store the full training dataset.',
  },
  relatedAlgorithms: [
    {
      name: 'Radius Nearest Neighbors',
      comparison:
        'Instead of picking a fixed K points, includes all neighbors within a fixed geometric radius r.',
    },
    {
      name: 'KD-Tree / Ball Tree Search',
      comparison:
        'Spatial tree structures that partition space to speed up nearest-neighbor queries from O(n) to O(log n).',
    },
    {
      name: 'K-Means Clustering',
      comparison:
        'Unsupervised algorithm that clusters unlabeled data by iteratively moving K centroids; KNN is supervised and queries existing labeled points.',
    },
  ],
  quiz: [
    {
      question: 'What happens to the decision boundary when K in KNN is set to K = 1?',
      options: [
        'The boundary becomes completely linear',
        'The boundary becomes highly complex, jagged, and sensitive to individual noise points (overfitting)',
        'The boundary collapses to a single point',
        'All points are assigned to the majority class',
      ],
      correctIndex: 1,
      explanation:
        'With K = 1, every individual training point creates its own Voronoi cell. The model achieves 0% training error but suffers from high variance and severe overfitting to noise.',
      optionExplanations: [
        'Linear boundaries arise from large K or parametric linear models, not K=1.',
        'Correct! K=1 produces highly jagged, irregular boundaries prone to overfitting.',
        'The boundary spans the entire feature space.',
        'Majority voting across the whole dataset occurs when K approaches n, not 1.',
      ],
    },
    {
      question: 'Why is feature standardization (scaling) critical for K-Nearest Neighbors?',
      options: [
        'Because unscaled features cause memory leaks',
        'Because features with larger numerical ranges will dominate Euclidean distance calculations',
        'Because KNN cannot calculate square roots on large numbers',
        'To make the number of classes equal',
      ],
      correctIndex: 1,
      explanation:
        'If one feature is Salary ($50,000 to $100,000) and another is Age (20 to 60), the Salary differences will completely overpower Age in Euclidean distance: √[(ΔSalary)² + (ΔAge)²].',
      optionExplanations: [
        'Memory usage is independent of feature scale.',
        'Correct! Euclidean distance treats 1 unit in salary identically to 1 unit in age unless normalized.',
        'Hardware handles arbitrary floating point magnitudes.',
        'Scaling does not alter class frequencies.',
      ],
    },
    {
      question: 'Why is an odd value of K usually chosen for binary classification?',
      options: [
        'To prevent tie votes between the two classes',
        'Because odd numbers compute faster',
        'Odd K values guarantee 100% accuracy',
        'To satisfy the triangle inequality',
      ],
      correctIndex: 0,
      explanation:
        'In binary classification (two classes), an odd K guarantees that one class will always receive a strict majority of votes, eliminating tie-breaking ambiguity.',
      optionExplanations: [
        'Correct! An odd K prevents 50/50 split ties in two-class problems.',
        'Odd and even number comparisons take identical processor cycles.',
        'Accuracy depends on data quality and optimal K selection.',
        'The triangle inequality is a property of metric spaces, independent of K.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Proposed by Evelyn Fix and Joseph Hodges in 1951, later expanded by Thomas Cover in 1967. Named for selecting the "K" closest neighbor vectors.',
    problemSolved:
      'Assigns a class label or continuous numerical estimate to a query based on the local neighborhood consensus.',
    problemNotSolved:
      'Does not provide an analytical mathematical formula or explain the global structural dependencies between features.',
    whyLearn:
      'Demonstrates the power of non-parametric instance-based learning and illustrates the fundamental bias-variance trade-off governed by K.',
    prerequisites: ['Euclidean distance formula', 'Vector algebra', 'Basic sorting and ranking'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can we accurately classify samples when the boundary between classes is a complex, swirling, or disjoint geometric shape that cannot be separated by straight lines?',
    naiveApproachInefficiency:
      'Linear classifiers fail completely on concentric circles or interleaved spiral data.',
    coreIdeaUsed:
      'Local geometric continuity: instances close together in feature space are overwhelmingly likely to share the same category.',
    utilityExplanation:
      'Requires zero training iterations and naturally adapts to arbitrary decision boundary shapes.',
    workingConditions: [
      'Numerical features with comparable scales.',
      'Low to moderate dimensionality (d < 20).',
      'Sufficient representative training data in all regions of feature space.',
    ],
    whenAnotherIsBetter:
      'When query speed is paramount on massive datasets (millions of points), use Logistic Regression, Random Forests, or Neural Networks.',
    analogyOrRealLifeExample:
      'If you move to a new neighborhood and want to guess the local political affiliation, you ask your 5 immediate next-door neighbors and go with the majority.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Training dataset of labeled points {(x_i, y_i)} and an unlabeled query vector q.',
    expectedOutput: 'Predicted discrete class label (classification) or mean continuous value (regression).',
    constraints: ['K must be a positive integer where 1 <= K <= n', 'Features must be numerical real numbers'],
    preconditions: ['Features must be standardized or normalized to equal scales'],
    specialCases: ['K = 1 (nearest neighbor)', 'K = n (predicts global majority class)'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Unnormalized features allow the largest variable to dictate 99% of neighbor selection; excessive dimensions lead to distance concentration.',
  },
  coreIntuition: {
    simpleExplanation:
      'Find the K closest historical examples to your query point and let them vote on the query’s classification.',
    keyDrivingDecision:
      'Tuning hyperparameter K controls the bias-variance trade-off: small K = high variance (overfitting); large K = high bias (underfitting).',
    whyRepeatedOperationWorks:
      'Computing distances from the query point to all stored points systematically ranks every candidate by geometric proximity.',
    paradigmSpecificDetail:
      'Instance-Based / Memory-Based Learning: delays computation until inference time rather than building an explicit abstract model.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function classifyKNN(trainingData, query, K):',
      '  distances := []',
      '  for each point in trainingData do:',
      '    d := sqrt(sum((point.x[i] - query[i])^2 for i in 1..dim))',
      '    distances.append({ distance: d, label: point.label })',
      '  sort distances by distance ascending',
      '  nearest := distances[0 .. K-1]',
      '  return majorityVote(nearest.labels)',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'distances := []', explanation: 'Initialize list to hold distance calculations.' },
      { lineIndex: 3, lineText: 'd := sqrt(...)', explanation: 'Compute Euclidean distance between query and training point.' },
      { lineIndex: 5, lineText: 'sort distances by distance ascending', explanation: 'Rank all candidates from closest to farthest.' },
      { lineIndex: 6, lineText: 'nearest := distances[0 .. K-1]', explanation: 'Extract the top K closest neighbors.' },
      { lineIndex: 7, lineText: 'return majorityVote(nearest.labels)', explanation: 'Return the most frequent class label among the K neighbors.' },
    ],
    terminationCondition: 'Terminates after scanning all n points and tallying the K votes.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function predictKNN(points: DataPoint2D[], query: {x: number, y: number}, k: number): number',
    code: `export function predictKNN(
  points: { x: number; y: number; label: number }[],
  query: { x: number; y: number },
  k = 3
): number {
  if (points.length === 0) throw new Error("Dataset cannot be empty");
  const validK = Math.max(1, Math.min(points.length, k));

  // Compute Euclidean distances
  const distances = points.map((p, idx) => {
    const dx = p.x - query.x;
    const dy = p.y - query.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return { idx, dist, label: p.label };
  });

  // Sort ascending by distance
  distances.sort((a, b) => a.dist - b.dist);

  // Take top K
  const topK = distances.slice(0, validK);

  // Tally votes
  const votes: Record<number, number> = {};
  for (const item of topK) {
    votes[item.label] = (votes[item.label] || 0) + 1;
  }

  let bestLabel = topK[0].label;
  let maxVotes = -1;
  for (const [labelStr, count] of Object.entries(votes)) {
    if (count > maxVotes) {
      maxVotes = count;
      bestLabel = Number(labelStr);
    }
  }

  return bestLabel;
}`,
    inputValidation: 'Validates that dataset is non-empty and bounds K between 1 and dataset size n.',
    variables: [
      { name: 'validK', type: 'number', purpose: 'Sanitized number of neighbors' },
      { name: 'distances', type: 'Array', purpose: 'Pairs of distance and point label' },
      { name: 'topK', type: 'Array', purpose: 'Subarray of the K nearest neighbors' },
      { name: 'votes', type: 'Record<number, number>', purpose: 'Frequency map of class votes' },
    ],
    lineByLine: [
      { line: 7, code: 'const distances = points.map(...)', explanation: 'Compute distance to every point in dataset.' },
      { line: 15, code: 'distances.sort((a, b) => a.dist - b.dist);', explanation: 'Sort distances in ascending order.' },
      { line: 18, code: 'const topK = distances.slice(0, validK);', explanation: 'Slice first K nearest elements.' },
      { line: 22, code: 'votes[item.label] = (votes[item.label] || 0) + 1;', explanation: 'Count frequency of each class in neighborhood.' },
    ],
    returnExplanation: 'Returns the winning class label with the highest vote count.',
    commonBugs: [
      'Setting K larger than the total number of training points.',
      'Tie votes when K is an even number in binary classification.',
      'Failing to standardize features before distance calculations.',
    ],
    edgeCaseHandling: [
      'Clamps K to [1, points.length].',
      'Defaults tie-breakers to the nearest neighbor (1-NN).',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Under the Cover-Hart theorem (1967), as the number of training samples n → ∞, the probability of error for 1-Nearest Neighbor is at most twice the optimal Bayes error rate. As K → ∞ and K/n → 0, KNN error approaches the theoretical Bayes limit.',
    formalProof: {
      method: 'Geometric Monotonicity',
      invariantOrClaim: 'The asymptotic risk R(1-NN) ≤ 2R*, where R* is the Bayes risk (the irreducible minimum theoretical error rate).',
      initialization: 'Let x be a query point and x\' be its nearest neighbor in a dataset of size n.',
      maintenance: 'By Lebesgue density theorem, as n → ∞, distance ||x - x\'|| → 0 with probability 1, meaning P(y | x\') → P(y | x).',
      termination: 'The probability of error is P(error) = Σ P(y=c|x)[1 - P(y=c|x\')] ≈ Σ P_c(1 - P_c) = 1 - Σ P_c².',
      conclusion: 'Since 1 - Σ P_c² ≤ 2(1 - max_c P_c) = 2R*, the 1-NN error rate is strictly bounded by twice the Bayes rate.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(1)', explanation: 'Training time is constant: storing references to training vectors.', condition: 'Training phase.' },
    averageCase: { complexity: 'O(n · d)', explanation: 'Brute force query must compute distance to every sample.', condition: 'Inference without spatial indexing.' },
    worstCase: { complexity: 'O(n · d + n log K)', explanation: 'Full distance scan with min-heap neighbor extraction.', condition: 'Inference on large datasets.' },
    auxiliarySpace: { complexity: 'O(n · d)', explanation: 'Must retain the complete training dataset in memory.' },
    totalMemory: 'O(n · d) memory footprint.',
    bigOExplanation: 'Inference latency scales directly with dataset size n, unlike parametric models where inference is O(d).',
    scalingBehavior: 'Becomes sluggish on large datasets (millions of rows); requires indexing structures (KD-tree, FAISS) for production scale.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Zero model training time: immediate availability for queries.',
      'Adapts automatically to irregular, non-linear boundaries.',
      'Easily supports multi-class classification without structural modifications.',
    ],
    limitations: [
      'Slow query times on large datasets.',
      'Degrades in high-dimensional feature spaces due to distance dilution.',
      'Vulnerable to noisy features and irrelevant dimensions.',
    ],
    memoryTradeOffs: [
      'High inference memory requirement: full dataset must reside in memory.',
    ],
    poorChoiceScenarios: [
      'High-dimensional sparse text vectors (use Naive Bayes or Logistic Regression).',
      'Ultra-low-latency real-time bidding where predictions must occur within 2ms.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Logistic Regression',
      timeComplexity: 'O(d) inference vs O(nd) in KNN',
      spaceComplexity: 'O(d) vs O(nd) in KNN',
      stabilityOrType: 'Parametric Linear Classifier',
      similarities: 'Both solve supervised classification tasks.',
      differences: 'Logistic regression learns a single linear boundary; KNN learns local non-linear boundaries.',
      whenToPreferThis: 'When decision boundaries are highly curved or irregular.',
      whenToPreferAlternative: 'When datasets are large and inference speed is vital.',
    },
    {
      algorithm: 'Decision Trees (CART)',
      timeComplexity: 'O(depth) inference',
      spaceComplexity: 'O(nodes)',
      stabilityOrType: 'Non-parametric Axis-Aligned Splits',
      similarities: 'Both can capture non-linear class distributions.',
      differences: 'Decision trees partition space with axis-aligned orthogonal splits; KNN partitions via Voronoi cells.',
      whenToPreferThis: 'When features have continuous geometric relationships (e.g. spatial coordinates).',
      whenToPreferAlternative: 'When features include mixed categorical data and rules must be human-readable.',
    },
  ],
  commonMistakes: [
    {
      title: 'Omitting Feature Scaling',
      misconception: 'Running KNN on unscaled features with different units.',
      badCodeOrApproach: 'Running KNN directly on raw age and income columns.',
      correctApproach: 'Standardize features so each has mean 0 and variance 1 before computing distances.',
    },
    {
      title: 'Choosing an Even K in Binary Classification',
      misconception: 'Using K = 2 or K = 4 for two-class problems.',
      correctApproach: 'Always pick an odd K (e.g. 3, 5, 7) to guarantee that tie-breaking votes are avoided.',
    },
  ],
  exercises: [
    {
      id: 'knn-ex-1',
      type: 'conceptual',
      question: 'What happens to the bias and variance of a KNN model as K increases from 1 toward n?',
      options: [
        'Bias increases, variance decreases',
        'Bias decreases, variance increases',
        'Both bias and variance increase',
        'Both bias and variance decrease',
      ],
      correctIndex: 0,
      explanation: 'Larger K aggregates more neighbors, smoothing boundaries (reducing variance) while averaging out subtle local patterns (increasing bias).',
    },
    {
      id: 'knn-ex-2',
      type: 'challenge',
      question: 'Why does Euclidean distance become ineffective in very high dimensions (e.g. d > 500)?',
      options: [
        'Distances between any pair of points become nearly identical (distance concentration phenomenon)',
        'Computers cannot calculate high-dimensional square roots',
        'Labels become random numbers',
        'All coordinates become zero',
      ],
      correctIndex: 0,
      explanation:
        'Due to the curse of dimensionality, the ratio (d_max - d_min) / d_min approaches 0 as d → ∞, meaning all points become equidistant and nearest-neighbor concepts lose meaning.',
    },
  ],
  summary: {
    coreIdea: 'Predicts the label of a query by finding the K nearest training samples and executing a majority vote.',
    keyConditions: ['Features must be normalized', 'Dimensionality should be modest (d < 20)', 'Odd K for binary classification'],
    complexitySummary: { time: 'O(1) training; O(n · d) per query', space: 'O(n · d) to store all points' },
    whenToUse: 'Non-linear classification where zero training time is desirable and dataset size is moderate.',
    prerequisites: ['Euclidean distance', 'Sorting', 'Majority voting'],
    nextSteps: [
      { id: 'k-means', name: 'K-Means Clustering', reason: 'Apply distance-based thinking to discover clusters in unlabeled data.' },
      { id: 'gradient-descent', name: 'Gradient Descent', reason: 'Learn how parametric models train weights iteratively.' },
    ],
  },
};
