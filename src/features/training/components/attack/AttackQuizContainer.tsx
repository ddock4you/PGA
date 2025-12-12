import { useQuizContext } from "../../store";
import { AttackQuizLevel1 } from "./AttackQuizLevel1";
import { AttackQuizLevel2 } from "./AttackQuizLevel2";

export function AttackQuizContainer() {
  const { state } = useQuizContext();

  // 화면에 따라 적절한 컴포넌트 렌더링
  if (state.level === 1) {
    return <AttackQuizLevel1 />;
  }

  if (state.level === 2) {
    return <AttackQuizLevel2 />;
  }

  return null;
}
