import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/features/training/contexts/types";

type UseTypeAnswerSelectionParams = {
  question: QuizQuestion | null;
  submittedChoice: string | null;
  onSubmit: (answer: string) => void;
};

const parseSubmittedChoice = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export function useTypeAnswerSelection({ question, submittedChoice, onSubmit }: UseTypeAnswerSelectionParams) {
  const isDualType = (question?.pokemonData?.types.length ?? 0) === 2;
  const requiredCount = isDualType ? 2 : 1;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isAnswerSubmitted = submittedChoice !== null;

  const effectiveSelectedIds = useMemo(() => {
    if (selectedIds.length > 0) return selectedIds;
    if (submittedChoice) return parseSubmittedChoice(submittedChoice);
    return selectedIds;
  }, [selectedIds, submittedChoice]);

  const toggleSelect = (typeId: string) => {
    if (!question) return;
    if (isAnswerSubmitted) return;

    if (!isDualType) {
      setSelectedIds([typeId]);
      onSubmit(typeId);
      return;
    }

    setSelectedIds((prev) => {
      const prevSet = new Set(prev);

      if (prevSet.has(typeId)) {
        return prev.filter((t) => t !== typeId);
      }

      if (prev.length >= requiredCount) return prev;
      const next = [...prev, typeId];
      if (next.length === requiredCount) {
        onSubmit(next.join(","));
      }
      return next;
    });
  };

  const reset = () => {
    setSelectedIds([]);
  };

  return {
    isDualType,
    requiredCount,
    isAnswerSubmitted,
    selectedIds: effectiveSelectedIds,
    toggleSelect,
    reset,
  };
}
