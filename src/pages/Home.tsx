import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Play, Zap, BookOpen, BarChart2, Code2,
  ArrowUpDown, Search, Network, Table, RefreshCw, GitBranch, TrendingUp,
  Brain, Boxes, Target, Gamepad2,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { algorithms } from '../data/algorithms';

const categoryCards = [
  {
    icon: ArrowUpDown, label: 'Sorting', to: '/sorting', category: 'sorting', color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-900/10', text: 'text-violet-600 dark:text-violet-400',
    desc: 'Bubble, Merge, Quick & more',
  },
  {
    icon: Search, label: 'Searching', to: '/searching', category: 'searching', color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400',
    desc: 'Linear & Binary search',
  },
  {
    icon: Network, label: 'Graph', to: '/graph', category: 'graph', color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-600 dark:text-emerald-400',
    desc: 'BFS, DFS traversals',
  },
  {
    icon: GitBranch, label: 'Trees', to: '/tree', category: 'tree', color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-600 dark:text-amber-400',
    desc: 'In-Order & BST Search',
  },
  {
    icon: Table, label: 'Dynamic Programming', to: '/dynamic-programming', category: 'dp', color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50 dark:bg-pink-900/10', text: 'text-pink-600 dark:text-pink-400',
    desc: 'Fibonacci, LCS & more',
  },
  {
    icon: TrendingUp, label: 'Greedy', to: '/greedy', category: 'greedy', color: 'from-lime-500 to-green-600',
    bg: 'bg-lime-50 dark:bg-lime-900/10', text: 'text-lime-600 dark:text-lime-400',
    desc: 'Coin Change & optimization',
  },
  {
    icon: RefreshCw, label: 'Backtracking', to: '/backtracking', category: 'backtracking', color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-50 dark:bg-orange-900/10', text: 'text-orange-600 dark:text-orange-400',
    desc: 'N-Queens, constraint solving',
  },
  {
    icon: Brain, label: 'Supervised Learning', to: '/supervised', category: 'supervised', color: 'from-blue-600 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/10', text: 'text-blue-600 dark:text-blue-400',
    desc: 'Regression, Trees, SVM & NNs',
  },
  {
    icon: Boxes, label: 'Unsupervised Learning', to: '/unsupervised', category: 'unsupervised', color: 'from-purple-600 to-pink-600',
    bg: 'bg-purple-50 dark:bg-purple-900/10', text: 'text-purple-600 dark:text-purple-400',
    desc: 'K-Means, PCA & Clustering',
  },
  {
    icon: Target, label: 'Optimization', to: '/optimization', category: 'optimization', color: 'from-amber-600 to-rose-600',
    bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-600 dark:text-amber-400',
    desc: 'Gradient Descent & Loss Landscapes',
  },
  {
    icon: Gamepad2, label: 'Reinforcement Learning', to: '/reinforcement-learning', category: 'reinforcement-learning', color: 'from-emerald-600 to-cyan-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-600 dark:text-emerald-400',
    desc: 'Q-Learning & Bellman Updates',
  },
];

const features = [
  {
    icon: Play, title: 'Step-by-Step Playback',
    desc: 'Watch algorithms execute one step at a time. Control the speed, pause, and rewind.',
    color: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
  },
  {
    icon: Code2, title: 'Live Pseudocode',
    desc: 'See highlighted pseudocode that tracks the currently executing line as the algorithm runs.',
    color: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: BarChart2, title: 'Complexity Analysis',
    desc: 'View time and space complexity for best, average, and worst cases side by side.',
    color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  },
  {
    icon: BookOpen, title: 'Clear Explanations',
    desc: 'Every step comes with a natural language explanation of exactly what the algorithm is doing.',
    color: 'bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredAlgos = algorithms.slice(0, 6);

  useEffect(() => {
    document.title = 'AlgoViz — Interactive Algorithm Visualizer';
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white dark:bg-surface-900 border-b border-slate-100 dark:border-surface-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-violet-50/50 dark:from-primary-900/20 dark:to-violet-900/10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium px-3 py-1 rounded-full mb-6 border border-primary-200 dark:border-primary-800">
              <Zap size={12} />
              Interactive Algorithm Learning
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-6">
              Learn Algorithms{' '}
              <span className="gradient-text">Visually</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl">
              Watch algorithms come to life with step-by-step animations. Understand sorting, searching, graph traversal, dynamic programming, and more — all in your browser.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="btn-primary text-base px-6 py-3 shadow-lg shadow-primary-500/20"
                onClick={() => navigate('/algorithms')}
                id="explore-button"
              >
                Explore Algorithms <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary text-base px-6 py-3"
                onClick={() => navigate('/visualize/bubble-sort')}
              >
                <Play size={16} />
                Try Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <PageContainer>
        {/* Categories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Algorithm Categories</h2>
              <p className="section-subtitle">Browse by topic</p>
            </div>
            <Link to="/algorithms" className="btn-ghost text-xs">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categoryCards.map(cat => {
              const count = algorithms.filter(a => a.category === cat.category).length;
              return (
                <Link
                  key={cat.to}
                  to={cat.to}
                  className={`card-hover p-5 group flex flex-col gap-3`}
                  aria-label={`${cat.label} algorithms`}
                >
                  <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center`}>
                    <cat.icon size={20} className={cat.text} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-0.5">
                      {cat.label}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{cat.desc}</div>
                  </div>
                  <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    {count} algorithm{count !== 1 ? 's' : ''}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured algorithms */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-title">Featured Algorithms</h2>
              <p className="section-subtitle">Start with the classics</p>
            </div>
            <Link to="/algorithms" className="btn-ghost text-xs">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredAlgos.map(algo => (
              <div key={algo.id} className="card-hover p-5 group flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {algo.name}
                  </h3>
                  <span className={`badge ${algo.difficulty === 'beginner' ? 'badge-beginner' : algo.difficulty === 'intermediate' ? 'badge-intermediate' : 'badge-advanced'}`}>
                    {algo.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
                  {algo.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-surface-700">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{algo.complexity.average}</span>
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/learn/${algo.id}`}
                      className="btn-ghost py-1 px-2.5 text-xs text-primary-600 dark:text-primary-400 font-medium"
                      aria-label={`Learn ${algo.name}`}
                    >
                      Learn
                    </Link>
                    <button
                      className="btn-primary py-1 px-3 text-xs"
                      onClick={() => navigate(`/visualize/${algo.id}`)}
                      aria-label={`Visualize ${algo.name}`}
                    >
                      <Play size={11} />
                      Visualize
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="section-title">Why AlgoViz?</h2>
            <p className="section-subtitle">Built for deep understanding, not just memorization</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(f => (
              <div key={f.title} className="card p-5">
                <div className={`w-9 h-9 rounded-lg ${f.color} flex items-center justify-center mb-3`}>
                  <f.icon size={17} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 p-8 sm:p-12 text-white text-center shadow-xl shadow-primary-500/20 mb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to master algorithms?</h2>
          <p className="text-primary-100 mb-6 max-w-md mx-auto">
            Over {algorithms.length} algorithms with interactive visualizations. Start learning today.
          </p>
          <button
            className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg active:scale-95"
            onClick={() => navigate('/algorithms')}
          >
            Get Started
          </button>
        </section>
      </PageContainer>
    </div>
  );
};
