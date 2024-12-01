import { useCallback, useState } from "react";

interface IStepIndicator<TStep extends string> {
  title: string;
  name: TStep;
  isActive: boolean;
}

interface IUseStepper<TStep extends string> {
  currentStep: TStep;
  steps: Array<IStepIndicator<TStep>>;
  gotoStep: (stepName: TStep) => void;
  resetSteps: () => void;
}

const useStepper = <TStep extends string>(initialSteps: Array<IStepIndicator<TStep>>): IUseStepper<TStep> => {
  const [steps, setSteps] = useState<Array<IStepIndicator<TStep>>>(() => initialSteps);
  const [currentStep, setCurrentStep] = useState<TStep>(() => initialSteps[0].name);

  // Update active steps based on the current step
  const updateActiveSteps = useCallback((stepName: TStep) => {
    /**
     * 1. Find the index of the current step in the steps array
     * 2. And set the isActive property of each step based on the index
     */
    const findStepIdx = steps.findIndex((step) => step.name === stepName);

    const updatedActiveSteps = steps.map((step, idx) => ({
      ...step,
      isActive: idx <= findStepIdx,
    }));

    setSteps(updatedActiveSteps);
  }, []);

  // Go to a specific step
  const gotoStep = useCallback(
    (stepName: TStep) => {
      /**
       * 1. Set the current step to the stepName
       * 2. Update the active steps based on the current step
       * 3. Scroll to the top of the page
       */
      setCurrentStep(stepName);
      updateActiveSteps(stepName);

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateActiveSteps],
  );

  // Reset steps to initial state
  const resetSteps = useCallback(() => {
    /**
     * 1. Set the steps to the initial steps
     * 2. Set the current step to the first step
     */
    setSteps(initialSteps);
    setCurrentStep(initialSteps[0].name);
  }, [initialSteps]);

  return { currentStep, steps, gotoStep, resetSteps };
};

export default useStepper;
