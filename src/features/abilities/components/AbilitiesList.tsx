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
import { Input } from "@/components/ui/input";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { transformAbilitiesForDex } from "@/utils/dataTransforms";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useListRestoration } from "@/hooks/useListRestoration";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import type { DexAbilitySummary } from "@/utils/dataTransforms";
import { saveListState } from "@/lib/listState";

const ITEMS_PER_PAGE = 30;

export function AbilitiesList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationType, setNavigationType] = useState<"push" | "pop">("push");

  // 1. CSV 데이터 로딩
  const {
    abilitiesData,
    abilityNamesData,
    isLoading: isCsvLoading,
    isError: isCsvError,
  } = useDexCsvData();

  // 2. 특성 데이터 변환 및 필터링
  const allAbilities = useMemo(() => {
    if (!abilitiesData || !abilityNamesData) return [];
    return transformAbilitiesForDex(abilitiesData, abilityNamesData, 3, 9); // 한국어 우선, 영어 보조
  }, [abilitiesData, abilityNamesData]);

  const filteredAbilities = useMemo(() => {
    if (!allAbilities) return [];
    if (!searchQuery.trim()) return allAbilities;

    const query = searchQuery.trim().toLowerCase();
    return allAbilities.filter((ability) => {
      const nameMatch = ability.name.toLowerCase().includes(query);
      const identifierMatch = ability.identifier.toLowerCase().includes(query);

      return nameMatch || identifierMatch;
    });
  }, [allAbilities, searchQuery]);

  // 3. 페이지네이션 계산
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const pathname = usePathname();
  const chunkQueryKey = useMemo(() => ["abilities", searchQuery.trim()], [searchQuery]);

  const {
    items,
    totalPages,
    totalCount,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: loadMoreError,
  } = useLoadMore<DexAbilitySummary>({
    queryKey: chunkQueryKey,
    enabled: !isCsvLoading && !isCsvError,
    fetchPage: async (pageParam = 1) => {
      const pageSize = ITEMS_PER_PAGE;
      const count = filteredAbilities.length;
      const totalPagesOfResults = Math.max(1, Math.ceil(count / pageSize));
      const start = (pageParam - 1) * pageSize;
      return {
        page: pageParam,
        totalPages: totalPagesOfResults,
        totalCount: count,
        items: filteredAbilities.slice(start, start + pageSize),
      };
    },
  });

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
    router.push(`/abilities/${id}`);
  };

  // 특성 효과 텍스트 (간단한 설명 표시)
  const getAbilityDescription = (ability: DexAbilitySummary) => {
    return ability.description;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-xs font-medium text-muted-foreground">특성명 검색</label>
        <Input
          placeholder="특성 이름으로 검색"
          className="max-w-sm h-9 text-xs"
          value={searchQuery}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>

      {isCsvLoading ? (
        <p className="pt-2 text-xs text-muted-foreground">특성 리스트를 불러오는 중입니다...</p>
      ) : isCsvError ? (
        <p className="pt-2 text-xs text-destructive">
          특성 리스트를 불러오는 중 오류가 발생했습니다.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{totalCount}개의 특성을 볼 수 있습니다.</p>
          <div className="rounded-md border card-ability">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">특성명</TableHead>
                  <TableHead className="w-[100px]">세대</TableHead>
                  <TableHead>설명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((ability: DexAbilitySummary) => (
                    <TableRow
                      key={ability.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(ability.id)}
                    >
                      <TableCell className="font-medium">{ability.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {ability.generation}세대
                      </TableCell>
                      <TableCell className="text-xs">{getAbilityDescription(ability)}</TableCell>
                    </TableRow>
                  ))
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
