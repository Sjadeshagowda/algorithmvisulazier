import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Play, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, Check, RotateCcw,
  Sparkles, Terminal, Scale,
  Compass, ArrowRight, Settings2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { getAlgorithmById, categoryMeta } from '../data/algorithms';
import { VisualizationCanvas, type CanvasViewMode } from '../components/visualization/VisualizationCanvas';
import { StepControls } from '../components/visualization/StepControls';
import { useVisualization } from '../hooks/useVisualization';
import {
  generateAlgorithmSteps,
  getDefaultAlgorithmInput,
  type CustomAlgorithmInput
} from '../utils/stepGenerator';
import { cn } from '../utils/cn';
import { CustomInputModal } from '../components/common/CustomInputModal';

const sectionList = [
  { id: 'sec-intro', num: 1, label: 'Introduction' },
  { id: 'sec-why', num: 2, label: 'Why Do We Need It?' },
  { id: 'sec-io', num: 3, label: 'Input, Output & Assumptions' },
  { id: 'sec-intuition', num: 4, label: 'Core Intuition' },
  { id: 'sec-worked', num: 5, label: 'Worked Example' },
  { id: 'sec-visualize', num: 6, label: 'Interactive Visualization' },
  { id: 'sec-pseudo', num: 7, label: 'Pseudocode' },
  { id: 'sec-source', num: 8, label: 'Source Code Walkthrough' },
  { id: 'sec-correctness', num: 9, label: 'Correctness & Proof' },
  { id: 'sec-complexity', num: 10, label: 'Time & Space Complexity' },
  { id: 'sec-pros-cons', num: 11, label: 'Advantages & Limitations' },
  { id: 'sec-apps', num: 12, label: 'Real-World Applications' },
  { id: 'sec-compare', num: 13, label: 'Comparison with Alternatives' },
  { id: 'sec-mistakes', num: 14, label: 'Common Mistakes' },
  { id: 'sec-quiz', num: 15, label: 'Exercises & Knowledge Check' },
  { id: 'sec-summary', num: 16, label: 'Summary & Next Steps' },
];

