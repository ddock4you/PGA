import { useMemo } from "react";
import { useQuizContext } from "@/features/training/contexts";
import { useQuizNavigation } from "@/features/training/hooks/useQuizNavigation";
import { useQuizGenerator } from "@/features/training/hooks/useQuizGenerator";
import { QuizQuestionCard } from "@/features/training/components/QuizQuestionCard";
import { QuizChoiceGrid } from "@/features/training/components/QuizChoiceGrid";
import { QuizPlayScaffold } from "@/features/training/components/QuizPlayScaffold";
import { QuizResultFooter } from "@/features/training/components/QuizResultFooter";

export function AttackQuizLevel2() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  // 퀴즈 생성기 연결
  useQuizGenerator();

  const title = "공격 상성 맞추기 Lv.2";
  const description = "포켓몬을 보고 효과적인 공격 타입을 맞춰보세요 (타입 숨김)";

  const question = state.question;
  const reveal = state.selectedChoice !== null;

  const correctLabel = useMemo(() => {
    if (!question) return "";
    return question.choices.find((c) => c.id === question.correctAnswer)?.label ?? "";
  }, [question]);

  const handleChoiceSelect = (choiceId: string) => {
    actions.submitAnswer(choiceId);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  const content = question ? (
    <>
      <QuizQuestionCard
        question={question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={reveal}
      />

      <QuizChoiceGrid
        choices={question.choices}
        selectionMode="single"
        selectedIds={state.selectedChoice ? [state.selectedChoice] : []}
        correctIds={[question.correctAnswer]}
        reveal={reveal}
        onSelect={handleChoiceSelect}
        showTypeBadge={true}
      />

      <QuizResultFooter
        isCorrect={state.isCorrect}
        correctMessage={`정답입니다! ${correctLabel} 기술이 효과적입니다.`}
        incorrectMessage={`아쉽네요. 정답은 ${correctLabel} 입니다.`}
        score={state.score}
        currentQuestion={state.currentQuestion}
        onNext={handleNextQuestion}
        nextDisabled={state.selectedChoice === null}
      />
    </>
  ) : null;

  return (
    <QuizPlayScaffold
      title={title}
      description={description}
      isLoading={state.isLoading}
      error={state.error}
      hasQuestion={question !== null}
    >
      {content}
    </QuizPlayScaffold>
  );
}
