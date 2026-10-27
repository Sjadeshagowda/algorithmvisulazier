import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface AlgorithmSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const AlgorithmSearch: React.FC<AlgorithmSearchProps> = ({
  value, onChange, placeholder = 'Search algorithms...'
}) => {
  return (
    <div className="relative">
      <SearchIcon
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="search"
        className="input-base pl-9"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search algorithms"
      />
    </div>
  );
};
