import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GameGenerationModal } from "@/features/generation/components/GameGenerationModal";

interface DexGenerationSelectorProps {
  generationId: string;
  onGenerationChange: (generationId: string) => void;
}

export function DexGenerationSelector({
  generationId,
  onGenerationChange,
}: DexGenerationSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (selectedGenId: string, _gameId: string) => {
    onGenerationChange(selectedGenId);
    setIsModalOpen(false);
  };

  const getGenerationDisplayName = (genId: string) => {
    const genNames: Record<string, string> = {
      "1": "1세대",
      "2": "2세대",
      "3": "3세대",
      "4": "4세대",
      "5": "5세대",
      "6": "6세대",
      "7": "7세대",
      "8": "8세대",
      "9": "9세대",
    };
    return genNames[genId] || genId;
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        className="h-9 px-3 text-xs"
      >
        {getGenerationDisplayName(generationId)}
      </Button>

      <GameGenerationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
