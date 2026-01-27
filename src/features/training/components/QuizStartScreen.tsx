import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "../contexts";
import { useQuizNavigation } from "../hooks/useQuizNavigation";
import { useQuizOptions } from "../hooks/useQuizOptions";
import { QuizModeSelector } from "./start/QuizModeSelector";
import { QuizLevelSelector } from "./start/QuizLevelSelector";
import { Lv1OptionsPanel } from "./start/Lv1OptionsPanel";
import { GenerationOptionsPanel } from "./start/GenerationOptionsPanel";

export function QuizStartScreen() {
  const { state, actions } = useQuizContext();
  const { startQuiz, canStartQuiz } = useQuizNavigation();
  const {
    getLv1Options,
    getLv2Options,
    getLv3Options,
    updateTotalQuestions,
    updateAllowDualType,
    updateGenerationSingle,
    updateGenerationRange,
  } = useQuizOptions();

  const handleStartQuiz = () => {
    if (canStartQuiz) {
      startQuiz();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">배틀 트레이닝</CardTitle>
        <CardDescription>타입 상성 퀴즈로 포켓몬 배틀 실력을 키워보세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <QuizModeSelector selectedMode={state.mode} onModeChange={actions.setMode} />

        <QuizLevelSelector selectedLevel={state.level} onLevelChange={actions.setLevel} hide={state.mode === "type"} />

        {((state.level && state.mode !== "type") || state.mode === "type") && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3">퀴즈 옵션</h3>
            {state.mode === "type" ? (
              // 포켓몬 속성 맞추기는 난이도 없이 바로 옵션 표시
              <GenerationOptionsPanel
                generationSelection={getLv2Options().generationSelection}
                onGenerationSingle={updateGenerationSingle}
                onGenerationRange={updateGenerationRange}
                includeSubGenerationsInputId="includeSubGenerations"
              />
            ) : state.level === 1 ? (
              <Lv1OptionsPanel
                totalQuestions={getLv1Options().totalQuestions}
                allowDualType={getLv1Options().allowDualType}
                onTotalQuestionsChange={updateTotalQuestions}
                onAllowDualTypeChange={updateAllowDualType}
              />
            ) : state.level === 2 ? (
              <GenerationOptionsPanel
                generationSelection={getLv2Options().generationSelection}
                onGenerationSingle={updateGenerationSingle}
                onGenerationRange={updateGenerationRange}
                includeSubGenerationsInputId="includeSubGenerations"
              />
            ) : (
              <GenerationOptionsPanel
                generationSelection={getLv3Options().generationSelection}
                onGenerationSingle={updateGenerationSingle}
                onGenerationRange={updateGenerationRange}
                includeSubGenerationsInputId="includeSubGenerationsLv3"
              />
            )}
          </div>
        )}

        <div className="border-t pt-4">
          <Button onClick={handleStartQuiz} disabled={!canStartQuiz} className="w-full" size="lg">
            {canStartQuiz
              ? "퀴즈 시작하기"
              : state.mode === "type"
              ? "퀴즈 종류를 선택해주세요"
              : "퀴즈 종류와 난이도를 선택해주세요"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
