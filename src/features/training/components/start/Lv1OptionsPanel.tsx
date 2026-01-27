import { Button } from "@/components/ui/button";

interface Lv1OptionsPanelProps {
  totalQuestions: number;
  allowDualType: boolean;
  onTotalQuestionsChange: (value: number) => void;
  onAllowDualTypeChange: (value: boolean) => void;
}

export function Lv1OptionsPanel({
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
