import React from 'react';
import type { AlgorithmStep } from '../../types/algorithm';
import { ArrayBars } from './ArrayBars';
import { ArrayBlocks } from './ArrayBlocks';
import { ArrayTable } from './ArrayTable';
import { GraphCanvas } from './GraphCanvas';
import { DPTable } from './DPTable';
import { GridCanvas } from './GridCanvas';
import { TreeCanvas } from './TreeCanvas';
import { RegressionPlot } from './RegressionPlot';
import { ClassificationPlot } from './ClassificationPlot';
import { ClusterPlot } from './ClusterPlot';
import { OptimizationPlot } from './OptimizationPlot';
import { DecisionTreePlot } from './DecisionTreePlot';
import { SVMPlot } from './SVMPlot';
import { PCAPlot } from './PCAPlot';
import { NeuralNetworkPlot } from './NeuralNetworkPlot';
import { QLearningPlot } from './QLearningPlot';

export type CanvasViewMode = 'bars' | 'blocks' | 'table';

interface VisualizationCanvasProps {
  step: AlgorithmStep | null;
  viewMode?: CanvasViewMode;
}

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({ step, viewMode = 'bars' }) => {
  if (!step) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-slate-400 dark:text-slate-600">
        <div className="text-center">
          <div className="text-5xl mb-3">⚡</div>
          <p className="text-sm font-medium">Press Play or Step Forward to start visualization</p>
        </div>
      </div>
    );
  }

  const { data, operation, auxiliary } = step;

  const renderContent = () => {
    if (data.type === 'bars' || data.type === 'array') {
      if (viewMode === 'blocks') {
        return <ArrayBlocks elements={data.elements} />;
      }
      if (viewMode === 'table') {
        return <ArrayTable elements={data.elements} />;
      }
      return <ArrayBars elements={data.elements} />;
    }
    if (data.type === 'graph') {
      return <GraphCanvas nodes={data.nodes} edges={data.edges} />;
    }
    if (data.type === 'dp') {
      return <DPTable table={data.table} labels={data.labels} />;
    }
    if (data.type === 'grid') {
      return <GridCanvas cells={data.cells} />;
    }
    if (data.type === 'tree') {
      return <TreeCanvas root={data.root} />;
    }
    if (data.type === 'regression') {
      return <RegressionPlot data={data} />;
    }
    if (data.type === 'classification') {
      return <ClassificationPlot data={data} />;
    }
    if (data.type === 'clustering') {
      return <ClusterPlot data={data} />;
    }
    if (data.type === 'optimization') {
      return <OptimizationPlot data={data} />;
    }
    if (data.type === 'decision-tree') {
      return <DecisionTreePlot data={data} />;
    }
    if (data.type === 'svm') {
      return <SVMPlot data={data} />;
    }
    if (data.type === 'pca') {
      return <PCAPlot data={data} />;
    }
    if (data.type === 'neural-network') {
      return <NeuralNetworkPlot data={data} />;
    }
    if (data.type === 'q-learning') {
      return <QLearningPlot data={data} />;
    }
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Visualization type not supported</p>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {(operation || (auxiliary && auxiliary.length > 0)) && (
        <div className="absolute top-3 left-4 right-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
          {operation && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-800 shadow-sm">
              {operation}
            </span>
          )}
          {auxiliary?.map((aux, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-surface-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-surface-600 shadow-sm"
            >
              <strong className="font-semibold text-slate-500 dark:text-slate-400">{aux.label}:</strong>{' '}
              {Array.isArray(aux.value) ? `[${aux.value.join(', ')}]` : aux.value}
            </span>
          ))}
        </div>
      )}
      <div className="w-full h-full flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};
