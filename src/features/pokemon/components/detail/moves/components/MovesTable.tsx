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
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { getDamageClassKorean } from "@/utils/dataTransforms";
import type { MoveRow } from "../types/moveTypes";

// 타입 이름(영문)으로부터 한글 이름을 찾는 매핑
const TYPE_NAME_TO_KOREAN: Record<string, string> = {
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

const renderCommonCells = (move: MoveRow) => {
  const koreanType = TYPE_NAME_TO_KOREAN[move.type] || move.type;
  const koreanCategory = getDamageClassKorean(move.category);

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

export const MovesTable = ({
  title,
  rows,
  emptyMessage,
  leadingCell,
  leadingHeader,
  extraHeaders = [],
  footer,
}: MovesTableProps) => {
  const { movesData, moveNamesData } = useDexCsvData();

  // 기술 ID로 한글 이름 찾기 함수
  const getKoreanMoveName = (moveName: string) => {
    // moveName이 ID인 경우 (숫자)
    if (/^\d+$/.test(moveName)) {
      const moveId = parseInt(moveName, 10);
      // 먼저 한글 이름 찾기
      const koreanName = moveNamesData.find(
        (name) => name.move_id === moveId && name.local_language_id === 3
      )?.name;
      if (koreanName) return koreanName;

      // 한글 이름이 없으면 영문 identifier 사용
      const moveData = movesData.find((m) => m.id === moveId);
      return moveData?.identifier.replace(/-/g, " ") || moveName;
    }
    // moveName이 영문 이름인 경우
    // 먼저 해당 영문 이름으로 move_id 찾기
    const moveData = movesData.find((m) => m.identifier === moveName);
    if (moveData) {
      // 한글 이름 찾기
      const koreanName = moveNamesData.find(
        (name) => name.move_id === moveData.id && name.local_language_id === 3
      )?.name;
      if (koreanName) return koreanName;
    }
    // 한글 이름이 없으면 영문 이름 그대로 사용 (하이픈을 공백으로)
    return moveName.replace(/-/g, " ");
  };

  return (
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
                        {getKoreanMoveName(move.name)}
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
};
