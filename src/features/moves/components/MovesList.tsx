"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useLocalizedMoveName } from "@/hooks/useLocalizedMoveName";
import { transformMovesForDex } from "@/utils/dataTransforms";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import type { DexMoveSummary } from "@/utils/dataTransforms";
import { saveListState } from "@/lib/listState";

const ITEMS_PER_PAGE = 30;

export function MovesList() {
  const router = useRouter();
  const { state } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationType, setNavigationType] = useState<"push" | "pop">("push");

  // 기본값은 1세대. Preferences 에 세대가 설정되어 있으면 그것을 우선 사용.
  const effectiveGenerationId = state.selectedGenerationId ?? "1";

  // 1. CSV 데이터 로딩
  const {
    movesData,
    moveNamesData,
    machinesData,
    isLoading: isCsvLoading,
    isError: isCsvError,
  } = useDexCsvData();
  const { getLocalizedMoveName } = useLocalizedMoveName({ movesData, moveNamesData });

  // 2. 기술 데이터 변환 및 필터링
  const allMoves = useMemo(() => {
    if (!movesData || !machinesData) return [];
    return transformMovesForDex(movesData, machinesData, effectiveGenerationId);
  }, [movesData, machinesData, effectiveGenerationId]);

  const localizedMoves = useMemo(() => {
    if (!allMoves.length) return [];
    return allMoves.map((move) => ({
      ...move,
      displayName: getLocalizedMoveName(move.id),
    }));
  }, [allMoves, getLocalizedMoveName]);

  const filteredMoves = useMemo(() => {
    if (!localizedMoves.length) return [];
    if (!searchQuery.trim()) return localizedMoves;
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return localizedMoves.filter((move) => {
      const englishMatch = move.name.toLowerCase().includes(normalizedQuery);
      const koreanMatch = move.displayName?.toLowerCase().includes(normalizedQuery);
      return englishMatch || koreanMatch;
    });
  }, [localizedMoves, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const pathname = usePathname();
  const chunkQueryKey = useMemo(
    () => ["moves", effectiveGenerationId, searchQuery.trim()],
    [effectiveGenerationId, searchQuery]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePop = () => setNavigationType("pop");
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    if (navigationType === "pop") {
      const id = window.setTimeout(() => setNavigationType("push"), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [navigationType]);

  const {
    items,
    totalPages,
    totalCount,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: loadMoreError,
  } = useLoadMore<DexMoveSummary>({
    queryKey: chunkQueryKey,
    enabled: !isCsvLoading && !isCsvError,
    fetchPage: async (pageParam = 1) => {
      const pageSize = ITEMS_PER_PAGE;
      const count = filteredMoves.length;
      const calculatedTotalPages = Math.max(1, Math.ceil(count / pageSize));
      const start = (pageParam - 1) * pageSize;
      return {
        page: pageParam,
        totalPages: calculatedTotalPages,
        totalCount: count,
        items: filteredMoves.slice(start, start + pageSize),
      };
    },
  });

  useListRestoration({
    pathname,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    navigationType,
  });

  const handleRowClick = (id: number) => {
    if (typeof window !== "undefined") {
      saveListState(pathname, { pageCount: Math.max(1, currentPage), scrollY: window.scrollY });
    }
    setNavigationType("push");
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
          <p className="text-sm text-muted-foreground">{totalCount}개의 기술을 볼 수 있습니다.</p>
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
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((move: DexMoveSummary) => {
                    const displayName = move.displayName ?? move.name;

                    return (
                      <TableRow
                        key={move.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(move.id)}
                      >
                        <TableCell className="font-medium">{displayName}</TableCell>
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <LoadMoreButton
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={Boolean(hasNextPage)}
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            />
          )}
          {loadMoreError && (
            <p className="text-xs text-destructive">
              추가 페이지를 불러오는 중 오류가 발생했습니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}
