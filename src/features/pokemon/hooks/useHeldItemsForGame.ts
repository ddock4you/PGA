"use client";

import { useMemo } from "react";
import { GENERATION_GAME_MAPPING } from "@/features/generation/constants/generationData";
import type { CsvItem } from "@/types/csvTypes";
import type { PokeApiPokemon } from "@/features/pokemon/types/pokeApiTypes";

export interface HeldItemDisplayRow {
  itemName: string;
  koreanItemName: string;
  rarity: number;
  versionName: string;
  showVersionBadge: boolean;
}

export function useHeldItemsForGame({
  heldItems,
  selectedGameId,
  itemsData,
}: {
  heldItems: PokeApiPokemon["held_items"];
  selectedGameId?: string;
  itemsData: CsvItem[];
}): HeldItemDisplayRow[] {
  return useMemo(() => {
    if (!heldItems.length) return [];

    const rows = heldItems
      .map((item) => {
        let versionDetail = null as (typeof item)["version_details"][number] | null;

        if (selectedGameId) {
          versionDetail = item.version_details.find((detail) => detail.version.name === selectedGameId) ?? null;
        }

        if (!versionDetail && selectedGameId) {
          const selectedGeneration = GENERATION_GAME_MAPPING.find((gen) =>
            gen.versions.some((v) => v.id === selectedGameId)
          );
          if (selectedGeneration) {
            const generationVersionNames = selectedGeneration.versions.map((v) => v.id);
            versionDetail =
              item.version_details.find((detail) => generationVersionNames.includes(detail.version.name)) ??
              null;
          }
        }

        if (!versionDetail) {
          versionDetail = item.version_details[0] ?? null;
        }

        const rarity = versionDetail ? versionDetail.rarity : 0;
        const versionName = versionDetail ? versionDetail.version.name : "";

        const itemIdentifier = item.item.name;
        const itemData = itemsData.find((i) => i.identifier === itemIdentifier);
        const koreanItemName =
          itemData?.identifier.replace(/-/g, " ") || item.item.name.replace(/-/g, " ");

        return {
          itemName: item.item.name,
          koreanItemName,
          rarity,
          versionName,
          showVersionBadge: Boolean(versionName && selectedGameId && versionName !== selectedGameId),
        } satisfies HeldItemDisplayRow;
      })
      .filter((row) => row.rarity > 0)
      .sort((a, b) => b.rarity - a.rarity);

    return rows;
  }, [heldItems, selectedGameId, itemsData]);
}
