import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizContext } from "../store";
import { useQuizNavigation } from "../hooks/useQuizNavigation";
import { useQuizOptions } from "../hooks/useQuizOptions";

interface QuizModeSelectorProps {
  selectedMode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
}

function QuizModeSelector({ selectedMode, onModeChange }: QuizModeSelectorProps) {
  const modes = [
    {
      key: "attack" as const,
      label: "공격 상성 맞추기",
      description: "효과적인 공격 타입을 맞춰보세요",
    },
    {
      key: "type" as const,
      label: "포켓몬 속성 맞추기",
      description: "포켓몬의 타입을 맞춰보세요",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">퀴즈 종류 선택</h3>
      <div className="grid grid-cols-1 gap-2">
        {modes.map(({ key, label, description }) => (
          <Button
            key={key}
            variant={selectedMode === key ? "default" : "outline"}
            className="justify-start h-auto p-3"
            onClick={() => onModeChange(key)}
          >
            <div className="text-left">
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground mt-1">{description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface QuizLevelSelectorProps {
  selectedLevel: 1 | 2 | 3 | null;
  onLevelChange: (level: 1 | 2 | 3) => void;
  hideForTypeMode?: boolean;
}

function QuizLevelSelector({
  selectedLevel,
  onLevelChange,
  hideForTypeMode = false,
}: QuizLevelSelectorProps) {
  const levels = [
    {
      key: 1 as const,
      label: "Lv.1",
      description: "타입 정보를 확인하면서 연습",
      details: "포켓몬의 타입이 표시됩니다",
    },
    {
      key: 2 as const,
      label: "Lv.2",
      description: "실전처럼 타입 숨김",
      details: "포켓몬 타입이 숨겨집니다",
    },
    {
      key: 3 as const,
      label: "Lv.3",
      description: "심화 학습",
      details: "가장 효과적인 기술을 선택하세요 (타입 숨김)",
    },
  ];

  if (hideForTypeMode) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">난이도 선택</h3>
      <div className="grid grid-cols-1 gap-2">
        {levels.map(({ key, label, description, details }) => (
          <Button
            key={key}
            variant={selectedLevel === key ? "default" : "outline"}
            className="justify-start h-auto p-3"
            onClick={() => onLevelChange(key)}
          >
            <div className="text-left">
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground mt-1">{description}</div>
              <div className="text-xs text-muted-foreground">{details}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}

interface Lv1OptionsPanelProps {
  totalQuestions: number;
  allowDualType: boolean;
  onTotalQuestionsChange: (value: number) => void;
  onAllowDualTypeChange: (value: boolean) => void;
}

function Lv1OptionsPanel({
  totalQuestions,
  allowDualType,
  onTotalQuestionsChange,
  onAllowDualTypeChange,
}: Lv1OptionsPanelProps) {
  const questionOptions = [5, 10, 15];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">문제 수</h4>
        <div className="flex gap-2">
          {questionOptions.map((count) => (
            <Button
              key={count}
              variant={totalQuestions === count ? "default" : "outline"}
              size="sm"
              onClick={() => onTotalQuestionsChange(count)}
            >
              {count}문제
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">듀얼 타입 허용</h4>
        <div className="flex gap-2">
          <Button
            variant={allowDualType ? "default" : "outline"}
            size="sm"
            onClick={() => onAllowDualTypeChange(true)}
          >
            허용
          </Button>
          <Button
            variant={!allowDualType ? "default" : "outline"}
            size="sm"
            onClick={() => onAllowDualTypeChange(false)}
          >
            단일 타입만
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Lv2OptionsPanelProps {
  generationSelection:
    | {
        type: "single";
        generation: number;
        includeSubGenerations: boolean;
      }
    | {
        type: "range";
        minGeneration: number;
        maxGeneration: number;
      }
    | undefined;
  onGenerationSingle: (generation: number, includeSubGenerations: boolean) => void;
  onGenerationRange: (minGen: number, maxGen: number) => void;
}

interface Lv3OptionsPanelProps {
  generationSelection:
    | {
        type: "single";
        generation: number;
        includeSubGenerations: boolean;
      }
    | {
        type: "range";
        minGeneration: number;
        maxGeneration: number;
      }
    | undefined;
  onGenerationSingle: (generation: number, includeSubGenerations: boolean) => void;
  onGenerationRange: (minGen: number, maxGen: number) => void;
}

function Lv2OptionsPanel({
  generationSelection,
  onGenerationSingle,
  onGenerationRange,
}: Lv2OptionsPanelProps) {
  const [selectionType, setSelectionType] = useState<"single" | "range">("single");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">세대 범위 선택</h4>
        <div className="flex gap-2">
          <Button
            variant={selectionType === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionType("single")}
          >
            단일 세대
          </Button>
          <Button
            variant={selectionType === "range" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionType("range")}
          >
            세대 범위
          </Button>
        </div>
      </div>

      {selectionType === "single" ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">세대 선택</h4>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
              <Button
                key={gen}
                variant={
                  generationSelection?.type === "single" && generationSelection.generation === gen
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  onGenerationSingle(
                    gen,
                    generationSelection?.type === "single"
                      ? generationSelection.includeSubGenerations
                      : false
                  )
                }
              >
                {gen}세대
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeSubGenerations"
              checked={
                generationSelection?.type === "single"
                  ? generationSelection.includeSubGenerations
                  : false
              }
              onChange={(e) =>
                onGenerationSingle(
                  generationSelection?.type === "single" ? generationSelection.generation : 1,
                  e.target.checked
                )
              }
            />
            <label htmlFor="includeSubGenerations" className="text-xs">
              하위 세대 포켓몬 추가
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">세대 범위</h4>
          <div className="flex items-center gap-2">
            <select
              className="px-2 py-1 text-sm border rounded"
              value={generationSelection?.type === "range" ? generationSelection.minGeneration : 1}
              onChange={(e) =>
                onGenerationRange(
                  parseInt(e.target.value),
                  generationSelection?.type === "range" ? generationSelection.maxGeneration : 9
                )
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
                <option key={gen} value={gen}>
                  {gen}세대
                </option>
              ))}
            </select>
            <span className="text-sm">부터</span>
            <select
              className="px-2 py-1 text-sm border rounded"
              value={generationSelection?.type === "range" ? generationSelection.maxGeneration : 9}
              onChange={(e) =>
                onGenerationRange(
                  generationSelection?.type === "range" ? generationSelection.minGeneration : 1,
                  parseInt(e.target.value)
                )
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
                <option key={gen} value={gen}>
                  {gen}세대
                </option>
              ))}
            </select>
            <span className="text-sm">까지</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Lv3OptionsPanel({
  generationSelection,
  onGenerationSingle,
  onGenerationRange,
}: Lv3OptionsPanelProps) {
  const [selectionType, setSelectionType] = useState<"single" | "range">("single");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">세대 범위 선택</h4>
        <div className="flex gap-2">
          <Button
            variant={selectionType === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionType("single")}
          >
            단일 세대
          </Button>
          <Button
            variant={selectionType === "range" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionType("range")}
          >
            세대 범위
          </Button>
        </div>
      </div>

      {selectionType === "single" ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">세대 선택</h4>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
              <Button
                key={gen}
                variant={
                  generationSelection?.type === "single" && generationSelection.generation === gen
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  onGenerationSingle(
                    gen,
                    generationSelection?.type === "single"
                      ? generationSelection.includeSubGenerations
                      : false
                  )
                }
              >
                {gen}세대
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeSubGenerationsLv3"
              checked={
                generationSelection?.type === "single"
                  ? generationSelection.includeSubGenerations
                  : false
              }
              onChange={(e) =>
                onGenerationSingle(
                  generationSelection?.type === "single" ? generationSelection.generation : 1,
                  e.target.checked
                )
              }
            />
            <label htmlFor="includeSubGenerationsLv3" className="text-xs">
              하위 세대 포켓몬 추가
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">세대 범위</h4>
          <div className="flex items-center gap-2">
            <select
              className="px-2 py-1 text-sm border rounded"
              value={generationSelection?.type === "range" ? generationSelection.minGeneration : 1}
              onChange={(e) =>
                onGenerationRange(
                  parseInt(e.target.value),
                  generationSelection?.type === "range" ? generationSelection.maxGeneration : 9
                )
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
                <option key={gen} value={gen}>
                  {gen}세대
                </option>
              ))}
            </select>
            <span className="text-sm">부터</span>
            <select
              className="px-2 py-1 text-sm border rounded"
              value={generationSelection?.type === "range" ? generationSelection.maxGeneration : 9}
              onChange={(e) =>
                onGenerationRange(
                  generationSelection?.type === "range" ? generationSelection.minGeneration : 1,
                  parseInt(e.target.value)
                )
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
                <option key={gen} value={gen}>
                  {gen}세대
                </option>
              ))}
            </select>
            <span className="text-sm">까지</span>
          </div>
        </div>
      )}
    </div>
  );
}

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

        <QuizLevelSelector
          selectedLevel={state.level}
          onLevelChange={actions.setLevel}
          hideForTypeMode={state.mode === "type"}
        />

        {((state.level && state.mode !== "type") || state.mode === "type") && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3">퀴즈 옵션</h3>
            {state.mode === "type" ? (
              // 포켓몬 속성 맞추기는 난이도 없이 바로 옵션 표시
              <Lv2OptionsPanel
                generationSelection={getLv2Options().generationSelection}
                onGenerationSingle={updateGenerationSingle}
                onGenerationRange={updateGenerationRange}
              />
            ) : state.level === 1 ? (
              <Lv1OptionsPanel
                totalQuestions={getLv1Options().totalQuestions}
                allowDualType={getLv1Options().allowDualType}
                onTotalQuestionsChange={updateTotalQuestions}
                onAllowDualTypeChange={updateAllowDualType}
              />
            ) : state.level === 2 ? (
              <Lv2OptionsPanel
                generationSelection={getLv2Options().generationSelection}
                onGenerationSingle={updateGenerationSingle}
                onGenerationRange={updateGenerationRange}
              />
            ) : (
              <Lv3OptionsPanel
                generationSelection={getLv3Options().generationSelection}
                onGenerationSingle={updateGenerationSingle}
                onGenerationRange={updateGenerationRange}
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
