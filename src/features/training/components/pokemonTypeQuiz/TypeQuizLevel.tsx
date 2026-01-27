import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuizContext } from "@/features/training/contexts";
import { useQuizNavigation } from "@/features/training/hooks/useQuizNavigation";
import { useQuizGenerator } from "@/features/training/hooks/useQuizGenerator";
import { QuizQuestionCard } from "@/features/training/components/QuizQuestionCard";
import { QuizChoiceGrid } from "@/features/training/components/QuizChoiceGrid";
import { QuizPlayScaffold } from "@/features/training/components/QuizPlayScaffold";
import { QuizResultFooter } from "@/features/training/components/QuizResultFooter";
import { useTypeAnswerSelection } from "@/features/training/hooks/useTypeAnswerSelection";

export function TypeQuizLevel() {
  const { state, actions } = useQuizContext();
  const { nextQuestion } = useQuizNavigation();

  useQuizGenerator();

  const title = "포켓몬 속성 맞추기";
  const description = "포켓몬의 타입을 맞춰보세요";

  const question = state.question;

  const {
    isDualType,
    requiredCount,
    isAnswerSubmitted,
    selectedIds,
    toggleSelect,
    reset,
  } = useTypeAnswerSelection({
    question,
    submittedChoice: state.selectedChoice,
    onSubmit: actions.submitAnswer,
  });

  const correctTypes = question?.pokemonData?.types ?? [];
  const choiceLabelById = new Map((question?.choices ?? []).map((c) => [c.id, c.label] as const));
  const selectedLabels = selectedIds.map((id) => choiceLabelById.get(id) ?? id);

  const handleNextQuestion = () => {
    reset();
    nextQuestion();
  };

  const content = question ? (
    <>
      <QuizQuestionCard
        question={question}
        currentQuestion={state.currentQuestion}
        totalQuestions={state.options.totalQuestions}
        showPokemonTypes={isAnswerSubmitted}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {!isAnswerSubmitted && isDualType ? (
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  선택된 타입: {selectedIds.length}/{requiredCount}
                </p>
                {selectedLabels.length > 0 ? (
                  <div className="flex gap-2 justify-center mt-2">
                    {selectedLabels.map((label) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <QuizChoiceGrid
              choices={question.choices}
              selectionMode={isDualType ? "multiple" : "single"}
              maxSelections={isDualType ? requiredCount : undefined}
              selectedIds={selectedIds}
              correctIds={correctTypes}
              reveal={isAnswerSubmitted}
              onSelect={toggleSelect}
              appearance="tile"
              gridClassName="grid grid-cols-2 gap-3"
              showTypeBadge={false}
            />
          </div>
        </CardContent>
      </Card>

      <QuizResultFooter
        isCorrect={state.isCorrect}
        correctMessage={`정답입니다! ${correctTypes.join("/")} 타입입니다.`}
        incorrectMessage={`아쉽네요. 정답은 ${correctTypes.join("/")} 타입입니다.`}
        score={state.score}
        currentQuestion={state.currentQuestion}
        onNext={handleNextQuestion}
        nextDisabled={!isAnswerSubmitted}
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
