import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowUpDown, Search, Network, GitBranch, Table,
  TrendingUp, RefreshCw, LayoutGrid, ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const navLinks = [
  { to: '/algorithms', label: 'All Algorithms', icon: LayoutGrid },
  { to: '/sorting', label: 'Sorting', icon: ArrowUpDown, count: 6 },
  { to: '/searching', label: 'Searching', icon: Search, count: 2 },
  { to: '/graph', label: 'Graph', icon: Network, count: 2 },
  { to: '/tree', label: 'Trees', icon: GitBranch, count: 2 },
  { to: '/dynamic-programming', label: 'Dynamic Programming', icon: Table, count: 2 },
  { to: '/greedy', label: 'Greedy', icon: TrendingUp, count: 1 },
  { to: '/backtracking', label: 'Backtracking', icon: RefreshCw, count: 1 },
];

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  return (
    <aside className={cn('w-64 border-r border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-850 p-4 space-y-6', className)}>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
          Categories
        </div>
        <nav className="space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-700 hover:text-slate-900 dark:hover:text-slate-100'
                  )
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && (
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-surface-700 text-slate-500">
                    {link.count}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-surface-700">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3">
          Popular Visualizers
        </div>
        <div className="space-y-1">
          {[
            { id: 'bubble-sort', label: 'Bubble Sort' },
            { id: 'merge-sort', label: 'Merge Sort' },
            { id: 'binary-search', label: 'Binary Search' },
            { id: 'bfs', label: 'Breadth-First Search' },
            { id: 'n-queens', label: 'N-Queens' },
          ].map(algo => (
            <NavLink
              key={algo.id}
              to={`/visualize/${algo.id}`}
              onClick={onNavigate}
              className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-surface-750 transition-colors"
            >
              <span>{algo.label}</span>
              <ChevronRight size={12} className="opacity-60" />
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
};
