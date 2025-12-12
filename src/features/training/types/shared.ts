// 공용으로 사용되는 타입들

export interface PokemonDisplayData {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
}

export interface TypeEffectivenessData {
  attackType: string;
  defenderTypes: string[];
  multiplier: number;
  effectiveness: "super" | "normal" | "weak" | "immune";
}

export interface QuizChoice {
  id: string;
  label: string;
  isCorrect?: boolean;
  isSelected?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
}
