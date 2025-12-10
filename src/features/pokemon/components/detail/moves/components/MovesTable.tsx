import { Link } from "react-router-dom";
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

interface MovesTableProps {
  title: string;
  rows: MoveRow[];
  emptyMessage: string;
  leadingCell?: (row: MoveRow) => React.ReactNode;
  leadingHeader?: string;
  extraHeaders?: string[];
  footer?: React.ReactNode;
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

export const MovesTable = ({
  title,
  rows,
  emptyMessage,
  leadingCell,
  leadingHeader,
  extraHeaders = [],
  footer,
}: MovesTableProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {rows.length === 0 ? (
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
                <TableRow
                  key={`${move.name}-${move.versionGroups ?? move.method ?? "generic"}-${index}`}
                >
                  {leadingCell && <TableCell>{leadingCell(move)}</TableCell>}
                  <TableCell>
                    <Link
                      to={`/moves/${move.name}`}
                      className="capitalize text-primary hover:underline"
                    >
                      {move.name.replace(/-/g, " ")}
                    </Link>
                  </TableCell>
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
