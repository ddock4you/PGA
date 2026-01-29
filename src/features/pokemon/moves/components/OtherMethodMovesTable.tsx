import { MovesTable } from "./MovesTable";
import type { MoveRow } from "../types/moveTypes";

interface OtherMethodMovesTableProps {
  rows: MoveRow[];
  targetVersionGroup: string;
}

export const OtherMethodMovesTable = ({ rows, targetVersionGroup }: OtherMethodMovesTableProps) => (
  <MovesTable
    title={`기타 습득 방식 - ${targetVersionGroup}`}
    rows={rows}
    emptyMessage="기타 방식으로 배우는 기술이 없습니다."
    leadingCell={(move) => <span className="text-xs text-muted-foreground">{move.method}</span>}
    extraHeaders={["버전그룹", "습득 방식"]}
    leadingHeader="방법"
  />
);
