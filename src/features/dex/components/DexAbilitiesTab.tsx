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
import { transformAbilitiesForDex } from "../utils/dataTransforms";
import type { DexAbilitySummary } from "../utils/dataTransforms";

interface DexAbilitiesTabProps {
  generationId: string;
}

const ITEMS_PER_PAGE = 20;

export function DexAbilitiesTab({ generationId }: DexAbilitiesTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    return transformAbilitiesForDex(abilitiesData, abilityNamesData);
  }, [abilitiesData, abilityNamesData]);

  const filteredAbilities = useMemo(() => {
    if (!allAbilities) return [];
    if (!searchQuery.trim()) return allAbilities;
    return allAbilities.filter((ability) =>
      ability.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [allAbilities, searchQuery]);

  // 3. 페이지네이션 계산
  const totalPages = Math.ceil(filteredAbilities.length / ITEMS_PER_PAGE);
  const paginatedAbilities = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAbilities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAbilities, currentPage]);

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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">특성명</TableHead>
                  <TableHead className="w-[100px]">세대</TableHead>
                  <TableHead>설명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAbilities.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-xs text-muted-foreground"
                    >
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAbilities.map((ability: DexAbilitySummary) => (
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
