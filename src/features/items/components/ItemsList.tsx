"use client";

import Image from "next/image";
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
import type { DexItemSummary } from "@/utils/dataTransforms";
import { useItemsList } from "@/features/items/hooks/useItemsList";

export function ItemsList() {
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
  } = useItemsList();

  const getItemEffectText = (item: DexItemSummary) => {
    const descriptions: Record<string, string> = {
      "standard-balls": "포켓몬을 잡는 데 사용",
      healing: "HP 회복",
      "pp-recovery": "기술 PP 회복",
      "status-cures": "상태 이상 치료",
      vitamins: "능력치 상승",
      evolution: "진화 관련",
      "held-items": "지니게 하는 도구",
    };
    return descriptions[item.category] || `${item.category} 카테고리의 도구`;
  };

  const getItemSpriteUrl = (itemName: string) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-xs font-medium text-muted-foreground">도구명 검색</label>
        <Input
          placeholder="도구 이름으로 검색"
          className="max-w-sm h-9 text-xs"
          value={searchQuery}
          onChange={(event) => handleSearchChange(event.target.value)}
        />
      </div>

      {isCsvLoading ? (
        <p className="pt-2 text-xs text-muted-foreground">도구 리스트를 불러오는 중입니다...</p>
      ) : isCsvError ? (
        <p className="pt-2 text-xs text-destructive">
          도구 리스트를 불러오는 중 오류가 발생했습니다.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{totalCount}개의 도구를 볼 수 있습니다.</p>
          <div className="rounded-md border card-item">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">IMG</TableHead>
                  <TableHead className="w-[150px]">도구명</TableHead>
                  <TableHead className="w-[150px]">카테고리</TableHead>
                  <TableHead>효과</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item: DexItemSummary) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(item.id)}
                    >
                      <TableCell>
                        <div className="size-8 flex items-center justify-center">
                          <Image
                            src={getItemSpriteUrl(item.name)}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="max-h-full max-w-full"
                            onError={({ currentTarget }) => {
                              currentTarget.style.visibility = "hidden";
                            }}
                            unoptimized
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {getItemEffectText(item)}
                      </TableCell>
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
