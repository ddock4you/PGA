import { MovesTable } from "./MovesTable";
import type { MoveRow } from "../types/moveTypes";

interface TutorMovesTableProps {
  rows: MoveRow[];
  targetVersionGroup: string;
}

export const TutorMovesTable = ({ rows, targetVersionGroup }: TutorMovesTableProps) => (
  <MovesTable
    title={`NPC / 튜터 기술 - ${targetVersionGroup}`}
    rows={rows}
    emptyMessage="해당 세대 튜터 기술이 없습니다."
    leadingCell={() => <span className="text-xs text-muted-foreground">튜터</span>}
    extraHeaders={["버전그룹", "습득 방식"]}
    leadingHeader="습득"
  />
);
