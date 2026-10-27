import type { AlgorithmLesson } from '../../../types/algorithm';

export const qlearningLesson: AlgorithmLesson = {
  oneSentenceDefinition:
    'A model-free, off-policy reinforcement learning algorithm that iteratively learns the optimal state-action value function Q*(s, a) via Bellman temporal-difference updates from trial-and-error environmental interactions.',
  mainPurpose:
    'To discover an optimal decision-making policy that maximizes cumulative discounted future rewards in an unknown Markov Decision Process without requiring a prior mathematical transition model of the environment.',
  whatIsIt: {
    overview:
      'Q-Learning is a foundational reinforcement learning algorithm developed by Chris Watkins in 1989. An autonomous agent navigates through discrete environment states s ∈ S by choosing actions a ∈ A. Upon taking an action, the environment transitions to next state s\' and returns an immediate scalar reward r. The agent maintains a Q-table storing Q(s, a), estimating the expected discounted cumulative return of executing action a in state s and subsequently following the optimal policy. The algorithm updates these estimates using the Bellman optimality equation: Q(s, a) ← Q(s, a) + α[r + γ max_a\' Q(s\', a\') − Q(s, a)], where α is the learning rate and γ is the discount factor. Because it bootstraps directly from the maximum next-state Q-value regardless of the action actually taken next, Q-Learning is strictly "off-policy". Crucially, when reaching a terminal goal state, bootstrapping ceases and the TD target simplifies strictly to the immediate reward r.',
    smallExample:
      'A robot in a 4×4 grid world starts at (0, 0) and seeks a prize at (0, 3) (+10 reward) while avoiding walls. Each step has a cost of -1. Initially, all Q-table entries are 0.0. The agent wanders using an ε-greedy policy. Upon reaching the goal from (0, 2) via RIGHT, it receives +10 reward. Q((0,2), RIGHT) updates from 0.0 to 2.0 (with α=0.2). In subsequent episodes, this reward backpropagates across neighboring cells, transforming the Q-table into an arrow map guiding the robot along the shortest path.',
  },
  whyUseIt: {
    problemSolved:
      'Enables sequential decision making and control in environments where the transition dynamics P(s\'|s, a) and reward functions R(s, a) are unknown in advance, solving problems that supervised learning cannot address due to the absence of correct step-by-step labels.',
    whyItMatters:
      'Watkins and Dayan (1992) proved that tabular Q-Learning converges with probability 1 to the true optimal action-value function Q*(s, a) under standard stochastic approximation conditions (all state-action pairs visited infinitely often, decaying learning rates satisfying Robbins-Monro conditions). It forms the theoretical bedrock for Deep Q-Networks (DQN) that solved Atari 2600 games and modern reinforcement learning.',
    whenToUse: [
      'The environment can be modeled as a discrete Markov Decision Process (finite states and actions).',
      'The transition probabilities and reward mechanics of the environment are unknown or difficult to formulate mathematically (model-free).',
      'The agent can interact with the environment or a simulator through trial-and-error experience.',
      'Delayed reward signals must be credited back across a chain of sequential decisions (the credit assignment problem).',
    ],
    whenToAvoid: [
      'Massive or continuous state spaces where tabular memory O(|S| · |A|) exceeds RAM (use Deep Q-Networks with function approximation).',
      'High-risk physical environments where random exploration is catastrophic (e.g. piloting an expensive drone or clinical patient dosage).',
      'One-shot decision problems with immediate i.i.d. labels where Supervised Learning is far more sample-efficient.',
    ],
  },
  realWorldApplications: [
    {
      title: 'Automated Guided Vehicle (AGV) Warehouse Navigation',
      description:
        'Industrial robotic vehicles learning optimal transit routes between storage racks and shipping bays while avoiding dynamic obstacles and optimizing battery life.',
      educationalVsProductionNote:
        'Educational simulations use tabular grids; production Amazon Robotics fleets deploy hierarchical multi-agent reinforcement learning with continuous kinematic constraints.',
    },
    {
      title: 'Adaptive Traffic Signal Control',
      description:
        'Intersections modeling traffic queues as states and light phases as actions to minimize average vehicle waiting time in urban grids.',
      educationalVsProductionNote:
        'Widely tested in smart-city municipal testbeds where reward signals balance green-light throughput against cross-traffic delay.',
    },
    {
      title: 'Algorithmic Execution & Order Routing in Finance',
      description:
        'Trading agents placing limit and market orders across financial order books to minimize market slippage and transaction costs over time.',
      educationalVsProductionNote:
        'Production high-frequency trading firms deploy risk-constrained RL agents with microsecond execution pipelines.',
    },
  ],
  howItWorksSteps: [
    {
      stepNumber: 1,
      title: 'Environment State Observation & Action Selection',
      description:
        'The agent observes its current discrete state s. With probability ε (epsilon), it explores by picking a random action; otherwise, it exploits by picking argmax_a Q(s, a) with deterministic tie-breaking.',
    },
    {
      stepNumber: 2,
      title: 'Environment Transition & Reward Feedback',
      description:
        'The agent executes action a. The environment returns the resulting state s\', a scalar reward r, and an indicator whether s\' is a terminal state.',
    },
    {
      stepNumber: 3,
      title: 'Bellman Target & Temporal-Difference (TD) Error Calculation',
      description:
        'If s\' is non-terminal, TD_target = r + γ max_a\' Q(s\', a\'). If s\' is terminal, TD_target = r (no bootstrapping from terminal state). The TD error δ = TD_target − Q(s, a).',
    },
    {
      stepNumber: 4,
      title: 'Q-Table Value Update',
      description:
        'The state-action value is updated: Q(s, a) ← Q(s, a) + α · δ. The table now reflects a fraction α of the newly observed temporal-difference error.',
    },
    {
      stepNumber: 5,
      title: 'Episode Progression & Greedy Policy Extraction',
      description:
        'State transitions continue until reaching the goal or the step limit. Over multiple episodes, the greedy policy π*(s) = argmax_a Q(s, a) converges toward the optimal path.',
    },
  ],
  workedExample: {
    datasetDescription:
      'A 1×3 linear corridor: State 0 (Start) → State 1 → State 2 (Goal, Terminal). Actions: LEFT, RIGHT. Parameters: α = 0.5, γ = 0.9, step cost r = -1, goal reward r_goal = +10. Initial Q-table: all 0.0.',
    initialState:
      'Q(0, RIGHT) = 0.0, Q(1, RIGHT) = 0.0, Q(1, LEFT) = 0.0. Agent starts at State 0.',
    steps: [
      {
        stepNumber: 1,
        operation: 'Episode 1, Step 1: Agent moves RIGHT from State 0 to State 1',
        stateDisplay:
          'Transition: State 0 --(RIGHT)--> State 1. Immediate reward r = -1. Non-terminal transition.',
        explanation:
          'At State 1, max_a\' Q(1, a\') = max(0.0, 0.0) = 0.0. TD_target = -1 + 0.9(0.0) = -1.0. TD_error = -1.0 - 0.0 = -1.0. Q(0, RIGHT) ← 0.0 + 0.5(-1.0) = -0.500.',
        whyNecessary: 'Penalizes moving into intermediate states when reward has not yet propagated from the goal.',
        beforeState: 'Q(0, RIGHT) = 0.000',
        afterState: 'Q(0, RIGHT) = -0.500',
        nextAction: 'Agent takes action from State 1.',
        intermediateResult: 'New Q(0, RIGHT) = -0.500',
      },
      {
        stepNumber: 2,
        operation: 'Episode 1, Step 2: Agent moves RIGHT from State 1 to Goal (State 2)',
        stateDisplay:
          'Transition: State 1 --(RIGHT)--> State 2 (Terminal Goal). Immediate reward r = +10. Terminal transition.',
        explanation:
          'Because State 2 is terminal, bootstrapping is disabled: TD_target = r = +10.0 (do NOT add γ max Q(2, a\')). TD_error = 10.0 - 0.0 = 10.0. Q(1, RIGHT) ← 0.0 + 0.5(10.0) = +5.000.',
        whyNecessary: 'Terminal states do not have future actions; bootstrapping from them would violate Bellman optimality.',
        beforeState: 'Q(1, RIGHT) = 0.000',
        afterState: 'Q(1, RIGHT) = +5.000',
        nextAction: 'Episode 1 terminates. Reset agent to State 0 for Episode 2.',
        intermediateResult: 'New Q(1, RIGHT) = +5.000',
      },
      {
        stepNumber: 3,
        operation: 'Episode 2, Step 1: Agent moves RIGHT from State 0 to State 1 (Reward Propagation)',
        stateDisplay:
          'Transition: State 0 --(RIGHT)--> State 1. Immediate reward r = -1. Non-terminal transition.',
        explanation:
          'At State 1, max_a\' Q(1, a\') is now max(Q(1, RIGHT), Q(1, LEFT)) = max(5.0, 0.0) = 5.0! TD_target = -1 + 0.9(5.0) = -1 + 4.5 = 3.5. Old Q(0, RIGHT) = -0.5. TD_error = 3.5 - (-0.5) = 4.0. Q(0, RIGHT) ← -0.5 + 0.5(4.0) = +1.500.',
        whyNecessary: 'Demonstrates reward backpropagation: the reward learned at State 1 now flows backward to State 0!',
        beforeState: 'Q(0, RIGHT) = -0.500',
        afterState: 'Q(0, RIGHT) = +1.500',
        nextAction: 'Agent at State 1 takes action.',
        intermediateResult: 'New Q(0, RIGHT) = +1.500',
      },
    ],
    finalState:
      'Q(0, RIGHT) = +1.500, Q(1, RIGHT) = +5.000. Greedy policy π*(s) = RIGHT at all states, guiding agent directly to the goal in 2 optimal steps.',
  },
  advantages: [
    'Model-Free Learning: Does not require knowledge of environment transition dynamics P(s\'|s, a) or reward function formulas.',
    'Off-Policy Optimization: Learns the optimal target policy even while following an exploratory behavior policy.',
    'Proven Mathematical Convergence: Guaranteed to converge to Q* under standard Robbins-Monro stochastic approximation conditions.',
    'Transparent Tabular Representation: Every state-action value can be directly inspected, audited, and debugged.',
  ],
  limitations: [
    'Curse of Dimensionality: Tabular storage O(|S| · |A|) becomes intractable for continuous or large discrete state spaces.',
    'Sample Inefficiency: Rewards propagate backward by only one step per transition, requiring many episodes for long trajectories.',
    'Maximization Bias: Taking max_a\' Q(s\', a\') can overestimate action values in noisy or stochastic reward settings.',
    'Exploration Sensitivity: Setting epsilon too low leads to exploration starvation where the goal is never reached.',
  ],
  complexityDetailed: {
    bestCaseMeaning:
      'O(episodes · path_length) execution time when the agent navigates directly along the optimal trajectory without exploratory wandering.',
    averageCaseMeaning:
      'O(episodes · maxSteps) training time with standard epsilon-greedy exploration and obstacle detours.',
    worstCaseMeaning:
      'O(episodes · maxSteps) training time when exploration fails to find the goal within the configured step budget.',
    spaceComplexityMeaning:
      'O(|S| · |A|) auxiliary storage for the discrete state-action Q-table (4 entries per traversable grid cell).',
  },
  relatedAlgorithms: [
    {
      name: 'Dynamic Programming (Value Iteration)',
      comparison:
        'Value Iteration solves the Bellman equation offline using a known transition model; Q-Learning solves it online without a model via experiential sampling.',
    },
    {
      name: 'SARSA',
      comparison:
        'SARSA is an on-policy TD algorithm updating with the actual next action Q(s\', a\'); Q-Learning is off-policy and updates with max_a\' Q(s\', a\').',
    },
    {
      name: 'Deep Q-Networks (DQN)',
      comparison:
        'DQN replaces the discrete tabular Q-table with a deep convolutional or feed-forward neural network to scale to continuous, high-dimensional observations.',
    },
  ],
  quiz: [
    {
      question: 'Why is Q-Learning classified as an "off-policy" reinforcement learning algorithm?',
      options: [
        'Because it updates Q(s, a) using the maximum Q-value of the next state (max_a\' Q(s\', a\')), regardless of which action the agent actually selects next',
        'Because the agent operates offline without interacting with an environment',
        'Because it does not use any mathematical policies',
        'Because it only works when the learning rate is zero',
      ],
      correctIndex: 0,
      explanation:
        'Q-Learning is off-policy because the target policy (greedy maximization over actions) is distinct from the behavior policy (e.g. ε-greedy exploration). On-policy algorithms like SARSA update using the action a\' actually chosen by the behavior policy.',
      optionExplanations: [
        'Correct! The Bellman update uses max_a\' Q(s\', a\'), decoupling the learning target from the behavior action.',
        'Q-Learning actively collects transitions from online simulation or interaction.',
        'The agent follows a behavior policy (such as ε-greedy) to act.',
        'Learning rate must be positive (α > 0) for updates to take effect.',
      ],
    },
    {
      question: 'What is the correct Bellman update target when an agent transitions into a terminal goal state?',
      options: [
        'TD_target = r (immediate reward only, without bootstrapping from next state)',
        'TD_target = r + γ · max_a\' Q(s\', a\')',
        'TD_target = 0',
        'TD_target = Q(s, a) / 2',
      ],
      correctIndex: 0,
      explanation:
        'A terminal state signifies the end of an episode; no further actions or future rewards exist from that state. Therefore, bootstrapping from Q(s_terminal, a\') must not occur, and TD_target simplifies strictly to r.',
      optionExplanations: [
        'Correct! Terminal transitions do not bootstrap from future expected rewards.',
        'Adding future discounted returns from a terminal state falsely assumes execution continues after termination.',
        'Setting the target to 0 ignores the terminal reward earned by reaching the goal.',
        'Arbitrary halving has no mathematical basis in Bellman optimality.',
      ],
    },
    {
      question: 'What role does the discount factor γ (gamma) play in Q-Learning?',
      options: [
        'It determines the present value of future rewards; γ near 0 makes the agent myopic (greedy for immediate rewards), while γ near 1 makes it far-sighted',
        'It controls the percentage of exploratory actions taken by the agent',
        'It sets the computer memory allocated for the Q-table',
        'It prevents the agent from colliding with walls',
      ],
      correctIndex: 0,
      explanation:
        'Gamma γ ∈ [0, 1] discounts rewards received k steps in the future by γᵏ. A small γ prioritizes immediate gratification; a larger γ values long-term cumulative returns, enabling the agent to accept temporary negative step costs to reach a distant high-value goal.',
      optionExplanations: [
        'Correct! Discount factor determines the balance between immediate and distant delayed rewards.',
        'Exploration percentage is controlled by epsilon (ε), not gamma.',
        'Memory allocation depends on state and action space cardinalities |S| × |A|.',
        'Wall collisions are handled by environment collision dynamics and penalties.',
      ],
    },
    {
      question: 'What happens if the exploration rate ε (epsilon) is set to 0.0 throughout the entire training process from all-zero initial Q-values?',
      options: [
        'The agent will exploit its initial ties, potentially getting stuck in a local loop or never discovering the path to the goal (Exploration Starvation)',
        'The agent will learn the optimal path instantaneously in 1 step',
        'The Q-table will automatically fill with infinite values',
        'The computer CPU will trigger an overflow exception',
      ],
      correctIndex: 0,
      explanation:
        'Without exploration (ε = 0), an agent initialized with zeros has no incentive to test unvisited actions. It will repeatedly choose the first tied action and may never stumble upon the reward cell or goal, remaining trapped in an uninformative policy.',
      optionExplanations: [
        'Correct! Sufficient exploration is required for Q-learning convergence so that all reachable states are discovered.',
        'Learning requires reward signals; without exploration, rewards may never be encountered.',
        'Values remain bounded by the maximum possible discounted episode return.',
        'Execution remains standard deterministic arithmetic.',
      ],
    },
    {
      question: 'Why does Tabular Q-Learning fail to scale to complex real-world tasks like autonomous driving or Go?',
      options: [
        'The curse of dimensionality: storing |S| × |A| table entries becomes impossible for continuous or astronomically large state spaces',
        'Because reinforcement learning is mathematically invalid for games',
        'Because Q-values cannot represent negative numbers',
        'Because Bellman equations only work on 4×4 grids',
      ],
      correctIndex: 0,
      explanation:
        'Tabular Q-learning requires discrete memory for every unique state. An 84×84 image with 256 pixel values yields 256^(84×84) states, far exceeding the number of atoms in the universe. Deep Q-Networks (DQN) solve this using neural networks as function approximators instead of a table.',
      optionExplanations: [
        'Correct! Tabular representations scale exponentially with state variables, requiring function approximation for high dimensions.',
        'Reinforcement learning achieved world-class breakthroughs in Go (AlphaGo) and games.',
        'Q-values can be positive, negative, or zero.',
        'Bellman optimality applies to any Markov Decision Process regardless of dimensions.',
      ],
    },
  ],
  introduction: {
    nameOriginAndMeaning:
      'Q-Learning was introduced by Chris Watkins in his 1989 PhD thesis "Learning from Delayed Rewards". The letter "Q" stands for "Quality", denoting the expected quality or long-term utility of taking a particular action in a given environmental state.',
    problemSolved:
      'Solves the optimal control and pathfinding problem in unknown stochastic or deterministic Markov Decision Processes through direct experience, without requiring an explicit environmental model.',
    problemNotSolved:
      'Does not natively scale to continuous or high-dimensional state spaces without function approximation, and does not provide sample efficiency guarantees in sparse-reward environments.',
    whyLearn:
      'Q-Learning is the essential conceptual bridge between classical dynamic programming and modern deep reinforcement learning, introducing temporal-difference bootstrapping, off-policy evaluation, and credit assignment.',
    prerequisites: ['Markov Decision Processes (MDP)', 'Conditional Probability', 'Dynamic Programming & Recurrence Relations'],
  },
  whyDoWeNeedIt: {
    problemStatement:
      'How can an autonomous agent learn to navigate an obstacle-laden environment to reach a target when nobody provides explicit correct action labels, and rewards are delayed until the end of a long sequence of moves?',
    naiveApproachInefficiency:
      'Random search or brute-force trajectory evaluation requires searching through |A|^T action sequences, causing exponential O(|A|^T) blowup. Supervised learning fails because training datasets with optimal action labels for every state do not exist a priori.',
    coreIdeaUsed:
      'Temporal-Difference (TD) Bootstrapping: update current value estimates based partly on other learned value estimates from successor states, allowing rewards to propagate backward one transition at a time.',
    utilityExplanation:
      'By decoupling exploration from target maximization, Q-Learning allows the agent to explore erratically while still converging mathematically to the optimal greedy policy.',
    workingConditions: [
      'Discrete state space S and discrete action space A.',
      'Environment satisfies the Markov Property: next state distribution depends only on current state and action, P(s\'|s, a).',
      'Bounded scalar rewards.',
    ],
    whenAnotherIsBetter:
      'When the transition probability matrix P(s\'|s, a) is fully known in advance, Value Iteration or Policy Iteration (Dynamic Programming) solves for the optimal policy directly without simulation trial-and-error.',
    analogyOrRealLifeExample:
      'A dog learning to navigate an unfamiliar backyard maze to reach a treat. At first, it runs randomly (exploration). When it finally finds the treat, it remembers the last turn. On subsequent runs, that positive memory extends backward turn-by-turn until it runs straight to the treat every time.',
  },
  inputOutputAssumptions: {
    expectedInput:
      'Discrete grid world configuration: dimensions (width, height), start coordinate, goal coordinate, wall positions, reward parameters, and hyperparameters (α, γ, ε).',
    expectedOutput:
      'Trained Q-table Q(s, a) for all traversable states, and the extracted optimal greedy policy π*(s) = argmax_a Q(s, a).',
    constraints: [
      'Grid dimensions must be within [3, 8] for tabular visualization',
      'Start and Goal coordinates must be distinct and traversable (not walls)',
      'A valid path must exist from Start to Goal (reachability check via BFS)',
      'Learning rate α ∈ (0, 1]',
      'Discount factor γ ∈ [0, 1]',
      'Exploration probability ε ∈ [0, 1]',
    ],
    preconditions: ['Environment must be deterministic and fully observable (coordinate states).'],
    specialCases: [
      'Invalid move into wall or boundary: agent remains in current cell and receives penalty.',
      'Terminal goal transition: episode terminates immediately without next-state bootstrapping.',
      'Tied Q-values: deterministic seeded tie-breaking selects consistently.',
    ],
    isSortedRequired: false,
    brokenAssumptionsBehavior:
      'If start and goal are disconnected by walls, validation rejects the configuration upfront. If learning rate is non-positive or discount exceeds 1.0, validation prevents divergence.',
  },
  coreIntuition: {
    simpleExplanation:
      'Think of Q-values as water flowing uphill from the goal. Every time the agent reaches the goal, it pours value into the preceding square. Over multiple episodes, this value flows backward square-by-square toward the start. To find the fastest path, the agent simply follows the steepest uphill slope of Q-values.',
    keyDrivingDecision:
      'Off-Policy Maximization: evaluating the next state by max_a\' Q(s\', a\') rather than the action chosen by exploration, ensuring that random exploratory blunders do not corrupt the estimated value of optimal play.',
    whyRepeatedOperationWorks:
      'The Bellman operator is a contraction mapping in the infinity norm with contraction factor γ < 1. Banach fixed-point theorem guarantees that repeated application converges to a unique fixed point Q*.',
    paradigmSpecificDetail:
      'Credit Assignment: backward propagation of delayed rewards through temporal-difference bootstrapping.',
  },
  pseudocodeWalkthrough: {
    code: [
      'function TabularQLearning(env, alpha, gamma, epsilon, episodes, maxSteps):',
      '  initialize Q(s, a) := 0 for all states s and actions a',
      '  for episode from 1 to episodes do:',
      '    s := env.resetToStart()',
      '    for step from 1 to maxSteps do:',
      '      // 1. Epsilon-greedy action selection',
      '      if random() < epsilon then:',
      '        a := randomAction()',
      '      else:',
      '        a := argmax_a Q(s, a)  // break ties deterministically',
      '      // 2. Environment step transition',
      '      s_next, reward, isTerminal := env.step(s, a)',
      '      // 3. Bellman target calculation',
      '      if isTerminal then:',
      '        target := reward',
      '      else:',
      '        target := reward + gamma * max_a\' Q(s_next, a\')',
      '      // 4. Temporal-difference error and Q-update',
      '      td_error := target - Q(s, a)',
      '      Q(s, a) := Q(s, a) + alpha * td_error',
      '      s := s_next',
      '      if isTerminal then break',
      '  return Q',
    ],
    lineExplanations: [
      { lineIndex: 1, lineText: 'initialize Q(s, a) := 0', explanation: 'All state-action values initialized to zero for unbiased exploration.' },
      { lineIndex: 6, lineText: 'if random() < epsilon', explanation: 'Exploration branch allows discovering new trajectories.' },
      { lineIndex: 9, lineText: 'a := argmax_a Q(s, a)', explanation: 'Exploitation branch selects the action currently believed to be optimal.' },
      { lineIndex: 13, lineText: 'target := reward (terminal)', explanation: 'Critical rule: do NOT bootstrap from terminal state.' },
      { lineIndex: 15, lineText: 'target := reward + gamma * max_a\' Q(...)', explanation: 'Standard non-terminal Bellman optimality target.' },
      { lineIndex: 18, lineText: 'Q(s, a) := Q(s, a) + alpha * td_error', explanation: 'Shifts Q-value toward the TD target by step size alpha.' },
    ],
    terminationCondition:
      'Training terminates when the configured number of episodes completes. Within each episode, execution stops upon reaching the terminal goal or reaching the maximum step limit.',
  },
  sourceCodeWalkthrough: {
    language: 'typescript',
    signature: 'export function applyBellmanUpdate(state: GridCoord, action: ActionType, reward: number, nextState: GridCoord, isTerminal: boolean, isInvalidMove: boolean, qTable: Record<string, Record<ActionType, number>>, alpha: number, gamma: number): BellmanUpdateInfo',
    code: `export function applyBellmanUpdate(
  state: GridCoord,
  action: ActionType,
  reward: number,
  nextState: GridCoord,
  isTerminal: boolean,
  isInvalidMove: boolean,
  qTable: Record<string, Record<ActionType, number>>,
  alpha: number,
  gamma: number
): BellmanUpdateInfo {
  const stateKey = encodeState(state);
  const nextStateKey = encodeState(nextState);

  const oldQ = qTable[stateKey]?.[action] ?? 0;

  let maxNextQ = 0;
  if (!isTerminal && qTable[nextStateKey]) {
    const nextActions = qTable[nextStateKey];
    maxNextQ = Math.max(nextActions.up, nextActions.down, nextActions.left, nextActions.right);
  }

  const tdTarget = isTerminal ? reward : reward + gamma * maxNextQ;
  const tdError = tdTarget - oldQ;
  const newQ = oldQ + alpha * tdError;

  if (qTable[stateKey]) {
    qTable[stateKey][action] = newQ;
  }

  return {
    state: { ...state },
    action,
    nextState: { ...nextState },
    reward,
    isTerminal,
    isInvalidMove,
    oldQ,
    maxNextQ,
    alpha,
    gamma,
    tdTarget,
    tdError,
    newQ,
  };
}`,
    inputValidation:
      'Validates grid dimensions within [3, 8], checks start/goal coordinates within bounds and distinct, verifies wall placements, and executes BFS reachability check from Start to Goal.',
    variables: [
      { name: 'oldQ', type: 'number', purpose: 'Existing state-action value Q(s, a) before update' },
      { name: 'maxNextQ', type: 'number', purpose: 'Maximum Q-value among all available actions in successor state s\'' },
      { name: 'tdTarget', type: 'number', purpose: 'Bellman optimality target: r + γ max Q(s\', a\') or r if terminal' },
      { name: 'tdError', type: 'number', purpose: 'Difference between the TD target and oldQ' },
      { name: 'newQ', type: 'number', purpose: 'Updated state-action value stored in the Q-table' },
    ],
    lineByLine: [
      { line: 15, code: 'let maxNextQ = 0;', explanation: 'Defaults next-state value to zero for terminal states.' },
      { line: 18, code: 'maxNextQ = Math.max(nextActions.up, nextActions.down, nextActions.left, nextActions.right);', explanation: 'Off-policy evaluation: finds the maximum Q-value across all 4 actions in state s\'.' },
      { line: 21, code: 'const tdTarget = isTerminal ? reward : reward + gamma * maxNextQ;', explanation: 'Calculates the Bellman target; terminal transitions omit future discounting.' },
      { line: 22, code: 'const tdError = tdTarget - oldQ;', explanation: 'Computes the temporal-difference error δ.' },
      { line: 23, code: 'const newQ = oldQ + alpha * tdError;', explanation: 'Updates Q-value by blending old estimate with the new TD target scaled by alpha.' },
    ],
    returnExplanation:
      'Returns a comprehensive BellmanUpdateInfo record exposing oldQ, maxNextQ, tdTarget, tdError, and newQ for visualizer inspection.',
    commonBugs: [
      'Bootstrapping from terminal goal state by adding gamma * maxNextQ, which inflates goal values incorrectly.',
      'Mutating the Q-table in-place across historical playback steps without creating immutable snapshots.',
      'Allowing wall collisions to move the agent into the wall rather than bouncing back to current state with penalty.',
    ],
    edgeCaseHandling: [
      'Bouncing on wall/boundary: agent remains in current cell and absorbs configurable invalidMovePenalty.',
      'Tied actions: seeded pseudo-random tie breaking guarantees reproducibility without directional bias.',
      'Terminal transitions explicitly set maxNextQ to 0.',
    ],
  },
  correctness: {
    intuitiveExplanation:
      'Q-Learning is guaranteed to converge because the Bellman optimality update acts as a contraction mapping in the supremum norm. Every time an agent visits state s and takes action a, the update pulls Q(s, a) closer to the true expected return r + γ max_a\' Q*(s\', a\'). As long as all state-action pairs are explored repeatedly and the learning rate decays appropriately, the temporal-difference errors shrink to zero and the Q-table converges to Q*.',
    formalProof: {
      method: 'Mathematical Optimization Convergence',
      invariantOrClaim:
        'The Bellman optimality operator T* defined by (T*Q)(s, a) = R(s, a) + γ Σ_s\' P(s\'|s, a) max_a\' Q(s\', a\') is a γ-contraction mapping in the supremum norm: ||T*Q₁ − T*Q₂||_∞ ≤ γ ||Q₁ − Q₂||_∞.',
      initialization:
        'Initialize Q₀(s, a) = 0 for all (s, a) ∈ S × A. The initial approximation error is bounded by ||Q₀ − Q*||_∞ ≤ R_max / (1 − γ).',
      maintenance:
        'Let Q_k be the Q-table after k transitions. In expectation, E[tdTarget | s, a] = (T*Q_k)(s, a). By the Robbins-Monro stochastic approximation theorem (Watkins & Dayan, 1992), if learning rates satisfy Σ α_t = ∞ and Σ α_t² < ∞, and all (s, a) pairs are visited infinitely often, the stochastic sequence Q_k converges almost surely to the unique fixed point Q* satisfying T*Q* = Q*.',
      termination:
        'Upon convergence, ||Q_k − Q*||_∞ < ε_tol. The greedy policy π*(s) = argmax_a Q*(s, a) attains the maximum possible cumulative discounted return V*(s) from any starting state.',
      conclusion:
        'Q-Learning converges with probability 1 to the optimal action-value function Q* under standard exploration and step-size conditions.',
    },
  },
  complexityAnalysis: {
    bestCase: {
      complexity: 'O(episodes · path_length)',
      explanation: 'Agent navigates directly from Start to Goal along the shortest path without unnecessary wandering.',
      condition: 'Post-convergence greedy exploitation or simple unblocked corridor.',
    },
    averageCase: {
      complexity: 'O(episodes · maxSteps)',
      explanation: 'Agent balances exploration and exploitation, taking moderate detours before reaching the goal.',
      condition: 'Standard epsilon-greedy training with intermediate obstacle maze.',
    },
    worstCase: {
      complexity: 'O(episodes · maxSteps)',
      explanation: 'Agent wanders randomly, exhausting the maximum step limit in every episode before reaching the goal.',
      condition: 'High exploration epsilon with highly labyrinthine walls and small reward signals.',
    },
    auxiliarySpace: {
      complexity: 'O(|S| · |A|)',
      explanation: 'Tabular storage for state-action entries. For a W×H grid with 4 actions, storage is 4 · W · H floating-point numbers.',
    },
    totalMemory: 'O(W · H · |A|) for the Q-table + O(episodes) for training return curves.',
    bigOExplanation:
      'Each transition takes O(|A|) constant time to find max_a\' Q(s\', a\') across the 4 discrete actions. Overall training runtime scales linearly with total transitions executed: O(episodes · steps · |A|).',
    scalingBehavior:
      'Tabular Q-learning scales linearly with the number of grid cells W · H. However, in continuous state spaces, state discretization suffers from the curse of dimensionality, requiring neural network function approximation (DQN).',
  },
  advantagesAndLimitations: {
    strengths: [
      'Model-Free: does not require knowledge of environment transition dynamics P(s\'|s, a) or reward function formulas.',
      'Off-Policy: learns the optimal policy even while following an exploratory, sub-optimal behavior policy.',
      'Exact Convergence: proven mathematical convergence to Q* under standard stochastic approximation conditions.',
      'Transparent & Interpretable: tabular Q-values can be directly inspected, audited, and debugged state-by-state.',
    ],
    limitations: [
      'Curse of Dimensionality: tabular storage O(|S| · |A|) becomes intractable for continuous or high-dimensional problems.',
      'Sample Inefficient: delayed rewards propagate backward by only one step per episode, requiring many episodes for long paths.',
      'Maximization Bias: taking max_a\' Q(s\', a\') can overestimate action values in noisy or stochastic reward settings (mitigated by Double Q-Learning).',
      'Exploration-Exploitation Dilemma: poor exploration tuning can lead to policy starvation or slow learning.',
    ],
    memoryTradeOffs: [
      'Small grid worlds (e.g. 5×5 grid with 4 actions = 100 entries) require less than 1 KB of memory.',
      'Tabular approach cannot generalize across states: learning about cell (2, 2) provides zero information about cell (2, 3) without explicit visits.',
    ],
    poorChoiceScenarios: [
      'Continuous control problems (e.g. robotic arm joint angles) where states and actions cannot be discretized.',
      'Safety-critical real-world systems where random exploratory actions could cause hardware damage.',
    ],
  },
  comparisons: [
    {
      algorithm: 'Dynamic Programming (Value Iteration)',
      timeComplexity: 'O(iterations · |S|² · |A|)',
      spaceComplexity: 'O(|S|)',
      stabilityOrType: 'Model-Based Planning (Offline)',
      similarities: 'Both solve the Bellman optimality equation to find optimal value functions and policies.',
      differences:
        'Value Iteration requires an exact transition probability model P(s\'|s, a) and computes expectations over all states; Q-Learning is model-free and samples transitions through environmental interaction.',
      whenToPreferThis: 'When the transition rules are unknown and must be learned via simulation experience.',
      whenToPreferAlternative: 'When transition probabilities and rewards are completely known in advance.',
    },
    {
      algorithm: 'Greedy Search / A* Pathfinding',
      timeComplexity: 'O(|V| log |V| + |E|)',
      spaceComplexity: 'O(|V|)',
      stabilityOrType: 'Deterministic Graph Search',
      similarities: 'Both find paths from a start node to a goal node avoiding obstacles.',
      differences:
        'A* requires an explicit graph and heuristic function; Q-Learning learns through trial-and-error rewards and can optimize arbitrary non-distance reward objectives.',
      whenToPreferThis: 'When rewards are delayed, stochastic, or when learning a general reactive policy for any starting state.',
      whenToPreferAlternative: 'When the complete map is known and finding the single shortest path deterministically is required.',
    },
    {
      algorithm: 'Supervised Learning (e.g. Behavioral Cloning)',
      timeComplexity: 'O(epochs · n · parameters)',
      spaceComplexity: 'O(parameters)',
      stabilityOrType: 'Function Approximation from Expert Labels',
      similarities: 'Both learn to map states (inputs) to actions (outputs).',
      differences:
        'Supervised learning requires expert demonstration labels for every state; Q-Learning learns autonomously from delayed scalar reward signals without needing an expert teacher.',
      whenToPreferThis: 'When optimal expert demonstrations are unavailable or impossible to collect.',
      whenToPreferAlternative: 'When thousands of high-quality expert demonstration trajectories already exist.',
    },
  ],
  commonMistakes: [
    {
      title: 'Bootstrapping from Terminal States',
      misconception: 'Applying the full Bellman formula target = r + γ max Q(s\', a\') even when s\' is the terminal goal.',
      badCodeOrApproach:
        'const tdTarget = reward + gamma * Math.max(...Object.values(qTable[nextState])); // BUG: executed on terminal state',
      correctApproach:
        'Always check isTerminal first. If isTerminal is true, set tdTarget = reward strictly without adding gamma * maxNextQ.',
    },
    {
      title: 'Exploration Starvation (ε = 0 Too Early)',
      misconception: 'Believing that disabling exploration immediately produces the best policy.',
      badCodeOrApproach:
        'Setting epsilon = 0.0 from episode 1, causing the agent to get stuck taking the same loop.',
      correctApproach:
        'Maintain a positive exploration rate (e.g. ε = 0.2) or use an explicit decay schedule so all reachable states are thoroughly explored.',
    },
    {
      title: 'Setting Discount Factor γ = 0 or γ > 1',
      misconception: 'Assuming any positive gamma value is acceptable.',
      badCodeOrApproach:
        'Using gamma = 1.0 in infinite-horizon tasks (causing unbounded Q-value growth) or gamma = 0 (causing the agent to ignore delayed rewards).',
      correctApproach:
        'Use gamma in [0.8, 0.99] so that future rewards are appropriately discounted and cumulative returns remain finite.',
    },
    {
      title: 'Confusing Q-Learning with SARSA',
      misconception: 'Assuming Q-Learning and SARSA update rules are identical.',
      badCodeOrApproach:
        'Updating Q(s, a) using the Q-value of the action chosen by ε-greedy in the next state, instead of the maximum possible Q-value.',
      correctApproach:
        'Q-Learning is off-policy and uses max_a\' Q(s\', a\'). SARSA is on-policy and uses Q(s\', a\') where a\' is the actual next action chosen.',
    },
  ],
  exercises: [
    {
      id: 'ql-ex-1',
      type: 'conceptual',
      question:
        'An agent in state (1, 1) has Q-values: UP: 2.5, DOWN: 4.0, LEFT: 1.0, RIGHT: 4.0. If the agent acts greedily (ε = 0), what should happen regarding the tied actions DOWN and RIGHT?',
      options: [
        'A deterministic tie-breaking rule (such as seeded random selection or prioritized action order) must select consistently',
        'The algorithm crashes because tied Q-values are illegal',
        'Both actions are executed simultaneously',
        'The agent is forced to select UP instead',
      ],
      correctIndex: 0,
      explanation:
        'Ties frequently occur in reinforcement learning (especially during initial learning). The agent must break ties deterministically or with a seeded pseudo-random selection among the tied maximal actions.',
      optionExplanations: [
        'Correct! Deterministic seeded tie-breaking resolves equal maximal Q-values without directional bias.',
        'Tied Q-values are completely normal and expected.',
        'An agent can only execute one discrete action per time step.',
        'Suboptimal actions with lower values (2.5 < 4.0) are not selected during greedy exploitation.',
      ],
    },
    {
      id: 'ql-ex-2',
      type: 'step-tracing',
      question:
        'Current Q(s, a) = 3.0. Agent takes action a, receives immediate reward r = 2.0, and moves to non-terminal state s\' where max_a\' Q(s\', a\') = 5.0. If α = 0.5 and γ = 0.8, what is the new Q(s, a)?',
      options: ['4.500', '6.000', '3.000', '5.000'],
      correctIndex: 0,
      explanation:
        'TD_target = r + γ · max Q(s\', a\') = 2.0 + 0.8(5.0) = 2.0 + 4.0 = 6.0. TD_error = 6.0 - 3.0 = 3.0. New Q = 3.0 + 0.5(3.0) = 3.0 + 1.5 = 4.500.',
      optionExplanations: [
        'Correct! TD_target = 2 + 4 = 6.0; TD_error = 6 - 3 = 3.0; New Q = 3 + 0.5(3) = 4.5.',
        '6.0 is the TD target, not the updated Q-value (which moves only by fraction α = 0.5 toward the target).',
        '3.0 was the previous Q-value before the update.',
        '5.0 is the maximum Q-value of the successor state.',
      ],
    },
    {
      id: 'ql-ex-3',
      type: 'challenge',
      question:
        'An agent takes an action that hits a wall. The environment keeps the agent in the same cell and applies a penalty r = -5. If old Q = 0, α = 0.2, γ = 0.9, and max Q in the current cell is 0, what is the updated Q-value?',
      options: ['-1.000', '-5.000', '0.000', '-0.500'],
      correctIndex: 0,
      explanation:
        'Since next state s\' is the current state s, max Q(s\', a\') = 0.0. TD_target = -5 + 0.9(0) = -5.0. TD_error = -5.0 - 0.0 = -5.0. New Q = 0 + 0.2(-5.0) = -1.000.',
      optionExplanations: [
        'Correct! Target is -5.0; moving with step size α = 0.2 yields 0 + 0.2(-5) = -1.0.',
        '-5.0 is the full TD target before applying the learning rate α.',
        'The value decreases because of the negative wall penalty.',
        '-0.5 would correspond to α = 0.1 rather than 0.2.',
      ],
    },
  ],
  summary: {
    coreIdea:
      'Learns optimal state-action values Q*(s, a) through trial-and-error environmental transitions using off-policy Bellman temporal-difference bootstrapping without requiring a transition model.',
    keyConditions: [
      'Discrete state and action spaces with Markov property',
      'Positive learning rate α ∈ (0, 1] and discount factor γ ∈ [0, 1]',
      'Terminal transitions must NOT bootstrap from successor state values',
      'Sufficient exploration rate ε to discover optimal paths',
    ],
    complexitySummary: {
      time: 'O(episodes · steps · |A|)',
      space: 'O(|S| · |A|)',
    },
    whenToUse:
      'When an autonomous agent must discover an optimal sequential policy in an unknown discrete environment using delayed reward signals.',
    prerequisites: ['Markov Decision Processes', 'Bellman Optimality Equations', 'Dynamic Programming'],
    nextSteps: [
      { id: 'gradient-descent', name: 'Gradient Descent', reason: 'Learn how continuous parameter optimization powers Deep Q-Networks (DQN).' },
      { id: 'bfs', name: 'Breadth-First Search', reason: 'Compare model-free reinforcement learning with deterministic graph pathfinding.' },
    ],
  },
};
