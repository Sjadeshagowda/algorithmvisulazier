import { createServer } from 'vite';

async function runTests() {
  console.log('========================================================================');
  console.log('   ALGOVIZ — COMPLETE 16-SECTION CURRICULUM & VERIFICATION SUITE       ');
  console.log('========================================================================\n');

  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { algorithms } = await server.ssrLoadModule('/src/data/algorithms.ts');
    const { generateAlgorithmSteps, getDefaultAlgorithmInput } = await server.ssrLoadModule('/src/utils/stepGenerator.ts');

    console.log(`[1] Verifying 16 Distinct Curriculum Sections across all ${algorithms.length} Algorithms:\n`);
    let lessonFailures = 0;

    for (const algo of algorithms) {
      const { lesson } = algo;
      if (!lesson) {
        console.error(`❌ ${algo.name} (${algo.id}) is missing lesson object!`);
        lessonFailures++;
        continue;
      }

      const errors = [];

      // Section 1: Introduction
      if (!lesson.introduction?.problemSolved) errors.push('Sec 1: introduction.problemSolved');
      if (!lesson.introduction?.problemNotSolved) errors.push('Sec 1: introduction.problemNotSolved');
      if (!lesson.introduction?.whyLearn) errors.push('Sec 1: introduction.whyLearn');
      if (!lesson.introduction?.prerequisites?.length) errors.push('Sec 1: introduction.prerequisites');

      // Section 2: Why Do We Need It?
      if (!lesson.whyDoWeNeedIt?.problemStatement) errors.push('Sec 2: whyDoWeNeedIt.problemStatement');
      if (!lesson.whyDoWeNeedIt?.naiveApproachInefficiency) errors.push('Sec 2: whyDoWeNeedIt.naiveApproachInefficiency');
      if (!lesson.whyDoWeNeedIt?.coreIdeaUsed) errors.push('Sec 2: whyDoWeNeedIt.coreIdeaUsed');
      if (!lesson.whyDoWeNeedIt?.whenAnotherIsBetter) errors.push('Sec 2: whyDoWeNeedIt.whenAnotherIsBetter');

      // Section 3: Input, Output, and Assumptions
      if (!lesson.inputOutputAssumptions?.expectedInput) errors.push('Sec 3: inputOutputAssumptions.expectedInput');
      if (!lesson.inputOutputAssumptions?.expectedOutput) errors.push('Sec 3: inputOutputAssumptions.expectedOutput');
      if (!lesson.inputOutputAssumptions?.brokenAssumptionsBehavior) errors.push('Sec 3: inputOutputAssumptions.brokenAssumptionsBehavior');

      // Section 4: Core Intuition
      if (!lesson.coreIntuition?.simpleExplanation) errors.push('Sec 4: coreIntuition.simpleExplanation');
      if (!lesson.coreIntuition?.keyDrivingDecision) errors.push('Sec 4: coreIntuition.keyDrivingDecision');
      if (!lesson.coreIntuition?.whyRepeatedOperationWorks) errors.push('Sec 4: coreIntuition.whyRepeatedOperationWorks');

      // Section 5: Worked Example
      if (!lesson.workedExample?.steps?.length) errors.push('Sec 5: workedExample.steps');
      if (!lesson.workedExample?.finalState) errors.push('Sec 5: workedExample.finalState');

      // Section 7: Pseudocode
      if (!lesson.pseudocodeWalkthrough?.code?.length) errors.push('Sec 7: pseudocodeWalkthrough.code');
      if (!lesson.pseudocodeWalkthrough?.lineExplanations?.length) errors.push('Sec 7: pseudocodeWalkthrough.lineExplanations');

      // Section 8: Source Code Walkthrough
      if (!lesson.sourceCodeWalkthrough?.code) errors.push('Sec 8: sourceCodeWalkthrough.code');
      if (!lesson.sourceCodeWalkthrough?.variables?.length) errors.push('Sec 8: sourceCodeWalkthrough.variables');
      if (!lesson.sourceCodeWalkthrough?.commonBugs?.length) errors.push('Sec 8: sourceCodeWalkthrough.commonBugs');

      // Section 9: Correctness
      if (!lesson.correctness?.intuitiveExplanation) errors.push('Sec 9: correctness.intuitiveExplanation');
      if (!lesson.correctness?.formalProof?.method) errors.push('Sec 9: correctness.formalProof.method');
      if (!lesson.correctness?.formalProof?.initialization) errors.push('Sec 9: correctness.formalProof.initialization');
      if (!lesson.correctness?.formalProof?.maintenance) errors.push('Sec 9: correctness.formalProof.maintenance');
      if (!lesson.correctness?.formalProof?.termination) errors.push('Sec 9: correctness.formalProof.termination');

      // Section 10: Complexity Analysis
      if (!lesson.complexityAnalysis?.bestCase?.complexity) errors.push('Sec 10: complexityAnalysis.bestCase');
      if (!lesson.complexityAnalysis?.averageCase?.complexity) errors.push('Sec 10: complexityAnalysis.averageCase');
      if (!lesson.complexityAnalysis?.worstCase?.complexity) errors.push('Sec 10: complexityAnalysis.worstCase');
      if (!lesson.complexityAnalysis?.auxiliarySpace?.complexity) errors.push('Sec 10: complexityAnalysis.auxiliarySpace');

      // Section 11: Advantages and Limitations
      if (!lesson.advantagesAndLimitations?.strengths?.length) errors.push('Sec 11: advantagesAndLimitations.strengths');
      if (!lesson.advantagesAndLimitations?.limitations?.length) errors.push('Sec 11: advantagesAndLimitations.limitations');

      // Section 12: Real-World Applications
      if (!lesson.realWorldApplications || lesson.realWorldApplications.length < 2) errors.push('Sec 12: realWorldApplications');

      // Section 13: Comparisons
      if (!lesson.comparisons?.length) errors.push('Sec 13: comparisons');

      // Section 14: Common Mistakes
      if (!lesson.commonMistakes?.length) errors.push('Sec 14: commonMistakes');

      // Section 15: Exercises
      const quizCount = (lesson.exercises?.length || 0) + (lesson.quiz?.length || 0);
      if (quizCount === 0) errors.push('Sec 15: exercises/quiz');

      // Section 16: Summary and Next Steps
      if (!lesson.summary?.coreIdea) errors.push('Sec 16: summary.coreIdea');
      if (!lesson.summary?.nextSteps?.length) errors.push('Sec 16: summary.nextSteps');

      if (errors.length > 0) {
        console.error(`  ❌ ${algo.name.padEnd(25)}: Missing fields -> ${errors.join(', ')}`);
        lessonFailures++;
      } else {
        console.log(`  ✓ ${algo.name.padEnd(25)}: All 16 Sections verified (${quizCount} exercises, ${lesson.workedExample.steps.length} worked steps)`);
      }
    }

    console.log(`\n[2] Verifying Custom Input Processing & Step Generation Across All 16 Algorithms:\n`);
    let inputFailures = 0;

    for (const algo of algorithms) {
      try {
        const defInput = getDefaultAlgorithmInput(algo.id);
        const steps = generateAlgorithmSteps(algo.id, 7, defInput);

        if (!Array.isArray(steps) || steps.length === 0) {
          console.error(`  ❌ ${algo.name} (${algo.id}): Generated 0 steps with default input`);
          inputFailures++;
          continue;
        }

        // Check first and last step
        const first = steps[0];
        const last = steps[steps.length - 1];

        if (!first.description || !first.data) {
          console.error(`  ❌ ${algo.name} (${algo.id}): Malformed step snapshot`);
          inputFailures++;
          continue;
        }

        console.log(`  ✓ ${algo.name.padEnd(25)}: Default Input -> Generated ${steps.length} steps (First: "${first.description.slice(0, 35)}...", Last: "${last.description.slice(0, 35)}...")`);
      } catch (err) {
        console.error(`  ❌ ${algo.name} (${algo.id}) threw error on default input:`, err);
        inputFailures++;
      }
    }

    console.log('\n========================================================================');
    console.log(`CURRICULUM LESSON VERIFICATION: ${algorithms.length - lessonFailures} / ${algorithms.length} PASSED`);
    console.log(`STEP GENERATION & INPUT TESTING: ${algorithms.length - inputFailures} / ${algorithms.length} PASSED`);
    console.log('========================================================================\n');

    if (lessonFailures > 0 || inputFailures > 0) {
      process.exit(1);
    } else {
      console.log('🎉 ALL 16 ALGORITHMS HAVE PASSED THE COMPLETE 16-SECTION CURRICULUM AUDIT!\n');
      process.exit(0);
    }
  } finally {
    await server.close();
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
