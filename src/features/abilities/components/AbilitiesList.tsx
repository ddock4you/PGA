"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { LoadMoreButton } from "@/components/ui/load-more-button";
import type { DexAbilitySummary } from "@/utils/dataTransforms";
import { useAbilitiesList } from "@/features/abilities/hooks/useAbilitiesList";

export function AbilitiesList() {
  const {
    searchQuery,
    handleSearchChange,
    isCsvLoading,
    isCsvError,
    totalCount,
    items,
    totalPages,
    currentPage,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    loadMoreError,
    handleRowClick,
  } = useAbilitiesList();

  const getAbilityDescription = (ability: DexAbilitySummary) => ability.description;

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
