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

interface PreviousStageMovesTableProps {
  rows: MoveRow[];
  isLoading: boolean;
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

export const PreviousStageMovesTable = ({ rows, isLoading }: PreviousStageMovesTableProps) => (
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
);
