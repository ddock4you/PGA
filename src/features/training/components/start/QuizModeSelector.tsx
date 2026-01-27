import { Button } from "@/components/ui/button";
import type { QuizMode } from "../../contexts/types";

interface QuizModeSelectorProps {
  selectedMode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
}

export function QuizModeSelector({ selectedMode, onModeChange }: QuizModeSelectorProps) {
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
