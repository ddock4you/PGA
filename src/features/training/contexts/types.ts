export type QuizMode = "attack" | "type";
export type QuizLevel = 1 | 2 | 3;
export type QuizScreen = "start" | "playing" | "finished";

export interface QuizOptions {
  totalQuestions: number;
  allowDualType?: boolean;
  generationSelection?:
    | {
        type: "single";
        generation: number;
        includeSubGenerations: boolean;
      }
    | {
        type: "range";
        minGeneration: number;
        maxGeneration: number;
      };
}

export interface QuizChoiceData {
  id: string;
  label: string;
  type?: string;
  multiplier?: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  choices: QuizChoiceData[];
  correctAnswer: string;
  pokemonData?: {
    id: number;
    name: string;
    sprite: string | null;
    types: string[];
  };
  attackType?: string;
  defenderTypes?: string[];
}

export interface QuizState {
  mode: QuizMode;
  level: QuizLevel | null;
  screen: QuizScreen;
  options: QuizOptions;
  currentQuestion: number;
  score: number;
  selectedChoice: string | null;
  isCorrect: boolean | null;
  question: QuizQuestion | null;
  isLoading: boolean;
  error: string | null;
  askedPokemonIds: number[];
}

export type QuizAction =
  | { type: "SET_MODE"; payload: QuizMode }
  | { type: "SET_LEVEL"; payload: QuizLevel | null }
  | { type: "SET_SCREEN"; payload: QuizScreen }
  | { type: "UPDATE_OPTIONS"; payload: Partial<QuizOptions> }
  | { type: "START_QUIZ" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_QUESTION"; payload: QuizQuestion | null }
  | { type: "SUBMIT_ANSWER"; payload: string }
  | { type: "NEXT_QUESTION" }
  | { type: "ADD_ASKED_POKEMON"; payload: number }
  | { type: "RESET_QUIZ" };

export interface QuizContextType {
  state: QuizState;
  actions: {
    setMode: (mode: QuizMode) => void;
    setLevel: (level: QuizLevel) => void;
    setScreen: (screen: QuizScreen) => void;
    updateOptions: (options: Partial<QuizOptions>) => void;
    startQuiz: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setQuestion: (question: QuizQuestion | null) => void;
    submitAnswer: (choice: string) => void;
    nextQuestion: () => void;
    addAskedPokemon: (pokemonId: number) => void;
    resetQuiz: () => void;
  };
}
