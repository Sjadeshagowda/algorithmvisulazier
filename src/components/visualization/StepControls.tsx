import React from 'react';
import {
  Play, Pause, SkipBack, SkipForward, RotateCcw, Shuffle, Settings2,
} from 'lucide-react';
import { Slider } from '../common/Slider';
import { cn } from '../../utils/cn';

interface StepControlsProps {
  isPlaying: boolean;
  isPaused?: boolean;
  currentStep: number;
  totalSteps: number;
  progress: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  onRandomize: () => void;
  onCustomInput?: () => void;
  className?: string;
}

export const StepControls: React.FC<StepControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  progress,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onRandomize,
  onCustomInput,
  className,
}) => {
  const speedMs = speed;
  const speedLabel = speedMs <= 100 ? '4x' : speedMs <= 250 ? '2x' : speedMs <= 500 ? '1x' : speedMs <= 750 ? '0.5x' : '0.25x';

  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span>Step {Math.min(currentStep + 1, totalSteps)} / {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-slate-200 dark:bg-surface-600 overflow-hidden">
          <div
            className="absolute h-full rounded-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-2">
        <button
          className="btn-icon"
          onClick={onReset}
          title="Reset"
          aria-label="Reset"
          disabled={currentStep === 0 && !isPlaying}
        >
          <RotateCcw size={15} />
        </button>

        <button
          className="btn-icon"
          onClick={onStepBackward}
          title="Step Backward"
          aria-label="Step backward"
          disabled={currentStep === 0}
        >
          <SkipBack size={16} />
        </button>

        <button
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-surface-800 active:scale-95 shadow-lg',
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400'
              : 'bg-primary-600 hover:bg-primary-500'
          )}
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={totalSteps === 0}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        <button
          className="btn-icon"
          onClick={onStepForward}
          title="Step Forward"
          aria-label="Step forward"
          disabled={currentStep >= totalSteps - 1}
        >
          <SkipForward size={16} />
        </button>

        <button
          className="btn-icon"
          onClick={onRandomize}
          title="Randomize Input"
          aria-label="Generate random input"
        >
          <Shuffle size={15} />
        </button>

        {onCustomInput && (
          <button
            className="btn-icon"
            onClick={onCustomInput}
            title="Custom Input"
            aria-label="Enter custom input"
          >
            <Settings2 size={15} />
          </button>
        )}
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">Speed</span>
        <Slider
          min={100}
          max={1500}
          value={1600 - speed}
          onChange={(v) => onSpeedChange(1600 - v)}
          className="flex-1"
        />
        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 w-8 text-right">
          {speedLabel}
        </span>
      </div>
    </div>
  );
};
