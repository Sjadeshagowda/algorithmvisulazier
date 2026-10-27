import { useMemo, useCallback } from 'react';
import type { AlgorithmMeta, AlgorithmStep } from '../types/algorithm';
import { getAlgorithmById } from '../data/algorithms';
import { useVisualization } from './useVisualization';
import { generateAlgorithmSteps, type CustomAlgorithmInput } from '../utils/stepGenerator';

export function executeAlgorithm(id: string, size: number = 15, customInput?: number[] | CustomAlgorithmInput): AlgorithmStep[] {
  const input: CustomAlgorithmInput | undefined = Array.isArray(customInput)
    ? { array: customInput }
    : customInput;
  return generateAlgorithmSteps(id, size, input);
}

export function useAlgorithm(algorithmId?: string) {
  const algorithm: AlgorithmMeta | undefined = useMemo(() => {
    return algorithmId ? getAlgorithmById(algorithmId) : undefined;
  }, [algorithmId]);

  const viz = useVisualization();

  const loadSteps = useCallback((size: number = 15, customInput?: number[] | CustomAlgorithmInput) => {
    if (!algorithmId) return;
    const steps = executeAlgorithm(algorithmId, size, customInput);
    viz.setSteps(steps);
  }, [algorithmId, viz]);

  return {
    algorithm,
    viz,
    loadSteps,
  };
}
