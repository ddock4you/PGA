// 방어 상성 퀴즈 관련 타입들

export interface DefenseQuizLevel1Question {
  id: string;
  attackType: string;
  defenderTypes: string[];
  correctAnswer: string;
  choices: string[];
}

export interface DefenseQuizLevel2Question {
  id: string;
  attackType: string;
  pokemonData: {
    id: number;
    name: string;
    sprite: string | null;
    types: string[];
  };
  correctAnswer: string;
  choices: string[];
}
