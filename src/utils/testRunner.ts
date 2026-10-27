import { executeAlgorithm } from '../hooks/useAlgorithm';
import { algorithms } from '../data/algorithms';

export function runAllAlgorithmTests(): { passed: number; failed: number; results: string[] } {
  let passed = 0;
  let failed = 0;
  const results: string[] = [];

  for (const algo of algorithms) {
    try {
      const steps = executeAlgorithm(algo.id, 8, [5, 2, 8, 1, 9, 3]);
      if (!steps || steps.length === 0) {
        failed++;
        results.push(`FAIL: ${algo.id} returned empty steps`);
      } else {
        const firstStep = steps[0];
        const lastStep = steps[steps.length - 1];
        if (!firstStep.data || !lastStep.data || !firstStep.description) {
          failed++;
          results.push(`FAIL: ${algo.id} invalid step data`);
        } else {
          passed++;
          results.push(`PASS: ${algo.id} generated ${steps.length} steps`);
        }
      }
    } catch (err) {
      failed++;
      results.push(`ERROR: ${algo.id} threw: ${String(err)}`);
    }
  }

  return { passed, failed, results };
}
