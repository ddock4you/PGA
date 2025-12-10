import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GenerationRow } from "./GenerationRow";
import { GENERATION_GAME_MAPPING } from "../constants/generationData";
import type { GameVersion } from "../types/generationTypes";

interface GameGenerationModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (generationId: string, version: GameVersion) => void;
}

export function GameGenerationModal({ open, onClose, onSelect }: GameGenerationModalProps) {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>게임/세대 선택</DialogTitle>
          <DialogDescription>
            플레이 중인 게임을 선택하세요. 세대가 자동으로 설정됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {GENERATION_GAME_MAPPING.map((generation) => (
            <GenerationRow
              key={generation.id}
              generation={generation}
              onGameSelect={(version) => onSelect(generation.id, version)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
