import React, { useState } from 'react';
import type { QLearningSnapshot, ActionType, GridCoord } from '../../types/ml';
import { ACTION_SYMBOLS, ALL_ACTIONS, encodeState, areCoordsEqual } from '../../algorithms/ml/qLearning';

interface QLearningPlotProps {
  data: QLearningSnapshot;
}

type QLearningTab = 'grid' | 'values' | 'qtable' | 'bellman' | 'progress' | 'policy';

export const QLearningPlot: React.FC<QLearningPlotProps> = ({ data }) => {
  const {
    gridWidth,
    gridHeight,
    start,
    goal,
    walls,
    specialRewards,
    stepReward,
    goalReward,
    invalidMovePenalty,
    learningRate,
    discountFactor,
    epsilon,
    totalEpisodes,
    currentEpisode,
    currentStepInEpisode,
    agentPosition,
    previousPosition,
    selectedAction,
    actionType,
    isTiedAction,
    qTable,
    visitCounts,
    bellmanUpdate,
    episodeMetrics,
    cumulativeExploration,
    cumulativeExploitation,
    greedyRollout,
    stage,
  } = data;

  const [activeTab, setActiveTab] = useState<QLearningTab>('grid');
  const [inspectedCoord, setInspectedCoord] = useState<GridCoord | null>(null);

  // Determine state to inspect (defaults to agent position)
  const activeCoord = inspectedCoord || agentPosition;
  const activeKey = encodeState(activeCoord);
  const activeQValues = qTable[activeKey] || { up: 0, down: 0, left: 0, right: 0 };

  // Calculate maximum Q-value and greedy action for active state
  let maxActiveQ = -Infinity;
  const bestActiveActions: ActionType[] = [];
  for (const a of ALL_ACTIONS) {
    const val = activeQValues[a];
    if (val > maxActiveQ + 1e-9) {
      maxActiveQ = val;
      bestActiveActions.length = 0;
      bestActiveActions.push(a);
    } else if (Math.abs(val - maxActiveQ) <= 1e-9) {
      bestActiveActions.push(a);
    }
  }

  // Calculate success rate over the last 10 episodes
  const recentWindow = 10;
  const recentEpisodes = episodeMetrics.slice(-recentWindow);
  const successCount = recentEpisodes.filter(e => e.reachedGoal).length;
  const recentSuccessRate = recentEpisodes.length > 0 ? (successCount / recentEpisodes.length) * 100 : 0;

  // Total exploration percentage
  const totalDecisions = cumulativeExploration + cumulativeExploitation;
  const explorationPercent = totalDecisions > 0 ? ((cumulativeExploration / totalDecisions) * 100).toFixed(1) : '0.0';

  // Wall set for quick lookups
  const wallKeys = new Set(walls.map(encodeState));

  // Policy path keys for overlay
  const greedyPathKeys = new Set((greedyRollout?.path || []).map(encodeState));

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-2 relative select-none">
      <div className="w-full max-w-4xl bg-slate-900/95 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl text-slate-200">
        {/* Header Stats Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Tabular Q-Learning (RL)
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Episode {currentEpisode}/{totalEpisodes}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Step {currentStepInEpisode}
            </span>
            {selectedAction && (
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                actionType === 'exploration'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}>
                {ACTION_SYMBOLS[selectedAction]} {selectedAction.toUpperCase()} ({actionType === 'exploration' ? 'ε-Explore' : 'Exploit'})
                {isTiedAction ? ' [Tied]' : ''}
              </span>
            )}
            {stage === 'greedy-rollout' && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Greedy Rollout
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              α = {learningRate}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              γ = {discountFactor}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ε = {epsilon}
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap gap-1 mb-3 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-[11px]">
          {[
            { id: 'grid', label: 'View A: Grid World' },
            { id: 'values', label: 'View B: State Q-Values' },
            { id: 'qtable', label: 'View C: Q-Table' },
            { id: 'bellman', label: 'View D: Bellman Inspector' },
            { id: 'progress', label: 'View E: Learning Progress' },
            { id: 'policy', label: 'View F: Greedy Policy' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as QLearningTab)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Visualization Canvas */}
        <div className="min-h-[300px] flex flex-col justify-center">
          {/* ──────────────── VIEW A: GRID WORLD ──────────────── */}
          {activeTab === 'grid' && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="grid gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner"
                  style={{
                    gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: gridHeight }).map((_, r) =>
                    Array.from({ length: gridWidth }).map((_, c) => {
                      const coord: GridCoord = { r, c };
                      const key = encodeState(coord);
                      const isAgent = areCoordsEqual(coord, agentPosition);
                      const isPrevAgent = previousPosition && areCoordsEqual(coord, previousPosition);
                      const isStart = areCoordsEqual(coord, start);
                      const isGoal = areCoordsEqual(coord, goal);
                      const isWall = wallKeys.has(key);
                      const specialReward = specialRewards?.find(sr => areCoordsEqual(sr, coord));
                      const isInspected = areCoordsEqual(coord, activeCoord);
                      const isGreedyPath = greedyPathKeys.has(key);
                      const visitCount = visitCounts[key] || 0;

                      // Cell background styling
                      let cellBg = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60';
                      if (isWall) {
                        cellBg = 'bg-slate-900 border-slate-800 text-slate-600 opacity-90 pattern-diagonal';
                      } else if (isAgent) {
                        cellBg = 'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400/80 shadow-lg scale-[1.03] z-10';
                      } else if (isGoal) {
                        cellBg = 'bg-amber-500/20 border-amber-400 text-amber-300';
                      } else if (isStart) {
                        cellBg = 'bg-blue-500/20 border-blue-400 text-blue-300';
                      } else if (specialReward) {
                        cellBg = 'bg-purple-500/20 border-purple-400 text-purple-300';
                      } else if (isGreedyPath) {
                        cellBg = 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300';
                      } else if (visitCount > 0) {
                        cellBg = 'bg-slate-800 border-slate-600/70 text-slate-300';
                      }

                      return (
                        <div
                          key={key}
                          onClick={() => !isWall && setInspectedCoord(coord)}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border flex flex-col items-center justify-between p-1 transition-all cursor-pointer relative ${cellBg} ${
                            isInspected && !isAgent
                              ? 'ring-2 ring-cyan-400/80'
                              : isPrevAgent && !isAgent
                              ? 'ring-1 ring-cyan-500/50'
                              : ''
                          }`}
                          title={`Cell (${r}, ${c}) | Visits: ${visitCount}`}
                        >
                          {/* Coordinates / Badge */}
                          <div className="w-full flex items-center justify-between text-[9px] font-mono opacity-70">
                            <span>{r},{c}</span>
                            {visitCount > 0 && !isWall && (
                              <span className="text-[8px] px-1 rounded bg-slate-950/60">×{visitCount}</span>
                            )}
                          </div>

                          {/* Center Marker */}
                          <div className="flex items-center justify-center font-bold text-xs">
                            {isWall ? (
                              <span className="text-xs">■</span>
                            ) : isAgent ? (
                              <span className="text-base animate-bounce">🤖</span>
                            ) : isGoal ? (
                              <span className="text-sm">🏆 Goal</span>
                            ) : isStart ? (
                              <span className="text-xs text-blue-300 font-semibold">Start</span>
                            ) : specialReward ? (
                              <span className="text-[10px] text-purple-300 font-bold">+{specialReward.reward}</span>
                            ) : isGreedyPath ? (
                              <span className="text-[10px] text-emerald-400 font-semibold">★ Path</span>
                            ) : null}
                          </div>

                          {/* Action Arrow if in policy or current agent */}
                          <div className="text-[10px] font-mono text-center opacity-80">
                            {isAgent && selectedAction ? (
                              <span className="font-bold text-emerald-200">
                                {ACTION_SYMBOLS[selectedAction]}
                              </span>
                            ) : !isWall && qTable[key] ? (
                              <span className="text-[9px] text-slate-400">
                                {(() => {
                                  const acts = qTable[key];
                                  const max = Math.max(acts.up, acts.down, acts.left, acts.right);
                                  if (max === 0) return '•';
                                  if (max === acts.up) return '↑';
                                  if (max === acts.down) return '↓';
                                  if (max === acts.left) return '←';
                                  return '→';
                                })()}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Click any traversable cell to inspect its state-action values below.
                </div>
              </div>

              {/* Legend & Current Agent Info */}
              <div className="flex-1 w-full flex flex-col gap-2.5 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Environment Legend</span>
                    <span className="text-[10px] text-slate-500">Discrete Grid 2D</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-400 flex items-center justify-center text-[9px]">🤖</span>
                      <span>Agent Position</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-amber-500/30 border border-amber-400 flex items-center justify-center text-[9px]">🏆</span>
                      <span>Goal (+{goalReward})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-blue-500/30 border border-blue-400 flex items-center justify-center text-[9px]">S</span>
                      <span>Start Position</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-[9px]">■</span>
                      <span>Wall (Penalty {invalidMovePenalty})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-purple-500/30 border border-purple-400 flex items-center justify-center text-[9px]">★</span>
                      <span>Special Reward</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-[9px]">·</span>
                      <span>Step Cost ({stepReward})</span>
                    </div>
                  </div>
                </div>

                {/* Transition Summary Card */}
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 font-mono text-[11px]">
                  <div className="font-sans font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Current Transition</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      actionType === 'exploration' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {actionType === 'exploration' ? 'Random Action (ε)' : 'Greedy Choice (max Q)'}
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-300">
                    <div>State: <span className="text-cyan-300">({agentPosition.r}, {agentPosition.c})</span></div>
                    {previousPosition && (
                      <div>From: <span className="text-slate-400">({previousPosition.r}, {previousPosition.c})</span></div>
                    )}
                    <div>Action: <span className="text-emerald-300 font-bold">{selectedAction ? `${ACTION_SYMBOLS[selectedAction]} ${selectedAction.toUpperCase()}` : 'None'}</span></div>
                    <div>Reward: <span className={`font-bold ${(bellmanUpdate?.reward ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{bellmanUpdate?.reward ?? 0}</span></div>
                    <div>Invalid Move: <span className={bellmanUpdate?.isInvalidMove ? 'text-rose-400 font-bold' : 'text-slate-400'}>{bellmanUpdate?.isInvalidMove ? 'Yes (Bumped into wall/boundary)' : 'No'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── VIEW B: STATE-ACTION VALUES ──────────────── */}
          {activeTab === 'values' && (
            <div className="flex flex-col items-center justify-center p-2 gap-4">
              <div className="text-center">
                <div className="text-xs text-slate-400">Inspecting State:</div>
                <div className="text-base font-bold text-cyan-300 font-mono">
                  State s = ({activeCoord.r}, {activeCoord.c})
                  {areCoordsEqual(activeCoord, agentPosition) && ' [Agent Current State]'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Visit Count: <span className="font-mono text-white font-bold">{visitCounts[activeKey] || 0}</span>
                </div>
              </div>

              {/* Directional Action Diamond */}
              <div className="relative w-64 h-64 bg-slate-950 rounded-2xl border border-slate-800 p-2 flex items-center justify-center shadow-inner">
                {/* UP */}
                <div className={`absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center p-2 rounded-lg border w-24 text-center transition-all ${
                  bestActiveActions.includes('up') && maxActiveQ !== 0
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <span className="text-sm font-bold">↑ UP</span>
                  <span className="text-xs font-mono font-bold mt-0.5">{activeQValues.up.toFixed(3)}</span>
                </div>

                {/* LEFT */}
                <div className={`absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-center p-2 rounded-lg border w-24 text-center transition-all ${
                  bestActiveActions.includes('left') && maxActiveQ !== 0
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <span className="text-sm font-bold">← LEFT</span>
                  <span className="text-xs font-mono font-bold mt-0.5">{activeQValues.left.toFixed(3)}</span>
                </div>

                {/* Center Badge */}
                <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-[10px] text-slate-400 font-mono font-semibold">({activeCoord.r},{activeCoord.c})</span>
                  <span className="text-xs">🤖</span>
                </div>

                {/* RIGHT */}
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center p-2 rounded-lg border w-24 text-center transition-all ${
                  bestActiveActions.includes('right') && maxActiveQ !== 0
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <span className="text-sm font-bold">RIGHT →</span>
                  <span className="text-xs font-mono font-bold mt-0.5">{activeQValues.right.toFixed(3)}</span>
                </div>

                {/* DOWN */}
                <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center p-2 rounded-lg border w-24 text-center transition-all ${
                  bestActiveActions.includes('down') && maxActiveQ !== 0
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}>
                  <span className="text-sm font-bold">↓ DOWN</span>
                  <span className="text-xs font-mono font-bold mt-0.5">{activeQValues.down.toFixed(3)}</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                <div className="px-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                  Max Q-Value: <span className="font-mono font-bold text-emerald-400">{maxActiveQ.toFixed(3)}</span>
                </div>
                <div className="px-3 py-1.5 bg-slate-950/70 border border-slate-800 rounded-lg">
                  Greedy Policy Action: <span className="font-mono font-bold text-cyan-300">{bestActiveActions.join(', ').toUpperCase()}</span>
                </div>
                {bestActiveActions.length > 1 && (
                  <div className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg font-mono">
                    Tied Action: Deterministic Seeded Resolution
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──────────────── VIEW C: Q-TABLE ──────────────── */}
          {activeTab === 'qtable' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Tabular Representation Q(s, a) for all traversable grid states:</span>
                <span className="text-cyan-400 font-mono">Current state highlighted in cyan</span>
              </div>
              <div className="overflow-x-auto max-h-[300px] border border-slate-800 rounded-lg">
                <table className="w-full text-left font-mono text-[11px] text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-2">State (r, c)</th>
                      <th className="p-2 text-right">Q(s, ↑ Up)</th>
                      <th className="p-2 text-right">Q(s, ↓ Down)</th>
                      <th className="p-2 text-right">Q(s, ← Left)</th>
                      <th className="p-2 text-right">Q(s, → Right)</th>
                      <th className="p-2 text-center">Best Greedy Action</th>
                      <th className="p-2 text-right">Visits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                    {Object.entries(qTable).map(([key, actions]) => {
                      const [r, c] = key.split(',').map(Number);
                      const isCurrent = areCoordsEqual({ r, c }, agentPosition);
                      const isGoalCell = areCoordsEqual({ r, c }, goal);
                      const visits = visitCounts[key] || 0;

                      // Find max
                      let bestA = 'up';
                      let maxVal = -Infinity;
                      for (const a of ALL_ACTIONS) {
                        if (actions[a] > maxVal) {
                          maxVal = actions[a];
                          bestA = a;
                        }
                      }

                      return (
                        <tr
                          key={key}
                          onClick={() => setInspectedCoord({ r, c })}
                          className={`cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-cyan-950/60 text-cyan-200 font-bold border-l-4 border-cyan-400'
                              : 'hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="p-2 font-bold">
                            ({r}, {c}) {isCurrent && '🤖'} {isGoalCell && '🏆'}
                          </td>
                          <td className={`p-2 text-right ${bestA === 'up' && maxVal !== 0 ? 'text-emerald-400 font-bold' : ''}`}>
                            {actions.up.toFixed(3)}
                          </td>
                          <td className={`p-2 text-right ${bestA === 'down' && maxVal !== 0 ? 'text-emerald-400 font-bold' : ''}`}>
                            {actions.down.toFixed(3)}
                          </td>
                          <td className={`p-2 text-right ${bestA === 'left' && maxVal !== 0 ? 'text-emerald-400 font-bold' : ''}`}>
                            {actions.left.toFixed(3)}
                          </td>
                          <td className={`p-2 text-right ${bestA === 'right' && maxVal !== 0 ? 'text-emerald-400 font-bold' : ''}`}>
                            {actions.right.toFixed(3)}
                          </td>
                          <td className="p-2 text-center font-bold text-amber-300">
                            {ACTION_SYMBOLS[bestA as ActionType]} {bestA.toUpperCase()}
                          </td>
                          <td className="p-2 text-right text-slate-400">
                            {visits}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ──────────────── VIEW D: BELLMAN INSPECTOR ──────────────── */}
          {activeTab === 'bellman' && (
            <div className="flex flex-col gap-3">
              {bellmanUpdate ? (
                <div className="space-y-3">
                  {/* Mathematical Formulation Card */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>Bellman Temporal-Difference (TD) Equation</span>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {bellmanUpdate.isTerminal ? 'Terminal Transition (No Bootstrapping)' : 'Standard Non-Terminal'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-emerald-300 border border-slate-800 overflow-x-auto">
                      Q(s, a) ← Q(s, a) + α · [ r + γ · maxₐ′ Q(s′, a′) − Q(s, a) ]
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Target definition: <span className="font-mono text-slate-200">TD_target = {bellmanUpdate.isTerminal ? 'r' : 'r + γ · maxₐ′ Q(s′, a′)'}</span>
                      {'  '}|{'  '}
                      Error: <span className="font-mono text-slate-200">TD_error = TD_target − Q(s, a)</span>
                    </div>
                  </div>

                  {/* Plugged-in Numerical Values */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400">Previous Q(s, a)</div>
                      <div className="text-sm font-bold text-slate-200">{bellmanUpdate.oldQ.toFixed(4)}</div>
                    </div>
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400">Reward (r)</div>
                      <div className={`text-sm font-bold ${bellmanUpdate.reward >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {bellmanUpdate.reward.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400">max Q(s′, a′)</div>
                      <div className="text-sm font-bold text-cyan-300">
                        {bellmanUpdate.isTerminal ? '0.000 (terminal)' : bellmanUpdate.maxNextQ.toFixed(4)}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400">TD Target</div>
                      <div className="text-sm font-bold text-purple-300">{bellmanUpdate.tdTarget.toFixed(4)}</div>
                    </div>
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400">TD Error (δ)</div>
                      <div className="text-sm font-bold text-amber-300">{bellmanUpdate.tdError.toFixed(4)}</div>
                    </div>
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400">Learning Rate (α)</div>
                      <div className="text-sm font-bold text-blue-300">{bellmanUpdate.alpha}</div>
                    </div>
                    <div className="p-2 bg-slate-950/70 border border-slate-800 rounded-lg">
                      <div className="text-[10px] text-slate-400">Discount (γ)</div>
                      <div className="text-sm font-bold text-blue-300">{bellmanUpdate.gamma}</div>
                    </div>
                    <div className="p-2 bg-emerald-950/50 border border-emerald-500/40 rounded-lg">
                      <div className="text-[10px] text-emerald-400">New Q(s, a)</div>
                      <div className="text-sm font-bold text-emerald-300">{bellmanUpdate.newQ.toFixed(4)}</div>
                    </div>
                  </div>

                  {/* Step-by-Step Calculation Trace */}
                  <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
                    <div className="text-xs font-bold text-white font-sans mb-1">Step-by-step arithmetic check:</div>
                    <div>1. TD_target = {bellmanUpdate.isTerminal ? `${bellmanUpdate.reward}` : `${bellmanUpdate.reward} + (${bellmanUpdate.gamma} × ${bellmanUpdate.maxNextQ.toFixed(4)}) = ${bellmanUpdate.tdTarget.toFixed(4)}`}</div>
                    <div>2. TD_error  = {bellmanUpdate.tdTarget.toFixed(4)} − ({bellmanUpdate.oldQ.toFixed(4)}) = <span className="text-amber-300 font-bold">{bellmanUpdate.tdError.toFixed(4)}</span></div>
                    <div>3. Q_new     = {bellmanUpdate.oldQ.toFixed(4)} + ({bellmanUpdate.alpha} × {bellmanUpdate.tdError.toFixed(4)}) = <span className="text-emerald-400 font-bold">{bellmanUpdate.newQ.toFixed(4)}</span></div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  Step forward in playback to observe real-time Bellman updates as transitions execute.
                </div>
              )}
            </div>
          )}

          {/* ──────────────── VIEW E: LEARNING PROGRESS ──────────────── */}
          {activeTab === 'progress' && (
            <div className="flex flex-col gap-3">
              {/* Summary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-400">Completed Episodes</div>
                  <div className="text-base font-bold text-white font-mono">{episodeMetrics.length} / {totalEpisodes}</div>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-400">Recent Goal Rate (Last {Math.min(recentWindow, episodeMetrics.length)})</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">{recentSuccessRate.toFixed(0)}%</div>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-400">Exploration Decisions (ε)</div>
                  <div className="text-base font-bold text-amber-300 font-mono">
                    {cumulativeExploration} ({explorationPercent}%)
                  </div>
                </div>
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
                  <div className="text-[10px] text-slate-400">Exploitation Decisions</div>
                  <div className="text-base font-bold text-cyan-300 font-mono">{cumulativeExploitation}</div>
                </div>
              </div>

              {/* Learning Curve Chart (Episode Returns) */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Episode Return Curve (Reward Trajectory)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Higher is better</span>
                </div>
                {episodeMetrics.length > 0 ? (
                  <div className="w-full h-36 relative">
                    {(() => {
                      const returns = episodeMetrics.map(m => m.totalReward);
                      const minRet = Math.min(...returns, -10);
                      const maxRet = Math.max(...returns, 10);
                      const spanY = maxRet - minRet || 1;
                      const spanX = Math.max(episodeMetrics.length - 1, 1);
                      const chartW = 500;
                      const chartH = 110;

                      const points = returns
                        .map((val, i) => {
                          const x = 30 + (i / spanX) * (chartW - 40);
                          const y = chartH - 10 - ((val - minRet) / spanY) * (chartH - 20);
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        })
                        .join(' ');

                      return (
                        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-full font-mono text-[9px]">
                          {/* Zero reference line */}
                          {minRet <= 0 && maxRet >= 0 && (
                            <line
                              x1={30}
                              y1={chartH - 10 - ((0 - minRet) / spanY) * (chartH - 20)}
                              x2={chartW - 10}
                              y2={chartH - 10 - ((0 - minRet) / spanY) * (chartH - 20)}
                              stroke="#475569"
                              strokeDasharray="2,2"
                            />
                          )}
                          {/* Returns Polyline */}
                          <polyline fill="none" stroke="#10b981" strokeWidth="2" points={points} />
                          {/* Points */}
                          {returns.map((val, i) => {
                            const x = 30 + (i / spanX) * (chartW - 40);
                            const y = chartH - 10 - ((val - minRet) / spanY) * (chartH - 20);
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={episodeMetrics.length > 30 ? 1.5 : 2.5}
                                fill={episodeMetrics[i].reachedGoal ? '#10b981' : '#f43f5e'}
                              />
                            );
                          })}
                          <text x={5} y={15} fill="#94a3b8">{maxRet.toFixed(0)}</text>
                          <text x={5} y={chartH - 10} fill="#94a3b8">{minRet.toFixed(0)}</text>
                        </svg>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-500">
                    No completed episodes yet. Step through training to record the learning curve.
                  </div>
                )}
                <div className="text-[10px] text-slate-500 mt-2 italic text-center">
                  * Note: Empirical returns over short training horizons reflect recent exploration choices and do not imply asymptotic convergence.
                </div>
              </div>
            </div>
          )}

          {/* ──────────────── VIEW F: GREEDY POLICY ──────────────── */}
          {activeTab === 'policy' && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Policy Grid Arrows */}
              <div className="flex flex-col items-center">
                <div
                  className="grid gap-1.5 p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner"
                  style={{
                    gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: gridHeight }).map((_, r) =>
                    Array.from({ length: gridWidth }).map((_, c) => {
                      const coord: GridCoord = { r, c };
                      const key = encodeState(coord);
                      const isWall = wallKeys.has(key);
                      const isGoal = areCoordsEqual(coord, goal);
                      const isStart = areCoordsEqual(coord, start);
                      const isGreedyPath = greedyPathKeys.has(key);

                      const acts = qTable[key] || { up: 0, down: 0, left: 0, right: 0 };
                      let bestA: ActionType = 'up';
                      let maxVal = -Infinity;
                      for (const a of ALL_ACTIONS) {
                        if (acts[a] > maxVal) {
                          maxVal = acts[a];
                          bestA = a;
                        }
                      }

                      return (
                        <div
                          key={key}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border flex flex-col items-center justify-between p-1 relative ${
                            isWall
                              ? 'bg-slate-900 border-slate-800 text-slate-600'
                              : isGoal
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : isGreedyPath
                              ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/50'
                              : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
                          }`}
                        >
                          <div className="w-full flex items-center justify-between text-[8px] font-mono opacity-70">
                            <span>{r},{c}</span>
                            {isStart && <span className="text-blue-300 font-bold">Start</span>}
                          </div>

                          <div className="text-center font-bold">
                            {isWall ? (
                              <span className="text-xs">■</span>
                            ) : isGoal ? (
                              <span className="text-xs">🏆</span>
                            ) : (
                              <span className="text-lg text-emerald-400">
                                {ACTION_SYMBOLS[bestA]}
                              </span>
                            )}
                          </div>

                          <div className="text-[8px] font-mono text-slate-400">
                            {!isWall && !isGoal ? bestA.toUpperCase() : ''}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Learned greedy policy: <span className="font-mono text-emerald-300">π(s) = argmax_a Q(s, a)</span>
                </div>
              </div>

              {/* Rollout Execution Summary */}
              <div className="flex-1 w-full space-y-3 text-xs">
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>Greedy Policy Rollout Trace</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      greedyRollout?.reachedGoal
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {greedyRollout?.reachedGoal ? 'SUCCESS: Goal Reached' : 'INCOMPLETE: Step Limit Hit'}
                    </span>
                  </div>

                  {greedyRollout ? (
                    <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
                      <div>Total Path Steps: <span className="text-white font-bold">{greedyRollout.steps.length}</span></div>
                      <div>Total Return: <span className="text-emerald-400 font-bold">{greedyRollout.totalReward.toFixed(1)}</span></div>
                      <div>
                        Action Sequence:{' '}
                        <span className="text-cyan-300 font-semibold">
                          {greedyRollout.actions.map(a => ACTION_SYMBOLS[a]).join(' ')}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans mt-2">
                        Greedy execution tests the learned Q-table without exploration (ε = 0) or further Bellman updates.
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs">
                      Greedy policy rollout will be executed at the final training step.
                    </div>
                  )}
                </div>

                {/* Path Table */}
                {greedyRollout && greedyRollout.steps.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border border-slate-800 rounded-lg bg-slate-950/50">
                    <table className="w-full text-left font-mono text-[10px]">
                      <thead className="bg-slate-900 text-slate-400 sticky top-0">
                        <tr>
                          <th className="p-1.5">Step</th>
                          <th className="p-1.5">State</th>
                          <th className="p-1.5">Action</th>
                          <th className="p-1.5 text-right">Reward</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {greedyRollout.steps.map((st, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40">
                            <td className="p-1.5 text-slate-400">{idx + 1}</td>
                            <td className="p-1.5 font-bold">({st.state.r}, {st.state.c})</td>
                            <td className="p-1.5 text-cyan-300 font-semibold">{ACTION_SYMBOLS[st.action as ActionType]} {st.action.toUpperCase()}</td>
                            <td className="p-1.5 text-right text-emerald-400 font-bold">{st.reward}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
