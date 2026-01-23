import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "@/features/training/contexts";
import { useQuizNavigation } from "@/features/training/hooks/useQuizNavigation";
import { useQuizGenerator } from "@/features/training/hooks/useQuizGenerator";
import { QuizQuestionCard } from "@/features/training/components/QuizQuestionCard";
import { QuizAnswerButtons } from "@/features/training/components/QuizAnswerButtons";

export function AttackQuizLevel2() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  // 퀴즈 생성기 연결
  useQuizGenerator();

  const handleChoiceSelect = (choiceId: string) => {
    actions.submitAnswer(choiceId);
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  // 로딩 상태
  if (state.isLoading && !state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
          <CardDescription className="text-xs">
            포켓몬을 보고 효과적인 공격 타입을 맞춰보세요 (타입 숨김)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (state.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-destructive">
            {state.error || "데이터를 불러오는 중 오류가 발생했습니다."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // 문제 없음
  if (!state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  const questionChoices = state.question.choices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    type: choice.type,
    multiplier: choice.multiplier,
    isCorrect: choice.id === state.question!.correctAnswer,
    isSelected: choice.id === state.selectedChoice,
  }));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.2</CardTitle>
          <CardDescription className="text-xs">
            포켓몬을 보고 효과적인 공격 타입을 맞춰보세요 (타입 숨김)
          </CardDescription>
        </CardHeader>
      </Card>

      <QuizQuestionCard
        question={state.question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={state.selectedChoice !== null} // 정답 공개 시에만 포켓몬 타입 표시
      />

      <QuizAnswerButtons
        choices={questionChoices}
        selectedChoice={state.selectedChoice}
        isCorrect={state.isCorrect}
        onChoiceSelect={handleChoiceSelect}
        disabled={state.selectedChoice !== null}
        showTypeBadge={true} // Lv2는 항상 기술 타입 표시
      />

      {/* 결과 및 다음 버튼 */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {state.isCorrect === true && (
              <p className="text-sm text-green-600 text-center font-bold">
                정답입니다!{" "}
                {state.question.choices.find((c) => c.id === state.question?.correctAnswer)?.label}{" "}
                기술이 효과적입니다.
              </p>
            )}
            {state.isCorrect === false && (
              <p className="text-sm text-red-600 text-center font-bold">
                아쉽네요. 정답은{" "}
                {state.question.choices.find((c) => c.id === state.question?.correctAnswer)?.label}{" "}
                입니다.
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                점수: {state.score} / {state.currentQuestion}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextQuestion}
                disabled={state.selectedChoice === null}
              >
                다음 문제
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
