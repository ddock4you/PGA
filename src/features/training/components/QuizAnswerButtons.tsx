import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QuizChoice {
  id: string;
  label: string;
  isCorrect?: boolean;
  isSelected?: boolean;
}

interface QuizAnswerButtonsProps {
  choices: QuizChoice[];
  selectedChoice: string | null;
  isCorrect: boolean | null;
  onChoiceSelect: (choiceId: string) => void;
  disabled?: boolean;
}

export function QuizAnswerButtons({
  choices,
  selectedChoice,
  isCorrect,
  onChoiceSelect,
  disabled = false,
}: QuizAnswerButtonsProps) {
  const getButtonVariant = (choice: QuizChoice) => {
    if (!selectedChoice || !isCorrect) {
      return "outline";
    }

    if (choice.isCorrect) {
      return "default";
    }

    if (choice.isSelected) {
      return "destructive";
    }

    return "outline";
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {choices.map((choice) => (
        <Button
          key={choice.id}
          variant={getButtonVariant(choice)}
          onClick={() => onChoiceSelect(choice.id)}
          disabled={disabled || selectedChoice !== null}
          className="h-auto p-3 text-left justify-start"
        >
          <div className="flex items-center gap-2 w-full">
            <Badge variant="secondary" className="capitalize flex-shrink-0">
              {choice.label}
            </Badge>
            {choice.isCorrect && selectedChoice && (
              <span className="text-xs text-green-600 ml-auto">✓</span>
            )}
            {choice.isSelected && !choice.isCorrect && (
              <span className="text-xs text-red-600 ml-auto">✗</span>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
}
