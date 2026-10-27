import type { ComplexityInfo } from '../types/algorithm';

export interface ComplexityRating {
  name: string;
  order: number;
  color: string;
  description: string;
}

export const COMPLEXITY_RATINGS: Record<string, ComplexityRating> = {
  'O(1)': {
    name: 'Constant',
    order: 1,
    color: 'text-emerald-500',
    description: 'Execution time remains constant regardless of the input size.',
  },
  'O(log n)': {
    name: 'Logarithmic',
    order: 2,
    color: 'text-teal-500',
    description: 'Runtime grows logarithmically, cutting problem size in half repeatedly.',
  },
  'O(n)': {
    name: 'Linear',
    order: 3,
    color: 'text-blue-500',
    description: 'Runtime is directly proportional to the size of the input.',
  },
  'O(n log n)': {
    name: 'Linearithmic',
    order: 4,
    color: 'text-amber-500',
    description: 'Optimal comparison-based sorting runtime (e.g. Merge Sort, Quick Sort).',
  },
  'O(n²)': {
    name: 'Quadratic',
    order: 5,
    color: 'text-orange-500',
    description: 'Involves nested iterations over the dataset (e.g. Bubble Sort, Selection Sort).',
  },
  'O(2ⁿ)': {
    name: 'Exponential',
    order: 6,
    color: 'text-rose-500',
    description: 'Doubles with each additional input element (e.g. recursive Fibonacci, power set).',
  },
  'O(n!)': {
    name: 'Factorial',
    order: 7,
    color: 'text-red-600',
    description: 'Grows extremely rapidly (e.g. generating permutations, brute force TSP).',
  },
};

export function getComplexityRating(notation: string): ComplexityRating {
  return (
    COMPLEXITY_RATINGS[notation] ?? {
      name: 'Custom',
      order: 8,
      color: 'text-slate-400',
      description: notation,
    }
  );
}

export function formatComplexity(complexity: ComplexityInfo): string {
  return `Avg: ${complexity.average} | Space: ${complexity.space}`;
}
