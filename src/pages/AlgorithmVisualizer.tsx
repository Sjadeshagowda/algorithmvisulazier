import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Code2, BookOpen, BarChart2, List, LayoutGrid, BarChart, Table2, GraduationCap } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { VisualizationCanvas, type CanvasViewMode } from '../components/visualization/VisualizationCanvas';
import { StepControls } from '../components/visualization/StepControls';
import { AlgorithmCode } from '../components/visualization/AlgorithmCode';
import { ExplanationPanel } from '../components/visualization/ExplanationPanel';
import { ComplexityCard } from '../components/visualization/ComplexityCard';
import { Slider } from '../components/common/Slider';
import { Badge } from '../components/common/Badge';
import { AlgorithmSelector } from '../components/algorithm/AlgorithmSelector';
import { useVisualization } from '../hooks/useVisualization';
import { getAlgorithmById } from '../data/algorithms';
import { cn } from '../utils/cn';
import { generateAlgorithmSteps, getDefaultAlgorithmInput, type CustomAlgorithmInput } from '../utils/stepGenerator';
import { CustomInputModal } from '../components/common/CustomInputModal';

type SideTab = 'explain' | 'code' | 'complexity' | 'state';

export const AlgorithmVisualizer: React.FC = () => {
  const { id, algorithmId } = useParams<{ id?: string; algorithmId?: string }>();
  const activeId = algorithmId || id;
  const navigate = useNavigate();
  const algorithm = activeId ? getAlgorithmById(activeId) : undefined;

  const [sideTab, setSideTab] = useState<SideTab>('explain');
  const [viewMode, setViewMode] = useState<CanvasViewMode>('bars');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [inputSize, setInputSizeLocal] = useState(15);

  const viz = useVisualization();
  const { setSteps } = viz;

  useEffect(() => {
    if (algorithm) {
      document.title = `${algorithm.name} Visualizer — AlgoViz`;
    } else {
      document.title = 'Algorithm Visualizer — AlgoViz';
    }
  }, [algorithm]);

  const loadAlgorithm = useCallback((size: number, custom?: CustomAlgorithmInput) => {
    if (!activeId) return;
    const input = custom ?? getDefaultAlgorithmInput(activeId);
    const steps = generateAlgorithmSteps(activeId, size, input);
    setSteps(steps);
  }, [activeId, setSteps]);

  useEffect(() => {
    if (activeId) {
      const def = getDefaultAlgorithmInput(activeId);
      loadAlgorithm(inputSize, def);
    }
  }, [activeId, loadAlgorithm, inputSize]);

  const handleRandomize = () => {
    viz.pause();
    if (!activeId) return;
    const steps = generateAlgorithmSteps(activeId, inputSize);
    setSteps(steps);
  };

  const handleCustomInput = () => {
    setCustomModalOpen(true);
  };

  const handleApplyCustom = (input: CustomAlgorithmInput) => {
    viz.pause();
    loadAlgorithm(inputSize, input);
  };

  if (!algorithm) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
          <div className="text-6xl">🔍</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Algorithm not found</h1>
          <p className="text-slate-500 dark:text-slate-400">The algorithm "{id}" doesn't exist.</p>
          <button className="btn-primary" onClick={() => navigate('/algorithms')}>
            Browse Algorithms
          </button>
        </div>
      </PageContainer>
    );
  }

  const currentStep = viz.currentStepData;
  const isArrayData = currentStep?.data.type === 'bars' || currentStep?.data.type === 'array';
  const hasSizeControl = algorithm && (
    algorithm.category === 'sorting' ||
    algorithm.category === 'searching' ||
    algorithm.id === 'n-queens' ||
    algorithm.id === 'fibonacci-dp'
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-surface-900">
      {/* Top bar */}
      <div className="bg-white dark:bg-surface-800 border-b border-slate-200 dark:border-surface-700 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-icon"
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-slate-900 dark:text-white">{algorithm.name}</h1>
                <Badge variant={algorithm.difficulty}>{algorithm.difficulty}</Badge>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-slate-300 capitalize font-medium hidden sm:inline-block">
                  {algorithm.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block line-clamp-1 max-w-lg">
                {algorithm.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct link to deep lesson */}
            <Link
              to={`/learn/${algorithm.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-colors shadow-sm"
              title="Read complete theory, worked examples, and quiz"
            >
              <GraduationCap size={15} />
              <span className="hidden md:inline">Full Lesson Guide</span>
              <span className="md:hidden">Lesson</span>
            </Link>

            <AlgorithmSelector currentId={algorithm.id} />

            {/* Input size */}
            {hasSizeControl && (
              <div className="hidden lg:flex items-center gap-3 bg-slate-50 dark:bg-surface-700 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-surface-600">
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {algorithm.id === 'n-queens' ? 'Board N' : 'Size'}
                </span>
                <Slider
                  min={algorithm.id === 'n-queens' ? 4 : 5}
                  max={algorithm.id === 'n-queens' ? 8 : 40}
                  value={algorithm.id === 'n-queens' ? Math.max(4, Math.min(8, inputSize <= 8 ? inputSize : 4 + Math.floor((inputSize - 5) / 9))) : inputSize}
                  onChange={(v) => {
                    setInputSizeLocal(v);
                    loadAlgorithm(v);
                  }}
                  className="w-24"
                />
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 w-5">
                  {algorithm.id === 'n-queens' ? Math.max(4, Math.min(8, inputSize <= 8 ? inputSize : 4 + Math.floor((inputSize - 5) / 9))) : inputSize}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-screen-2xl mx-auto w-full gap-0 lg:overflow-hidden lg:h-[calc(100vh-65px)]">
        {/* Visualization area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-surface-700">
          {/* Canvas Sub-header (Controls View Mode & Status) */}
          <div className="bg-slate-50 dark:bg-surface-850 px-4 py-2 border-b border-slate-200 dark:border-surface-700 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {currentStep?.phase ? currentStep.phase : `Step ${viz.currentStep + 1} of ${viz.steps.length}`}
              </span>
              {currentStep?.operation && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  {currentStep.operation}
                </span>
              )}
            </div>

            {/* View Mode Toggle (Bars / Blocks / Table) for array structures */}
            {isArrayData && (
              <div className="flex items-center gap-1 bg-white dark:bg-surface-800 p-0.5 rounded-lg border border-slate-200 dark:border-surface-700">
                <button
                  onClick={() => setViewMode('bars')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors',
                    viewMode === 'bars'
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  title="Bar chart view with proportional heights"
                >
                  <BarChart size={13} />
                  <span>Bars</span>
                </button>
                <button
                  onClick={() => setViewMode('blocks')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors',
                    viewMode === 'blocks'
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  title="Grid block elements view"
                >
                  <LayoutGrid size={13} />
                  <span>Blocks</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors',
                    viewMode === 'table'
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                  title="Tabular index and value inspection"
                >
                  <Table2 size={13} />
                  <span>Table</span>
                </button>
              </div>
            )}
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 bg-white dark:bg-surface-800 p-4 sm:p-6 overflow-hidden flex flex-col justify-center min-h-[340px] relative">
            <VisualizationCanvas step={currentStep} viewMode={viewMode} />
          </div>

          {/* Step Controls */}
          <div className="bg-white dark:bg-surface-800 border-t border-slate-200 dark:border-surface-700 px-6 py-3.5">
            <StepControls
              isPlaying={viz.isPlaying}
              isPaused={viz.isPaused}
              currentStep={viz.currentStep}
              totalSteps={viz.steps.length}
              progress={viz.progress}
              speed={viz.speed}
              onPlay={viz.play}
              onPause={viz.pause}
              onReset={viz.reset}
              onStepForward={viz.stepForward}
              onStepBackward={viz.stepBackward}
              onSpeedChange={viz.setSpeed}
              onRandomize={handleRandomize}
              onCustomInput={handleCustomInput}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full lg:w-84 xl:w-96 flex flex-col bg-white dark:bg-surface-800 border-t lg:border-t-0 border-slate-200 dark:border-surface-700 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-850">
            {[
              { id: 'explain' as SideTab, label: 'Explain', icon: BookOpen },
              { id: 'code' as SideTab, label: 'Code', icon: Code2 },
              { id: 'complexity' as SideTab, label: 'Complexity', icon: BarChart2 },
              { id: 'state' as SideTab, label: 'State', icon: List },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSideTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors border-b-2',
                  sideTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-white dark:bg-surface-800'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
                aria-selected={sideTab === tab.id}
                aria-label={tab.label}
              >
                <tab.icon size={13} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {sideTab === 'explain' && (
              <div className="space-y-4">
                {currentStep ? (
                  <ExplanationPanel
                    description={currentStep.description}
                    stepIndex={viz.currentStep}
                    step={currentStep}
                  />
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    Press Play or Step Forward to see step-by-step explanations.
                  </p>
                )}

                {/* Color legend */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-surface-700">
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Visual Color Legend</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { color: 'bg-amber-400', label: 'Comparing / Inspecting' },
                      { color: 'bg-blue-500', label: 'Active Pointer' },
                      { color: 'bg-orange-500', label: 'Swapping / Shifting' },
                      { color: 'bg-emerald-500', label: 'Sorted / Final' },
                      { color: 'bg-violet-500', label: 'Selected / Candidate' },
                      { color: 'bg-teal-500', label: 'Visited Node' },
                      { color: 'bg-rose-500', label: 'Pivot / Threat' },
                      { color: 'bg-green-500', label: 'Match Found' },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-sm ${color} shrink-0`} />
                        <span className="text-slate-600 dark:text-slate-300 truncate">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {sideTab === 'code' && (
              <AlgorithmCode
                lines={algorithm.pseudocode}
                highlightLines={currentStep?.highlightLines ?? []}
                lineExplanation={currentStep?.lineExplanation}
              />
            )}

            {sideTab === 'complexity' && (
              <div className="space-y-4">
                <ComplexityCard
                  complexity={algorithm.complexity}
                  stable={algorithm.stable}
                  inPlace={algorithm.inPlace}
                />
                <div className="p-3 bg-slate-50 dark:bg-surface-750 rounded-lg text-xs space-y-1.5 border border-slate-200 dark:border-surface-700">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Why these bounds?</div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Check the dedicated lesson guide for mathematical derivations, best/worst case permutations, and space-time trade-off comparisons.
                  </p>
                  <Link
                    to={`/learn/${algorithm.id}`}
                    className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold hover:underline mt-1"
                  >
                    View detailed complexity analysis &rarr;
                  </Link>
                </div>
              </div>
            )}

            {sideTab === 'state' && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Current Data State</span>
                  <span className="font-mono text-slate-400">{currentStep?.data.type}</span>
                </div>

                {isArrayData && currentStep?.data && 'elements' in currentStep.data && (
                  <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                    {currentStep.data.elements.map((el, idx) => (
                      <div
                        key={el.id ?? idx}
                        className={cn(
                          'flex items-center justify-between px-3 py-1.5 rounded text-xs border font-mono transition-colors',
                          el.state === 'comparing' ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200 font-bold' :
                          el.state === 'swapping' ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-300 text-orange-900 dark:text-orange-200 font-bold' :
                          el.state === 'sorted' || el.state === 'found' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 font-bold' :
                          el.state === 'pivot' ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200 font-bold' :
                          el.state === 'active' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-900 dark:text-blue-200 font-bold' :
                          'bg-slate-50 dark:bg-surface-700/50 border-slate-200 dark:border-surface-600 text-slate-700 dark:text-slate-300'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[10px] w-6">[{idx}]</span>
                          <span className="font-semibold">{el.value}</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-sans px-1.5 py-0.5 rounded bg-white/60 dark:bg-surface-800/60">
                          {el.state}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {currentStep?.auxiliary && currentStep.auxiliary.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-surface-700 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Auxiliary Variables</span>
                    <div className="space-y-1">
                      {currentStep.auxiliary.map((aux, idx) => (
                        <div key={idx} className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-50 dark:bg-surface-700 text-xs font-mono">
                          <span className="text-slate-500 dark:text-slate-400">{aux.label}:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {Array.isArray(aux.value) ? `[${aux.value.join(', ')}]` : aux.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom input modal */}
      {activeId && (
        <CustomInputModal
          isOpen={customModalOpen}
          onClose={() => setCustomModalOpen(false)}
          algorithmId={activeId}
          onApply={handleApplyCustom}
        />
      )}
    </div>
  );
};
