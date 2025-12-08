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
import {
  useAbilitiesListByGeneration,
  useAbilitiesDetails,
} from "@/features/abilities/hooks/useAbilitiesQueries";

interface DexAbilitiesTabProps {
  generationId: string;
}

const ITEMS_PER_PAGE = 20;

export function DexAbilitiesTab({ generationId }: DexAbilitiesTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. 세대별 특성 목록 가져오기
  const { data: abilityList, isLoading: isListLoading } =
    useAbilitiesListByGeneration(generationId);

  // 2. 검색 필터링 & 페이지네이션
  const filteredList = useMemo(() => {
    if (!abilityList) return [];
    if (!searchQuery.trim()) return abilityList;
    return abilityList.filter((a) =>
      a.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [abilityList, searchQuery]);

  const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);

  const paginatedNames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredList.slice(start, start + ITEMS_PER_PAGE).map((a) => a.name);
  }, [filteredList, currentPage]);

  // 3. 상세 정보 로딩
  const abilityDetailsQueries = useAbilitiesDetails(paginatedNames);
  const isDetailsLoading = abilityDetailsQueries.some((q) => q.isLoading);

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

  // 언어에 맞는 텍스트 찾기 헬퍼 (한국어 우선, 없으면 영어)
  const getEffectText = (entries: { effect: string; language: { name: string } }[]) => {
    const ko = entries.find((e) => e.language.name === "ko");
    const en = entries.find((e) => e.language.name === "en");
    return ko?.effect || en?.effect || "-";
  };

  const getShortEffectText = (entries: { short_effect: string; language: { name: string } }[]) => {
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
        description="이름으로 특성을 검색할 수 있습니다."
      />

      {isListLoading ? (
        <p className="pt-2 text-xs text-muted-foreground">특성 리스트를 불러오는 중입니다...</p>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">특성명</TableHead>
                  <TableHead className="w-[200px]">요약</TableHead>
                  <TableHead>설명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDetailsLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      상세 정보를 불러오는 중입니다...
                    </TableCell>
                  </TableRow>
                ) : paginatedNames.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  abilityDetailsQueries.map(({ data: ability, isLoading }) => {
                    if (isLoading || !ability) return null;
                    return (
                      <TableRow
                        key={ability.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(ability.id)}
                      >
                        <TableCell className="font-medium">{ability.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {getShortEffectText(ability.effect_entries)}
                        </TableCell>
                        <TableCell className="text-xs">
                          {getEffectText(ability.effect_entries)}
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
