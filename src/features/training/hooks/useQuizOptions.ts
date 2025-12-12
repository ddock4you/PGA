import { useCallback } from "react";
import { useQuizContext } from "../store";

/**
 * 퀴즈 옵션 관리를 위한 공용 훅
 */
export function useQuizOptions() {
  const { state, actions } = useQuizContext();

  const updateTotalQuestions = useCallback(
    (totalQuestions: number) => {
      actions.updateOptions({ totalQuestions });
    },
    [actions]
  );

  const updateAllowDualType = useCallback(
    (allowDualType: boolean) => {
      actions.updateOptions({ allowDualType });
    },
    [actions]
  );

  const updateGenerationSingle = useCallback(
    (generation: number, includeSubGenerations: boolean) => {
      actions.updateOptions({
        generationSelection: {
          type: "single",
          generation,
          includeSubGenerations,
        },
      });
    },
    [actions]
  );

  const updateGenerationRange = useCallback(
    (minGeneration: number, maxGeneration: number) => {
      actions.updateOptions({
        generationSelection: {
          type: "range",
          minGeneration,
          maxGeneration,
        },
      });
    },
    [actions]
  );

  const resetOptions = useCallback(() => {
    actions.updateOptions({
      totalQuestions: 10,
      allowDualType: undefined,
      generationSelection: undefined,
    });
  }, [actions]);

  const getLv1Options = () => ({
    totalQuestions: state.options.totalQuestions,
    allowDualType: state.options.allowDualType ?? true,
  });

  const getLv2Options = () => ({
    generationSelection: state.options.generationSelection,
  });

  const getLv3Options = () => ({
    generationSelection: state.options.generationSelection,
  });

  return {
    options: state.options,
    updateTotalQuestions,
    updateAllowDualType,
    updateGenerationSingle,
    updateGenerationRange,
    resetOptions,
    getLv1Options,
    getLv2Options,
    getLv3Options,
  };
}
