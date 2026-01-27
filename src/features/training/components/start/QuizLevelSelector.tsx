import { Button } from "@/components/ui/button";
import type { QuizLevel } from "../../contexts/types";

interface QuizLevelSelectorProps {
  selectedLevel: QuizLevel | null;
  onLevelChange: (level: QuizLevel) => void;
  hide?: boolean;
}

export function QuizLevelSelector({ selectedLevel, onLevelChange, hide = false }: QuizLevelSelectorProps) {
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

  if (hide) return null;

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
