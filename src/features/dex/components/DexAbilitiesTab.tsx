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
import { useDexCsvData } from "../hooks/useDexCsvData";
import { transformNaturesForDex } from "../utils/dataTransforms";
import type { DexNatureSummary } from "../utils/dataTransforms";

interface DexAbilitiesTabProps {
  generationId: string;
}

const ITEMS_PER_PAGE = 20;

export function DexAbilitiesTab({ generationId }: DexAbilitiesTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. CSV 데이터 로딩
  const { naturesData, isLoading: isCsvLoading, isError: isCsvError } = useDexCsvData();

  // 2. 특성 데이터 변환 및 필터링
  const allNatures = useMemo(() => {
    if (!naturesData) return [];
    return transformNaturesForDex(naturesData);
  }, [naturesData]);

  const filteredNatures = useMemo(() => {
    if (!allNatures) return [];
    if (!searchQuery.trim()) return allNatures;
    return allNatures.filter((n) =>
      n.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [allNatures, searchQuery]);

  // 3. 페이지네이션 계산
  const totalPages = Math.ceil(filteredNatures.length / ITEMS_PER_PAGE);
  const paginatedNatures = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNatures.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNatures, currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRowClick = (id: number) => {
    navigate(`/abilities/${id}`);
  };

  // 특성 효과 텍스트 (CSV에 없으므로 간단한 설명 생성)
  const getNatureDescription = (nature: DexNatureSummary) => {
    const increased = nature.increasedStat;
    const decreased = nature.decreasedStat;
    return `${increased} 상승, ${decreased} 하락`;
  };

  return (
    <div className="space-y-4">
      <DexFilterBar
        generationId={generationId}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchChange}
        description="이름으로 특성을 검색할 수 있습니다."
      />

      {isCsvLoading ? (
        <p className="pt-2 text-xs text-muted-foreground">특성 리스트를 불러오는 중입니다...</p>
      ) : isCsvError ? (
        <p className="pt-2 text-xs text-destructive">
          특성 리스트를 불러오는 중 오류가 발생했습니다.
        </p>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">특성명</TableHead>
                  <TableHead className="w-[200px]">스탯 변화</TableHead>
                  <TableHead>설명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNatures.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedNatures.map((nature: DexNatureSummary) => (
                    <TableRow
                      key={nature.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(nature.id)}
                    >
                      <TableCell className="font-medium">{nature.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {nature.increasedStat} ↑ / {nature.decreasedStat} ↓
                      </TableCell>
                      <TableCell className="text-xs">{getNatureDescription(nature)}</TableCell>
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
