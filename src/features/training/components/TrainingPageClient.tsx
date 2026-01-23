"use client";

import { QuizProvider } from "@/features/training/contexts";
import { QuizContainer } from "@/features/training/components/QuizContainer";

export function TrainingPageClient() {
  return (
    <QuizProvider>
      <QuizContainer />
    </QuizProvider>
  );
}
