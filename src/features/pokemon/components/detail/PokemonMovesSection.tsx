import { useCallback, useMemo, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { GENERATION_VERSION_GROUP_MAP } from "@/features/generation/constants/generationData";
import type {
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  PokeApiEvolutionChain,
} from "../../api/pokemonApi";
import { useDexCsvData } from "@/features/dex/hooks/useDexCsvData";
import {
  getDamageClassName,
  getGenerationIdFromVersionGroup,
  getTypeName,
} from "@/features/dex/utils/dataTransforms";
import { usePreviousStagePokemons } from "@/features/pokemon/hooks/usePreviousStagePokemons";
import { SPECIAL_METHODS, SPECIAL_METHOD_LABELS } from "./moveConstants";

export interface PokemonMovesSectionProps {
  moves: PokeApiPokemon["moves"];
  species: PokeApiPokemonSpecies;
  evolutionChain?: PokeApiEvolutionChain;
}

type MoveMeta = {
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
};

type MoveRow = MoveMeta & {
  level?: number;
  tmNumber?: number;
  versionGroups?: string;
  method?: string;
  stageName?: string;
  generationLabel?: string;
};

const parseIdFromUrl = (url?: string): number | undefined => {
  if (!url) return undefined;
  const parts = url.split("/").filter(Boolean);
  const id = Number(parts.at(-1));
  return Number.isFinite(id) ? id : undefined;
};

const formatStat = (value?: number | null) => (value === null || value === undefined ? "-" : value);

export function PokemonMovesSection(props: PokemonMovesSectionProps) {
  const { moves, species, evolutionChain } = props;
  const { state } = usePreferences();
  const { movesData, machinesData, isLoading: isCsvLoading, isError: isCsvError } = useDexCsvData();
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

  const renderCommonCells = (move: MoveRow) => (
    <>
      <TableCell>
        <Badge variant="secondary" className="capitalize">
          {move.type}
        </Badge>
      </TableCell>
      <TableCell className="capitalize">{move.category}</TableCell>
      <TableCell className="text-right">{formatStat(move.power)}</TableCell>
      <TableCell className="text-right">
        {move.accuracy !== null ? `${move.accuracy}%` : "-"}
      </TableCell>
      <TableCell className="text-right">{formatStat(move.pp)}</TableCell>
    </>
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
    if (!machinesData) return [];
    const generationNum = Number(selectedGenerationId);
    return machinesData
      .filter(
        (machine) => getGenerationIdFromVersionGroup(machine.version_group_id) === generationNum
      )
      .map((machine) => {
        const meta = moveMetadata.byId[machine.move_id];
        return {
          name: meta?.name ?? `move-${machine.move_id}`,
          type: meta?.type ?? "-",
          category: meta?.category ?? "-",
          power: meta?.power ?? null,
          accuracy: meta?.accuracy ?? null,
          pp: meta?.pp ?? 0,
          tmNumber: machine.machine_number,
        };
      })
      .sort((a, b) => (a.tmNumber ?? 0) - (b.tmNumber ?? 0));
  }, [machinesData, moveMetadata, selectedGenerationId]);

  const buildMethodRows = useCallback(
    (methodName: string) =>
      moves
        .flatMap((move) =>
          move.version_group_details
            .filter(
              (detail) =>
                detail.move_learn_method.name === methodName &&
                detail.version_group.name === targetVersionGroup
            )
            .map((detail) => buildRowFromDetail(move, detail))
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [moves, buildRowFromDetail, targetVersionGroup]
  );

  const eggMoves = useMemo(() => buildMethodRows("egg"), [buildMethodRows]);
  const tutorMoves = useMemo(() => buildMethodRows("tutor"), [buildMethodRows]);

  const otherMethodRows = useMemo(() => {
    const excluded = new Set(["level-up", "machine", "egg", "tutor"]);
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

  const getGenerationFromVersionGroupUrl = (url?: string) => {
    const id = parseIdFromUrl(url);
    return id !== undefined ? getGenerationIdFromVersionGroup(id) : undefined;
  };

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

  const buildRowKey = (move: MoveRow, index: number, suffix?: string) =>
    `${move.name}-${move.versionGroups ?? move.method ?? "generic"}-${suffix ?? index}`;

  const renderCollectionTable = ({
    title,
    rows,
    emptyMessage,
    loadingMessage,
    leadingCell,
    leadingHeader,
    extraHeaders = [],
    footer,
  }: {
    title: string;
    rows: MoveRow[];
    emptyMessage: string;
    loadingMessage: string;
    leadingCell?: (row: MoveRow) => ReactNode;
    leadingHeader?: string;
    extraHeaders?: string[];
    footer?: React.ReactNode;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {showCsvFallback ? (
          <p className="text-sm text-muted-foreground">{loadingMessage}</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="max-h-[360px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {leadingCell && (
                    <TableHead className="w-[90px]">{leadingHeader ?? "추가 정보"}</TableHead>
                  )}
                  <TableHead className="w-[180px]">기술명</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead className="text-right">위력</TableHead>
                  <TableHead className="text-right">명중률</TableHead>
                  <TableHead className="text-right">PP</TableHead>
                  {extraHeaders.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((move, index) => (
                  <TableRow key={buildRowKey(move, index)}>
                    {leadingCell && <TableCell>{leadingCell(move)}</TableCell>}
                    <TableCell className="capitalize">{move.name.replace(/-/g, " ")}</TableCell>
                    {renderCommonCells(move)}
                    {extraHeaders.map((header) => (
                      <TableCell
                        key={`${header}-${move.name}-${index}`}
                        className="text-xs text-muted-foreground"
                      >
                        {header === "버전그룹"
                          ? move.versionGroups
                          : header === "습득 방식"
                          ? move.method
                          : header === "세대"
                          ? move.generationLabel
                          : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {footer}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {renderCollectionTable({
        title: `자력기 (Level Up Moves) - ${selectedGenerationId}세대`,
        rows: levelUpRows,
        emptyMessage: "레벨업으로 배우는 기술이 없습니다.",
        loadingMessage: "기술 메타 정보를 준비 중입니다...",
        leadingCell: (move) => <span className="font-medium">{move.level ?? "-"}</span>,
        leadingHeader: "Lv.",
      })}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            기술 머신(TMs/HMs) - {selectedGenerationId}세대
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showCsvFallback ? (
            <p className="text-sm text-muted-foreground">기술 머신 정보를 준비 중입니다...</p>
          ) : tmRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">해당 세대에 TM/HM 기술이 없습니다.</p>
          ) : (
            <div className="max-h-[360px] overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[70px]">TM / HM</TableHead>
                    <TableHead className="w-[180px]">기술명</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>분류</TableHead>
                    <TableHead className="text-right">위력</TableHead>
                    <TableHead className="text-right">명중률</TableHead>
                    <TableHead className="text-right">PP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tmRows.map((move, index) => (
                    <TableRow key={`${move.name}-${move.tmNumber ?? "tm"}-${index}`}>
                      <TableCell className="font-medium">{move.tmNumber ?? "-"}</TableCell>
                      <TableCell className="capitalize">{move.name.replace(/-/g, " ")}</TableCell>
                      {renderCommonCells(move)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {renderCollectionTable({
        title: `교배 기술 - ${targetVersionGroup}`,
        rows: eggMoves,
        emptyMessage: "이 세대에서 교배로 배울 수 있는 기술이 없습니다.",
        loadingMessage: "교배 기술을 정리하는 중입니다...",
        leadingCell: () => <span className="text-xs text-muted-foreground">교배</span>,
        extraHeaders: ["버전그룹", "습득 방식"],
        leadingHeader: "습득",
      })}

      {renderCollectionTable({
        title: `NPC / 튜터 기술 - ${targetVersionGroup}`,
        rows: tutorMoves,
        emptyMessage: "해당 세대 튜터 기술이 없습니다.",
        loadingMessage: "튜터 기술 정보를 불러오는 중입니다...",
        leadingCell: () => <span className="text-xs text-muted-foreground">튜터</span>,
        extraHeaders: ["버전그룹", "습득 방식"],
        leadingHeader: "습득",
      })}

      {renderCollectionTable({
        title: `기타 습득 방식 - ${targetVersionGroup}`,
        rows: otherMethodRows,
        emptyMessage: "기타 방식으로 배우는 기술이 없습니다.",
        loadingMessage: "기타 기술을 분류하는 중입니다...",
        leadingCell: (move) => <span className="text-xs text-muted-foreground">{move.method}</span>,
        extraHeaders: ["버전그룹", "습득 방식"],
        leadingHeader: "방법",
      })}

      {Array.from(specialMethodRows.entries()).map(([method, rows]) =>
        renderCollectionTable({
          title: SPECIAL_METHOD_LABELS[method] ?? `${method} 방식`,
          rows,
          emptyMessage: `${SPECIAL_METHOD_LABELS[method] ?? method} 데이터가 없습니다.`,
          loadingMessage: `${SPECIAL_METHOD_LABELS[method] ?? method} 정보를 준비 중입니다...`,
          leadingCell: () => (
            <span className="text-xs text-muted-foreground">
              {SPECIAL_METHOD_LABELS[method] ?? method}
            </span>
          ),
          extraHeaders: ["버전그룹", "습득 방식"],
          leadingHeader: "습득",
        })
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">진화 전 단계 기술</CardTitle>
        </CardHeader>
        <CardContent>
          {isPreviousStagesLoading ? (
            <p className="text-sm text-muted-foreground">이전 단계 기술을 확인 중입니다...</p>
          ) : previousStageRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">진화 전 단계 기술 정보가 없습니다.</p>
          ) : (
            <div className="max-h-[360px] overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">단계</TableHead>
                    <TableHead className="w-[60px]">Lv.</TableHead>
                    <TableHead className="w-[180px]">기술명</TableHead>
                    <TableHead>타입</TableHead>
                    <TableHead>분류</TableHead>
                    <TableHead className="text-right">위력</TableHead>
                    <TableHead className="text-right">명중률</TableHead>
                    <TableHead className="text-right">PP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousStageRows.map((move, index) => (
                    <TableRow key={buildRowKey(move, index, move.stageName ?? "stage")}>
                      <TableCell className="capitalize font-medium">{move.stageName}</TableCell>
                      <TableCell className="font-medium">{move.level ?? "-"}</TableCell>
                      <TableCell className="capitalize">{move.name.replace(/-/g, " ")}</TableCell>
                      {renderCommonCells(move)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {renderCollectionTable({
        title: "이전 세대 전용 기술",
        rows: previousGenerationRows,
        emptyMessage: "이전 세대에서만 배울 수 있는 기술이 없습니다.",
        loadingMessage: "세대별 기술 정보를 비교 중입니다...",
        leadingCell: (move) => (
          <span className="text-xs text-muted-foreground">{move.generationLabel}</span>
        ),
        extraHeaders: ["버전그룹", "습득 방식"],
        leadingHeader: "세대",
      })}
    </div>
  );
}
