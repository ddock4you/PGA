import { useQuizContext } from "../../store";
import { TypeQuizLevel } from "./TypeQuizLevel";

export function TypeQuizContainer() {
  // 포켓몬 속성 맞추기는 난이도 없이 단일 레벨만
  return <TypeQuizLevel />;
}
