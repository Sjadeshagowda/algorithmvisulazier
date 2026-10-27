import type { AlgorithmLesson } from '../../../types/algorithm';

export const kmeansLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'An unsupervised clustering algorithm that partitions an unlabeled dataset into K distinct, non-overlapping clusters by iteratively assigning points to the nearest centroid and recomputing centroids as the center of mass of their assigned points.',
  mainPurpose:
    'To discover latent groupings, customer segments, and natural patterns in unlabeled data by minimizing the Within-Cluster Sum of Squares (Inertia).',
  whatIsIt: {
    overview:
      'K-Means (commonly formulated via Lloyd\'s Algorithm) is the gold standard for unsupervised partitioning. Unlike supervised algorithms that rely on training labels, K-Means receives raw unlabeled points. Given a specified integer K, the algorithm positions K initial centroids in feature space. It then alternates between two deterministic steps: (1) Assignment Step: every data point is assigned to its closest centroid, and (2) Update Step: each centroid is moved to the arithmetic mean of all points assigned to it. This continues until centroids stabilize.',
    smallExample:
      'Customer market segmentation: A retailer with 1,000 shoppers wants 3 spending tiers (K = 3). K-Means groups shoppers based on annual spend and visit frequency, producing Budget, Moderate, and VIP clusters without human labelling.',
  },
  whyUseIt: {
    problemSolved:
      'Automatically organizing massive unlabeled datasets into cohesive, actionable groups for analysis, compression, or personalized targeting.',
    whyItMatters:
      'Because labeling data is expensive and time-consuming, over 80% of enterprise data is unlabeled. K-Means unlocks immediate insights from raw logs, purchase histories, and sensor streams.',
    whenToUse: [
      'Data is unlabeled and natural group partitions are sought.',
      'Clusters are roughly spherical and comparable in size/density.',
      'Fast, scalable clustering is needed for thousands or millions of records.',
      'Image color quantization or codebook vector quantization.',
    ],
    whenToAvoid: [
      'Clusters have complex non-spherical shapes (e.g. concentric rings or crescents) — use DBSCAN or Spectral Clustering.',
      'Clusters have vastly different densities or variances — use Gaussian Mixture Models (GMMs).',
      'The number of clusters K is completely unknown and hard to estimate.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Customer Segmentation & Behavioral Cohorts',
      description:
        'E-commerce platforms grouping users into purchasing profiles based on average order value, cart abandonment rate, and browse duration.',
      educationalVsProductionNote:
        'Foundational business intelligence workflow for automated email campaign personalization and promotional coupon targeting.',
    },
    {
      title: 'Image Color Quantization & Compression',
      description:
        'Reducing an image with 16 million 24-bit RGB colors down to 16 dominant colors (K = 16) by clustering RGB color space.',
      educationalVsProductionNote:
        'Standard image compression technique used in GIF rendering and embedded display driver palette optimization.',
    },
    {
      title: 'Geographic Store Location Planning',
      description:
        'Logistics networks determining optimal distribution warehouse coordinates by clustering latitude/longitude coordinates of customer delivery addresses.',
      educationalVsProductionNote:
        'Direct application of K-Means centroids serving as the centroid of geographic delivery demand.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Centroid Initialization',
      description:
        'Place K initial cluster centroids in feature space (either randomly or using K-Means++ spread heuristic).',
    },
    {
      stepNumber: 2,
      title: 'Assignment Step (Expectation)',
      description:
        'For every data point xᵢ, compute Euclidean distance to all K centroids and assign xᵢ to the nearest centroid: cᵢ = argmin_k ||xᵢ - μₖ||².',
    },
    {
      stepNumber: 3,
      title: 'Update Step (Maximization)',
      description:
        'Recalculate each centroid μₖ as the mean (center of mass) of all data points currently assigned to cluster k: μₖ = (1/|Sₖ|) Σ_{x ∈ Sₖ} x.',
    },
    {
      stepNumber: 4,
      title: 'Convergence Check',
      description:
        'Repeat steps 2 and 3 until centroid movements fall below tolerance ε (or point assignments cease changing).',
    },
  ],
  workedExample: {
    datasetDescription:
      '4 points in 1D: A(2), B(4), C(10), D(12). Goal: partition into K = 2 clusters. Initial centroids: C1 = 2, C2 = 12.',
    initialState: 'Points: {2, 4, 10, 12}. Initial Centroids: C1 = 2.0, C2 = 12.0.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Iteration 1 - Assignment Step',
        stateDisplay: 'Point 2: d(C1)=0, d(C2)=10 => C1; Point 4: d(C1)=2, d(C2)=8 => C1; Point 10: d(C1)=8, d(C2)=2 => C2; Point 12: d(C1)=10, d(C2)=0 => C2',
        explanation: 'Each point is assigned to its geometrically closest centroid.',
        whyNecessary: 'Partitions data space into Voronoi cells.',
        beforeState: 'Unassigned points',
        afterState: 'Cluster 1: {2, 4}; Cluster 2: {10, 12}',
        nextAction: 'Recompute centroids as average of assigned points.',
        intermediateResult: 'Assignments locked: C1 has {2, 4}, C2 has {10, 12}.',
      },
      {
        stepNumber: 2,
        operation: 'Iteration 1 - Update Step',
        stateDisplay: 'New C1 = (2 + 4)/2 = 3.0; New C2 = (10 + 12)/2 = 11.0',
        explanation: 'Centroids move to the center of mass of their assigned members.',
        whyNecessary: 'Minimizes Within-Cluster Sum of Squares for the current partition.',
        beforeState: 'C1 = 2.0, C2 = 12.0',
        afterState: 'Updated C1 = 3.0, C2 = 11.0 (shift = 1.0 each)',
        nextAction: 'Check for reassignment in Iteration 2.',
        intermediateResult: 'Centroids updated to 3.0 and 11.0.',
      },
      {
        stepNumber: 3,
        operation: 'Iteration 2 - Assignment & Convergence Check',
        stateDisplay: 'Point 2: d(3)=1 vs d(11)=9 => C1; Point 4: d(3)=1 vs d(11)=7 => C1; Point 10: d(3)=7 vs d(11)=1 => C2; Point 12: d(3)=9 vs d(11)=1 => C2',
        explanation: 'All 4 points retain their exact same cluster assignments. Centroids will not move.',
        whyNecessary: 'Verifies convergence condition.',
        beforeState: 'Testing assignments with C1=3, C2=11',
        afterState: 'Zero reassignments detected; converged!',
        nextAction: 'Calculate final Inertia.',
        intermediateResult: 'Convergence achieved in 2 iterations.',
      },
    ],
    finalState: 'Final Clusters: Cluster 1: {2, 4} (mean=3.0), Cluster 2: {10, 12} (mean=11.0). Total Inertia = (2-3)² + (4-3)² + (10-11)² + (12-11)² = 4.0.',
  },
  advantages: [
    'Fast and scalable: runtime is linear in the number of samples O(n · K · d · iterations).',
    'Intuitive geometric formulation that always converges to a local minimum.',
    'Provides explicit cluster centers (centroids) that serve as representative archetypes.',
    'Guaranteed to terminate in a finite number of iterations.',
  ],
  limitations: [
    'User must pre-specify the number of clusters K.',
    'Vulnerable to poor local minima depending on initial centroid placement (mitigated by K-Means++).',
    'Assumes clusters are spherical, isotropic, and roughly equal in size.',
    'Sensitive to outliers which drag centroids away from dense cluster centers.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(n · K · d · I) where I is the number of iterations until convergence (typically I < 20).',
    averageCaseMeaning:
      'O(n · K · d · I); very fast in practice, easily handling hundreds of thousands of samples.',
    worstCaseMeaning:
      'Theoretically superpolynomial O(2^√n) in pathological worst-case configurations, though practically non-existent on real data.',
    spaceComplexityMeaning:
      'O(n · d + K · d) to store dataset points and K centroid coordinates.',
  },
  relatedAlgorithms: [
    {
      name: 'K-Means++',
      comparison:
        'A smarter initialization scheme that spaces out initial centroids with probability proportional to squared distance, bounding worst-case error.',
    },
    {
      name: 'DBSCAN (Density-Based Spatial Clustering)',
      comparison:
        'Discovers arbitrary non-spherical shapes and automatically handles noise/outliers without requiring K.',
    },
    {
      name: 'Gaussian Mixture Models (GMM)',
      comparison:
        'A probabilistic soft-clustering generalization that fits ellipsoidal clusters with varying covariance matrices.',
    },
  ],
  quiz: [
    {
      question: 'What mathematical objective does K-Means minimize?',
      options: [
        'Within-Cluster Sum of Squares (Inertia)',
        'Maximum distance between any two clusters',
        'Number of iterations',
        'The correlation coefficient between features',
      ],
      correctIndex: 0,
      explanation:
        'K-Means directly minimizes Inertia: J = Σ Σ ||x_i - μ_k||², the total squared Euclidean distance from every point to its assigned cluster centroid.',
      optionExplanations: [
        'Correct! Inertia (WCSS) is the exact quadratic loss minimized by the two alternating steps.',
        'Between-cluster distance maximization is part of Fisher criteria or complete linkage, not standard K-Means loss.',
        'Iterations are an execution metric, not the mathematical loss function.',
        'Features are assumed geometric coordinates, not correlations.',
      ],
    },
    {
      question: 'What is the "Elbow Method" used for in K-Means?',
      options: [
        'To speed up distance calculations',
        'To help determine the optimal number of clusters K by locating the point of diminishing returns in Inertia',
        'To remove extreme outliers',
        'To initialize centroids randomly',
      ],
      correctIndex: 1,
      explanation:
        'Plotting Inertia vs K shows a rapid drop that flattens out into an "elbow". The bend indicates the point where adding more clusters yields diminishing explanatory value.',
      optionExplanations: [
        'Distance computation is an algorithmic step unaffected by the elbow curve.',
        'Correct! The bend or elbow indicates the optimal K trade-off between compactness and simplicity.',
        'Outlier detection is handled by density algorithms or truncation.',
        'K-Means++ handles centroid initialization.',
      ],
    },
    {
      question: 'Why does K-Means guarantee convergence?',
      options: [
        'Because both the assignment step and update step strictly decrease or maintain Inertia, and there are finite partitions',
        'Because the learning rate decays to zero',
        'Because the data is normalized',
        'Because K is always an odd number',
      ],
      correctIndex: 0,
      explanation:
        'Since there are only Kⁿ possible cluster partitions, and each step monotonically decreases or holds constant the non-negative Inertia J, the algorithm must terminate in finite steps.',
      optionExplanations: [
        'Correct! Monotonic descent on a finite state space guarantees convergence to a local minimum.',
        'K-Means does not use a continuous learning rate.',
        'Normalization assists geometry but is not the mathematical proof of termination.',
        'K can be any positive integer.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'First introduced by Hugo Steinhaus in 1956 and popularized by Stuart Lloyd in 1957 (published 1982) and James MacQueen in 1967. "K" denotes cluster count; "Means" denotes the center of mass calculation.',
    problemSolved:
      'Partitions unlabelled data into K discrete clusters such that items within the same cluster are as close together as possible.',
    problemNotSolved:
      'Does not automatically deduce the correct number of clusters K, and cannot separate non-convex clusters like interlocking spirals.',
    whyLearn:
      'The foundational unsupervised algorithm that introduces centroid-based thinking, coordinate descent, and expectation-maximization concepts.',
    prerequisites: ['Euclidean distance', 'Center of mass (mean)', 'Basic coordinate geometry'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can an algorithm discover natural categories or structural groupings in raw data when nobody has provided labels or answers?',
    naiveApproachInefficiency:
      'Testing all Kⁿ possible partitions is an NP-hard combinatorial explosion that is impossible for n > 25.',
    coreIdeaUsed:
      'Lloyd’s alternating minimization: alternately optimize point assignments (Voronoi partitioning) and centroid positions (mean calculation).',
    utilityExplanation:
      'Converts an intractable combinatorial optimization problem into an efficient O(n · K · d) iterative descent that converges in seconds.',
    workingConditions: [
      'Continuous numerical coordinates.',
      'Spherical, convex clusters.',
      'Pre-determined cluster count K.',
    ],
    whenAnotherIsBetter:
      'Use DBSCAN when clusters have arbitrary shapes or when background noise must be filtered out without forcing it into clusters.',
    analogyOrRealLifeExample:
      'Political party platforms: politicians reposition themselves toward the average belief of their registered voters, and voters align with the closest candidate.',
  },
  inputOutputAssumptions: {
    expectedInput: 'Unlabeled dataset of points X ∈ ℝⁿˣᵈ and an integer K representing desired cluster count.',
    expectedOutput: 'Set of K centroid vectors μ ∈ ℝᴷˣᵈ and a cluster assignment array c ∈ {0..K-1}ⁿ.',
    constraints: ['1 <= K <= n', 'Points must be real-valued numerical coordinates'],
    preconditions: ['Features should be standardized so one feature does not disproportionately dominate Euclidean distance'],
    specialCases: ['K = 1 (centroid is whole dataset mean)', 'K = n (every point is its own centroid with 0 inertia)'],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'Elongated or nested circular clusters produce fragmented, unnatural split clusters because K-Means cuts space with flat hyperplanes.',
  },
  coreIntuition: {
    simpleExplanation:
      'Drop K pins into the data. Everyone walks to their nearest pin. Then, each pin is moved to the exact center of its group. Repeat until nobody has to change pins.',
    keyDrivingDecision:
      'The arithmetic mean uniquely minimizes the sum of squared distances to a set of points in Euclidean space: ∂/∂μ Σ(x - μ)² = 0 => μ = (1/n) Σ x.',
    whyRepeatedOperationWorks:
      'Both steps are coordinate descent updates on the same objective function: assignment minimizes J over c; update minimizes J over μ.',
    paradigmSpecificDetail:
      'Unsupervised Expectation-Maximization / Coordinate Descent: alternates between hidden variable assignment (E) and parameter estimation (M).',
  },
  pseudocodeWalkthrough: {
    code: [
      'function kMeans(data, K, maxIters):',
      '  centroids := initializeCentroids(data, K)',
      '  for iter from 1 to maxIters do:',
      '    changed := false',
      '    for each point in data do:',
      '      closestK := argmin_k(distance(point, centroids[k]))',
      '      if point.cluster != closestK then',
      '        point.cluster := closestK',
      '        changed := true',
      '    if not changed then break',
      '    for k from 0 to K-1 do:',
      '      clusterPoints := [p for p in data if p.cluster == k]',
      '      if length(clusterPoints) > 0 then',
      '        centroids[k] := mean(clusterPoints)',
      '  return { centroids, assignments }',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'centroids := initializeCentroids(...)', explanation: 'Select initial K points as starting centroids.' },
      { lineIndex: 5, lineText: 'closestK := argmin_k(...)', explanation: 'Assignment Step: find index of closest centroid for each point.' },
      { lineIndex: 9, lineText: 'if not changed then break', explanation: 'Convergence Check: terminate if no points shifted clusters.' },
      { lineIndex: 13, lineText: 'centroids[k] := mean(clusterPoints)', explanation: 'Update Step: compute new center of mass for each cluster.' },
    ],
    terminationCondition: 'Terminates when zero points change clusters between iterations, or when maxIters is reached.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'function runKMeans(points: {x: number, y: number}[], k: number, maxIters: number)',
    code: `export function runKMeans(
  points: { x: number; y: number }[],
  k = 3,
  maxIters = 20
) {
  const n = points.length;
  if (n === 0) return { centroids: [], assignments: [] };

  // Step 1: Initialize centroids (spread deterministically)
  const centroids = Array.from({ length: k }, (_, i) => {
    const idx = Math.floor((i * n) / k);
    return { x: points[idx].x, y: points[idx].y };
  });

  const assignments = new Array(n).fill(0);

  for (let iter = 0; iter < maxIters; iter++) {
    let changed = false;

    // Assignment Step
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let bestCluster = 0;

      for (let c = 0; c < k; c++) {
        const dx = points[i].x - centroids[c].x;
        const dy = points[i].y - centroids[c].y;
        const dist = dx * dx + dy * dy;
        if (dist < minDist) {
          minDist = dist;
          bestCluster = c;
        }
      }

      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed) break;

    // Update Step
    for (let c = 0; c < k; c++) {
      let sumX = 0, sumY = 0, count = 0;
      for (let i = 0; i < n; i++) {
        if (assignments[i] === c) {
          sumX += points[i].x;
          sumY += points[i].y;
          count++;
        }
      }
      if (count > 0) {
        centroids[c] = { x: sumX / count, y: sumY / count };
      }
    }
  }

  return { centroids, assignments };
}`,
    inputValidation: 'Validates non-empty points array and prevents divide-by-zero if a cluster becomes empty during updates.',
    variables: [
      { name: 'centroids', type: 'Array<{x, y}>', purpose: 'Current 2D coordinates of K cluster centers' },
      { name: 'assignments', type: 'number[]', purpose: 'Cluster index (0..k-1) assigned to each point' },
      { name: 'changed', type: 'boolean', purpose: 'Flag tracking whether any point flipped clusters' },
    ],
    lineByLine: [
      { line: 8, code: 'const centroids = Array.from(...)', explanation: 'Evenly spaced deterministic initial centroid selection.' },
      { line: 20, code: 'for (let c = 0; c < k; c++) { ... }', explanation: 'Compare Euclidean distance to all K centroids.' },
      { line: 36, code: 'if (!changed) break;', explanation: 'Early exit if cluster assignments have reached equilibrium.' },
      { line: 49, code: 'centroids[c] = { x: sumX / count, y: sumY / count };', explanation: 'Re-center centroid at center of mass.' },
    ],
    returnExplanation: 'Returns the final stabilized centroid coordinates and point-to-cluster assignment indices.',
    commonBugs: [
      'Empty cluster trap: an initial centroid has 0 assigned points, causing division by zero.',
      'Comparing square roots Math.sqrt instead of squared distances dx*dx + dy*dy (unnecessary slowdown).',
      'Forgetting that K-Means finds local minima, not guaranteed global minima.',
    ],
    edgeCaseHandling: [
      'Guards against empty clusters by preserving the prior centroid position.',
      'Stops immediately when changed === false to save CPU cycles.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Inertia J is bounded below by 0. In each step of Lloyd\'s algorithm, assigning points to their nearest centroid decreases or maintains J. Recomputing centroids to the arithmetic mean strictly minimizes J for those fixed assignments. Since the number of distinct partitions is finite, the algorithm cannot loop infinitely and must converge.',
    formalProof: {
      method: 'Mathematical Optimization Convergence',
      invariantOrClaim: 'The Within-Cluster Sum of Squares J(c, μ) = Σ ||x_i - μ_{c_i}||² monotonically decreases at every half-step.',
      initialization: 'Let initial centroids be μ^(0). Total inertia is J^(0) < ∞.',
      maintenance: 'Step 1 (Assignment): c_i^(t+1) = argmin_k ||x_i - μ_k^(t)||² ensures J(c^(t+1), μ^(t)) ≤ J(c^(t), μ^(t)). Step 2 (Update): μ_k^(t+1) = (1/|S_k|) Σ x minimizes the quadratic sum, guaranteeing J(c^(t+1), μ^(t+1)) ≤ J(c^(t+1), μ^(t)).',
      termination: 'Because J is non-increasing and the number of possible partitions is at most Kⁿ, J cannot decrease indefinitely without repeating a partition.',
      conclusion: 'By the Monotone Convergence Theorem on finite state spaces, the algorithm must terminate at a local minimum partition in a finite number of steps.',
    },
  },
  complexityAnalysis: {
    bestCase: { complexity: 'O(n · K · d)', explanation: 'Algorithm converges in 2 or 3 iterations.', condition: 'Well-separated clusters.' },
    averageCase: { complexity: 'O(n · K · d · I)', explanation: 'Typically converges within I = 10 to 20 iterations.', condition: 'General tabular data.' },
    worstCase: { complexity: 'O(2^√n)', explanation: 'Pathological geometric configurations designed to trigger maximal flips.', condition: 'Adversarial inputs.' },
    auxiliarySpace: { complexity: 'O(K · d)', explanation: 'Stores K centroid coordinate vectors.' },
    totalMemory: 'O(n · d) for original points + O(n) for assignments.',
    bigOExplanation: 'Runtime scales linearly with sample count n, cluster count K, and feature count d.',
    scalingBehavior: 'Highly scalable; easily parallelizable via Mini-Batch K-Means or MapReduce across distributed clusters.',
  },
  advantagesAndLimitations: {
    strengths: [
      'Simple, elegant, and computationally lightweight.',
      'Scales to millions of samples efficiently.',
      'Guaranteed mathematical convergence.',
      'Clear, explainable cluster prototypes (centroids).',
    ],
    limitations: [
      'Requires pre-defining K.',
      'Sensitive to initialization (can get trapped in poor local optima).',
      'Cannot identify complex non-spherical geometric shapes (e.g. concentric circles).',
      'Sensitive to outliers which distort the mean calculation.',
    ],
    memoryTradeOffs: [
      'Extremely memory efficient: only requires storing assignments and centroids.',
    ],
    poorChoiceScenarios: [
      'Nested rings, interlocking spirals, or moon-shaped data (use DBSCAN).',
      'Categorical datasets with non-Euclidean distances (use K-Modes).',
    ],
  },
  comparisons: [
    {
      algorithm: 'DBSCAN',
      timeComplexity: 'O(n log n) with spatial index',
      spaceComplexity: 'O(n)',
      stabilityOrType: 'Density-Based Clustering',
      similarities: 'Both are unsupervised grouping algorithms.',
      differences: 'DBSCAN identifies clusters based on continuous density and flags noise; K-Means forces every point into a cluster.',
      whenToPreferThis: 'When clusters are convex, spherical, and fast partitioning is required.',
      whenToPreferAlternative: 'When data has arbitrary shapes or significant outlier contamination.',
    },
    {
      algorithm: 'Hierarchical Agglomerative Clustering',
      timeComplexity: 'O(n³ or n² log n)',
      spaceComplexity: 'O(n²)',
      stabilityOrType: 'Dendrogram Tree Clustering',
      similarities: 'Both group similar items without supervision.',
      differences: 'Hierarchical builds a nested dendrogram of splits and does not require pre-specifying K.',
      whenToPreferThis: 'When dataset size n exceeds 5,000 samples.',
      whenToPreferAlternative: 'When hierarchical relationships (taxonomy) are desired and n is small.',
    },
  ],
  commonMistakes: [
    {
      title: 'Assuming K-Means Always Finds the Optimal Clustering',
      misconception: 'Running K-Means once and assuming the result is the globally best partition.',
      correctApproach: 'K-Means converges to a local minimum. Always run with multiple random restarts (n_init = 10) or use K-Means++ initialization.',
    },
    {
      title: 'Clustering Non-Spherical Patterns',
      misconception: 'Attempting to cluster concentric rings or crescent shapes with K-Means.',
      badCodeOrApproach: 'Using K-Means on topological or manifold datasets.',
      correctApproach: 'Inspect data distributions. For non-linear manifolds, use DBSCAN, Spectral Clustering, or UMAP.',
    },
  ],
  exercises: [
    {
      id: 'km-ex-1',
      type: 'conceptual',
      question: 'Why does K-Means use the arithmetic mean rather than the median during the update step?',
      options: [
        'The mean mathematically minimizes the sum of squared Euclidean distances',
        'The median is impossible to calculate in 2D',
        'The mean is resistant to outliers',
        'The mean avoids floating point numbers',
      ],
      correctIndex: 0,
      explanation: 'For squared Euclidean distance Σ(x - μ)², the derivative equals zero at μ = (1/n)Σx. The median minimizes absolute distance (L1 norm), used in K-Medians.',
    },
    {
      id: 'km-ex-2',
      type: 'challenge',
      question: 'How does K-Means++ improve standard random centroid initialization?',
      options: [
        'It selects subsequent centroids with probability proportional to their squared distance from existing centroids, spreading them across the data space',
        'It sorts points alphabetically before picking',
        'It always picks the points closest to (0, 0)',
        'It runs PCA first',
      ],
      correctIndex: 0,
      explanation:
        'K-Means++ samples initial centroids with probability D(x)² / ΣD(x)². This spreads centroids far apart across different clusters, providing an O(log K) competitive error bound.',
    },
  ],
  summary: {
    coreIdea: 'Partitions data into K clusters by repeatedly assigning points to the nearest centroid and re-centering centroids at the mean of their points.',
    keyConditions: ['K must be pre-specified', 'Features must be scaled', 'Clusters should be roughly convex and spherical'],
    complexitySummary: { time: 'O(n · K · d · I)', space: 'O(n · d + K · d)' },
    whenToUse: 'Fast unsupervised customer segmentation, pattern discovery, or image palette reduction.',
    prerequisites: ['Euclidean distance', 'Center of mass', 'Inertia'],
    nextSteps: [
      { id: 'gradient-descent', name: 'Gradient Descent', reason: 'Master continuous parameter optimization used across all modern deep learning.' },
    ],
  },
};
