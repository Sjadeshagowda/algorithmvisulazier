import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Page Not Found — AlgoViz';
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-8xl font-black text-slate-200 dark:text-surface-700 mb-4 select-none">404</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        The page you're looking for doesn't exist. Let's get you back on track.
      </p>
      <div className="flex gap-3">
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Go Back
        </button>
        <button className="btn-primary" onClick={() => navigate('/')}>
          <Home size={15} /> Home
        </button>
      </div>
    </div>
  );
};
