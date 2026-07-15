import { useState, useCallback } from 'react';
import { ExecutionStep } from '@/types/ai-hub.types';

const INITIAL_STEPS: ExecutionStep[] = [
  { stepIndex: 1, name: 'Receive Prompt', status: 'PENDING' },
  { stepIndex: 2, name: 'Planning', status: 'PENDING' },
  { stepIndex: 3, name: 'Search CRM', status: 'PENDING' },
  { stepIndex: 4, name: 'Query Database', status: 'PENDING' },
  { stepIndex: 5, name: 'AI Model Analysis', status: 'PENDING' },
  { stepIndex: 6, name: 'Execute Tools', status: 'PENDING' },
  { stepIndex: 7, name: 'Generate Response', status: 'PENDING' },
  { stepIndex: 8, name: 'Complete', status: 'PENDING' },
];

export function useAiExecution() {
  const [steps, setSteps] = useState<ExecutionStep[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const resetExecution = useCallback(() => {
    setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'PENDING' })));
    setCurrentStepIndex(0);
  }, []);

  const updateStep = useCallback((stepIndex: number, status: ExecutionStep['status'], durationMs?: number, logs?: string, inputJson?: any, outputJson?: any) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.stepIndex === stepIndex) {
          return {
            ...step,
            status,
            durationMs: durationMs !== undefined ? durationMs : step.durationMs,
            logs: logs !== undefined ? logs : step.logs,
            inputJson: inputJson !== undefined ? inputJson : step.inputJson,
            outputJson: outputJson !== undefined ? outputJson : step.outputJson,
          };
        }
        // Auto-complete previous steps if this step is complete
        if (step.stepIndex < stepIndex && status === 'COMPLETE' && step.status !== 'COMPLETE') {
          return { ...step, status: 'COMPLETE' };
        }
        return step;
      })
    );
    if (status === 'RUNNING') {
      setCurrentStepIndex(stepIndex);
    }
  }, []);

  return {
    steps,
    currentStepIndex,
    updateStep,
    resetExecution,
  };
}
