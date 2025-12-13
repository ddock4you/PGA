import { useCallback } from "react";
import { useQuizContext } from "../store";

/**
 * 퀴즈 화면 전환을 관리하는 공용 훅
 */
export function useQuizNavigation() {
  const { state, actions } = useQuizContext();

  const goToStart = useCallback(() => {
    actions.setScreen("start");
  }, [actions]);

  const startQuiz = useCallback(() => {
    if (state.mode !== "type" && !state.level) return;
    actions.startQuiz();
  }, [actions, state.level, state.mode]);

  const nextQuestion = useCallback(() => {
    actions.nextQuestion();
  }, [actions]);

  const resetQuiz = useCallback(() => {
    actions.resetQuiz();
  }, [actions]);

  const canStartQuiz = state.mode === "type" || state.level !== null;

  return {
    currentScreen: state.screen,
    canStartQuiz,
    goToStart,
    startQuiz,
    nextQuestion,
    resetQuiz,
  };
}
