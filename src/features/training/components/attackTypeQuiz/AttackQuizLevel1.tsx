import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuizContext } from "@/features/training/contexts";
import { useQuizNavigation } from "@/features/training/hooks/useQuizNavigation";
import { useQuizGenerator } from "@/features/training/hooks/useQuizGenerator";
import { QuizQuestionCard } from "@/features/training/components/QuizQuestionCard";
import { QuizChoiceGrid } from "@/features/training/components/QuizChoiceGrid";
import { QuizPlayScaffold } from "@/features/training/components/QuizPlayScaffold";
import { QuizResultFooter } from "@/features/training/components/QuizResultFooter";

export function AttackQuizLevel1() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  // 퀴즈 데이터 로드 및 문제 생성 자동화
  useQuizGenerator();

  const title = "공격 상성 맞추기 Lv.1";
  const description = "포켓몬 타입을 보고 효과적인 공격 타입을 맞춰보세요";

  const question = state.question;
  const reveal = state.selectedChoice !== null;

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
        showPokemonTypes={false}
      />

      <Card>
        <CardContent className="pt-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">방어 포켓몬 타입</div>
            <div className="flex gap-2 justify-center">
              {question.defenderTypes?.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <QuizChoiceGrid
        choices={question.choices}
        selectionMode="single"
        selectedIds={state.selectedChoice ? [state.selectedChoice] : []}
        correctIds={[question.correctAnswer]}
        reveal={reveal}
        onSelect={handleChoiceSelect}
        showTypeBadge={false}
      />

      <QuizResultFooter
        isCorrect={state.isCorrect}
        correctMessage={`정답입니다! ${question.correctAnswer} 타입이 효과적입니다.`}
        incorrectMessage={`아쉽네요. 정답은 ${question.correctAnswer} 타입입니다.`}
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
