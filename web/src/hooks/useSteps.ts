import { useCallback, useState } from 'react';

export const useSteps = (pageCount: number) => {
  const [step, setStep] = useState<number>(0);
  const reachStep = useCallback(
    (whichStep: number) =>
      setStep(whichStep <= pageCount && whichStep >= 0 ? whichStep : 0),
    [pageCount],
  );

  return { step, setStep, reachStep };
};
