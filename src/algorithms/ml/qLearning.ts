import type { AlgorithmStep } from '../../types/algorithm';
import type {
  ActionType,
  GridCoord,
  SpecialRewardCell,
  BellmanUpdateInfo,
  QLearningEpisodeMetric,
  GreedyRolloutResult,
  QLearningSnapshot,
} from '../../types/ml';

export const ALL_ACTIONS: ActionType[] = ['up', 'down', 'left', 'right'];

export const ACTION_DELTAS: Record<ActionType, { dr: number; dc: number }> = {
  up: { dr: -1, dc: 0 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 },
};

export const ACTION_SYMBOLS: Record<ActionType, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export interface GridEnvironmentConfig {
  width: number;
  height: number;
  start: GridCoord;
  goal: GridCoord;
  walls: GridCoord[];
  specialRewards?: SpecialRewardCell[];
  stepReward?: number;
  goalReward?: number;
  invalidMovePenalty?: number;
}

export interface QLearningHyperparameters {
  learningRate?: number; // alpha: (0, 1]
  discountFactor?: number; // gamma: [0, 1]
  epsilon?: number; // epsilon: [0, 1]
  episodes?: number; // 1 to 500
  maxStepsPerEpisode?: number; // 1 to 200
  seed?: number;
}

export interface QLearningConfig extends GridEnvironmentConfig, QLearningHyperparameters {}

// ── Pure Helper Functions ───────────────────────────────────────────────────

export function encodeState(coord: GridCoord): string {
  return `${coord.r},${coord.c}`;
}

export function decodeState(key: string): GridCoord {
  const [r, c] = key.split(',').map(Number);
  return { r, c };
}

/**
 * Deterministic pseudo-random number generator (Lehmer LCG).
 * Generates uniformly distributed floats in [0, 1).
 */
export function createPRNG(seed = 42): () => number {
  let s = Math.abs(Math.floor(seed)) % 2147483647;
  if (s <= 0) s = 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function areCoordsEqual(a: GridCoord, b: GridCoord): boolean {
  return a.r === b.r && a.c === b.c;
}

export function isCoordInList(coord: GridCoord, list: GridCoord[]): boolean {
  return list.some(item => areCoordsEqual(item, coord));
}

/**
 * Validates grid configuration and asserts that goal is reachable via BFS.
 */
export function validateGridEnvironment(config: GridEnvironmentConfig): void {
  const { width, height, start, goal, walls, specialRewards } = config;

  if (!Number.isInteger(width) || width < 3 || width > 10) {
    throw new Error(`Grid width must be an integer between 3 and 10 (received ${width}).`);
  }
  if (!Number.isInteger(height) || height < 3 || height > 10) {
    throw new Error(`Grid height must be an integer between 3 and 10 (received ${height}).`);
  }

  if (start.r < 0 || start.r >= height || start.c < 0 || start.c >= width) {
    throw new Error(`Start position (${start.r}, ${start.c}) is outside the grid bounds.`);
  }
  if (goal.r < 0 || goal.r >= height || goal.c < 0 || goal.c >= width) {
    throw new Error(`Goal position (${goal.r}, ${goal.c}) is outside the grid bounds.`);
  }

  if (areCoordsEqual(start, goal)) {
    throw new Error('Start position and goal position must be distinct.');
  }

  if (isCoordInList(start, walls)) {
    throw new Error('Start position cannot be placed on a wall.');
  }
  if (isCoordInList(goal, walls)) {
    throw new Error('Goal position cannot be placed on a wall.');
  }

  for (const w of walls) {
    if (w.r < 0 || w.r >= height || w.c < 0 || w.c >= width) {
      throw new Error(`Wall at (${w.r}, ${w.c}) is outside the grid bounds.`);
    }
  }

  if (specialRewards) {
    for (const sr of specialRewards) {
      if (sr.r < 0 || sr.r >= height || sr.c < 0 || sr.c >= width) {
        throw new Error(`Special reward cell at (${sr.r}, ${sr.c}) is outside grid bounds.`);
      }
      if (areCoordsEqual(sr, start) || areCoordsEqual(sr, goal) || isCoordInList(sr, walls)) {
        throw new Error(`Special reward cell (${sr.r}, ${sr.c}) cannot overlap start, goal, or walls.`);
      }
    }
  }

  // Reachability check via Breadth-First Search (BFS)
  const reachable = checkPathExists(width, height, start, goal, walls);
  if (!reachable) {
    throw new Error('Goal is unreachable from the start state due to wall placement. Please remove blocking walls.');
  }
}

/**
 * Checks if a path exists between start and goal avoiding walls using BFS.
 */
export function checkPathExists(
  width: number,
  height: number,
  start: GridCoord,
  goal: GridCoord,
  walls: GridCoord[]
): boolean {
  const wallSet = new Set(walls.map(encodeState));
  const queue: GridCoord[] = [start];
  const visited = new Set<string>([encodeState(start)]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (areCoordsEqual(current, goal)) return true;

    for (const action of ALL_ACTIONS) {
      const delta = ACTION_DELTAS[action];
      const nr = current.r + delta.dr;
      const nc = current.c + delta.dc;

      if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
        const nextCoord: GridCoord = { r: nr, c: nc };
        const key = encodeState(nextCoord);
        if (!wallSet.has(key) && !visited.has(key)) {
          visited.add(key);
          queue.push(nextCoord);
        }
      }
    }
  }

  return false;
}

