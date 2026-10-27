import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center">
              <Cpu size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold">AlgoViz</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            Built with <Heart size={11} className="text-red-400" /> for students learning algorithms
          </p>
          <nav className="flex gap-4">
            {[
              { label: 'Home', to: '/' },
              { label: 'Algorithms', to: '/algorithms' },
              { label: 'Sorting', to: '/sorting' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
