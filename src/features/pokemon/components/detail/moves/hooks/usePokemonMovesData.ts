import { useCallback, useMemo } from "react";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { GENERATION_VERSION_GROUP_MAP } from "@/features/generation/constants/generationData";
import type { PokeApiPokemon } from "@/features/pokemon/api/pokemonApi";
import { useDexCsvData } from "@/features/dex/hooks/useDexCsvData";
import { getDamageClassName, getTypeName } from "@/features/dex/utils/dataTransforms";
import { usePreviousStagePokemons } from "@/features/pokemon/hooks/usePreviousStagePokemons";
import { SPECIAL_METHODS } from "../../moveConstants";
import type { MoveRow, MoveMeta, PokemonMovesSectionProps } from "../types/moveTypes";
import { parseIdFromUrl, getGenerationFromVersionGroupUrl } from "../utils/moveUtils";

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
    state.selectedVersionGroup ?? GENERATION_VERSION_GROUP_MAP[selectedGenerationId] ?? "red-blue";

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

  const levelUpRows = useMemo(() => {
    const rows: MoveRow[] = [];
    for (const move of moves) {
      const detail = move.version_group_details.find(
        (versionDetail) =>
          versionDetail.move_learn_method.name === "level-up" &&
          versionDetail.version_group.name === targetVersionGroup
      );
      if (!detail) continue;
      const row = buildRowFromDetail(move, detail);
      rows.push({ ...row, level: detail.level_learned_at });
    }
    rows.sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
    return rows;
  }, [moves, buildRowFromDetail, targetVersionGroup]);

  const tmRows = useMemo(() => {
    if (!machinesData || !versionGroupsData) return [];

    // targetVersionGroup에 해당하는 version_group_id 찾기
    const targetVersionGroupData = versionGroupsData.find(
      (vg) => vg.identifier === targetVersionGroup
    );
    if (!targetVersionGroupData) return [];

    // 해당 포켓몬이 machine 방법으로 배울 수 있는 기술들의 move_id를 추출
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
        // TM/HM 구분: item_id가 397-404는 HM, 나머지는 TM
        const isHm = machine.item_id >= 397 && machine.item_id <= 404;
        // HM일 때는 machine_number에서 100을 빼서 번호 표시 (예: 101 -> 1)
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
        // HM을 먼저 정렬, 그 다음 TM을 번호순으로 정렬
        if (a.isHm && !b.isHm) return -1; // a(HM)가 먼저
        if (!a.isHm && b.isHm) return 1; // b(HM)가 먼저
        // 같은 타입(HM 또는 TM) 내에서는 번호순 정렬
        return (a.tmNumber ?? 0) - (b.tmNumber ?? 0);
      });
  }, [machinesData, versionGroupsData, moveMetadata, moves, targetVersionGroup]);

  const tutorMoves = useMemo(() => {
    // Tutor moves: 특정 버전 그룹에 존재하는 경우만 표시 (3세대부터 도입)
    if (selectedGenerationNumber < 3) return [];

    const rows = moves
      .flatMap((move) =>
        move.version_group_details
          .filter(
            (detail) =>
              detail.move_learn_method.name === "tutor" &&
              detail.version_group.name === targetVersionGroup
          )
          .map((detail) => buildRowFromDetail(move, detail))
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    return rows;
  }, [moves, buildRowFromDetail, targetVersionGroup, selectedGenerationNumber]);

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
    const rows: MoveRow[] = [];
    moves.forEach((move) => {
      const generations = move.version_group_details
        .map((detail) => getGenerationFromVersionGroupUrl(detail.version_group.url))
        .filter((gen): gen is number => gen !== undefined);

      if (generations.length === 0) return;

      const hasOlder = generations.some((gen) => gen < selectedGenerationNumber);
      const hasCurrentOrNewer = generations.some((gen) => gen >= selectedGenerationNumber);

      if (!(hasOlder && !hasCurrentOrNewer)) return;

      const uniqueGroups = Array.from(
        new Set(move.version_group_details.map((detail) => detail.version_group.name))
      );

      const row = { ...buildRowFromDetail(move, move.version_group_details[0]) };
      row.versionGroups = uniqueGroups.join(", ");
      row.method = move.version_group_details[0]?.move_learn_method.name ?? "-";
      row.generationLabel = `≤ ${Math.min(...generations)}세대`;
      rows.push(row);
    });
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }, [moves, buildRowFromDetail, selectedGenerationNumber]);

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
