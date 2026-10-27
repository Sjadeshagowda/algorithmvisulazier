import { useState, useCallback, useRef, useEffect } from 'react';
import type { AlgorithmStep, VisualizationState } from '../types/algorithm';

export function useVisualization() {
  const [state, setState] = useState<VisualizationState>({
    steps: [],
    currentStep: 0,
    isPlaying: false,
    isPaused: false,
    speed: 500,
    inputSize: 15,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const setSteps = useCallback((steps: AlgorithmStep[]) => {
    clearTimer();
    setState(prev => ({ ...prev, steps, currentStep: 0, isPlaying: false, isPaused: false }));
  }, [clearTimer]);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  }, []);

  const pause = useCallback(() => {
    clearTimer();
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setState(prev => ({ ...prev, currentStep: 0, isPlaying: false, isPaused: false }));
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    clearTimer();
    setState(prev => {
      if (prev.currentStep < prev.steps.length - 1) {
        return { ...prev, currentStep: prev.currentStep + 1, isPlaying: false, isPaused: true };
      }
      return { ...prev, isPlaying: false, isPaused: false };
    });
  }, [clearTimer]);

  const stepBackward = useCallback(() => {
    clearTimer();
    setState(prev => {
      if (prev.currentStep > 0) {
        return { ...prev, currentStep: prev.currentStep - 1, isPlaying: false, isPaused: true };
      }
      return prev;
    });
  }, [clearTimer]);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const setInputSize = useCallback((inputSize: number) => {
    setState(prev => ({ ...prev, inputSize }));
  }, []);

  const goToStep = useCallback((step: number) => {
    clearTimer();
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, prev.steps.length - 1)),
      isPlaying: false,
      isPaused: true,
    }));
  }, [clearTimer]);

  // Auto-advance when playing
  useEffect(() => {
    if (state.isPlaying) {
      if (state.currentStep >= state.steps.length - 1) {
        const endTimer = setTimeout(() => {
          setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
        }, 0);
        return () => clearTimeout(endTimer);
      }
      timerRef.current = setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
        }));
      }, state.speed);
    }
    return () => clearTimer();
  }, [state.isPlaying, state.currentStep, state.speed, state.steps.length, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const currentStepData = state.steps[state.currentStep] ?? null;
  const progress = state.steps.length > 1
    ? (state.currentStep / (state.steps.length - 1)) * 100
    : 0;

  return {
    ...state,
    currentStepData,
    progress,
    setSteps,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
    setInputSize,
    goToStep,
  };
}
