import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { GameGenerationModal } from "./GameGenerationModal";
import { GENERATION_GAME_MAPPING } from "../constants/generationData";
import type { GameVersion } from "../types/generationTypes";

interface GameGenerationSelectorProps {
  variant?: "default" | "compact";
  showGenerationOnly?: boolean; // 세대만 표시할지 여부
  onGenerationSelect?: (generationId: string, version?: GameVersion) => void;
}

export function GameGenerationSelector({
  variant = "default",
  showGenerationOnly = false,
  onGenerationSelect,
}: GameGenerationSelectorProps) {
  const { state } = usePreferences();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHasMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const displayText = (() => {
    if (!hasMounted) {
      return "게임/세대 선택";
    }

    if (showGenerationOnly) {
      return state.selectedGenerationId ? `${state.selectedGenerationId}세대` : "세대 선택";
    }

    if (state.selectedGameId) {
      for (const generation of GENERATION_GAME_MAPPING) {
        const game = generation.versions.find((v) => v.id === state.selectedGameId);
        if (game) {
          return `${game.name} (${generation.name})`;
        }
      }
    }

    return "게임/세대 선택";
  })();

  const handleSelect = (generationId: string, version: GameVersion) => {
    onGenerationSelect?.(generationId, version);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size={variant === "compact" ? "sm" : "default"}
        onClick={() => setIsModalOpen(true)}
        className="justify-start font-normal"
      >
        {displayText}
      </Button>

      <GameGenerationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
