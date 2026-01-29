import { MovesTable } from "./MovesTable";
import type { MoveRow } from "../types/moveTypes";

interface LevelUpMovesTableProps {
  rows: MoveRow[];
  selectedGenerationId: string;
}

export const LevelUpMovesTable = ({ rows, selectedGenerationId }: LevelUpMovesTableProps) => (
  <MovesTable
    title={`자력기 (Level Up Moves) - ${selectedGenerationId}세대`}
    rows={rows}
    emptyMessage="레벨업으로 배우는 기술이 없습니다."
    leadingCell={(move) => <span className="font-medium">{move.level ?? "-"}</span>}
    leadingHeader="Lv."
  />
);