/**
 * Simulates a single environment transition from currentState taking action.
 * Returns the resulting next state, immediate reward, terminal status, and invalid move flag.
 */
export function stepEnvironment(
  currentState: GridCoord,
  action: ActionType,
  config: {
    width: number;
    height: number;
    goal: GridCoord;
    walls: GridCoord[];
    specialRewards?: SpecialRewardCell[];
    stepReward: number;
    goalReward: number;
    invalidMovePenalty: number;
  }
): { nextState: GridCoord; reward: number; isTerminal: boolean; isInvalidMove: boolean } {
  const delta = ACTION_DELTAS[action];
  const nr = currentState.r + delta.dr;
  const nc = currentState.c + delta.dc;

  // Check out of bounds or wall collision
  const isOutOfBounds = nr < 0 || nr >= config.height || nc < 0 || nc >= config.width;
  const isWall = !isOutOfBounds && isCoordInList({ r: nr, c: nc }, config.walls);

  if (isOutOfBounds || isWall) {
    return {
      nextState: { ...currentState },
      reward: config.invalidMovePenalty,
      isTerminal: false,
      isInvalidMove: true,
    };
  }

  const nextState: GridCoord = { r: nr, c: nc };

  // Check terminal goal
  if (areCoordsEqual(nextState, config.goal)) {
    return {
      nextState,
      reward: config.goalReward,
      isTerminal: true,
      isInvalidMove: false,
    };
  }

  // Check optional special reward cell
  if (config.specialRewards) {
    const match = config.specialRewards.find(sr => areCoordsEqual(sr, nextState));
    if (match) {
      return {
        nextState,
        reward: match.reward,
        isTerminal: false,
        isInvalidMove: false,
      };
    }
  }

  // Regular step reward
  return {
    nextState,
    reward: config.stepReward,
    isTerminal: false,
    isInvalidMove: false,
  };
}

/**
 * Initializes a deterministic Q-table with zeros for all grid states and actions.
 */
export function initializeQTable(
  width: number,
  height: number,
  walls: GridCoord[]
): Record<string, Record<ActionType, number>> {
  const qTable: Record<string, Record<ActionType, number>> = {};
  const wallSet = new Set(walls.map(encodeState));

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const key = `${r},${c}`;
      if (!wallSet.has(key)) {
        qTable[key] = {
          up: 0,
          down: 0,
          left: 0,
          right: 0,
        };
      }
    }
  }

  return qTable;
}

/**
 * Deep-copies the Q-table to ensure immutable snapshots.
 */
