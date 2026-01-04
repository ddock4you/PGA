"use client";
import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type {
  QuizContextType,
  QuizState,
  QuizAction,
  QuizMode,
  QuizLevel,
  QuizScreen,
  QuizOptions,
  QuizQuestion,
} from "./types";

const QuizContext = createContext<QuizContextType | null>(null);

const initialState: QuizState = {
  mode: "attack",
  level: null,
  screen: "start",
  options: {
    totalQuestions: 10,
  },
  currentQuestion: 1,
  score: 0,
  selectedChoice: null,
  isCorrect: null,
  question: null,
  isLoading: false,
  error: null,
  askedPokemonIds: [],
};

const normalizeTypeAnswer = (answer: string) =>
  answer
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean)
    .sort()
    .join(",");

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
        level: null, // 모드 변경 시 레벨 초기화
        screen: "start",
      };

    case "SET_LEVEL":
      return {
        ...state,
        level: action.payload,
        screen: "start",
      };

    case "SET_SCREEN":
      return {
        ...state,
        screen: action.payload,
      };

    case "UPDATE_OPTIONS":
      return {
        ...state,
        options: {
          ...state.options,
          ...action.payload,
        },
      };

    case "START_QUIZ":
      return {
        ...state,
        screen: "playing",
        currentQuestion: 1,
        score: 0,
        selectedChoice: null,
        isCorrect: null,
        question: null,
        isLoading: true,
        error: null,
        askedPokemonIds: [],
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case "SET_QUESTION":
      return {
        ...state,
        question: action.payload,
        selectedChoice: null,
        isCorrect: null,
        isLoading: false,
        error: null,
      };

    case "SUBMIT_ANSWER":
      if (!state.question) return state;

      const isTypeMode = state.mode === "type";
      const submittedAnswer = action.payload;
      const isCorrect = isTypeMode
        ? normalizeTypeAnswer(submittedAnswer) === normalizeTypeAnswer(state.question.correctAnswer)
        : submittedAnswer === state.question.correctAnswer;
      return {
        ...state,
        selectedChoice: action.payload,
        isCorrect,
        score: isCorrect ? state.score + 1 : state.score,
      };

    case "NEXT_QUESTION":
      const nextQuestion = state.currentQuestion + 1;
      const isFinished = nextQuestion > state.options.totalQuestions;

      return {
        ...state,
        currentQuestion: nextQuestion,
        screen: isFinished ? "finished" : "playing",
        selectedChoice: null,
        isCorrect: null,
        question: null,
        isLoading: !isFinished,
      };

    case "ADD_ASKED_POKEMON":
      if (state.askedPokemonIds.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        askedPokemonIds: [...state.askedPokemonIds, action.payload],
      };

    case "RESET_QUIZ":
      return {
        ...initialState,
        mode: state.mode, // 모드만 유지
      };

    default:
      return state;
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const actions = {
    setMode: (mode: QuizMode) => {
      dispatch({ type: "SET_MODE", payload: mode });
    },

    setLevel: (level: QuizLevel) => {
      dispatch({ type: "SET_LEVEL", payload: level });
    },

    setScreen: (screen: QuizScreen) => {
      dispatch({ type: "SET_SCREEN", payload: screen });
    },

    updateOptions: (options: Partial<QuizOptions>) => {
      dispatch({ type: "UPDATE_OPTIONS", payload: options });
    },

    startQuiz: () => {
      dispatch({ type: "START_QUIZ" });
    },

    setLoading: (loading: boolean) => {
      dispatch({ type: "SET_LOADING", payload: loading });
    },

    setError: (error: string | null) => {
      dispatch({ type: "SET_ERROR", payload: error });
    },

    setQuestion: (question: QuizQuestion | null) => {
      dispatch({ type: "SET_QUESTION", payload: question });
    },

    submitAnswer: (choice: string) => {
      dispatch({ type: "SUBMIT_ANSWER", payload: choice });
    },

    nextQuestion: () => {
      dispatch({ type: "NEXT_QUESTION" });
    },

    addAskedPokemon: (pokemonId: number) => {
      dispatch({ type: "ADD_ASKED_POKEMON", payload: pokemonId });
    },

    resetQuiz: () => {
      dispatch({ type: "RESET_QUIZ" });
    },
  };

  const contextValue: QuizContextType = {
    state,
    actions,
  };

  return <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>;
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within QuizProvider");
  }
  return context;
}
