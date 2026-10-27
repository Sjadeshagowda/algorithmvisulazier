import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Cpu, Sun, Moon, Menu, X, ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Algorithms', to: '/algorithms' },
  {
    label: 'Categories',
    children: [
      { label: 'Sorting', to: '/sorting' },
      { label: 'Searching', to: '/searching' },
      { label: 'Graph', to: '/graph' },
      { label: 'Trees', to: '/tree' },
      { label: 'Dynamic Programming', to: '/dynamic-programming' },
      { label: 'Greedy', to: '/greedy' },
      { label: 'Backtracking', to: '/backtracking' },
      { label: 'Supervised Learning', to: '/supervised' },
      { label: 'Unsupervised Learning', to: '/unsupervised' },
      { label: 'Optimization', to: '/optimization' },
      { label: 'Reinforcement Learning', to: '/reinforcement-learning' },
    ],
  },
];

export const Navbar: React.FC = () => {
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-surface-700 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <Cpu size={15} className="text-white" />
            </div>
            <span className="text-sm tracking-tight hidden sm:block">AlgoViz</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item =>
              item.children ? (
                <div key={item.label} className="relative">
                  <button
                    className="nav-link btn-ghost py-1.5"
                    onClick={() => setDropdownOpen(o => !o)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                    aria-expanded={dropdownOpen}
                  >
                    {item.label}
                    <ChevronDown size={14} className={cn('transition-transform', dropdownOpen && 'rotate-180')} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 card py-1 shadow-xl animate-fade-in">
                      {item.children.map(child => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn('nav-link btn-ghost py-1.5', isActive && 'nav-link-active')
                  }
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="btn-icon"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="md:hidden btn-icon"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-900 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item =>
              item.children ? (
                <div key={item.label}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {item.label}
                  </div>
                  {item.children.map(child => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 rounded-lg hover:bg-slate-50 dark:hover:bg-surface-700"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to!}
                  className={({ isActive }) =>
                    cn('block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-700'
                    )
                  }
                  onClick={() => setMobileOpen(false)}
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};
