import React, { useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { AlgorithmCard } from '../components/algorithm/AlgorithmCard';
import { algorithms, categoryMeta } from '../data/algorithms';
import type { Category } from '../types/algorithm';
import * as LucideIcons from 'lucide-react';

interface CategoryPageProps {
  category: Category;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const catAlgorithms = algorithms.filter(a => a.category === category);
  const meta = categoryMeta[category];

  useEffect(() => {
    document.title = `${meta?.label ?? category} Algorithms — AlgoViz`;
  }, [meta, category]);

  const IconComponent = meta?.icon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? ((LucideIcons as Record<string, any>)[meta.icon] as React.ComponentType<{ size?: number; className?: string }>)
    : null;

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {IconComponent && (
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg`}>
              <IconComponent size={24} className="text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {meta?.label ?? category} Algorithms
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{meta?.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>{catAlgorithms.length} algorithm{catAlgorithms.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>
            {catAlgorithms.filter(a => a.difficulty === 'beginner').length} beginner,{' '}
            {catAlgorithms.filter(a => a.difficulty === 'intermediate').length} intermediate,{' '}
            {catAlgorithms.filter(a => a.difficulty === 'advanced').length} advanced
          </span>
        </div>
      </div>

      {catAlgorithms.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Coming Soon</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {meta?.label} algorithms are being added. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {catAlgorithms.map(algo => (
            <AlgorithmCard key={algo.id} algorithm={algo} />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
