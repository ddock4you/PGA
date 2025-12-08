import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { useTypeQuiz } from "@/features/training/hooks/useTypeQuiz";
import { usePokemonQuiz } from "@/features/training/hooks/usePokemonQuiz";

type QuizMode = "type" | "pokemon";

const capitalizeLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

interface TrainingModeSelectorProps {
  mode: QuizMode;
  onChange: (mode: QuizMode) => void;
}

function TrainingModeSelector({ mode, onChange }: TrainingModeSelectorProps) {
  const modes: { key: QuizMode; label: string }[] = [
    { key: "type", label: "타입 상성 퀴즈" },
    { key: "pokemon", label: "포켓몬 기반 퀴즈" },
  ];

  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {modes.map(({ key, label }) => (
        <Button
          key={key}
          variant={mode === key ? "default" : "outline"}
          size="sm"
          type="button"
          onClick={() => onChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

function TypeQuizCard({ totalQuestions }: { totalQuestions: number }) {
  const {
    typesLoading,
    typesError,
    question,
    choices,
    selectedChoice,
    isCorrect,
    score,
    submitChoice,
    nextQuestion,
  } = useTypeQuiz({ totalQuestions });

  const renderContent = () => {
    if (typesLoading) {
      return <p className="text-xs text-muted-foreground">타입 데이터를 불러오는 중입니다...</p>;
    }

    if (typesError) {
      return (
        <p className="text-xs text-destructive">
          타입 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      );
    }

    if (!question) {
      return <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>;
    }

    return (
      <>
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            문제 {question.index} / {question.total}
          </p>
          <p className="text-sm">
            <span className="font-semibold text-foreground">{question.attackType}</span> 타입 기술은{" "}
            <span className="rounded-full bg-muted px-2 py-0.5 text-foreground">
              {question.defenderType}
            </span>{" "}
            타입 포켓몬에게 어느 정도의 대미지를 줄까요?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {choices.map((choice) => {
            const isSelected = selectedChoice === choice;
            const correct = isCorrect && question.multiplier === choice;

            let variant: "outline" | "default" | "destructive" = "outline";
            if (isSelected && isCorrect != null) {
              variant = correct ? "default" : "destructive";
            }

            const label =
              choice === "2"
                ? "2배 (효과가 굉장하다)"
                : choice === "1"
                ? "1배 (보통)"
                : choice === "0.5"
                ? "0.5배 (효과가 별로이다)"
                : "0배 (효과가 없다)";

            return (
              <Button
                key={choice}
                variant={variant}
                size="sm"
                type="button"
                onClick={() => submitChoice(choice)}
                disabled={selectedChoice != null}
              >
                {label}
              </Button>
            );
          })}
        </div>

        <div className="rounded-md bg-muted px-3 py-2 text-[11px] text-muted-foreground">
          {isCorrect == null && <p>보기를 하나 선택해 정답을 확인해 보세요.</p>}
          {isCorrect === true && (
            <p>
              정답입니다! {question.attackType} → {question.defenderType} 조합은{" "}
              {question.multiplier === "2"
                ? "효과가 굉장한 상성입니다."
                : question.multiplier === "1"
                ? "보통 상성입니다."
                : question.multiplier === "0.5"
                ? "효과가 별로인 상성입니다."
                : "효과가 없는 상성입니다."}
            </p>
          )}
          {isCorrect === false && (
            <p>
              아쉽네요. 정답은{" "}
              {question.multiplier === "2"
                ? "2배 (효과가 굉장하다)"
                : question.multiplier === "1"
                ? "1배 (보통)"
                : question.multiplier === "0.5"
                ? "0.5배 (효과가 별로이다)"
                : "0배 (효과가 없다)"}{" "}
              입니다.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <p>
            점수: {score} / {question.total}
          </p>
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="h-7 px-2 text-[11px]"
            onClick={nextQuestion}
          >
            다음 문제
          </Button>
        </div>
      </>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">타입 상성 퀴즈</CardTitle>
        <CardDescription className="text-xs">
          랜덤 타입 조합에 대해 상성을 맞추는 연습용 퀴즈입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">{renderContent()}</CardContent>
    </Card>
  );
}

interface TrainingOptionsPanelProps {
  totalQuestions: number;
  onTotalQuestionsChange: (value: number) => void;
  allowDualType: boolean;
  onToggleDualType: () => void;
  generationLabel: string;
}

function TrainingOptionsPanel({
  totalQuestions,
  onTotalQuestionsChange,
  allowDualType,
  onToggleDualType,
  generationLabel,
}: TrainingOptionsPanelProps) {
  const questionCounts = [5, 10, 15];

  return (
    <div className="flex flex-col gap-3 rounded-md border p-4 text-xs md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground">문제 수</span>
        {questionCounts.map((count) => (
          <Button
            key={count}
            size="sm"
            variant={count === totalQuestions ? "default" : "outline"}
            type="button"
            onClick={() => onTotalQuestionsChange(count)}
          >
            {count}문제
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground">듀얼 타입</span>
        <Button
          variant={allowDualType ? "default" : "outline"}
          size="sm"
          type="button"
          onClick={onToggleDualType}
        >
          {allowDualType ? "허용" : "단일 타입만"}
        </Button>
      </div>

      <p className="text-[11px] text-muted-foreground">선택 세대: {generationLabel}</p>
    </div>
  );
}

interface PokemonQuizCardProps {
  generationId: number | string | null;
  totalQuestions: number;
  allowDualType: boolean;
}

function PokemonQuizCard({ generationId, totalQuestions, allowDualType }: PokemonQuizCardProps) {
  const {
    question,
    isPreparing,
    preparationError,
    selectedChoice,
    isCorrect,
    score,
    submitChoice,
    nextQuestion,
    typesLoading,
    typesError,
    speciesLoading,
    speciesError,
  } = usePokemonQuiz({
    generationId,
    totalQuestions,
    allowDualType,
  });

  const isLoading = typesLoading || speciesLoading || isPreparing;
  const hasError = Boolean(preparationError) || typesError || speciesError;
  const errorMessage =
    preparationError ??
    (typesError || speciesError ? "포켓몬 데이터를 불러오는 중 오류가 발생했습니다." : null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">포켓몬 기반 퀴즈</CardTitle>
        <CardDescription className="text-xs">
          선택한 세대 포켓몬을 보고 가장 효과적인 공격 타입을 맞춰보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        {isLoading ? (
          <p className="text-xs text-muted-foreground">포켓몬 데이터를 불러오는 중입니다...</p>
        ) : hasError ? (
          <p className="text-xs text-destructive">{errorMessage}</p>
        ) : !question ? (
          <p className="text-xs text-muted-foreground">다음 문제를 준비하는 중입니다...</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {question.pokemon.sprite ? (
                  <img
                    src={question.pokemon.sprite}
                    alt={question.pokemon.name}
                    className="h-16 w-16 rounded-md object-contain"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-muted" />
                )}
                <div>
                  <p className="font-semibold text-foreground">
                    {capitalizeLabel(question.pokemon.name)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {question.pokemon.types.map((type) => (
                      <Badge
                        key={`${question.pokemon.id}-${type}`}
                        variant="secondary"
                        className="capitalize text-[11px]"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                  {question.defenderTypes.length > 0 && (
                    <p className="text-[11px] text-muted-foreground">
                      방어 타입:{" "}
                      {question.defenderTypes.map((type) => capitalizeLabel(type)).join(" / ")}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                문제 {question.index} / {question.total}
              </p>
            </div>

            <p className="text-sm">
              <span className="font-semibold text-foreground">
                {capitalizeLabel(question.pokemon.name)}
              </span>
              에게 효과적인 공격 타입은 무엇일까요?
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {question.choices.map((choice) => {
                const isAnswer = choice === question.correctAttackType;

                let variant: "outline" | "default" | "destructive" = "outline";
                if (selectedChoice != null) {
                  if (isAnswer) {
                    variant = "default";
                  } else if (choice === selectedChoice) {
                    variant = "destructive";
                  }
                }

                return (
                  <Button
                    key={choice}
                    variant={variant}
                    size="sm"
                    type="button"
                    onClick={() => submitChoice(choice)}
                    disabled={selectedChoice != null}
                  >
                    {capitalizeLabel(choice)}
                  </Button>
                );
              })}
            </div>

            <div className="rounded-md bg-muted px-3 py-2 text-[11px] text-muted-foreground">
              {selectedChoice == null ? (
                <p>보기를 하나 선택해 정답을 확인해 보세요.</p>
              ) : isCorrect ? (
                <p>
                  정답입니다! {capitalizeLabel(question.correctAttackType)} 타입은{" "}
                  {question.correctMultiplier}배 이상의 대미지를 줍니다.
                </p>
              ) : (
                <p>
                  아쉽네요. 정답은 {capitalizeLabel(question.correctAttackType)} (
                  {question.correctMultiplier}배) 입니다.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <p>
                점수: {score} / {question.total}
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                className="h-7 px-2 text-[11px]"
                onClick={nextQuestion}
              >
                다음 문제
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function TrainingPage() {
  const { state } = usePreferences();
  const [mode, setMode] = useState<QuizMode>("type");
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [allowDualType, setAllowDualType] = useState(true);

  const effectiveGenerationId = state.selectedGenerationId ?? "1";
  const generationLabel = state.selectedGenerationId
    ? `세대 ${state.selectedGenerationId}`
    : "선택된 세대 없음";

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold">배틀 트레이닝</h2>
        <p className="text-sm text-muted-foreground">
          타입 상성 퀴즈와 포켓몬 기반 퀴즈로 상성을 연습할 수 있는 공간입니다.
        </p>
        <TrainingModeSelector mode={mode} onChange={setMode} />
      </header>

      <TrainingOptionsPanel
        totalQuestions={totalQuestions}
        onTotalQuestionsChange={setTotalQuestions}
        allowDualType={allowDualType}
        onToggleDualType={() => setAllowDualType((prev) => !prev)}
        generationLabel={generationLabel}
      />

      {mode === "type" ? (
        <TypeQuizCard totalQuestions={totalQuestions} />
      ) : (
        <PokemonQuizCard
          generationId={effectiveGenerationId}
          totalQuestions={totalQuestions}
          allowDualType={allowDualType}
        />
      )}
    </section>
  );
}
