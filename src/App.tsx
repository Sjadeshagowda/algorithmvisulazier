import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Algorithms = lazy(() => import('./pages/Algorithms').then(m => ({ default: m.Algorithms })));
const Sorting = lazy(() => import('./pages/Sorting').then(m => ({ default: m.Sorting })));
const Searching = lazy(() => import('./pages/Searching').then(m => ({ default: m.Searching })));
const Graph = lazy(() => import('./pages/Graph').then(m => ({ default: m.Graph })));
const Tree = lazy(() => import('./pages/Tree').then(m => ({ default: m.Tree })));
const DynamicProgramming = lazy(() => import('./pages/DynamicProgramming').then(m => ({ default: m.DynamicProgramming })));
const Greedy = lazy(() => import('./pages/Greedy').then(m => ({ default: m.Greedy })));
const Backtracking = lazy(() => import('./pages/Backtracking').then(m => ({ default: m.Backtracking })));
const Supervised = lazy(() => import('./pages/Supervised').then(m => ({ default: m.Supervised })));
const Unsupervised = lazy(() => import('./pages/Unsupervised').then(m => ({ default: m.Unsupervised })));
const Optimization = lazy(() => import('./pages/Optimization').then(m => ({ default: m.Optimization })));
const ReinforcementLearning = lazy(() => import('./pages/ReinforcementLearning').then(m => ({ default: m.ReinforcementLearning })));
const AlgorithmVisualizer = lazy(() => import('./pages/AlgorithmVisualizer').then(m => ({ default: m.AlgorithmVisualizer })));
const AlgorithmLessonPage = lazy(() => import('./pages/AlgorithmLessonPage').then(m => ({ default: m.AlgorithmLessonPage })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-slate-400">Loading...</span>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/sorting" element={<Sorting />} />
            <Route path="/searching" element={<Searching />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/tree" element={<Tree />} />
            <Route path="/dynamic-programming" element={<DynamicProgramming />} />
            <Route path="/greedy" element={<Greedy />} />
            <Route path="/backtracking" element={<Backtracking />} />
            <Route path="/supervised" element={<Supervised />} />
            <Route path="/unsupervised" element={<Unsupervised />} />
            <Route path="/optimization" element={<Optimization />} />
            <Route path="/reinforcement-learning" element={<ReinforcementLearning />} />
            <Route path="/learn/:algorithmId" element={<AlgorithmLessonPage />} />
            <Route path="/learn/:id" element={<AlgorithmLessonPage />} />
            <Route path="/visualize/:algorithmId" element={<AlgorithmVisualizer />} />
            <Route path="/visualize/:id" element={<AlgorithmVisualizer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
