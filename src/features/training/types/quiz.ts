import type { PokemonDisplayData } from "./shared";

export type PokemonQuizMultiplier = "0" | "0.5" | "1" | "2";

export interface PokemonQuizQuestion {
  pokemon: PokemonDisplayData;
  defenderTypes: string[];
  correctAttackType: string;
  correctMultiplier: number;
  choices: string[];
  index: number;
  total: number;
}

export interface UsePokemonQuizOptions {
  generationId: number | string | null;
  totalQuestions?: number;
  allowDualType?: boolean;
  choicesPerQuestion?: number;
}

export interface UsePokemonQuizResult {
  question: PokemonQuizQuestion | null;
  selectedChoice: string | null;
  isCorrect: boolean | null;
  score: number;
  isPreparing: boolean;
  preparationError: string | null;
  typesLoading: boolean;
  typesError: boolean;
  speciesLoading: boolean;
  speciesError: boolean;
  submitChoice: (choice: string) => void;
  nextQuestion: () => void;
}

export type MultiplierChoice = "0" | "0.5" | "1" | "2";

export interface TypeQuizQuestion {
  attackType: string;
  defenderType: string;
  multiplier: MultiplierChoice;
  index: number;
  total: number;
}

export interface UseTypeQuizOptions {
  totalQuestions?: number;
}

export interface UseTypeQuizResult {
  typesLoading: boolean;
  typesError: boolean;
  question: TypeQuizQuestion | null;
  choices: MultiplierChoice[];
  selectedChoice: MultiplierChoice | null;
  isCorrect: boolean | null;
  score: number;
  submitChoice: (choice: MultiplierChoice) => void;
  nextQuestion: () => void;
}
