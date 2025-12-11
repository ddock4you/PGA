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
import { Input } from "@/components/ui/input";
import { useDexCsvData } from "../hooks/useDexCsvData";
import { transformItemsForDex } from "../utils/dataTransforms";
import type { DexItemSummary } from "../utils/dataTransforms";

interface DexItemsTabProps {
  generationId: string; // 도구는 API 한계로 세대 필터 적용이 어려우나 인터페이스는 유지
}

const ITEMS_PER_PAGE = 30;

export function DexItemsTab({ generationId }: DexItemsTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. CSV 데이터 로딩
  const { itemsData, isLoading: isCsvLoading, isError: isCsvError } = useDexCsvData();

  // 2. 도구 데이터 변환 및 필터링
  const allItems = useMemo(() => {
    if (!itemsData) return [];
    return transformItemsForDex(itemsData);
  }, [itemsData]);

  const filteredItems = useMemo(() => {
    if (!allItems) return [];
    if (!searchQuery.trim()) return allItems;
    return allItems.filter((i) => i.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));
  }, [allItems, searchQuery]);

  // 3. 페이지네이션 계산
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

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

  // 도구 효과 텍스트 (CSV에 없으므로 기본 설명)
  const getItemEffectText = (item: DexItemSummary) => {
    // 간단한 카테고리 기반 설명
    const descriptions: Record<string, string> = {
      "standard-balls": "포켓몬을 잡는 데 사용",
      healing: "HP 회복",
      "pp-recovery": "기술 PP 회복",
      "status-cures": "상태 이상 치료",
      vitamins: "능력치 상승",
      evolution: "진화 관련",
      "held-items": "지니게 하는 도구",
      // 기타 카테고리는 기본 설명
    };
    return descriptions[item.category] || `${item.category} 카테고리의 도구`;
  };

  // 도구 이미지 URL 생성 (PokéAPI 스프라이트)
  const getItemSpriteUrl = (itemName: string) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`;
  };

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
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item: DexItemSummary) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(item.id)}
                    >
                      <TableCell>
                        <div className="size-8 flex items-center justify-center">
                          <img
                            src={getItemSpriteUrl(item.name)}
                            alt={item.name}
                            className="max-h-full max-w-full"
                            onError={(e) => {
                              // 이미지 로드 실패 시 숨김
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
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
