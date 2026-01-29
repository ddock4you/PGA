"use client";

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
import { LoadMoreButton } from "@/components/ui/load-more-button";
import { useMovesList } from "@/features/moves/hooks/useMovesList";

export function MovesList() {
  const {
    searchQuery,
    handleSearchChange,
    isCsvLoading,
    isCsvError,
    totalCount,
    items,
    totalPages,
    hasNextPage,
    currentPage,
    fetchNextPage,
    isFetchingNextPage,
    loadMoreError,
    handleRowClick,
  } = useMovesList();

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
                  items.map((move) => {
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
