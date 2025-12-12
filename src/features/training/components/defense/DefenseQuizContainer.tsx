import { useQuizContext } from "../../store";
import { DefenseQuizLevel1 } from "./DefenseQuizLevel1";
import { DefenseQuizLevel2 } from "./DefenseQuizLevel2";

export function DefenseQuizContainer() {
  const { state } = useQuizContext();

  // 화면에 따라 적절한 컴포넌트 렌더링
  if (state.level === 1) {
    return <DefenseQuizLevel1 />;
  }

  if (state.level === 2) {
    return <DefenseQuizLevel2 />;
  }

  return null;
}
