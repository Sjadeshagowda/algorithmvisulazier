import React from 'react';
import { useNavigate } from 'react-router-dom';
import { algorithms, categoryMeta } from '../../data/algorithms';
import type { Category } from '../../types/algorithm';
import { cn } from '../../utils/cn';

interface AlgorithmSelectorProps {
  currentId: string;
  category?: Category;
  className?: string;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  currentId,
  category,
  className,
}) => {
  const navigate = useNavigate();

  const filtered = category
    ? algorithms.filter(a => a.category === category)
    : algorithms;

  return (
    <div className={cn('relative inline-block', className)}>
      <select
        value={currentId}
        onChange={e => navigate(`/visualize/${e.target.value}`)}
        className="text-xs sm:text-sm font-medium bg-slate-100 dark:bg-surface-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-surface-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        aria-label="Select algorithm to visualize"
      >
        {category ? (
          filtered.map(a => (
            <option key={a.id} value={a.id}>
              {a.name} ({a.difficulty})
            </option>
          ))
        ) : (
          Object.keys(categoryMeta).map(catKey => (
            <optgroup key={catKey} label={categoryMeta[catKey].label}>
              {algorithms
                .filter(a => a.category === catKey)
                .map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </optgroup>
          ))
        )}
      </select>
    </div>
  );
};
