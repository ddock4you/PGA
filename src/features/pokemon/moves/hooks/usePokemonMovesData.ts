"use client";

import { useCallback, useMemo } from "react";
import { usePreferences } from "@/features/preferences";
import { GENERATION_VERSION_GROUP_MAP } from "@/features/generation";
import type { PokeApiPokemon } from "@/features/pokemon/types/pokeApiTypes";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { getDamageClassName, getTypeName } from "@/utils/dataTransforms";
import { usePreviousStagePokemons } from "@/features/pokemon/hooks/usePreviousStagePokemons";
import { SPECIAL_METHODS } from "@/features/pokemon/moveConstants";
import type {
  MoveMeta,
  MoveRow,
  PokemonMovesSectionProps,
} from "@/features/pokemon/moves/types/moveTypes";
import { parseIdFromUrl } from "@/features/pokemon/moves/utils/moveUtils";
import { useLevelUpMoves } from "@/features/pokemon/moves/hooks/useLevelUpMoves";
import { useTmHmMoves } from "@/features/pokemon/moves/hooks/useTmHmMoves";
import { useTutorMoves } from "@/features/pokemon/moves/hooks/useTutorMoves";

export const usePokemonMovesData = (props: PokemonMovesSectionProps) => {
  const { moves, species, evolutionChain } = props;
  const { state } = usePreferences();
  const {
    movesData,
    machinesData,
    versionGroupsData,
    isLoading: isCsvLoading,
    isError: isCsvError,
  } = useDexCsvData();
  const selectedGenerationId = state.selectedGenerationId || "1";
  const selectedGenerationNumber = Number(selectedGenerationId);
  const targetVersionGroup =
    state.selectedVersionGroup ??
    GENERATION_VERSION_GROUP_MAP[selectedGenerationId] ??
    "red-blue";

  const moveMetadata = useMemo(() => {
    const byName: Record<string, MoveMeta> = {};
    const byId: Record<number, MoveMeta> = {};

    movesData?.forEach((move) => {
      const meta: MoveMeta = {
        name: move.identifier,
        type: getTypeName(move.type_id),
        category: getDamageClassName(move.damage_class_id),
        power: move.power,
        accuracy: move.accuracy,
        pp: move.pp,
      };
      byName[move.identifier] = meta;
      byId[move.id] = meta;
    });

    return { byName, byId };
  }, [movesData]);

  const getMoveMeta = useCallback(
    (move: PokeApiPokemon["moves"][number]) => {
      const metaByName = moveMetadata.byName[move.move.name];
      if (metaByName) return metaByName;
      const parsedId = parseIdFromUrl(move.move.url);
      if (parsedId !== undefined) {
        return moveMetadata.byId[parsedId];
      }
      return undefined;
    },
    [moveMetadata]
  );

  const buildRowFromDetail = useCallback(
    (
      move: PokeApiPokemon["moves"][number],
      detail: PokeApiPokemon["moves"][number]["version_group_details"][number]
    ): MoveRow => {
      const metadata = getMoveMeta(move);
      return {
        name: metadata?.name ?? move.move.name,
        type: metadata?.type ?? "-",
        category: metadata?.category ?? "-",
        power: metadata?.power ?? null,
        accuracy: metadata?.accuracy ?? null,
        pp: metadata?.pp ?? 0,
        versionGroups: detail.version_group.name,
        method: detail.move_learn_method.name,
      };
    },
    [getMoveMeta]
  );

  const levelUpRows = useLevelUpMoves(moves, targetVersionGroup, buildRowFromDetail);

  const tmRows = useTmHmMoves({
    moves,
    machinesData,
    versionGroupsData,
    moveMetadata,
    targetVersionGroup,
  });

  const tutorMoves = useTutorMoves({
    moves,
    buildRowFromDetail,
    targetVersionGroup,
    selectedGenerationNumber,
  });

  const otherMethodRows = useMemo(() => {
    const excluded = new Set(["level-up", "machine", "tutor"]);
    return moves
      .flatMap((move) =>
        move.version_group_details
          .filter(
            (detail) =>
              !excluded.has(detail.move_learn_method.name) &&
              detail.version_group.name === targetVersionGroup
          )
          .map((detail) => buildRowFromDetail(move, detail))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [moves, buildRowFromDetail, targetVersionGroup]);

  const specialMethodRows = useMemo(() => {
    const map = new Map<string, MoveRow[]>();
    for (const move of moves) {
      for (const detail of move.version_group_details) {
        if (detail.version_group.name !== targetVersionGroup) continue;
        const method = detail.move_learn_method.name;
        if (!SPECIAL_METHODS.includes(method)) continue;
        const row = buildRowFromDetail(move, detail);
        const group = map.get(method) ?? [];
        group.push(row);
        map.set(method, group);
      }
    }
    map.forEach((rows) => rows.sort((a, b) => a.name.localeCompare(b.name)));
    return map;
  }, [moves, buildRowFromDetail, targetVersionGroup]);

  const previousGenerationRows = useMemo(() => {
    if (!versionGroupsData) return [];

    const rows: MoveRow[] = [];

    const targetVersionGroupData = versionGroupsData.find(
      (vg) => vg.identifier === targetVersionGroup
    );
    if (!targetVersionGroupData) return [];

    const targetGenerationId = targetVersionGroupData.generation_id;

    moves.forEach((move) => {
      const canLearnInTargetVersion = move.version_group_details.some(
        (detail) => detail.version_group.name === targetVersionGroup
      );

      if (!canLearnInTargetVersion) {
        const allGenerations = move.version_group_details
          .map((detail) => {
            const versionGroupData = versionGroupsData.find(
              (vg) => vg.identifier === detail.version_group.name
            );
            return versionGroupData?.generation_id;
          })
          .filter((gen): gen is number => gen !== undefined);

        if (allGenerations.length === 0) return;

        const maxGeneration = Math.max(...allGenerations);
        const hasNewerGenerations = maxGeneration >= targetGenerationId;

        if (!hasNewerGenerations) {
          const previousVersionDetails = move.version_group_details.filter((detail) => {
            const versionGroupData = versionGroupsData.find(
              (vg) => vg.identifier === detail.version_group.name
            );
            return versionGroupData && versionGroupData.generation_id < targetGenerationId;
          });

          if (previousVersionDetails.length > 0) {
            const uniqueGroups = Array.from(
              new Set(previousVersionDetails.map((detail) => detail.version_group.name))
            );

            const firstPreviousDetail = previousVersionDetails[0];
            const row = { ...buildRowFromDetail(move, firstPreviousDetail) };
            row.versionGroups = uniqueGroups.join(", ");
            row.method = firstPreviousDetail.move_learn_method.name;
            row.generationLabel = `<= ${maxGeneration}세대`;
            rows.push(row);
          }
        }
      }
    });

    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }, [moves, buildRowFromDetail, versionGroupsData, targetVersionGroup]);

  const { stages: previousStages, isLoading: isPreviousStagesLoading } = usePreviousStagePokemons(
    evolutionChain,
    species.name
  );

  const previousStageRows = useMemo(() => {
    const rows: MoveRow[] = [];
    for (const stage of previousStages) {
      if (!stage.pokemon) continue;
      for (const move of stage.pokemon.moves) {
        const detail = move.version_group_details.find(
          (versionDetail) =>
            versionDetail.move_learn_method.name === "level-up" &&
            versionDetail.version_group.name === targetVersionGroup
        );
        if (!detail) continue;
        const row = buildRowFromDetail(move, detail);
        rows.push({
          ...row,
          level: detail.level_learned_at,
          stageName: stage.speciesName,
        });
      }
    }
    rows.sort((a, b) => {
      if (a.stageName && b.stageName && a.stageName !== b.stageName) {
        return a.stageName.localeCompare(b.stageName);
      }
      return (a.level ?? 0) - (b.level ?? 0);
    });
    return rows;
  }, [previousStages, buildRowFromDetail, targetVersionGroup]);

  const showCsvFallback = isCsvLoading || isCsvError;

  return {
    selectedGenerationId,
    targetVersionGroup,
    levelUpRows,
    tmRows,
    tutorMoves,
    otherMethodRows,
    specialMethodRows,
    previousGenerationRows,
    previousStageRows,
    isPreviousStagesLoading,
    showCsvFallback,
  };
};
