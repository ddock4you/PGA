import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MoveRow } from "../types/moveTypes";

interface TmHmMovesTableProps {
  rows: MoveRow[];
  selectedGenerationId: string;
  showCsvFallback: boolean;
}

const formatStat = (value?: number | null) => (value === null || value === undefined ? "-" : value);

const renderCommonCells = (move: MoveRow) => (
  <>
    <TableCell>
      <span className="capitalize">{move.type}</span>
    </TableCell>
    <TableCell className="capitalize">{move.category}</TableCell>
    <TableCell className="text-right">{formatStat(move.power)}</TableCell>
    <TableCell className="text-right">
      {move.accuracy !== null ? `${move.accuracy}%` : "-"}
    </TableCell>
    <TableCell className="text-right">{formatStat(move.pp)}</TableCell>
  </>
);

export const TmHmMovesTable = ({
  rows,
  selectedGenerationId,
  showCsvFallback,
}: TmHmMovesTableProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">
        기술 머신(TMs/HMs) - {selectedGenerationId}세대
      </CardTitle>
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
);
