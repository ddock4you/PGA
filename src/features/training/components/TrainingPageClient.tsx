"use client";

import { QuizProvider } from "@/features/training/store";
import { QuizContainer } from "@/features/training/components/QuizContainer";

export function TrainingPageClient() {
  return (
    <QuizProvider>
      <QuizContainer />
    </QuizProvider>
  );
}
