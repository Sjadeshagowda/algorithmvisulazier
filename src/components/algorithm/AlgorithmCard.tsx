import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Clock, Database, BookOpen } from 'lucide-react';
import type { AlgorithmMeta } from '../../types/algorithm';
import { Badge } from '../common/Badge';

interface AlgorithmCardProps {
  algorithm: AlgorithmMeta;
  compact?: boolean;
}

const categoryColors: Record<string, string> = {
  sorting: 'bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400',
  searching: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  graph: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
  tree: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  'dynamic-programming': 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400',
  greedy: 'bg-lime-100 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400',
  backtracking: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
};

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm, compact = false }) => {
  const navigate = useNavigate();

  const handleVisualize = () => {
    navigate(`/visualize/${algorithm.id}`);
  };

  if (compact) {
    return (
      <div className="card-hover w-full p-4 group flex items-center justify-between">
        <Link to={`/learn/${algorithm.id}`} className="flex-1 min-w-0 pr-3">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {algorithm.name}
            </h3>
            <Badge variant={algorithm.difficulty}>{algorithm.difficulty}</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>{algorithm.complexity.average}</span>
            <span>{algorithm.complexity.space}</span>
          </div>
        </Link>
        <button
          onClick={handleVisualize}
          className="btn-primary py-1 px-2.5 text-xs shrink-0"
          title={`Visualize ${algorithm.name}`}
        >
          <Play size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="card-hover flex flex-col h-full group bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="category" color={categoryColors[algorithm.category]}>
                {algorithm.category.replace('-', ' ')}
              </Badge>
              <Badge variant={algorithm.difficulty}>{algorithm.difficulty}</Badge>
            </div>
            {algorithm.stable !== undefined && (
              <span className="text-[10px] text-slate-400 font-medium">
                {algorithm.stable ? 'Stable' : 'Unstable'}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <Link to={`/learn/${algorithm.id}`} className="hover:underline">
              {algorithm.name}
            </Link>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
            {algorithm.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-surface-700/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={12} className="text-amber-500 shrink-0" />
            <span className="font-mono font-medium">{algorithm.complexity.average}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Database size={12} className="text-violet-500 shrink-0" />
            <span className="font-mono font-medium">{algorithm.complexity.space}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-1 grid grid-cols-2 gap-2 border-t border-slate-50 dark:border-surface-750">
        <Link
          to={`/learn/${algorithm.id}`}
          className="btn-secondary justify-center text-xs py-2 px-3"
          aria-label={`Learn about ${algorithm.name}`}
        >
          <BookOpen size={13} />
          Learn More
        </Link>
        <button
          onClick={handleVisualize}
          className="btn-primary justify-center text-xs py-2 px-3 shadow-sm"
          aria-label={`Visualize ${algorithm.name}`}
        >
          <Play size={13} />
          Visualize
        </button>
      </div>
    </div>
  );
};