export function cloneQTable(
  table: Record<string, Record<ActionType, number>>
): Record<string, Record<ActionType, number>> {
  const copy: Record<string, Record<ActionType, number>> = {};
  for (const [state, actions] of Object.entries(table)) {
    copy[state] = { ...actions };
  }
  return copy;
}

/**
 * Chooses an action using an epsilon-greedy policy with deterministic seeded tie-breaking.
 */
export function selectAction(
  state: GridCoord,
  qTable: Record<string, Record<ActionType, number>>,
  epsilon: number,
  prng: () => number
): { action: ActionType; actionType: 'exploration' | 'exploitation'; isTied: boolean } {
  const stateKey = encodeState(state);
  const actions = qTable[stateKey] || { up: 0, down: 0, left: 0, right: 0 };

  // Exploration with probability epsilon
  if (prng() < epsilon) {
    const idx = Math.floor(prng() * ALL_ACTIONS.length);
    return {
      action: ALL_ACTIONS[Math.min(idx, ALL_ACTIONS.length - 1)],
      actionType: 'exploration',
      isTied: false,
    };
  }

  // Exploitation: maximum Q-value
  let maxQ = -Infinity;
  const bestActions: ActionType[] = [];

  for (const a of ALL_ACTIONS) {
    const val = actions[a];
    if (val > maxQ + 1e-9) {
      maxQ = val;
      bestActions.length = 0;
      bestActions.push(a);
    } else if (Math.abs(val - maxQ) <= 1e-9) {
      bestActions.push(a);
    }
  }

  const isTied = bestActions.length > 1;
  const chosenIndex = isTied ? Math.floor(prng() * bestActions.length) : 0;
  return {
    action: bestActions[Math.min(chosenIndex, bestActions.length - 1)],
    actionType: 'exploitation',
    isTied,
  };
}

/**
 * Performs Bellman Q-Learning update:
 * Nonterminal: TD_target = r + gamma * max_a' Q(s', a')
 * Terminal: TD_target = r (do NOT bootstrap from terminal state)
 * TD_error = TD_target - Q(s, a)
 * Q(s, a) <- Q(s, a) + alpha * TD_error
 */
export function applyBellmanUpdate(
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
}

/**
 * Executes the greedy policy without exploration and without updating the Q-table.
 */
export function executeGreedyPolicy(
  start: GridCoord,
  goal: GridCoord,
  qTable: Record<string, Record<ActionType, number>>,
  envConfig: {
    width: number;
    height: number;
    goal: GridCoord;
    walls: GridCoord[];
    specialRewards?: SpecialRewardCell[];
    stepReward: number;
    goalReward: number;
    invalidMovePenalty: number;
  },
  maxSteps = 50
): GreedyRolloutResult {
  const path: GridCoord[] = [{ ...start }];
  const actions: ActionType[] = [];
  const steps: GreedyRolloutResult['steps'] = [];
  let current = { ...start };
  let totalReward = 0;
  let reachedGoal = false;
  let stepLimitHit = false;

  const visitedSet = new Set<string>();

  for (let s = 0; s < maxSteps; s++) {
    if (areCoordsEqual(current, goal)) {
      reachedGoal = true;
      break;
    }

    const stateKey = encodeState(current);
    const qVals = qTable[stateKey] || { up: 0, down: 0, left: 0, right: 0 };

    // Select greedy action (break ties deterministically by fixed order)
    let bestA: ActionType = 'up';
    let maxVal = -Infinity;
    for (const a of ALL_ACTIONS) {
      if (qVals[a] > maxVal) {
        maxVal = qVals[a];
        bestA = a;
      }
    }

    // Step in environment
    const trans = stepEnvironment(current, bestA, envConfig);
    totalReward += trans.reward;
    actions.push(bestA);

    steps.push({
      state: { ...current },
      action: bestA,
      reward: trans.reward,
      qValues: { ...qVals },
    });

    current = trans.nextState;
    path.push({ ...current });

    if (trans.isTerminal || areCoordsEqual(current, goal)) {
      reachedGoal = true;
      break;
    }

    // Cycle detection check
    const currentKey = `${encodeState(current)}:${bestA}`;
    if (visitedSet.has(currentKey)) {
      // Loop detected
      stepLimitHit = true;
      break;
    }
    visitedSet.add(currentKey);
  }

  if (!reachedGoal && steps.length >= maxSteps) {
    stepLimitHit = true;
  }

  return {
    path,
    actions,
    totalReward,
    reachedGoal,
    stepLimitHit,
    steps,
  };
}

