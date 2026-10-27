import React, { useState } from 'react';
import type { NeuralNetworkSnapshot, NeuronVisualState } from '../../types/ml';

interface NeuralNetworkPlotProps {
  data: NeuralNetworkSnapshot;
}

type NNViewTab = 'architecture' | 'forward' | 'backward' | 'loss' | 'prediction';

export const NeuralNetworkPlot: React.FC<NeuralNetworkPlotProps> = ({ data }) => {
  const {
    task,
    layers,
    connections,
    currentEpoch,
    totalEpochs,
    currentLoss,
    lossHistory,
    inputSample,
    targetValue,
    predictedValue,
    learningRate,
    backpropStage,
    converged,
  } = data;

  const [selectedNeuron, setSelectedNeuron] = useState<NeuronVisualState | null>(null);
  const [activeTab, setActiveTab] = useState<NNViewTab>('architecture');

  const width = 560;
  const height = 330;
  const paddingX = 65;
  const paddingY = 40;

  const numLayers = layers.length;
  const layerSpacing = numLayers > 1 ? (width - 2 * paddingX) / (numLayers - 1) : 0;

  // Compute node coordinates (cx, cy)
  const neuronCoords = new Map<string, { cx: number; cy: number }>();

  layers.forEach((layer, lIdx) => {
    const cx = paddingX + lIdx * layerSpacing;
    const count = layer.neuronCount;
    const totalHeight = height - 2 * paddingY;
    const stepY = count > 1 ? totalHeight / (count - 1) : 0;

    layer.neurons.forEach((_neuron, nIdx) => {
      const cy = count === 1 ? height / 2 : paddingY + nIdx * stepY;
      neuronCoords.set(`${lIdx}-${nIdx}`, { cx, cy });
    });
  });

  // Scale for loss curve chart
  const maxLoss = lossHistory.length > 0 ? Math.max(...lossHistory, 0.5) : 1.0;
  const minLoss = 0.0;
  const lossSpanX = Math.max(lossHistory.length - 1, 1);
  const scaleLossX = (i: number) => 50 + (i / lossSpanX) * (width - 100);
  const scaleLossY = (val: number) => height - 50 - ((val - minLoss) / (maxLoss - minLoss || 1)) * (height - 100);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 relative select-none">
      <div className="w-full max-w-2xl bg-slate-900/95 dark:bg-surface-900 rounded-xl border border-slate-700/60 p-4 shadow-xl text-slate-200">
        {/* Header Stats Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Feed-Forward Neural Network
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {task.toUpperCase()}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Epoch {currentEpoch}/{totalEpochs}
            </span>
            {converged && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Converged
              </span>
            )}
            {backpropStage && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 capitalize">
                {backpropStage.replace('-', ' ')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Loss: {currentLoss.toFixed(4)}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              η = {learningRate}
            </span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap gap-1 mb-3 bg-slate-950/70 p-1 rounded-lg border border-slate-800 text-[11px]">
          {[
            { id: 'architecture', label: '1. Network Architecture' },
            { id: 'forward', label: '2. Forward Pass (z, a)' },
            { id: 'backward', label: '3. Backprop Gradients (δ)' },
            { id: 'loss', label: '4. Loss Curve History' },
            { id: 'prediction', label: '5. Prediction & Error' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as NNViewTab)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Visualization Canvas */}
        <div className="relative">
          {/* TAB 1, 2, 3: NETWORK DIAGRAM (Architecture, Forward, Backward) */}
          {(activeTab === 'architecture' || activeTab === 'forward' || activeTab === 'backward') && (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
              {/* Layer Title Labels */}
              {layers.map((_layer, lIdx) => {
                const cx = paddingX + lIdx * layerSpacing;
                return (
                  <text
                    key={`layer-label-${lIdx}`}
                    x={cx}
                    y={paddingY - 20}
                    fill="#94a3b8"
                    textAnchor="middle"
                    className="font-bold text-[10px] uppercase tracking-wider"
                  >
                    {lIdx === 0 ? 'Input' : lIdx === numLayers - 1 ? 'Output' : `Hidden ${lIdx}`}
                  </text>
                );
              })}

              {/* Connections (Weights) */}
              {connections.map((conn, cIdx) => {
                const source = neuronCoords.get(`${conn.sourceLayer}-${conn.sourceNeuron}`);
                const target = neuronCoords.get(`${conn.targetLayer}-${conn.targetNeuron}`);
                if (!source || !target) return null;

                const isPos = conn.weight >= 0;
                const strokeWidth = Math.min(Math.max(Math.abs(conn.weight) * 2.5, 1.0), 6.0);
                const isSelectedNeuronConnected =
                  selectedNeuron &&
                  ((selectedNeuron.layerIndex === conn.sourceLayer && selectedNeuron.neuronIndex === conn.sourceNeuron) ||
                    (selectedNeuron.layerIndex === conn.targetLayer && selectedNeuron.neuronIndex === conn.targetNeuron));

                return (
                  <g key={`conn-${cIdx}`}>
                    <line
                      x1={source.cx}
                      y1={source.cy}
                      x2={target.cx}
                      y2={target.cy}
                      stroke={
                        isSelectedNeuronConnected
                          ? '#f59e0b'
                          : activeTab === 'backward' && conn.gradient !== undefined
                          ? conn.gradient >= 0
                            ? '#f43f5e'
                            : '#06b6d4'
                          : isPos
                          ? '#10b981'
                          : '#38bdf8'
                      }
                      strokeWidth={isSelectedNeuronConnected ? strokeWidth + 1.5 : strokeWidth}
                      opacity={selectedNeuron ? (isSelectedNeuronConnected ? 1.0 : 0.2) : 0.65}
                    />
                  </g>
                );
              })}

              {/* Neurons */}
              {layers.map((layer, lIdx) =>
                layer.neurons.map((neuron, nIdx) => {
                  const coord = neuronCoords.get(`${lIdx}-${nIdx}`);
                  if (!coord) return null;

                  const isInput = lIdx === 0;
                  const isOutput = lIdx === numLayers - 1;
                  const isSelected =
                    selectedNeuron?.layerIndex === lIdx && selectedNeuron?.neuronIndex === nIdx;

                  let displayValue: string;
                  if (activeTab === 'forward') {
                    displayValue = neuron.a.toFixed(2);
                  } else if (activeTab === 'backward' && neuron.delta !== undefined) {
                    displayValue = neuron.delta.toFixed(2);
                  } else {
                    displayValue = neuron.label;
                  }

                  return (
                    <g
                      key={`neuron-${lIdx}-${nIdx}`}
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedNeuron(neuron)}
                      onMouseEnter={() => setSelectedNeuron(neuron)}
                    >
                      {/* Selection Ring */}
                      {isSelected && (
                        <circle
                          cx={coord.cx}
                          cy={coord.cy}
                          r={21}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth={2}
                          strokeDasharray="3 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${coord.cx}px ${coord.cy}px` }}
                        />
                      )}

                      {/* Neuron Circle */}
                      <circle
                        cx={coord.cx}
                        cy={coord.cy}
                        r={16}
                        fill={
                          isInput
                            ? '#38bdf8'
                            : isOutput
                            ? '#f59e0b'
                            : activeTab === 'backward'
                            ? '#ec4899'
                            : '#818cf8'
                        }
                        stroke="#0f172a"
                        strokeWidth={2}
                        className="hover:scale-110 transition-transform"
                      />

                      {/* Neuron Text Label / Activation */}
                      <text
                        x={coord.cx}
                        y={coord.cy + 3.5}
                        fill="#ffffff"
                        textAnchor="middle"
                        className="font-bold text-[9px] pointer-events-none"
                      >
                        {displayValue}
                      </text>

                      {/* Bias badge below neuron */}
                      {!isInput && (
                        <text
                          x={coord.cx}
                          y={coord.cy + 25}
                          fill="#94a3b8"
                          textAnchor="middle"
                          className="text-[8px] pointer-events-none"
                        >
                          b={neuron.bias.toFixed(2)}
                        </text>
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          )}

          {/* TAB 4: LOSS HISTORY CURVE */}
          {activeTab === 'loss' && (
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible font-mono text-[10px]">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1.0].map(ratio => {
                const val = minLoss + ratio * (maxLoss - minLoss);
                const y = scaleLossY(val);
                return (
                  <g key={`loss-grid-${ratio}`}>
                    <line x1={50} y1={y} x2={width - 50} y2={y} stroke="#334155" strokeDasharray="3 3" opacity={0.5} />
                    <text x={42} y={y + 3} fill="#94a3b8" textAnchor="end">
                      {val.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Axes */}
              <line x1={50} y1={height - 50} x2={width - 50} y2={height - 50} stroke="#64748b" strokeWidth={1.5} />
              <line x1={50} y1={50} x2={50} y2={height - 50} stroke="#64748b" strokeWidth={1.5} />
              <text x={width - 50} y={height - 25} fill="#94a3b8" textAnchor="end">
                Epoch →
              </text>
              <text x={50} y={35} fill="#94a3b8" textAnchor="start">
                ↑ Loss ({task === 'classification' ? 'BCE' : 'MSE'})
              </text>

              {/* Loss Curve Line */}
              {lossHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  points={lossHistory.map((val, i) => `${scaleLossX(i)},${scaleLossY(val)}`).join(' ')}
                />
              )}

              {/* Loss Data Points */}
              {lossHistory.map((val, i) => (
                <circle
                  key={`loss-pt-${i}`}
                  cx={scaleLossX(i)}
                  cy={scaleLossY(val)}
                  r={4}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth={1}
                />
              ))}
            </svg>
          )}

          {/* TAB 5: PREDICTION & ERROR GAUGES */}
          {activeTab === 'prediction' && (
            <div className="w-full h-[270px] flex flex-col justify-center px-8 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Sample Inference & Prediction Output
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Input Vector X</span>
                  <div className="text-sm font-bold text-cyan-300 font-mono mt-1">
                    [{inputSample.map(v => v.toFixed(2)).join(', ')}]
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Ground Truth Target Y</span>
                  <div className="text-sm font-bold text-amber-300 font-mono mt-1">{targetValue}</div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Model Prediction (Ŷ):</span>
                  <span className="text-emerald-400 font-bold">{predictedValue.toFixed(4)}</span>
                </div>

                {task === 'classification' ? (
                  <div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${Math.min(Math.max(predictedValue * 100, 0), 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>Class 0 (&lt; 0.5)</span>
                      <span>Confidence: {(predictedValue * 100).toFixed(1)}%</span>
                      <span>Class 1 (≥ 0.5)</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-slate-300">
                    Residual Absolute Error: |Ŷ - Y| = {Math.abs(predictedValue - targetValue).toFixed(4)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Neuron Detail Card */}
          {selectedNeuron && (
            <div className="mt-3 bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs font-mono flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="font-bold text-amber-300">
                  Selected: {selectedNeuron.label} (Layer {selectedNeuron.layerIndex})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-slate-300 text-[11px]">
                <span>Weighted Sum z: <b>{selectedNeuron.z.toFixed(4)}</b></span>
                <span>Activation a: <b>{selectedNeuron.a.toFixed(4)}</b></span>
                {selectedNeuron.layerIndex > 0 && <span>Bias b: <b>{selectedNeuron.bias.toFixed(4)}</b></span>}
                {selectedNeuron.delta !== undefined && (
                  <span className="text-rose-400">Error δ: <b>{selectedNeuron.delta.toFixed(4)}</b></span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              Input Neuron
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />
              Hidden Neuron
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Output Neuron
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
              Positive Weight (W &gt; 0)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-sky-400 inline-block" />
              Negative Weight (W &lt; 0)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
