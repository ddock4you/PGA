"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameGenerationModal, getGenerationLabel } from "@/features/generation";
import type { GameVersion } from "@/features/generation";
import type { DexGenerationSelectorProps } from "../types/ui";

export function DexGenerationSelector({
  generationId,
  selectedGameVersion,
  onGenerationChange,
}: DexGenerationSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (selectedGenId: string, gameVersion: GameVersion) => {
    onGenerationChange(selectedGenId, gameVersion);
    setIsModalOpen(false);
  };

  const getDisplayText = () => {
    if (selectedGameVersion) {
      const generationName = getGenerationLabel(generationId);
      return `${selectedGameVersion.name} (${generationName})`;
    }
    return getGenerationLabel(generationId);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-9 px-3 text-xs"
      >
        {getDisplayText()}
      </Button>

      <GameGenerationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