// ── Reproducible Presets ─────────────────────────────────────────────────────

export interface QLearningPresetDef {
  id: string;
  name: string;
  description: string;
  config: QLearningConfig;
}

export const Q_LEARNING_PRESETS: QLearningPresetDef[] = [
  {
    id: 'simple-corridor',
    name: '1. Simple Corridor (4×4)',
    description: 'A direct horizontal corridor with boundary walls forcing straight exploration to the goal.',
    config: {
      width: 4,
      height: 4,
      start: { r: 0, c: 0 },
      goal: { r: 0, c: 3 },
      walls: [
        { r: 1, c: 0 },
        { r: 1, c: 1 },
        { r: 1, c: 2 },
      ],
      stepReward: -1,
      goalReward: 10,
      invalidMovePenalty: -5,
      learningRate: 0.2,
      discountFactor: 0.9,
      epsilon: 0.2,
      episodes: 25,
      maxStepsPerEpisode: 30,
      seed: 42,
    },
  },
  {
    id: 'obstacle-maze',
    name: '2. Obstacle Maze (5×5)',
    description: 'Staggered interior walls requiring the agent to discover a multi-turn detour.',
    config: {
      width: 5,
      height: 5,
      start: { r: 0, c: 0 },
      goal: { r: 4, c: 4 },
      walls: [
        { r: 1, c: 1 },
        { r: 1, c: 2 },
        { r: 2, c: 3 },
        { r: 3, c: 1 },
        { r: 3, c: 2 },
      ],
      stepReward: -1,
      goalReward: 15,
      invalidMovePenalty: -5,
      learningRate: 0.25,
      discountFactor: 0.95,
      epsilon: 0.25,
      episodes: 35,
      maxStepsPerEpisode: 50,
      seed: 42,
    },
  },
  {
    id: 'reward-detour',
    name: '3. Reward Detour (4×5)',
    description: 'A special bonus reward cell (+8) competes with a direct shorter route to the terminal goal.',
    config: {
      width: 5,
      height: 4,
      start: { r: 0, c: 0 },
      goal: { r: 0, c: 4 },
      walls: [
        { r: 1, c: 2 },
      ],
      specialRewards: [
        { r: 3, c: 2, reward: 8, label: 'Detour Bonus' },
      ],
      stepReward: -1,
      goalReward: 10,
      invalidMovePenalty: -5,
      learningRate: 0.2,
      discountFactor: 0.9,
      epsilon: 0.2,
      episodes: 30,
      maxStepsPerEpisode: 40,
      seed: 42,
    },
  },
  {
    id: 'multiple-routes',
    name: '4. Multiple Routes (5×5)',
    description: 'Symmetric upper and lower passages around a central barrier demonstrate policy convergence.',
    config: {
      width: 5,
      height: 5,
      start: { r: 2, c: 0 },
      goal: { r: 2, c: 4 },
      walls: [
        { r: 2, c: 1 },
        { r: 2, c: 2 },
        { r: 2, c: 3 },
      ],
      stepReward: -1,
      goalReward: 12,
      invalidMovePenalty: -4,
      learningRate: 0.2,
      discountFactor: 0.9,
      epsilon: 0.2,
      episodes: 30,
      maxStepsPerEpisode: 40,
      seed: 42,
    },
  },
  {
    id: 'custom-grid',
    name: '5. Custom Grid (4×4)',
    description: 'Default clean 4×4 configuration ready for custom wall and coordinate experimentation.',
    config: {
      width: 4,
      height: 4,
      start: { r: 0, c: 0 },
      goal: { r: 3, c: 3 },
      walls: [
        { r: 1, c: 1 },
        { r: 2, c: 2 },
      ],
      stepReward: -1,
      goalReward: 10,
      invalidMovePenalty: -5,
      learningRate: 0.2,
      discountFactor: 0.9,
      epsilon: 0.2,
      episodes: 25,
      maxStepsPerEpisode: 35,
      seed: 42,
    },
  },
];

