import { MovesTable } from "./MovesTable";
import { SPECIAL_METHOD_LABELS } from "../../moveConstants";
import type { MoveRow } from "../types/moveTypes";

interface SpecialMethodMovesTableProps {
  method: string;
  rows: MoveRow[];
}

export const SpecialMethodMovesTable = ({ method, rows }: SpecialMethodMovesTableProps) => (
  <MovesTable
    title={SPECIAL_METHOD_LABELS[method] ?? `${method} 방식`}
    rows={rows}
    emptyMessage={`${SPECIAL_METHOD_LABELS[method] ?? method} 데이터가 없습니다.`}
    leadingCell={() => (
      <span className="text-xs text-muted-foreground">
        {SPECIAL_METHOD_LABELS[method] ?? method}
      </span>
    )}
    extraHeaders={["버전그룹", "습득 방식"]}
    leadingHeader="습득"
  />
);
