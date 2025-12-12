import { QuizProvider } from "@/features/training/store";
import { QuizContainer } from "@/features/training/components/QuizContainer";

export function TrainingPage() {
  return (
    <QuizProvider>
      <QuizContainer />
    </QuizProvider>
  );
}
