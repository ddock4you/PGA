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
import { getKoreanTypeName } from "@/utils/pokemonTypes";
import { getDamageClassKorean } from "@/features/pokemon/utils/localization";
import { useMoveNameResolver } from "@/features/moves/hooks/useMoveNameResolver";
import type { MoveRow } from "../types/moveTypes";
import { formatStat } from "../utils/moveUtils";

interface TmHmMovesTableProps {
  rows: MoveRow[];
  selectedGenerationId: string;
  showCsvFallback: boolean;
}

export const TmHmMovesTable = ({ rows, selectedGenerationId, showCsvFallback }: TmHmMovesTableProps) => {
  const { getMoveName } = useMoveNameResolver();

  const renderCommonCells = (move: MoveRow) => {
    const koreanType = getKoreanTypeName(move.type);
    const koreanCategory = getDamageClassKorean(move.category) || move.category;

    return (
      <>
        <TableCell>
          <span className="capitalize">{koreanType}</span>
        </TableCell>
        <TableCell className="capitalize">{koreanCategory}</TableCell>
        <TableCell className="text-right">{formatStat(move.power)}</TableCell>
        <TableCell className="text-right">{move.accuracy !== null ? `${move.accuracy}%` : "-"}</TableCell>
        <TableCell className="text-right">{formatStat(move.pp)}</TableCell>
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">기술 머신(TMs/HMs) - {selectedGenerationId}세대</CardTitle>
      </CardHeader>
      <CardContent>
        {showCsvFallback ? (
          <p className="text-sm text-muted-foreground">기술 머신 정보를 준비 중입니다...</p>
        ) : rows.length === 0 ? (
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
                {rows.map((move, index) => (
                  <TableRow key={`${move.name}-${move.tmNumber ?? "tm"}-${index}`}>
                    <TableCell className="font-medium">
                      {move.tmNumber !== undefined
                        ? move.isHm
                          ? `HM${move.tmNumber.toString().padStart(2, "0")}`
                          : `TM${move.tmNumber.toString().padStart(2, "0")}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Link href={`/moves/${move.name}`} className="capitalize text-primary hover:underline">
                        {getMoveName(move.name)}
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
