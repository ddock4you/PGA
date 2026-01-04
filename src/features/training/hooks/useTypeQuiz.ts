import { useCallback, useEffect, useMemo, useState } from "react";
import { useAllTypesQuery } from "@/features/types/hooks/useAllTypesQuery";
import {
  buildTypeMap,
  computeAttackMultiplier,
  type TypeMap,
} from "@/features/types/utils/typeEffectiveness";

type MultiplierChoice = "0" | "0.5" | "1" | "2";

interface TypeQuizQuestion {
  attackType: string;
  defenderType: string;
  multiplier: MultiplierChoice;
  index: number;
  total: number;
}

interface UseTypeQuizOptions {
  totalQuestions?: number;
}

interface UseTypeQuizResult {
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

function toChoiceFromMultiplier(multiplier: number): MultiplierChoice {
  if (multiplier === 0) return "0";
  if (multiplier <= 0.5) return "0.5";
  if (multiplier >= 2) return "2";
  return "1";
}

export function useTypeQuiz(options?: UseTypeQuizOptions): UseTypeQuizResult {
  const totalQuestions = options?.totalQuestions ?? 10;
  const { data: types, isLoading, isError } = useAllTypesQuery();

  const [questionIndex, setQuestionIndex] = useState(1);
  const [question, setQuestion] = useState<TypeQuizQuestion | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<MultiplierChoice | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const typeMap: TypeMap | null = useMemo(() => {
    if (!types) return null;
    return buildTypeMap(types);
  }, [types]);

  const choices: MultiplierChoice[] = ["2", "1", "0.5", "0"];

  const generateQuestion = useCallback(() => {
    if (!types || !typeMap) return;

    const typeNames = types.map((t) => t.name);
    if (typeNames.length === 0) return;

    const attackType = typeNames[Math.floor(Math.random() * typeNames.length)];
    let defenderType = typeNames[Math.floor(Math.random() * typeNames.length)];

    // 공격 타입과 방어 타입이 같은 경우는 조금 덜 흥미로우니, 가능하면 다시 뽑는다.
    if (defenderType === attackType && typeNames.length > 1) {
      defenderType = typeNames[(typeNames.indexOf(defenderType) + 1) % typeNames.length];
    }

    const multiplier = computeAttackMultiplier(attackType, [defenderType], typeMap);
    const choice = toChoiceFromMultiplier(multiplier);

    setQuestion({
      attackType,
      defenderType,
      multiplier: choice,
      index: questionIndex,
      total: totalQuestions,
    });
    setSelectedChoice(null);
    setIsCorrect(null);
  }, [typeMap, types, questionIndex, totalQuestions]);

  useEffect(() => {
    if (!isLoading && !isError && !question) {
      const timer = setTimeout(() => {
        generateQuestion();
      }, 0);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [generateQuestion, isError, isLoading, question]);

  const submitChoice = (choice: MultiplierChoice) => {
    if (!question || selectedChoice != null) return;

    setSelectedChoice(choice);
    const correct = choice === question.multiplier;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (questionIndex >= totalQuestions) {
      // 마지막 문제 이후에는 다시 처음으로 리셋
      setQuestionIndex(1);
      setScore(0);
      setQuestion(null);
      setSelectedChoice(null);
      setIsCorrect(null);
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setQuestion(null);
    setSelectedChoice(null);
    setIsCorrect(null);
  };

  return {
    typesLoading: isLoading,
    typesError: isError,
    question,
    choices,
    selectedChoice,
    isCorrect,
    score,
    submitChoice,
    nextQuestion,
  };
}
