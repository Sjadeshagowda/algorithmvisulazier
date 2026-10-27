import { createServer } from 'vite';

async function runQLearningVerification() {
  console.log('='.repeat(75));
  console.log('   ALGOVIZ — TABULAR Q-LEARNING & ENVIRONMENT AUDIT & VERIFICATION');
  console.log('='.repeat(75));

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  const qlMod = await vite.ssrLoadModule('/src/algorithms/ml/qLearning.ts');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      passed++;
      console.log(`  ✓ [PASS] ${testName}${detail ? ` (${detail})` : ''}`);
    } else {
      failed++;
      console.error(`  ✗ [FAIL] ${testName}${detail ? ` — ${detail}` : ''}`);
    }
  }

  // ── 1. ENVIRONMENT TRANSITIONS & COLLISION RULES ───────────────────────────
  console.log('\n[1] Verifying Grid-World Environment Transitions & Collision Dynamics:');

  const envConfig = {
    width: 4,
    height: 4,
    goal: { r: 0, c: 3 },
    walls: [{ r: 1, c: 1 }],
    specialRewards: [{ r: 2, c: 2, reward: 8 }],
    stepReward: -1,
    goalReward: 10,
    invalidMovePenalty: -5,
  };

  // Valid move right
  const move1 = qlMod.stepEnvironment({ r: 0, c: 0 }, 'right', envConfig);
  assert(
    move1.nextState.r === 0 && move1.nextState.c === 1 && move1.reward === -1 && !move1.isTerminal && !move1.isInvalidMove,
    'Valid move right transitions to (0, 1) with stepReward (-1)'
  );

  // Out-of-bounds move top (from row 0 moving 'up')
  const moveOOB = qlMod.stepEnvironment({ r: 0, c: 0 }, 'up', envConfig);
  assert(
    moveOOB.nextState.r === 0 && moveOOB.nextState.c === 0 && moveOOB.reward === -5 && !moveOOB.isTerminal && moveOOB.isInvalidMove,
    'Out-of-bounds move keeps agent in current state with invalidMovePenalty (-5)'
  );

  // Out-of-bounds move left (from col 0 moving 'left')
  const moveOOBLeft = qlMod.stepEnvironment({ r: 0, c: 0 }, 'left', envConfig);
  assert(
    moveOOBLeft.nextState.r === 0 && moveOOBLeft.nextState.c === 0 && moveOOBLeft.isInvalidMove,
    'Out-of-bounds left move bounces back to current cell'
  );

  // Wall collision (moving 'down' from (0, 1) into wall at (1, 1))
  const moveWall = qlMod.stepEnvironment({ r: 0, c: 1 }, 'down', envConfig);
  assert(
    moveWall.nextState.r === 0 && moveWall.nextState.c === 1 && moveWall.reward === -5 && moveWall.isInvalidMove,
    'Wall collision retains agent in (0, 1) and applies penalty (-5)'
  );

  // Move into goal (moving 'right' from (0, 2) into (0, 3))
  const moveGoal = qlMod.stepEnvironment({ r: 0, c: 2 }, 'right', envConfig);
  assert(
    moveGoal.nextState.r === 0 && moveGoal.nextState.c === 3 && moveGoal.reward === 10 && moveGoal.isTerminal && !moveGoal.isInvalidMove,
    'Goal transition reaches (0, 3), awards goalReward (+10), and flags isTerminal=true'
  );

  // Move into special reward cell (moving into (2, 2))
  const moveSpecial = qlMod.stepEnvironment({ r: 2, c: 1 }, 'right', envConfig);
  assert(
    moveSpecial.nextState.r === 2 && moveSpecial.nextState.c === 2 && moveSpecial.reward === 8 && !moveSpecial.isTerminal,
    'Special reward cell awards +8 bonus reward'
  );

  // ── 2. ENVIRONMENT VALIDATION & BFS REACHABILITY ───────────────────────────
  console.log('\n[2] Verifying Environment Layout Validation & BFS Reachability Checks:');

  // Valid configuration passes
  let threwValid = false;
  try {
    qlMod.validateGridEnvironment({
      width: 4,
      height: 4,
      start: { r: 0, c: 0 },
      goal: { r: 3, c: 3 },
      walls: [{ r: 1, c: 1 }],
    });
  } catch {
    threwValid = true;
  }
  assert(!threwValid, 'Valid grid environment passes validation without errors');

  // Identical Start and Goal must throw
  let threwSameStartGoal = false;
  try {
    qlMod.validateGridEnvironment({
      width: 4,
      height: 4,
      start: { r: 2, c: 2 },
      goal: { r: 2, c: 2 },
      walls: [],
    });
  } catch (e) {
    threwSameStartGoal = true;
    assert(e.message.includes('distinct'), 'Rejects start === goal with descriptive error', e.message);
  }
  assert(threwSameStartGoal, 'Start and goal co-location throws validation error');

  // Start on wall must throw
  let threwStartOnWall = false;
  try {
    qlMod.validateGridEnvironment({
      width: 4,
      height: 4,
      start: { r: 1, c: 1 },
      goal: { r: 3, c: 3 },
      walls: [{ r: 1, c: 1 }],
    });
  } catch (e) {
    threwStartOnWall = true;
    assert(e.message.includes('wall'), 'Rejects start on wall with descriptive error', e.message);
  }
  assert(threwStartOnWall, 'Start placed on wall throws error');

  // Out of bounds start must throw
  let threwOutOfBoundsStart = false;
  try {
    qlMod.validateGridEnvironment({
      width: 4,
      height: 4,
      start: { r: 5, c: 0 },
      goal: { r: 0, c: 0 },
      walls: [],
    });
  } catch {
    threwOutOfBoundsStart = true;
  }
  assert(threwOutOfBoundsStart, 'Start coordinate outside bounds throws error');

  // Completely blocked unreachable goal must throw via BFS check
  let threwUnreachable = false;
  try {
    qlMod.validateGridEnvironment({
      width: 3,
      height: 3,
      start: { r: 0, c: 0 },
      goal: { r: 2, c: 2 },
      // Surround goal (2, 2) completely: walls at (1, 2) and (2, 1)
      walls: [{ r: 1, c: 2 }, { r: 2, c: 1 }],
    });
  } catch (e) {
    threwUnreachable = true;
    assert(e.message.includes('unreachable'), 'Diagnoses unreachable goal via BFS reachability check', e.message);
  }
  assert(threwUnreachable, 'Unreachable goal throws descriptive error');

  // ── 3. EXACT BELLMAN UPDATE MATHEMATICS ────────────────────────────────────
  console.log('\n[3] Verifying Exact Bellman Updates against Hand-Calculated References:');

  const testQTable = {
    '0,0': { up: 1.0, down: 0.0, left: 0.0, right: 2.0 },
    '0,1': { up: 0.0, down: 3.0, left: 0.0, right: 5.0 },
  };

  // Hand-computed Non-terminal Bellman update:
  // state: (0, 0), action: 'right', nextState: (0, 1), reward: -1.0
  // oldQ = 2.0
  // maxNextQ = max(0, 3, 0, 5) = 5.0
  // gamma = 0.9, alpha = 0.2
  // TD_target = -1.0 + 0.9 * 5.0 = 3.5
  // TD_error = 3.5 - 2.0 = 1.5
  // newQ = 2.0 + 0.2 * 1.5 = 2.3
  const updateNonTerminal = qlMod.applyBellmanUpdate(
    { r: 0, c: 0 },
    'right',
    -1.0,
    { r: 0, c: 1 },
    false, // non-terminal
    false,
    testQTable,
    0.2, // alpha
    0.9  // gamma
  );

  assert(Math.abs(updateNonTerminal.oldQ - 2.0) < 1e-9, 'Non-terminal Bellman: oldQ = 2.0');
  assert(Math.abs(updateNonTerminal.maxNextQ - 5.0) < 1e-9, 'Non-terminal Bellman: maxNextQ = 5.0');
  assert(Math.abs(updateNonTerminal.tdTarget - 3.5) < 1e-9, 'Non-terminal Bellman: tdTarget = -1 + 0.9(5) = 3.5');
  assert(Math.abs(updateNonTerminal.tdError - 1.5) < 1e-9, 'Non-terminal Bellman: tdError = 3.5 - 2.0 = 1.5');
  assert(Math.abs(updateNonTerminal.newQ - 2.3) < 1e-9, 'Non-terminal Bellman: newQ = 2.0 + 0.2(1.5) = 2.3');
  assert(Math.abs(testQTable['0,0'].right - 2.3) < 1e-9, 'Q-table entry updated in-place to 2.3');

  // Hand-computed Terminal Bellman update (Goal Reached):
  // state: (0, 1), action: 'right', nextState: (0, 2), reward: +10.0, isTerminal: true
  // oldQ = 5.0
  // CRITICAL: maxNextQ must NOT bootstrap from terminal state! maxNextQ = 0.
  // TD_target = 10.0
  // alpha = 0.5
  // TD_error = 10.0 - 5.0 = 5.0
  // newQ = 5.0 + 0.5 * 5.0 = 7.5
  const updateTerminal = qlMod.applyBellmanUpdate(
    { r: 0, c: 1 },
    'right',
    10.0,
    { r: 0, c: 2 },
    true, // isTerminal
    false,
    testQTable,
    0.5,
    0.9
  );

  assert(updateTerminal.isTerminal === true, 'Terminal update flags isTerminal=true');
  assert(updateTerminal.maxNextQ === 0, 'Terminal update zeroes maxNextQ (no bootstrapping from goal)');
  assert(Math.abs(updateTerminal.tdTarget - 10.0) < 1e-9, 'Terminal update tdTarget = immediate reward = 10.0');
  assert(Math.abs(updateTerminal.tdError - 5.0) < 1e-9, 'Terminal update tdError = 10 - 5 = 5.0');
  assert(Math.abs(updateTerminal.newQ - 7.5) < 1e-9, 'Terminal update newQ = 5.0 + 0.5(5.0) = 7.5');

  // Boundary Case: Alpha = 1.0 (Full Replacement by Target)
  const alpha1Table = { '0,0': { up: 0, down: 0, left: 0, right: 1.0 } };
  const updateAlpha1 = qlMod.applyBellmanUpdate(
    { r: 0, c: 0 },
    'right',
    4.0,
    { r: 0, c: 1 },
    true,
    false,
    alpha1Table,
    1.0, // alpha = 1
    0.9
  );
  assert(Math.abs(updateAlpha1.newQ - 4.0) < 1e-9, 'Alpha = 1.0: newQ replaces completely with tdTarget (4.0)');

  // Boundary Case: Gamma = 0.0 (Pure Myopic Immediate Reward)
  const gamma0Table = {
    '0,0': { up: 0, down: 0, left: 0, right: 0 },
    '0,1': { up: 10, down: 10, left: 10, right: 10 },
  };
  const updateGamma0 = qlMod.applyBellmanUpdate(
    { r: 0, c: 0 },
    'right',
    2.0,
    { r: 0, c: 1 },
    false,
    false,
    gamma0Table,
    0.5,
    0.0 // gamma = 0
  );
  assert(Math.abs(updateGamma0.tdTarget - 2.0) < 1e-9, 'Gamma = 0.0: tdTarget equals immediate reward (2.0)');

  // ── 4. EPSILON-GREEDY POLICY & SEEDED TIE BREAKING ────────────────────────
  console.log('\n[4] Verifying Epsilon-Greedy Policy & Seeded Tie-Breaking:');

  // Pure exploitation (epsilon = 0)
  const exploitTable = {
    '1,1': { up: 1.0, down: 4.5, left: 2.0, right: 3.0 },
  };
  const prngExploit = qlMod.createPRNG(123);
  const choiceExploit = qlMod.selectAction({ r: 1, c: 1 }, exploitTable, 0.0, prngExploit);
  assert(choiceExploit.action === 'down', 'Epsilon = 0: selects action with max Q-value ("down")');
  assert(choiceExploit.actionType === 'exploitation', 'Tagged as exploitation');
  assert(!choiceExploit.isTied, 'No tie when unique maximum');

  // Tied maximum Q-values
  const tiedTable = {
    '1,1': { up: 5.0, down: 5.0, left: 1.0, right: 2.0 },
  };
  const prngTie = qlMod.createPRNG(42);
  const choiceTie = qlMod.selectAction({ r: 1, c: 1 }, tiedTable, 0.0, prngTie);
  assert(choiceTie.action === 'up' || choiceTie.action === 'down', 'Tied actions: selects among the tied maxima');
  assert(choiceTie.isTied === true, 'Flags isTied = true');

  // Pure exploration (epsilon = 1)
  const prngExplore = qlMod.createPRNG(99);
  const actionsObserved = new Set();
  for (let i = 0; i < 50; i++) {
    const act = qlMod.selectAction({ r: 1, c: 1 }, exploitTable, 1.0, prngExplore);
    actionsObserved.add(act.action);
    assert(act.actionType === 'exploration', 'Epsilon = 1: all choices tagged as exploration');
  }
  assert(actionsObserved.size === 4, 'Epsilon = 1: explores all 4 discrete directions (up, down, left, right)');

  // ── 5. FULL TRAINING & GREEDY POLICY EXECUTION ────────────────────────────
  console.log('\n[5] Verifying Full Training Convergence & Greedy Rollout:');

  // 4x4 Simple Corridor: Start (0,0) -> Goal (0,3)
  const corridorSteps = qlMod.runQLearning({
    width: 4,
    height: 4,
    start: { r: 0, c: 0 },
    goal: { r: 0, c: 3 },
    walls: [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
    episodes: 25,
    maxStepsPerEpisode: 30,
    seed: 42,
  });

  assert(corridorSteps.length > 5, 'Step sequence generated for Simple Corridor');

  const finalStep = corridorSteps[corridorSteps.length - 1];
  assert(finalStep.data.stage === 'greedy-rollout', 'Final step performs greedy rollout execution');

  const rollout = finalStep.data.greedyRollout;
  assert(rollout !== undefined, 'Greedy rollout result exists in final step');
  assert(rollout.reachedGoal === true, 'Learned greedy policy successfully reaches the goal');
  assert(rollout.steps.length === 3, 'Greedy policy takes optimal 3 steps: (0,0)->(0,1)->(0,2)->(0,3)', `steps=${rollout.steps.length}`);
  assert(rollout.actions.every(a => a === 'right'), 'All greedy actions are RIGHT along corridor');

  // Verify greedy rollout does not modify the Q-table
  const qTableBeforeRollout = qlMod.cloneQTable(finalStep.data.qTable);
  qlMod.executeGreedyPolicy(
    { r: 0, c: 0 },
    { r: 0, c: 3 },
    finalStep.data.qTable,
    {
      width: 4,
      height: 4,
      goal: { r: 0, c: 3 },
      walls: [{ r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 }],
      stepReward: -1,
      goalReward: 10,
      invalidMovePenalty: -5,
    }
  );
  assert(
    JSON.stringify(qTableBeforeRollout) === JSON.stringify(finalStep.data.qTable),
    'Greedy policy rollout leaves the Q-table completely untouched (inference only)'
  );

  // ── 6. VISUALIZATION STATE & SNAPSHOT IMMUTABILITY ────────────────────────
  console.log('\n[6] Verifying Snapshot Immutability & Visualizer Numerical Integrity:');

  // Verify that Step 0 initial Q-values are still 0.0 after training
  const initialStep = corridorSteps[0];
  assert(initialStep.data.stage === 'env-init', 'Step 0 is env-init');
  const initialQRight = initialStep.data.qTable['0,0'].right;
  assert(initialQRight === 0.0, 'Step 0 snapshot Q((0,0), RIGHT) remains 0.0 (immutable)', `got ${initialQRight}`);

  const finalQRight = finalStep.data.qTable['0,0'].right;
  assert(finalQRight > 0.0, 'Final step Q((0,0), RIGHT) reflects learned value (> 0.0)', `got ${finalQRight.toFixed(3)}`);

  // Verify transition update snapshot numbers match Bellman formulas
  const updateSteps = corridorSteps.filter(s => s.data.bellmanUpdate !== undefined);
  assert(updateSteps.length > 0, 'Found transition-update steps with Bellman inspector payloads');

  for (const step of updateSteps.slice(0, 5)) {
    const b = step.data.bellmanUpdate;
    const expectedError = b.tdTarget - b.oldQ;
    const expectedNewQ = b.oldQ + b.alpha * b.tdError;
    assert(
      Math.abs(b.tdError - expectedError) < 1e-9,
      'Bellman inspector tdError matches tdTarget - oldQ exactly',
      `target=${b.tdTarget.toFixed(4)}, old=${b.oldQ.toFixed(4)}, error=${b.tdError.toFixed(4)}`
    );
    assert(
      Math.abs(b.newQ - expectedNewQ) < 1e-9,
      'Bellman inspector newQ matches oldQ + alpha * tdError exactly',
      `newQ=${b.newQ.toFixed(4)}`
    );
  }

  // ── 7. PRESET INTEGRITY & REPRODUCIBILITY ──────────────────────────────────
  console.log('\n[7] Verifying Presets Registry & Deterministic Repeatability:');

  assert(qlMod.Q_LEARNING_PRESETS.length === 5, 'All 5 requested presets exist in registry');

  // Verify all presets pass environment validation
  for (const preset of qlMod.Q_LEARNING_PRESETS) {
    let err = null;
    try {
      qlMod.validateGridEnvironment(preset.config);
    } catch (e) {
      err = e;
    }
    assert(err === null, `Preset "${preset.name}" is valid and reachable`);
  }

  // Seeded reproducibility test
  const runA = qlMod.runQLearning({ episodes: 15, seed: 101 });
  const runB = qlMod.runQLearning({ episodes: 15, seed: 101 });
  assert(runA.length === runB.length, 'Repeat runs with identical seed generate exact same step count');
  assert(
    JSON.stringify(runA[runA.length - 1].data.qTable) === JSON.stringify(runB[runB.length - 1].data.qTable),
    'Repeat runs produce 100% bitwise identical Q-tables'
  );

  await vite.close();

  console.log('\n' + '='.repeat(75));
  console.log(`Q-LEARNING VERIFICATION COMPLETE: ${passed} passed, ${failed} failed.`);
  console.log('='.repeat(75));

  if (failed > 0) {
    process.exit(1);
  }
}

runQLearningVerification().catch(err => {
  console.error('Unhandled failure in Q-Learning verification suite:', err);
  process.exit(1);
});
