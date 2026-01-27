"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuizOptions } from "../../contexts/types";

type GenerationSelection = QuizOptions["generationSelection"];

interface GenerationOptionsPanelProps {
  generationSelection: GenerationSelection;
  onGenerationSingle: (generation: number, includeSubGenerations: boolean) => void;
  onGenerationRange: (minGen: number, maxGen: number) => void;
  includeSubGenerationsInputId: string;
}

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function GenerationOptionsPanel({
  generationSelection,
  onGenerationSingle,
  onGenerationRange,
  includeSubGenerationsInputId,
}: GenerationOptionsPanelProps) {
  const [selectionType, setSelectionType] = useState<"single" | "range">(
    generationSelection?.type ?? "single"
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">세대 범위 선택</h4>
        <div className="flex gap-2">
          <Button
            variant={selectionType === "single" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionType("single")}
          >
            단일 세대
          </Button>
          <Button
            variant={selectionType === "range" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectionType("range")}
          >
            세대 범위
          </Button>
        </div>
      </div>

      {selectionType === "single" ? (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">세대 선택</h4>
          <div className="grid grid-cols-4 gap-2">
            {GENERATIONS.map((gen) => (
              <Button
                key={gen}
                variant={
                  generationSelection?.type === "single" && generationSelection.generation === gen
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() =>
                  onGenerationSingle(
                    gen,
                    generationSelection?.type === "single"
                      ? generationSelection.includeSubGenerations
                      : false
                  )
                }
              >
                {gen}세대
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={includeSubGenerationsInputId}
              checked={
                generationSelection?.type === "single" ? generationSelection.includeSubGenerations : false
              }
              onChange={(e) =>
                onGenerationSingle(
                  generationSelection?.type === "single" ? generationSelection.generation : 1,
                  e.target.checked
                )
              }
            />
            <label htmlFor={includeSubGenerationsInputId} className="text-xs">
              하위 세대 포켓몬 추가
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">세대 범위</h4>
          <div className="flex items-center gap-2">
            <select
              className="px-2 py-1 text-sm border rounded"
              value={generationSelection?.type === "range" ? generationSelection.minGeneration : 1}
              onChange={(e) =>
                onGenerationRange(
                  parseInt(e.target.value, 10),
                  generationSelection?.type === "range" ? generationSelection.maxGeneration : 9
                )
              }
            >
              {GENERATIONS.map((gen) => (
                <option key={gen} value={gen}>
                  {gen}세대
                </option>
              ))}
            </select>
            <span className="text-sm">부터</span>
            <select
              className="px-2 py-1 text-sm border rounded"
              value={generationSelection?.type === "range" ? generationSelection.maxGeneration : 9}
              onChange={(e) =>
                onGenerationRange(
                  generationSelection?.type === "range" ? generationSelection.minGeneration : 1,
                  parseInt(e.target.value, 10)
                )
              }
            >
              {GENERATIONS.map((gen) => (
                <option key={gen} value={gen}>
                  {gen}세대
                </option>
              ))}
            </select>
            <span className="text-sm">까지</span>
          </div>
        </div>
      )}
    </div>
  );
}
