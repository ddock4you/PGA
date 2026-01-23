"use client";

import { useMemo } from "react";
import type { CsvMachine, CsvVersionGroup } from "@/types/csvTypes";
import type { PokeApiPokemon } from "@/features/pokemon/api/pokemonApi";
import type { MoveRow, MoveMeta } from "@/features/pokemon/components/detail/moves/types/moveTypes";
import { parseIdFromUrl } from "@/features/pokemon/components/detail/moves/utils/moveUtils";

export function useTmHmMoves({
  moves,
  machinesData,
  versionGroupsData,
  moveMetadata,
  targetVersionGroup,
}: {
  moves: PokeApiPokemon["moves"];
  machinesData: CsvMachine[];
  versionGroupsData: CsvVersionGroup[];
  moveMetadata: { byId: Record<number, MoveMeta>; byName: Record<string, MoveMeta> };
  targetVersionGroup: string;
}) {
  return useMemo(() => {
    if (!machinesData.length || !versionGroupsData.length) return [];

    const targetVersionGroupData = versionGroupsData.find(
      (vg) => vg.identifier === targetVersionGroup
    );
    if (!targetVersionGroupData) return [];

    const learnableMachineMoveIds = new Set<number>();
    for (const move of moves) {
      const machineDetail = move.version_group_details.find(
        (versionDetail) =>
          versionDetail.move_learn_method.name === "machine" &&
          versionDetail.version_group.name === targetVersionGroup
      );
      if (machineDetail) {
        const parsedId = parseIdFromUrl(move.move.url);
        if (parsedId !== undefined) {
          learnableMachineMoveIds.add(parsedId);
        }
      }
    }

    return machinesData
      .filter(
        (machine) =>
          machine.version_group_id === targetVersionGroupData.id &&
          learnableMachineMoveIds.has(machine.move_id)
      )
      .map((machine) => {
        const meta = moveMetadata.byId[machine.move_id];
        const isHm = machine.item_id >= 397 && machine.item_id <= 404;
        const displayNumber = isHm ? machine.machine_number - 100 : machine.machine_number;
        return {
          name: meta?.name ?? `move-${machine.move_id}`,
          type: meta?.type ?? "-",
          category: meta?.category ?? "-",
          power: meta?.power ?? null,
          accuracy: meta?.accuracy ?? null,
          pp: meta?.pp ?? 0,
          tmNumber: displayNumber,
          isHm,
        };
      })
      .sort((a, b) => {
        if (a.isHm && !b.isHm) return -1;
        if (!a.isHm && b.isHm) return 1;
        return (a.tmNumber ?? 0) - (b.tmNumber ?? 0);
      });
  }, [machinesData, versionGroupsData, moveMetadata, moves, targetVersionGroup]);
}
