import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuizContext } from "@/features/training/contexts";
import { useQuizNavigation } from "@/features/training/hooks/useQuizNavigation";
import { useQuizGenerator } from "@/features/training/hooks/useQuizGenerator";
import { QuizQuestionCard } from "@/features/training/components/QuizQuestionCard";
import { QuizAnswerButtons } from "@/features/training/components/QuizAnswerButtons";

export function AttackQuizLevel1() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  // 퀴즈 데이터 로드 및 문제 생성 자동화
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
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
          <CardDescription className="text-xs">
            포켓몬 타입을 보고 효과적인 공격 타입을 맞춰보세요
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
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-destructive">{state.error}</p>
        </CardContent>
      </Card>
    );
  }

  // 문제 없음
  if (!state.question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
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
          <CardTitle className="text-sm">공격 상성 맞추기 Lv.1</CardTitle>
          <CardDescription className="text-xs">
            포켓몬 타입을 보고 효과적인 공격 타입을 맞춰보세요
          </CardDescription>
        </CardHeader>
      </Card>

      <QuizQuestionCard
        question={state.question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={false}
      />

      {/* 방어 타입 표시 - 문제 텍스트에 이미 포함되어 있지만 시각적으로 강조 */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">방어 포켓몬 타입</div>
            <div className="flex gap-2 justify-center">
              {state.question?.defenderTypes?.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <QuizAnswerButtons
        choices={questionChoices}
        selectedChoice={state.selectedChoice}
        isCorrect={state.isCorrect}
        onChoiceSelect={handleChoiceSelect}
        disabled={state.selectedChoice !== null}
        showTypeBadge={false} // Lv1은 보기가 곧 타입이므로 배지 중복 표시 불필요 (하지만 보기 label이 타입명이므로 배지를 안 써도 됨, 혹은 label을 배지 스타일로?)
        // QuizAnswerButtons가 label을 텍스트로 보여주고 배지는 type이 있을 때만 보여주도록 했음.
        // Lv1에서는 choices의 type 필드를 undefined로 두거나, label과 같게 두면 됨.
        // generateAttackLevel1에서는 type 필드를 안 넣었음 (undefined).
        // 따라서 배지는 안 나옴.
      />

      {/* 결과 및 다음 버튼 */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {state.isCorrect === true && state.question && (
              <p className="text-sm text-green-600 text-center font-bold">
                정답입니다! {state.question.correctAnswer} 타입이 효과적입니다.
              </p>
            )}
            {state.isCorrect === false && state.question && (
              <p className="text-sm text-red-600 text-center font-bold">
                아쉽네요. 정답은 {state.question.correctAnswer} 타입입니다.
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
