"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useLocalizedMoveName } from "@/hooks/useLocalizedMoveName";
import { getDamageClassKorean } from "@/utils/dataTransforms";
import type { MoveRow } from "../types/moveTypes";

// 타입 이름(영문)으로부터 한글 이름을 찾는 매핑
const TYPE_NAME_TO_KOREAN_LOCAL: Record<string, string> = {
  normal: "노말",
  fighting: "격투",
  flying: "비행",
  poison: "독",
  ground: "땅",
  rock: "바위",
  bug: "벌레",
  ghost: "고스트",
  steel: "강철",
  fire: "불꽃",
  water: "물",
  grass: "풀",
  electric: "전기",
  psychic: "에스퍼",
  ice: "얼음",
  dragon: "드래곤",
  dark: "악",
  fairy: "페어리",
};

interface PreviousStageMovesTableProps {
  rows: MoveRow[];
  isLoading: boolean;
}

const formatStat = (value?: number | null) => (value === null || value === undefined ? "-" : value);

export const PreviousStageMovesTable = ({ rows, isLoading }: PreviousStageMovesTableProps) => {
  const { pokemonSpeciesNamesData, pokemonData } = useDexCsvData();
  const { getLocalizedMoveName } = useLocalizedMoveName();

  // 포켓몬 이름 한글화 헬퍼 함수
  const getKoreanPokemonName = (speciesName: string) => {
    // speciesName이 영문 이름인 경우 (예: "pichu")
    // pokemonData에서 해당 이름을 찾아 species_id를 구함
    const pokemonEntry = pokemonData.find((p) => p.identifier === speciesName);
    if (pokemonEntry) {
      // species_id로 한국어 이름 찾기
      const koreanName = pokemonSpeciesNamesData.find(
        (name) =>
          name.pokemon_species_id === pokemonEntry.species_id && name.local_language_id === 3
      )?.name;
      if (koreanName) return koreanName;
    }

    // speciesName이 이미 ID인 경우
    const idMatch = speciesName.match(/^\d+$/);
    if (idMatch) {
      const id = parseInt(idMatch[0], 10);
      const koreanName = pokemonSpeciesNamesData.find(
        (name) => name.pokemon_species_id === id && name.local_language_id === 3
      )?.name;
      if (koreanName) return koreanName;
    }

    // 찾을 수 없으면 원래 이름 반환
    return speciesName;
  };

  const renderCommonCells = (move: MoveRow) => {
    const koreanType = TYPE_NAME_TO_KOREAN_LOCAL[move.type] || move.type;
    const koreanCategory = getDamageClassKorean(move.category) || move.category;

    return (
      <>
        <TableCell>
          <span className="capitalize">{koreanType}</span>
        </TableCell>
        <TableCell className="capitalize">{koreanCategory}</TableCell>
        <TableCell className="text-right">{formatStat(move.power)}</TableCell>
        <TableCell className="text-right">
          {move.accuracy !== null ? `${move.accuracy}%` : "-"}
        </TableCell>
        <TableCell className="text-right">{formatStat(move.pp)}</TableCell>
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">진화 전 단계 기술</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">이전 단계 기술을 확인 중입니다...</p>
        ) : rows.length === 0 ? (
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
                {rows.map((move, index) => (
                  <TableRow key={`${move.name}-${move.stageName ?? "stage"}-${index}`}>
                    <TableCell className="capitalize font-medium">
                      {move.stageName ? getKoreanPokemonName(move.stageName) : "-"}
                    </TableCell>
                    <TableCell className="font-medium">{move.level ?? "-"}</TableCell>
                    <TableCell>
                      <Link
                        href={`/moves/${move.name}`}
                        className="capitalize text-primary hover:underline"
                      >
                        {getLocalizedMoveName(move.name)}
                      </Link>
                    </TableCell>
                    {renderCommonCells(move)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
