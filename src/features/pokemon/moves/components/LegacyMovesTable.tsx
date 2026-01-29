import { MovesTable } from "./MovesTable";
import type { MoveRow } from "../types/moveTypes";

interface LegacyMovesTableProps {
  rows: MoveRow[];
}

export const LegacyMovesTable = ({ rows }: LegacyMovesTableProps) => (
  <MovesTable
    title="이전 세대 전용 기술"
    rows={rows}
    emptyMessage="이전 세대에서만 배울 수 있는 기술이 없습니다."
    leadingCell={(move) => <span className="text-xs text-muted-foreground">{move.generationLabel}</span>}
    extraHeaders={["버전그룹", "습득 방식"]}
    leadingHeader="세대"
  />
);
