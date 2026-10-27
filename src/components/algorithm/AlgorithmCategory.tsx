import React from 'react';
import { AlgorithmCard } from './AlgorithmCard';
import type { AlgorithmMeta, Category } from '../../types/algorithm';
import { categoryMeta } from '../../data/algorithms';
import * as LucideIcons from 'lucide-react';

interface AlgorithmCategoryProps {
  category: Category;
  algorithms: AlgorithmMeta[];
}

export const AlgorithmCategory: React.FC<AlgorithmCategoryProps> = ({
  category,
  algorithms,
}) => {
  const meta = categoryMeta[category];

  const IconComponent = meta?.icon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? ((LucideIcons as Record<string, any>)[meta.icon] as React.ComponentType<{ size?: number; className?: string }>)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {IconComponent && (
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-sm`}>
            <IconComponent size={18} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {meta?.label ?? category}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {meta?.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {algorithms.map(algo => (
          <AlgorithmCard key={algo.id} algorithm={algo} />
        ))}
      </div>
    </div>
  );
};
