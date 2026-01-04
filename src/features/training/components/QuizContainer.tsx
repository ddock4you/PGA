import { useQuizContext } from "../store";
import { QuizStartScreen } from "./QuizStartScreen";
import { QuizFinishedScreen } from "./QuizFinishedScreen";
import { AttackQuizContainer } from "./attack/AttackQuizContainer";
import { TypeQuizContainer } from "./type/TypeQuizContainer";

export function QuizContainer() {
  const { state } = useQuizContext();

  // 화면 상태에 따른 컴포넌트 렌더링
  switch (state.screen) {
    case "start":
      return <QuizStartScreen />;

    case "playing":
      if (state.mode === "attack") {
        return <AttackQuizContainer />;
      } else if (state.mode === "type") {
        return <TypeQuizContainer />;
      }
      return <QuizStartScreen />; // 폴백

    case "finished":
      return <QuizFinishedScreen />;

    default:
      return <QuizStartScreen />;
  }
}
