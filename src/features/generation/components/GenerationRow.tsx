import { Button } from "@/components/ui/button";
import type { GenerationInfo } from "../types/generationTypes";

interface GenerationRowProps {
  generation: GenerationInfo;
  onGameSelect: (gameId: string) => void;
}

export function GenerationRow({ generation, onGameSelect }: GenerationRowProps) {
  return (
    <div className="space-y-2">
      {/* 세대 제목 */}
      <h3 className="font-semibold text-sm">{generation.name}</h3>

      {/* 게임 버전 버튼들 */}
      <div className="flex flex-wrap gap-2">
        {generation.versions.map((version) => (
          <Button
            key={version.id}
            variant="secondary"
            size="sm"
            className={`${version.color} text-white hover:opacity-80 transition-opacity`}
            onClick={() => onGameSelect(version.id)}
          >
            {version.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
