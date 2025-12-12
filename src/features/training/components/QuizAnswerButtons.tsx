import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TYPE_COLORS } from "@/features/dex/utils/dataTransforms";
import type { MoveChoice } from "../store/types";

interface QuizChoice {
  id: string;
  label: string;
<<<<<<< HEAD
  type?: string; // 타입 배지용
  isCorrect?: boolean;
  isSelected?: boolean;
  multiplier?: number; // 결과 표시용 배율
=======
  isCorrect: boolean;
  isSelected: boolean;
>>>>>>> 0fcf191 (feat: Add Lv.3 difficulty level for advanced move selection training)
}

interface QuizAnswerButtonsProps {
  choices: QuizChoice[] | MoveChoice[];
  selectedChoice: string | null;
  isCorrect: boolean | null;
  onChoiceSelect: (choiceId: string) => void;
  disabled?: boolean;
  showTypeBadge?: boolean; // 항상 보여줄지 여부
  showTypeOnResult?: boolean; // 결과 확인 시 타입을 보여줄지 여부
}

export function QuizAnswerButtons({
  choices,
  selectedChoice,
  isCorrect,
  onChoiceSelect,
  disabled = false,
  showTypeBadge = true,
  showTypeOnResult = true,
}: QuizAnswerButtonsProps) {
<<<<<<< HEAD
  const getButtonVariant = (choice: QuizChoice) => {
    if (!selectedChoice || isCorrect === null) {
      return "outline";
    }

    if (choice.isCorrect) {
      return "default"; // 정답: 초록/기본색
    }

    if (choice.isSelected) {
      return "destructive"; // 오답: 빨강
=======
  const getButtonVariant = (isCorrect: boolean, isSelected: boolean) => {
    if (!selectedChoice || !isCorrect) {
      return "outline";
    }

    if (isCorrect) {
      return "default";
    }

    if (isSelected) {
      return "destructive";
>>>>>>> 0fcf191 (feat: Add Lv.3 difficulty level for advanced move selection training)
    }

    return "outline";
  };

<<<<<<< HEAD
  const shouldShowType = (choice: QuizChoice) => {
    // 1. 기본적으로 보여주는 모드(Lv1, Lv2)면 true
    if (showTypeBadge) return true;
    // 2. 결과 화면이고, 결과 시 보여주기(Lv3)가 켜져있고, 선택된 상태(정답 공개)면 true
    if (showTypeOnResult && selectedChoice !== null) return true;
    return false;
  };

  const getMultiplierText = (multiplier?: number) => {
    if (multiplier === undefined) return "";
    if (multiplier >= 2) return "효과가 굉장했다!";
    if (multiplier === 0) return "효과가 없었다...";
    if (multiplier <= 0.5) return "효과가 별로였다...";
    return "";
=======
  // MoveChoice인지 확인하는 헬퍼 함수
  const isMoveChoice = (choice: any): choice is MoveChoice => {
    return "typeName" in choice;
  };

  const getChoiceCorrect = (choice: QuizChoice | MoveChoice): boolean => {
    if (isMoveChoice(choice)) {
      return choice.isCorrect ?? false;
    }
    return choice.isCorrect;
  };

  const getChoiceSelected = (choice: QuizChoice | MoveChoice): boolean => {
    if (isMoveChoice(choice)) {
      return choice.isSelected || choice.id === selectedChoice;
    }
    return choice.isSelected;
>>>>>>> 0fcf191 (feat: Add Lv.3 difficulty level for advanced move selection training)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {choices.map((choice) => {
<<<<<<< HEAD
        const showType = shouldShowType(choice);
        const isAnswerRevealed = selectedChoice !== null;
=======
        const choiceIsCorrect = getChoiceCorrect(choice);
        const choiceIsSelected = getChoiceSelected(choice);
>>>>>>> 0fcf191 (feat: Add Lv.3 difficulty level for advanced move selection training)

        return (
          <Button
            key={choice.id}
<<<<<<< HEAD
            variant={getButtonVariant(choice)}
            onClick={() => onChoiceSelect(choice.id)}
            disabled={disabled || selectedChoice !== null}
            className="h-auto min-h-[60px] p-3 text-left justify-start whitespace-normal"
          >
            <div className="flex flex-col w-full gap-1">
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium flex-1">{choice.label}</span>

                {showType && choice.type && (
                  <Badge variant="secondary" className="capitalize flex-shrink-0">
                    {choice.type}
                  </Badge>
                )}

                {choice.isCorrect && selectedChoice && (
                  <span className="text-xs font-bold ml-1">O</span>
                )}
                {choice.isSelected && !choice.isCorrect && (
                  <span className="text-xs font-bold ml-1">X</span>
                )}
              </div>

              {/* 결과 텍스트 (정답 공개 시) */}
              {isAnswerRevealed && choice.multiplier !== undefined && (
                <div className="text-xs opacity-90">
                  {getMultiplierText(choice.multiplier)} (x{choice.multiplier})
                </div>
              )}
            </div>
=======
            variant={getButtonVariant(choiceIsCorrect, choiceIsSelected)}
            onClick={() => onChoiceSelect(choice.id)}
            disabled={disabled || selectedChoice !== null}
            className="h-auto p-3 text-left justify-start"
          >
            {isMoveChoice(choice) ? (
              // MoveChoice 렌더링
              <div className="flex items-center gap-2 w-full">
                <span className="flex-1 text-left">{choice.name}</span>
                <Badge
                  className={`capitalize flex-shrink-0 text-white ${
                    TYPE_COLORS[choice.typeName as keyof typeof TYPE_COLORS] || "bg-gray-500"
                  }`}
                >
                  {choice.typeName}
                </Badge>
                {choiceIsCorrect && selectedChoice && (
                  <span className="text-xs text-green-600 ml-2">✓</span>
                )}
                {choiceIsSelected && !choiceIsCorrect && (
                  <span className="text-xs text-red-600 ml-2">✗</span>
                )}
              </div>
            ) : (
              // 기존 QuizChoice 렌더링
              <div className="flex items-center gap-2 w-full">
                <Badge variant="secondary" className="capitalize flex-shrink-0">
                  {choice.label}
                </Badge>
                {choiceIsCorrect && selectedChoice && (
                  <span className="text-xs text-green-600 ml-auto">✓</span>
                )}
                {choiceIsSelected && !choiceIsCorrect && (
                  <span className="text-xs text-red-600 ml-auto">✗</span>
                )}
              </div>
            )}
>>>>>>> 0fcf191 (feat: Add Lv.3 difficulty level for advanced move selection training)
          </Button>
        );
      })}
    </div>
  );
}
