import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type QuizChoice = {
  id: string;
  label: string;
  type?: string;
  multiplier?: number;
};

type SelectionMode = "single" | "multiple";
type ChoiceGridAppearance = "answer" | "tile";

type QuizChoiceGridProps = {
  choices: QuizChoice[];
  selectionMode: SelectionMode;
  selectedIds: string[];
  correctIds: string[];
  reveal: boolean;
  onSelect: (choiceId: string) => void;
  disabled?: boolean;
  maxSelections?: number;
  appearance?: ChoiceGridAppearance;
  gridClassName?: string;
  showTypeBadge?: boolean;
  showTypeOnResult?: boolean;
};

const getMultiplierText = (multiplier?: number) => {
  if (multiplier === undefined) return "";
  if (multiplier >= 2) return "효과가 굉장했다!";
  if (multiplier === 0) return "효과가 없었다...";
  if (multiplier <= 0.5) return "효과가 별로였다...";
  return "";
};

export function QuizChoiceGrid({
  choices,
  selectionMode,
  selectedIds,
  correctIds,
  reveal,
  onSelect,
  disabled = false,
  maxSelections,
  appearance = "answer",
  gridClassName = "grid grid-cols-1 md:grid-cols-2 gap-3",
  showTypeBadge = true,
  showTypeOnResult = true,
}: QuizChoiceGridProps) {
  const selectedSet = new Set(selectedIds);
  const correctSet = new Set(correctIds);

  const shouldShowType = () => {
    if (showTypeBadge) return true;
    if (showTypeOnResult && reveal) return true;
    return false;
  };

  const canSelectMore = () => {
    if (selectionMode !== "multiple") return true;
    if (maxSelections === undefined) return true;
    return selectedIds.length < maxSelections;
  };

  const getButtonVariant = (choiceId: string) => {
    const isSelected = selectedSet.has(choiceId);
    const isCorrect = correctSet.has(choiceId);

    if (!reveal) {
      return isSelected ? "secondary" : "outline";
    }

    if (isCorrect) return "default";
    if (isSelected && !isCorrect) return "destructive";
    return "outline";
  };

  const getButtonClassName = (choiceId: string) => {
    const isSelected = selectedSet.has(choiceId);
    const isCorrect = correctSet.has(choiceId);
    const isIncorrect = reveal && isSelected && !isCorrect;

    if (appearance === "tile") {
      return [
        "h-16 text-base font-medium",
        isCorrect ? "bg-green-600 hover:bg-green-700 text-white" : "",
        isIncorrect ? "bg-red-600 hover:bg-red-700 text-white" : "",
        !reveal && isSelected ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "",
      ]
        .filter(Boolean)
        .join(" ");
    }

    return "h-auto min-h-[60px] p-3 text-left justify-start whitespace-normal";
  };

  const showType = shouldShowType();

  return (
    <div className={gridClassName}>
      {choices.map((choice) => {
        const isSelected = selectedSet.has(choice.id);
        const isCorrect = correctSet.has(choice.id);
        const showMultiplier = reveal && choice.multiplier !== undefined;
        const multiplierText = getMultiplierText(choice.multiplier);

        const isChoiceDisabled =
          disabled || reveal || (selectionMode === "multiple" && !isSelected && !canSelectMore());

        return (
          <Button
            key={choice.id}
            variant={getButtonVariant(choice.id)}
            size={appearance === "tile" ? "lg" : undefined}
            onClick={() => onSelect(choice.id)}
            disabled={isChoiceDisabled}
            className={getButtonClassName(choice.id)}
          >
            {appearance === "tile" ? (
              <span>{choice.label}</span>
            ) : (
              <div className="flex flex-col w-full gap-1">
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium flex-1">{choice.label}</span>

                  {showType && choice.type ? (
                    <Badge variant="secondary" className="capitalize flex-shrink-0">
                      {choice.type}
                    </Badge>
                  ) : null}

                  {reveal && isCorrect ? <span className="text-xs font-bold ml-1">O</span> : null}
                  {reveal && isSelected && !isCorrect ? (
                    <span className="text-xs font-bold ml-1">X</span>
                  ) : null}
                </div>

                {showMultiplier ? (
                  <div className="text-xs opacity-90">
                    {multiplierText} (x{choice.multiplier})
                  </div>
                ) : null}
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
}
