// 공격 상성 퀴즈 관련 타입들

export interface AttackQuizLevel1Question {
  id: string;
  attackType: string;
  defenderTypes: string[];
  correctAnswer: string;
  choices: string[];
}

export interface AttackQuizLevel2Question {
  id: string;
  pokemonData: {
    id: number;
    name: string;
    sprite: string | null;
    types: string[];
  };
  correctAnswer: string;
  choices: string[];
}