export const AlgorithmLessonPage: React.FC = () => {
  const { algorithmId, id } = useParams<{ algorithmId?: string; id?: string }>();
  const activeId = algorithmId || id;
  const navigate = useNavigate();
  const algorithm = activeId ? getAlgorithmById(activeId) : undefined;

  // View settings
  const [learningMode, setLearningMode] = useState<'beginner' | 'technical'>('beginner');
  const [explanationMode, setExplanationMode] = useState<'simplified' | 'technical'>('simplified');
  const [canvasViewMode, setCanvasViewMode] = useState<CanvasViewMode>('bars');
  const [activeSection, setActiveSection] = useState('sec-intro');
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Custom Input State
  const [customInputModalOpen, setCustomInputModalOpen] = useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<number, boolean>>({});

  // Visualization Hook
  const viz = useVisualization();
  const { setSteps } = viz;

  // Set dynamic page title
  useEffect(() => {
    if (algorithm) {
      document.title = `${algorithm.name} Curriculum Lesson — AlgoViz`;
    } else {
      document.title = 'Algorithm Lesson — AlgoViz';
    }
  }, [algorithm]);

  // Load steps on activeId or customInput change
  const reloadSteps = useCallback((input: CustomAlgorithmInput) => {
    if (!activeId) return;
    const steps = generateAlgorithmSteps(activeId, 7, input);
    setSteps(steps);
  }, [activeId, setSteps]);

  useEffect(() => {
    if (activeId) {
      const def = getDefaultAlgorithmInput(activeId);
      reloadSteps(def);
    }
  }, [activeId, reloadSteps]);

  // Scrollspy for active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sec of sectionList) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApplyCustomInput = (input: CustomAlgorithmInput) => {
    reloadSteps(input);
  };

  const handleRestoreDefault = () => {
    if (!activeId) return;
    const def = getDefaultAlgorithmInput(activeId);
    reloadSteps(def);
  };

  if (!algorithm || !algorithm.lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 p-8">
        <div className="text-6xl">📚</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lesson Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400">
          We couldn't find an educational module for "{activeId}".
        </p>
        <button className="btn-primary" onClick={() => navigate('/algorithms')}>
          Browse All Algorithms
        </button>
      </div>
    );
  }

  const { lesson } = algorithm;
  const categoryInfo = categoryMeta[algorithm.category];
  const currentStep = viz.currentStepData;
  const isArrayData = currentStep?.data.type === 'bars' || currentStep?.data.type === 'array';

  const scrollTo = (secId: string) => {
    setActiveSection(secId);
    setMobileTocOpen(false);
    const el = document.getElementById(secId);
    if (el) {
      const topOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50/70 dark:bg-surface-900 min-h-screen text-slate-800 dark:text-slate-200">
      {/* Top Breadcrumb & Mode Bar */}
      <div className="sticky top-14 z-30 bg-white/95 dark:bg-surface-850/95 backdrop-blur border-b border-slate-200 dark:border-surface-700 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
            <Link to="/algorithms" className="hover:text-primary-600 transition-colors">Algorithms</Link>
            <ChevronRight size={12} />
            <Link to={`/${algorithm.category}`} className="hover:text-primary-600 transition-colors capitalize">
              {categoryInfo?.label ?? algorithm.category}
            </Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-slate-900 dark:text-white truncate">{algorithm.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Beginner vs Technical Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-surface-700 p-0.5 rounded-lg text-xs border border-slate-200 dark:border-surface-600">
              <button
                onClick={() => setLearningMode('beginner')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5',
                  learningMode === 'beginner'
                    ? 'bg-white dark:bg-surface-850 text-primary-600 dark:text-primary-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                )}
                title="Beginner view emphasizes intuitive metaphors and core mechanics"
              >
                <Sparkles size={13} />
                <span>Beginner</span>
              </button>
              <button
                onClick={() => setLearningMode('technical')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5',
                  learningMode === 'technical'
                    ? 'bg-white dark:bg-surface-850 text-primary-600 dark:text-primary-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                )}
                title="Technical view highlights formal invariant proofs, recurrence relations, and asymptotic bounds"
              >
                <Terminal size={13} />
                <span>Technical</span>
              </button>
            </div>

            {/* Mobile TOC Button */}
            <button
              onClick={() => setMobileTocOpen(o => !o)}
              className="lg:hidden btn-secondary text-xs py-1 px-2.5"
              aria-label="Table of contents"
            >
              Sections ({sectionList.length})
            </button>
          </div>
        </div>

        {/* Mobile TOC Dropdown */}
        {mobileTocOpen && (
          <div className="lg:hidden mt-2 p-3 bg-white dark:bg-surface-800 rounded-xl border border-slate-200 dark:border-surface-700 shadow-xl max-h-72 overflow-y-auto space-y-1">
            {sectionList.map(sec => (
              <button
                key={sec.id}
                onClick={() => scrollTo(sec.id)}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-colors',
                  activeSection === sec.id
                    ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-surface-700'
                )}
              >
                <span className="w-5 text-slate-400 font-mono text-[11px]">{sec.num}.</span>
                <span>{sec.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Desktop Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <div className="sticky top-28 bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-4 shadow-xs space-y-3 max-h-[calc(100vh-130px)] overflow-y-auto">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-surface-700 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Compass size={14} className="text-primary-500" />
              <span>Curriculum Outline</span>
            </div>
            <nav className="space-y-0.5">
              {sectionList.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={cn(
                    'w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2',
                    activeSection === sec.id
                      ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-bold border-l-2 border-primary-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-surface-750'
                  )}
                >
                  <span className="w-4 text-[10px] text-slate-400 font-mono">{sec.num}</span>
                  <span className="truncate">{sec.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content: 16 Sequential Learning Sections */}
        <main className="flex-1 min-w-0 space-y-12">

          {/* SECTION 1 — INTRODUCTION */}
          <section id="sec-intro" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="category" color={categoryInfo?.color}>
                {categoryInfo?.label ?? algorithm.category}
              </Badge>
              <Badge variant={algorithm.difficulty}>{algorithm.difficulty}</Badge>
              {algorithm.stable !== undefined && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-slate-300 font-medium">
                  {algorithm.stable ? '✓ Stable Sort' : '✗ Unstable Sort'}
                </span>
              )}
              {algorithm.inPlace !== undefined && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-slate-300 font-medium">
                  {algorithm.inPlace ? '✓ In-Place: O(1) Space' : '✗ Out-of-Place: Requires Extra Memory'}
                </span>
              )}
            </div>

            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 1 — Introduction</div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {algorithm.name}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {lesson.oneSentenceDefinition}
            </p>

            {lesson.introduction.nameOriginAndMeaning && (
              <div className="p-4 rounded-xl bg-primary-50/60 dark:bg-primary-950/30 border border-primary-200/80 dark:border-primary-800 text-xs sm:text-sm text-primary-950 dark:text-primary-200 space-y-1">
                <span className="font-bold text-primary-700 dark:text-primary-400 uppercase text-[10px] tracking-wider block">Name & Etymology</span>
                <p className="leading-relaxed">{lesson.introduction.nameOriginAndMeaning}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1.5 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400">Problem It Solves</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.introduction.problemSolved}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1.5 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400">What It Does NOT Solve</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.introduction.problemNotSolved}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-surface-700 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Why This Algorithm is Worth Learning</span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{lesson.introduction.whyLearn}</p>
              <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                <span className="text-xs font-medium text-slate-400 mr-1">Prerequisites:</span>
                {lesson.introduction.prerequisites.map((p, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-surface-700 text-slate-700 dark:text-slate-300 font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2 — WHY DO WE NEED IT? */}
          <section id="sec-why" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 2 — Motivation & Problem Context</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why Do We Need {algorithm.name}?</h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">The Problem Statement</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-surface-750 p-3.5 rounded-xl border border-slate-200 dark:border-surface-700">
                {lesson.whyDoWeNeedIt.problemStatement}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-1.5 text-xs">
                <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle size={14} /> Naive Approach Inefficiency
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.whyDoWeNeedIt.naiveApproachInefficiency}</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5 text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> The Core Idea Used
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.whyDoWeNeedIt.coreIdeaUsed}</p>
              </div>
            </div>

            {lesson.whyDoWeNeedIt.analogyOrRealLifeExample && (
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[10px] tracking-wider block">Real-World Analogy</span>
                <p className="leading-relaxed">{lesson.whyDoWeNeedIt.analogyOrRealLifeExample}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-surface-700">
              <div className="space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400">Working Conditions</span>
                <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                  {lesson.whyDoWeNeedIt.workingConditions.map((cond, i) => (
                    <li key={i}>{cond}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400">When Another Algorithm is Better</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{lesson.whyDoWeNeedIt.whenAnotherIsBetter}</p>
              </div>
            </div>
          </section>

          {/* SECTION 3 — INPUT, OUTPUT, AND ASSUMPTIONS */}
          <section id="sec-io" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 3 — Contracts & Specifications</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Input, Output, and Assumptions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 block tracking-wider">Expected Input</span>
                <p className="font-mono text-slate-800 dark:text-slate-200">{lesson.inputOutputAssumptions.expectedInput}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider">Expected Output</span>
                <p className="font-mono text-slate-800 dark:text-slate-200">{lesson.inputOutputAssumptions.expectedOutput}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Sorted Input Required?</span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {typeof lesson.inputOutputAssumptions.isSortedRequired === 'boolean'
                    ? (lesson.inputOutputAssumptions.isSortedRequired ? 'Yes (Strict Precondition)' : 'No (Any Order)')
                    : String(lesson.inputOutputAssumptions.isSortedRequired)}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Constraints</span>
                <p className="text-slate-700 dark:text-slate-300 font-mono">
                  {Array.isArray(lesson.inputOutputAssumptions.constraints)
                    ? lesson.inputOutputAssumptions.constraints.join(', ')
                    : lesson.inputOutputAssumptions.constraints}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Special Cases</span>
                <p className="text-slate-700 dark:text-slate-300">{lesson.inputOutputAssumptions.specialCases.join(' • ')}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
              <span className="font-bold text-rose-700 dark:text-rose-400 uppercase text-[10px] tracking-wider block">What Happens When Assumptions Break?</span>
              <p className="text-rose-900 dark:text-rose-200 leading-relaxed">{lesson.inputOutputAssumptions.brokenAssumptionsBehavior}</p>
            </div>
          </section>

          {/* SECTION 4 — CORE INTUITION */}
          <section id="sec-intuition" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 4 — Conceptual Engine</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Core Intuition</h2>
            </div>

            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {lesson.coreIntuition.simpleExplanation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-primary-50/40 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 text-[10px]">Key Driving Decision</span>
                <p className="text-slate-800 dark:text-slate-200 font-mono leading-relaxed">{lesson.coreIntuition.keyDrivingDecision}</p>
              </div>
              <div className="p-4 rounded-xl bg-primary-50/40 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 text-[10px]">Why Repeated Execution Solves It</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.coreIntuition.whyRepeatedOperationWorks}</p>
              </div>
            </div>

            {lesson.coreIntuition.paradigmSpecificDetail && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 text-xs space-y-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Algorithmic Paradigm Mechanics</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.coreIntuition.paradigmSpecificDetail}</p>
              </div>
            )}
          </section>

          {/* SECTION 5 — COMPLETE WORKED EXAMPLE */}
          <section id="sec-worked" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 5 — Step-by-Step Trace</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete Worked Example</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lesson.workedExample.datasetDescription || 'Deterministic tracing from start to finish.'} Initial: <code className="font-mono font-bold text-primary-600 dark:text-primary-400">{lesson.workedExample.initialState}</code>
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {lesson.workedExample.steps.map((step) => (
                <div key={step.stepNumber} className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-surface-650 pb-2">
                    <span className="font-sans text-xs font-bold text-primary-700 dark:text-primary-300">
                      Step {step.stepNumber}: {step.operation}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-600 text-slate-900 dark:text-white font-bold shrink-0">
                      {step.stateDisplay}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {step.explanation}
                  </p>

                  {(step.whyNecessary || step.nextAction) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans text-[11px] text-slate-500 dark:text-slate-400">
                      {step.whyNecessary && <div><strong className="text-slate-700 dark:text-slate-300">Why:</strong> {step.whyNecessary}</div>}
                      {step.nextAction && <div><strong className="text-slate-700 dark:text-slate-300">Next:</strong> {step.nextAction}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Final Result:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{lesson.workedExample.finalState}</span>
            </div>
          </section>

          {/* SECTION 6 — INTERACTIVE VISUALIZATION */}
          <section id="sec-visualize" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 6 — Live Lab</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interactive Visualization Workbench</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Execute the real step-generator logic with live playback controls, snapshot diffs, and customizable inputs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomInputModalOpen(true)}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  title="Configure custom input for this algorithm"
                >
                  <Settings2 size={13} />
                  <span>Custom Input</span>
                </button>
                <button
                  onClick={handleRestoreDefault}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  title="Reset to default reference values"
                >
                  <RotateCcw size={13} />
                  <span>Restore Default</span>
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="rounded-xl border border-slate-200 dark:border-surface-700 bg-slate-50/50 dark:bg-surface-900 overflow-hidden">
              {/* Canvas Header */}
              <div className="bg-slate-100/80 dark:bg-surface-800 px-4 py-2 border-b border-slate-200 dark:border-surface-700 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {currentStep?.phase ? currentStep.phase : `Step ${viz.currentStep + 1} of ${viz.steps.length}`}
                  </span>
                  {currentStep?.operation && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                      {currentStep.operation}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle for Arrays */}
                  {isArrayData && (
                    <div className="flex items-center gap-1 bg-white dark:bg-surface-750 p-0.5 rounded-lg border border-slate-200 dark:border-surface-600">
                      {(['bars', 'blocks', 'table'] as CanvasViewMode[]).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setCanvasViewMode(mode)}
                          className={cn(
                            'px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors',
                            canvasViewMode === mode
                              ? 'bg-primary-500 text-white font-semibold'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                          )}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Explanation Mode Toggle */}
                  <div className="flex items-center gap-1 bg-white dark:bg-surface-750 p-0.5 rounded-lg border border-slate-200 dark:border-surface-600">
                    <button
                      onClick={() => setExplanationMode('simplified')}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
                        explanationMode === 'simplified' ? 'bg-primary-500 text-white' : 'text-slate-500'
                      )}
                    >
                      Simplified
                    </button>
                    <button
                      onClick={() => setExplanationMode('technical')}
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-medium transition-colors',
                        explanationMode === 'technical' ? 'bg-primary-500 text-white' : 'text-slate-500'
                      )}
                    >
                      Technical
                    </button>
                  </div>
                </div>
              </div>

              {/* Canvas viewport */}
              <div className="p-4 sm:p-6 min-h-[300px] flex items-center justify-center relative bg-white dark:bg-surface-800">
                <VisualizationCanvas step={currentStep} viewMode={canvasViewMode} />
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
                  onRandomize={() => reloadSteps({})}
                  onCustomInput={() => setCustomInputModalOpen(true)}
                />
              </div>

              {/* Current Step Analysis Bar */}
              {currentStep && (
                <div className="bg-slate-50 dark:bg-surface-850 p-4 border-t border-slate-200 dark:border-surface-700 space-y-3 text-xs">
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      i
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-normal leading-relaxed">
                      {explanationMode === 'technical' && currentStep.reason
                        ? `${currentStep.description} Reasoning: ${currentStep.reason}`
                        : currentStep.description}
                    </p>
                  </div>

                  {/* Before -> After Transformation Pill */}
                  {currentStep.beforeState && currentStep.afterState && (
                    <div className="bg-slate-900 text-slate-100 dark:bg-surface-950 p-3 rounded-lg font-mono text-[11px] flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Before:</span>
                        <span className="text-amber-300 font-semibold">{currentStep.beforeState}</span>
                      </div>
                      <ArrowRight size={13} className="text-slate-500" />
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">After:</span>
                        <span className="text-emerald-400 font-semibold">{currentStep.afterState}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 7 — PSEUDOCODE */}
          <section id="sec-pseudo" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 7 — Algorithmic Specification</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pseudocode & Line Breakdown</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Code Box */}
              <div className="bg-slate-900 text-slate-100 dark:bg-surface-950 p-4 rounded-xl font-mono text-xs overflow-auto border border-slate-800 space-y-0.5">
                {lesson.pseudocodeWalkthrough.code.map((line, i) => {
                  const isHighlighted = currentStep?.highlightLines?.includes(i);
                  return (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-3 px-2 py-0.5 rounded transition-colors',
                        isHighlighted
                          ? 'bg-primary-600/30 text-primary-200 border-l-2 border-primary-500 font-semibold'
                          : 'text-slate-300'
                      )}
                    >
                      <span className="text-slate-500 select-none w-5 text-right shrink-0">{i + 1}</span>
                      <span className="whitespace-pre">{line || ' '}</span>
                    </div>
                  );
                })}
              </div>

              {/* Line Explanations Table */}
              <div className="space-y-2 overflow-y-auto max-h-96 pr-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">Line-by-Line Mechanics</span>
                <div className="space-y-2">
                  {lesson.pseudocodeWalkthrough.lineExplanations.map((exp, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                      <div className="font-mono text-primary-700 dark:text-primary-300 font-semibold text-[11px]">
                        Line {exp.lineIndex + 1}: {exp.lineText}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{exp.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 text-xs flex items-center justify-between">
              <span className="font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">Termination Condition</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{lesson.pseudocodeWalkthrough.terminationCondition}</span>
            </div>
          </section>

          {/* SECTION 8 — SOURCE CODE WALKTHROUGH */}
          <section id="sec-source" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 8 — Implementation Reference</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Source Code Walkthrough (TypeScript)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Idiomatic, production-ready implementation matching the actual algorithm logic.
              </p>
            </div>

            <div className="bg-slate-900 text-slate-100 dark:bg-surface-950 p-4 rounded-xl font-mono text-xs overflow-auto border border-slate-800">
              <pre>{lesson.sourceCodeWalkthrough.code}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Variables & Purpose</span>
                <div className="space-y-1.5">
                  {lesson.sourceCodeWalkthrough.variables.map((v, i) => (
                    <div key={i} className="flex justify-between border-b border-slate-200/50 dark:border-surface-650 pb-1 font-mono">
                      <span className="font-semibold text-primary-600 dark:text-primary-400">{v.name} ({v.type}):</span>
                      <span className="text-slate-600 dark:text-slate-300 font-sans text-right">{v.purpose}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Edge Case Handling</span>
                <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300">
                  {lesson.sourceCodeWalkthrough.edgeCaseHandling.map((edge, i) => (
                    <li key={i}>{edge}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 9 — CORRECTNESS */}
          <section id="sec-correctness" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 9 — Theoretical Verification</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Correctness Rationale & Proof</h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 text-xs sm:text-sm space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Intuitive Correctness</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.correctness.intuitiveExplanation}</p>
            </div>

            {/* Formal Invariant Proof */}
            <div className="p-5 rounded-xl bg-primary-50/40 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-primary-700 dark:text-primary-300 text-xs flex items-center gap-1.5">
                  <Scale size={14} /> Formal Proof Method: {lesson.correctness.formalProof.method}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-surface-850 border border-primary-200/60 dark:border-primary-800/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white text-[11px] block">Invariant Claim</span>
                <p className="text-slate-700 dark:text-slate-300 italic">{lesson.correctness.formalProof.invariantOrClaim}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div className="p-2.5 rounded bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700">
                  <span className="font-bold text-[10px] uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">1. Initialization</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{lesson.correctness.formalProof.initialization}</p>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700">
                  <span className="font-bold text-[10px] uppercase text-amber-600 dark:text-amber-400 block mb-0.5">2. Maintenance</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{lesson.correctness.formalProof.maintenance}</p>
                </div>
                <div className="p-2.5 rounded bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700">
                  <span className="font-bold text-[10px] uppercase text-blue-600 dark:text-blue-400 block mb-0.5">3. Termination</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{lesson.correctness.formalProof.termination}</p>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 font-medium text-[11px] pt-1 border-t border-primary-200/40 dark:border-primary-800/40">
                <strong>Conclusion:</strong> {lesson.correctness.formalProof.conclusion}
              </p>
            </div>
          </section>

          {/* SECTION 10 — TIME AND SPACE COMPLEXITY */}
          <section id="sec-complexity" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 10 — Asymptotic Analysis</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Time & Space Complexity</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Best Case</span>
                <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">{lesson.complexityAnalysis.bestCase.complexity}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{lesson.complexityAnalysis.bestCase.condition}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Average Case</span>
                <div className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">{lesson.complexityAnalysis.averageCase.complexity}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{lesson.complexityAnalysis.averageCase.condition}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Worst Case</span>
                <div className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">{lesson.complexityAnalysis.worstCase.complexity}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{lesson.complexityAnalysis.worstCase.condition}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Aux Space</span>
                <div className="text-base font-bold font-mono text-violet-600 dark:text-violet-400">{lesson.complexityAnalysis.auxiliarySpace.complexity}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{lesson.complexityAnalysis.totalMemory}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Asymptotic Bounds (Big-O / Theta / Omega):</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{lesson.complexityAnalysis.bigOExplanation}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200">Scaling Curve Behavior:</span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{lesson.complexityAnalysis.scalingBehavior}</p>
              </div>
            </div>
          </section>

          {/* SECTION 11 — ADVANTAGES AND LIMITATIONS */}
          <section id="sec-pros-cons" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 11 — Trade-Off Analysis</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Advantages & Limitations</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Strengths
                </span>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {lesson.advantagesAndLimitations.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle size={15} /> Limitations & Poor Choices
                </span>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {lesson.advantagesAndLimitations.limitations.map((lim, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{lim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 12 — REAL-WORLD APPLICATIONS */}
          <section id="sec-apps" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 12 — Production Systems</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Real-World Applications</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {lesson.realWorldApplications.map((app, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{app.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{app.description}</p>
                  </div>
                  {app.educationalVsProductionNote && (
                    <div className="text-[10px] text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/40 p-2 rounded border border-primary-200 dark:border-primary-800">
                      <strong>Production Reality:</strong> {app.educationalVsProductionNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 13 — COMPARISON WITH OTHER ALGORITHMS */}
          <section id="sec-compare" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 13 — Head-to-Head Evaluation</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Comparison with Alternatives</h2>
            </div>

            <div className="space-y-4">
              {lesson.comparisons.map((cmp, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 dark:border-surface-650 pb-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {algorithm.name} vs {cmp.algorithm}
                    </h3>
                    <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      Time: {cmp.timeComplexity} | Space: {cmp.spaceComplexity}
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{cmp.differences}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans text-[11px]">
                    <div className="p-2 rounded bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700">
                      <strong className="text-primary-600 dark:text-primary-400">Prefer {algorithm.name}:</strong> {cmp.whenToPreferThis}
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700">
                      <strong className="text-amber-600 dark:text-amber-400">Prefer {cmp.algorithm}:</strong> {cmp.whenToPreferAlternative}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 14 — COMMON MISTAKES */}
          <section id="sec-mistakes" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 14 — Pitfalls & Debugging</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Common Mistakes & Bugs</h2>
            </div>

            <div className="space-y-3">
              {lesson.commonMistakes.map((m, i) => (
                <div key={i} className="p-4 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2 text-xs">
                  <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle size={15} /> {m.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{m.misconception}</p>
                  {m.badCodeOrApproach && (
                    <div className="font-mono bg-white/80 dark:bg-surface-900 p-2 rounded border border-rose-200/60 dark:border-rose-900/40 text-[11px] text-rose-700 dark:text-rose-400">
                      ❌ Bad: {m.badCodeOrApproach}
                    </div>
                  )}
                  <div className="font-mono bg-emerald-50/80 dark:bg-surface-900 p-2 rounded border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                    ✓ Fix: {m.correctApproach}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 15 — EXERCISES AND KNOWLEDGE CHECK */}
          <section id="sec-quiz" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 15 — Assessment</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Exercises & Knowledge Check</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Test your understanding with conceptual questions, step-tracing, and edge cases. Instant feedback provided!
              </p>
            </div>

            <div className="space-y-6">
              {(lesson.exercises && lesson.exercises.length > 0 ? lesson.exercises : lesson.quiz).map((q, qIdx) => {
                const selected = selectedAnswers[qIdx];
                const hasAnswered = showQuizResults[qIdx];

                return (
                  <div key={qIdx} className="p-5 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-3 text-xs sm:text-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {qIdx + 1}. {q.question}
                    </h3>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctIndex;
                        const isUserChoice = selected === optIdx;

                        let btnStyle = 'border-slate-200 dark:border-surface-600 hover:border-primary-400 bg-white dark:bg-surface-850 text-slate-700 dark:text-slate-300';
                        if (hasAnswered) {
                          if (isCorrect) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 font-semibold';
                          } else if (isUserChoice) {
                            btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              setSelectedAnswers(p => ({ ...p, [qIdx]: optIdx }));
                              setShowQuizResults(p => ({ ...p, [qIdx]: true }));
                            }}
                            className={cn('w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between', btnStyle)}
                          >
                            <span>{opt}</span>
                            {hasAnswered && isCorrect && <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {hasAnswered && (
                      <div className={cn(
                        'p-3 rounded-lg text-xs leading-relaxed',
                        selected === q.correctIndex
                          ? 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                      )}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 16 — SUMMARY AND NEXT STEPS */}
          <section id="sec-summary" className="bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">Section 16 — Curriculum Milestone</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Summary & Next Steps</h2>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-2 text-xs sm:text-sm">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Core Takeaway</span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{lesson.summary.coreIdea}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Essential Conditions to Remember</span>
                <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                  {lesson.summary.keyConditions.map((k, i) => (
                    <li key={i}>{k}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-surface-750 border border-slate-200 dark:border-surface-700 space-y-2">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">When to Use</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lesson.summary.whenToUse}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-surface-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Recommended Next Algorithms</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.summary.nextSteps.map(next => (
                  <Link
                    key={next.id}
                    to={`/learn/${next.id}`}
                    className="p-4 rounded-xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800/60 hover:border-primary-400 transition-colors group flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {next.name} &rarr;
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{next.reason}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Visualizer Link */}
            <div className="rounded-xl bg-gradient-to-r from-primary-600 to-indigo-700 p-6 text-white text-center space-y-2 shadow-md">
              <h3 className="text-lg font-bold">Ready to practice more with {algorithm.name}?</h3>
              <p className="text-primary-100 text-xs max-w-md mx-auto">
                Open the dedicated fullscreen workbench with tabular elements, custom arrays, and live metric diffs.
              </p>
              <button
                onClick={() => navigate(`/visualize/${algorithm.id}`)}
                className="mt-2 bg-white text-primary-700 font-bold px-5 py-2.5 rounded-lg text-xs hover:bg-primary-50 transition-colors shadow inline-flex items-center gap-1.5"
              >
                <Play size={14} /> Open Fullscreen Workbench
              </button>
            </div>
          </section>

        </main>
      </div>

      {/* Custom Input Modal */}
      {activeId && (
        <CustomInputModal
          isOpen={customInputModalOpen}
          onClose={() => setCustomInputModalOpen(false)}
          algorithmId={activeId}
          onApply={handleApplyCustomInput}
        />
      )}
    </div>
  );
};
