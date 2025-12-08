import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DexFilterBar } from "@/features/dex/components/DexFilterBar";
import { useAllItemsList, useItemsDetails } from "@/features/items/hooks/useItemsQueries";

interface DexItemsTabProps {
  generationId: string; // 도구는 API 한계로 세대 필터 적용이 어려우나 인터페이스는 유지
}

const ITEMS_PER_PAGE = 20;

export function DexItemsTab({ generationId }: DexItemsTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. 전체 아이템 목록 가져오기
  const { data: itemList, isLoading: isListLoading } = useAllItemsList();

  // 2. 검색 필터링 & 페이지네이션
  const filteredList = useMemo(() => {
    if (!itemList) return [];
    if (!searchQuery.trim()) return itemList;
    return itemList.filter((i) => i.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));
  }, [itemList, searchQuery]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const paginatedNames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE).map((i) => i.name);
  }, [filteredList, currentPage]);

  // 3. 상세 정보 로딩
  const itemDetailsQueries = useItemsDetails(paginatedNames);
  const isDetailsLoading = itemDetailsQueries.some((q) => q.isLoading);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRowClick = (id: number) => {
    navigate(`/items/${id}`);
  };

  const getEffectText = (entries: { short_effect: string; language: { name: string } }[]) => {
    const ko = entries.find((e) => e.language.name === "ko");
    const en = entries.find((e) => e.language.name === "en");
    return ko?.short_effect || en?.short_effect || "-";
  };

  return (
    <div className="space-y-4">
      <DexFilterBar
        generationId={generationId}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchChange}
        description="이름으로 도구를 검색할 수 있습니다. (도구는 세대 구분 없이 전체 목록이 표시됩니다)"
      />

      {isListLoading ? (
        <p className="pt-2 text-xs text-muted-foreground">도구 리스트를 불러오는 중입니다...</p>
      ) : (
        <>
          <div className="rounded-md border">
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
                {isDetailsLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      상세 정보를 불러오는 중입니다...
                    </TableCell>
                  </TableRow>
                ) : paginatedNames.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  itemDetailsQueries.map(({ data: item, isLoading }) => {
                    if (isLoading || !item) return null;
                    return (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(item.id)}
                      >
                        <TableCell>
                          <div className="size-8 flex items-center justify-center">
                            {item.sprites.default && (
                              <img
                                src={item.sprites.default}
                                alt={item.name}
                                className="max-h-full max-w-full"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="capitalize">{item.category.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {getEffectText(item.effect_entries)}
                        </TableCell>
                      </TableRow>
                    );
                  })
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