// ── Step-by-Step Training Engine ─────────────────────────────────────────────

/**
 * Main entry point for Q-Learning step generation.
 * Executes full training, records detailed snapshots for initial, milestone, and final episodes,
 * and terminates with a greedy policy rollout.
 */
export function runQLearning(configOverride?: Partial<QLearningConfig>): AlgorithmStep[] {
  const defaultConfig = Q_LEARNING_PRESETS[0].config;
  const config: QLearningConfig = {
    ...defaultConfig,
    ...configOverride,
    start: configOverride?.start || defaultConfig.start,
    goal: configOverride?.goal || defaultConfig.goal,
    walls: configOverride?.walls || defaultConfig.walls,
    specialRewards: configOverride?.specialRewards || defaultConfig.specialRewards,
  };

  const width = config.width ?? 4;
  const height = config.height ?? 4;
  const start = config.start;
  const goal = config.goal;
  const walls = config.walls || [];
  const specialRewards = config.specialRewards || [];
  const stepReward = config.stepReward ?? -1;
  const goalReward = config.goalReward ?? 10;
  const invalidMovePenalty = config.invalidMovePenalty ?? -5;
  const alpha = config.learningRate ?? 0.2;
  const gamma = config.discountFactor ?? 0.9;
  const epsilon = config.epsilon ?? 0.2;
  const episodes = Math.min(Math.max(config.episodes ?? 25, 1), 500);
  const maxStepsPerEpisode = Math.min(Math.max(config.maxStepsPerEpisode ?? 30, 1), 200);
  const seed = config.seed ?? 42;

  // Validate layout & reachability
  validateGridEnvironment({
    width,
    height,
    start,
    goal,
    walls,
    specialRewards,
    stepReward,
    goalReward,
    invalidMovePenalty,
  });

  const prng = createPRNG(seed);
  const qTable = initializeQTable(width, height, walls);
  const visitCounts: Record<string, number> = {};
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      visitCounts[`${r},${c}`] = 0;
    }
  }

  const steps: AlgorithmStep[] = [];
  const episodeMetrics: QLearningEpisodeMetric[] = [];
  let cumulativeExploration = 0;
  let cumulativeExploitation = 0;

  // Helper to build an immutable snapshot
  const makeSnapshot = (
    stage: QLearningSnapshot['stage'],
    currentEp: number,
    currentStep: number,
    agentPos: GridCoord,
    visited: GridCoord[],
    extra: Partial<QLearningSnapshot> = {}
  ): QLearningSnapshot => ({
    type: 'q-learning',
    gridWidth: width,
    gridHeight: height,
    start: { ...start },
    goal: { ...goal },
    walls: walls.map(w => ({ ...w })),
    specialRewards: specialRewards.map(sr => ({ ...sr })),
    stepReward,
    goalReward,
    invalidMovePenalty,
    learningRate: alpha,
    discountFactor: gamma,
    epsilon,
    totalEpisodes: episodes,
    currentEpisode: currentEp,
    currentStepInEpisode: currentStep,
    agentPosition: { ...agentPos },
    visitedStates: visited.map(v => ({ ...v })),
    qTable: cloneQTable(qTable),
    visitCounts: { ...visitCounts },
    episodeMetrics: episodeMetrics.map(m => ({ ...m })),
    cumulativeExploration,
    cumulativeExploitation,
    stage,
    ...extra,
  });

  // Step 1: Environment Initialization & Initial Q-Table
  steps.push({
    data: makeSnapshot('env-init', 0, 0, start, [start]),
    description: `Environment initialized: ${width}×${height} grid with Start at (${start.r}, ${start.c}) and Goal at (${goal.r}, ${goal.c}). All Q-values initialized to 0.00. Hyperparameters: α = ${alpha}, γ = ${gamma}, ε = ${epsilon}.`,
    highlightLines: [0, 1],
    operation: 'Init Environment',
    phase: 'Initialization',
    auxiliary: [
      { label: 'Grid Size', value: `${width}×${height}` },
      { label: 'Start', value: `(${start.r}, ${start.c})` },
      { label: 'Goal', value: `(${goal.r}, ${goal.c})` },
      { label: 'Walls', value: walls.length },
      { label: 'Alpha (α)', value: alpha },
      { label: 'Gamma (γ)', value: gamma },
      { label: 'Epsilon (ε)', value: epsilon },
    ],
  });

  // Determine which episodes receive granular step-by-step snapshots
  // Pedagogical design: Detailed snapshots for episode 1 (initial exploration),
  // a milestone mid-training episode, and the final episode.
  const detailedEpisodeSet = new Set<number>();
  detailedEpisodeSet.add(1);
  if (episodes >= 5) {
    detailedEpisodeSet.add(Math.floor(episodes / 2));
  }
  if (episodes > 1) {
    detailedEpisodeSet.add(episodes);
  }

  // ── Training Loop across Episodes ──────────────────────────────────────────
  for (let ep = 1; ep <= episodes; ep++) {
    let currentPos: GridCoord = { ...start };
    const visitedInEpisode: GridCoord[] = [{ ...start }];
    let epReward = 0;
    let epSteps = 0;
    let reachedGoal = false;
    let epExploration = 0;
    let epExploitation = 0;

    const isDetailedEpisode = detailedEpisodeSet.has(ep);

    if (isDetailedEpisode) {
      steps.push({
        data: makeSnapshot('episode-start', ep, 0, currentPos, visitedInEpisode),
        description: `Starting Episode ${ep}/${episodes}. Agent resets to Start position (${start.r}, ${start.c}) with zero cumulative episode return.`,
        highlightLines: [2, 3],
        operation: `Episode ${ep} Start`,
        phase: 'Training',
        auxiliary: [
          { label: 'Episode', value: `${ep}/${episodes}` },
          { label: 'Agent Pos', value: `(${currentPos.r}, ${currentPos.c})` },
          { label: 'Mode', value: 'Epsilon-Greedy' },
        ],
      });
    }

    // Step loop within episode
    for (let step = 1; step <= maxStepsPerEpisode; step++) {
      epSteps++;
      visitCounts[encodeState(currentPos)] = (visitCounts[encodeState(currentPos)] || 0) + 1;

      // 1. Epsilon-greedy action selection
      const selection = selectAction(currentPos, qTable, epsilon, prng);
      const chosenAction = selection.action;
      if (selection.actionType === 'exploration') {
        epExploration++;
        cumulativeExploration++;
      } else {
        epExploitation++;
        cumulativeExploitation++;
      }

      // 2. Environment step transition
      const transition = stepEnvironment(currentPos, chosenAction, {
        width,
        height,
        goal,
        walls,
        specialRewards,
        stepReward,
        goalReward,
        invalidMovePenalty,
      });

      epReward += transition.reward;

      // 3. Bellman update
      const updateInfo = applyBellmanUpdate(
        currentPos,
        chosenAction,
        transition.reward,
        transition.nextState,
        transition.isTerminal,
        transition.isInvalidMove,
        qTable,
        alpha,
        gamma
      );

      const prevPos = { ...currentPos };
      currentPos = transition.nextState;
      visitedInEpisode.push({ ...currentPos });

      // Generate visualizer step for detailed episodes
      if (isDetailedEpisode) {
        const actionLabel = `${ACTION_SYMBOLS[chosenAction]} ${chosenAction.toUpperCase()}`;
        const typeLabel = selection.actionType === 'exploration' ? 'Random Exploration (ε)' : 'Greedy Exploitation';

        const updateDesc = transition.isTerminal
          ? `Terminal goal reached! Q(s, ${chosenAction}) ← ${updateInfo.oldQ.toFixed(3)} + ${alpha}[${updateInfo.reward} − ${updateInfo.oldQ.toFixed(3)}] = ${updateInfo.newQ.toFixed(3)}.`
          : `Transition to (${currentPos.r}, ${currentPos.c}), r = ${updateInfo.reward}. TD target = ${updateInfo.tdTarget.toFixed(3)}, TD error = ${updateInfo.tdError.toFixed(3)}. New Q = ${updateInfo.newQ.toFixed(3)}.`;

        steps.push({
          data: makeSnapshot('transition-update', ep, step, currentPos, visitedInEpisode, {
            previousPosition: prevPos,
            selectedAction: chosenAction,
            actionType: selection.actionType,
            isTiedAction: selection.isTied,
            bellmanUpdate: updateInfo,
            isTerminal: transition.isTerminal,
          }),
          description: `Ep ${ep}, Step ${step}: Action ${actionLabel} chosen via ${typeLabel}. ${updateDesc}`,
          highlightLines: [4, 5, 6, 7, 8, 9, 10],
          operation: `Bellman Update (${chosenAction})`,
          phase: 'Training',
          auxiliary: [
            { label: 'Action', value: actionLabel },
            { label: 'Selection', value: selection.actionType },
            { label: 'Reward', value: transition.reward },
            { label: 'Old Q', value: updateInfo.oldQ.toFixed(3) },
            { label: 'TD Target', value: updateInfo.tdTarget.toFixed(3) },
            { label: 'TD Error', value: updateInfo.tdError.toFixed(3) },
            { label: 'New Q', value: updateInfo.newQ.toFixed(3) },
          ],
        });
      }

      if (transition.isTerminal) {
        reachedGoal = true;
        break;
      }
    }

    // Record episode metrics
    episodeMetrics.push({
      episode: ep,
      totalReward: epReward,
      stepCount: epSteps,
      reachedGoal,
      explorationCount: epExploration,
      exploitationCount: epExploitation,
    });

    if (isDetailedEpisode) {
      steps.push({
        data: makeSnapshot('episode-end', ep, epSteps, currentPos, visitedInEpisode, {
          isTerminal: reachedGoal,
        }),
        description: `Episode ${ep} finished: ${reachedGoal ? 'Goal reached' : 'Step limit reached'}. Steps: ${epSteps}, Total Return: ${epReward.toFixed(1)}, Exploration: ${epExploration}, Exploitation: ${epExploitation}.`,
        highlightLines: [11, 12, 13],
        operation: `Episode ${ep} Complete`,
        phase: 'Episode Summary',
        auxiliary: [
          { label: 'Episode', value: `${ep}/${episodes}` },
          { label: 'Return', value: epReward.toFixed(1) },
          { label: 'Steps', value: epSteps },
          { label: 'Outcome', value: reachedGoal ? 'Goal Reached' : 'Step Limit' },
        ],
      });
    }
  }

  // Final greedy policy execution using learned Q-table
  const greedyRollout = executeGreedyPolicy(
    start,
    goal,
    qTable,
    {
      width,
      height,
      goal,
      walls,
      specialRewards,
      stepReward,
      goalReward,
      invalidMovePenalty,
    },
    50
  );

  steps.push({
    data: makeSnapshot('greedy-rollout', episodes, 0, start, greedyRollout.path, {
      greedyRollout,
    }),
    description: `Training Complete (${episodes} episodes)! Executing learned greedy policy (π(s) = argmax_a Q(s,a)) from Start. Outcome: ${greedyRollout.reachedGoal ? `Goal Reached in ${greedyRollout.steps.length} steps` : 'Failed to reach goal'}. Total Return: ${greedyRollout.totalReward.toFixed(1)}.`,
    highlightLines: [14, 15],
    operation: 'Greedy Policy Rollout',
    phase: 'Learned Policy',
    auxiliary: [
      { label: 'Total Episodes', value: episodes },
      { label: 'Greedy Steps', value: greedyRollout.steps.length },
      { label: 'Greedy Return', value: greedyRollout.totalReward.toFixed(1) },
      { label: 'Goal Reached', value: greedyRollout.reachedGoal ? 'Yes' : 'No' },
    ],
  });

  return steps;
}
