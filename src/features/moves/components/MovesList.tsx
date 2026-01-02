"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { transformMovesForDex } from "@/utils/dataTransforms";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import type { DexMoveSummary } from "@/utils/dataTransforms";

const ITEMS_PER_PAGE = 30;

export function MovesList() {
  const router = useRouter();
  const { state } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 기본값은 1세대. Preferences 에 세대가 설정되어 있으면 그것을 우선 사용.
  const effectiveGenerationId = state.selectedGenerationId ?? "1";

  // 1. CSV 데이터 로딩
  const { movesData, machinesData, isLoading: isCsvLoading, isError: isCsvError } = useDexCsvData();

  // 2. 기술 데이터 변환 및 필터링
  const allMoves = useMemo(() => {
    if (!movesData || !machinesData) return [];
    return transformMovesForDex(movesData, machinesData, effectiveGenerationId);
  }, [movesData, machinesData, effectiveGenerationId]);

  const filteredMoves = useMemo(() => {
    if (!allMoves) return [];
    if (!searchQuery.trim()) return allMoves;
    return allMoves.filter((m) => m.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));
  }, [allMoves, searchQuery]);

  // 3. 페이지네이션 계산
  const totalPages = Math.ceil(filteredMoves.length / ITEMS_PER_PAGE);
  const paginatedMoves = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMoves.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMoves, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 1페이지로 리셋
  };

  const handleRowClick = (id: number) => {
    router.push(`/moves/${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-xs font-medium text-muted-foreground">기술명 검색</label>
        <Input
          placeholder="기술 이름으로 검색"
          className="max-w-sm h-9 text-xs"
          value={searchQuery}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>

      {isCsvLoading ? (
        <p className="pt-2 text-xs text-muted-foreground">기술 리스트를 불러오는 중입니다...</p>
      ) : isCsvError ? (
        <p className="pt-2 text-xs text-destructive">
          기술 리스트를 불러오는 중 오류가 발생했습니다.
        </p>
      ) : (
        <>
          <div className="rounded-md border card-move">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">기술명</TableHead>
                  <TableHead>타입</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead className="text-right">위력</TableHead>
                  <TableHead className="text-right">명중률</TableHead>
                  <TableHead className="text-right">PP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMoves.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMoves.map((move: DexMoveSummary) => (
                    <TableRow
                      key={move.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(move.id)}
                    >
                      <TableCell className="font-medium">{move.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {move.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{move.damageClass}</TableCell>
                      <TableCell className="text-right">{move.power ?? "-"}</TableCell>
                      <TableCell className="text-right">{move.accuracy ?? "-"}</TableCell>
                      <TableCell className="text-right">{move.pp}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                <PaginationItem>
                  <div className="flex items-center px-4 text-sm">
                    {currentPage} / {totalPages}
                  </div>
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
