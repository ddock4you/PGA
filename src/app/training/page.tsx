import { Metadata } from "next";
import { QuizProvider } from "@/features/training/store";
import { QuizContainer } from "@/features/training/components/QuizContainer";

export const metadata: Metadata = {
  title: "배틀 트레이닝 - 포켓몬 게임 어시스턴트",
  description: "타입 상성과 포켓몬 지식을 테스트하고 학습하세요.",
  openGraph: {
    title: "배틀 트레이닝",
    description: "타입 상성과 포켓몬 지식을 테스트하고 학습하세요.",
    type: "website",
  },
};

export default function TrainingPage() {
  return <TrainingPageClient />;
}

function TrainingPageClient() {
  return (
    <QuizProvider>
      <QuizContainer />
    </QuizProvider>
  );
}
