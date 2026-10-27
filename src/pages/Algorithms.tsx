import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AlgorithmCategory } from '../components/algorithm/AlgorithmCategory';
import { AlgorithmSearch } from '../components/algorithm/AlgorithmSearch';
import { algorithms, categoryMeta } from '../data/algorithms';
import type { Category } from '../types/algorithm';
import { cn } from '../utils/cn';

const categories: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'sorting', label: 'Sorting' },
  { value: 'searching', label: 'Searching' },
  { value: 'graph', label: 'Graph' },
  { value: 'tree', label: 'Trees' },
  { value: 'dynamic-programming', label: 'Dynamic Programming' },
  { value: 'greedy', label: 'Greedy' },
  { value: 'backtracking', label: 'Backtracking' },
  { value: 'supervised', label: 'Supervised Learning' },
  { value: 'unsupervised', label: 'Unsupervised Learning' },
  { value: 'optimization', label: 'Optimization' },
  { value: 'reinforcement-learning', label: 'Reinforcement Learning' },
];

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

export const Algorithms: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    document.title = 'All Algorithms — AlgoViz';
  }, []);

  const filtered = useMemo(() => {
    return algorithms.filter(algo => {
      const matchSearch =
        search === '' ||
        algo.name.toLowerCase().includes(search.toLowerCase()) ||
        algo.description.toLowerCase().includes(search.toLowerCase()) ||
        algo.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = category === 'all' || algo.category === category;
      const matchDiff = difficulty === 'all' || algo.difficulty === difficulty;
      return matchSearch && matchCategory && matchDiff;
    });
  }, [search, category, difficulty]);

  // Group filtered by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach(algo => {
      if (!map.has(algo.category)) map.set(algo.category, []);
      map.get(algo.category)!.push(algo);
    });
    return map;
  }, [filtered]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">All Algorithms</h1>
        <p className="text-slate-500 dark:text-slate-400">
          {algorithms.length} algorithms across {Object.keys(categoryMeta).length} categories
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1">
          <AlgorithmSearch value={search} onChange={setSearch} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={cn(
                'whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                difficulty === d
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-surface-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-surface-600'
              )}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 mb-6 border-b border-slate-200 dark:border-surface-700">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              'whitespace-nowrap px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px',
              category === cat.value
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-slate-500 dark:text-slate-400">No algorithms match your search.</p>
          <button className="btn-secondary mt-3" onClick={() => { setSearch(''); setCategory('all'); setDifficulty('all'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {Array.from(grouped.entries()).map(([cat, algos]) => (
            <AlgorithmCategory
              key={cat}
              category={cat as Category}
              algorithms={algos}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
