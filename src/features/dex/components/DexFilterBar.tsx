import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { DexGenerationSelector } from "./DexGenerationSelector";
import { DexTypeFilter } from "./DexTypeFilter";
import { DexAbilityFilterNew as DexAbilityFilter } from "./DexAbilityFilterNew";
import { DexSortOptions } from "./DexSortOptions";
import type { DexFilters } from "../types/filterTypes";
import { DEFAULT_DEX_FILTERS } from "../types/filterTypes";

interface DexFilterBarProps {
  filters: DexFilters;
  searchQuery: string;
  onFiltersChange: (filters: DexFilters) => void;
  onSearchQueryChange: (value: string) => void;
  description?: string;
}

export function DexFilterBar({
  filters,
  searchQuery,
  onFiltersChange,
  onSearchQueryChange,
  description = "세대/게임과 다양한 조건으로 포켓몬을 탐색할 수 있습니다.",
}: DexFilterBarProps) {
  const updateFilter = <K extends keyof DexFilters>(key: K, value: DexFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleResetFilters = () => {
    onFiltersChange(DEFAULT_DEX_FILTERS);
    onSearchQueryChange("");
  };
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">필터</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-xs">
        {/* 1행: 게임/세대 선택, 초기화 버튼 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">게임/세대</label>
            <div className="flex gap-2">
              <DexGenerationSelector
                generationId={filters.dexGenerationId}
                selectedGameVersion={filters.selectedGameVersion}
                onGenerationChange={(genId, gameVersion) => {
                  onFiltersChange({
                    ...filters,
                    dexGenerationId: genId,
                    selectedGameVersion: gameVersion,
                  });
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-3 text-xs"
                title="모든 필터 초기화"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                초기화
              </Button>
            </div>
          </div>
        </div>

        {/* 2행: 하위세대 포함, 기본 포켓몬만 보기 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-sub-generations"
              checked={filters.includeSubGenerations}
              onCheckedChange={(checked) =>
                updateFilter("includeSubGenerations", checked as boolean)
              }
              className="h-3 w-3"
            />
            <Label htmlFor="include-sub-generations" className="text-xs">
              하위세대 포함
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="only-default-forms"
              checked={filters.onlyDefaultForms}
              onCheckedChange={(checked) => updateFilter("onlyDefaultForms", checked as boolean)}
              className="h-3 w-3"
            />
            <Label htmlFor="only-default-forms" className="text-xs">
              기본 포켓몬만 보기
            </Label>
          </div>
        </div>

        {/* 2행: 타입 필터, 특성 필터 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DexTypeFilter
            selectedTypes={filters.selectedTypes}
            onTypesChange={(types) => updateFilter("selectedTypes", types)}
          />

          <DexAbilityFilter
            generationId={filters.dexGenerationId}
            selectedAbilityId={filters.selectedAbilityId}
            onAbilityChange={(abilityId) => updateFilter("selectedAbilityId", abilityId)}
          />
        </div>

        {/* 3행, 4행, 5행: 정렬 옵션들 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <DexSortOptions
            sortByWeight={filters.sortByWeight}
            weightOrder={filters.weightOrder}
            onWeightSortChange={(enabled, order) => {
              onFiltersChange({
                ...filters,
                sortByWeight: enabled,
                weightOrder: order,
              });
            }}
            sortByHeight={filters.sortByHeight}
            heightOrder={filters.heightOrder}
            onHeightSortChange={(enabled, order) => {
              onFiltersChange({
                ...filters,
                sortByHeight: enabled,
                heightOrder: order,
              });
            }}
            sortByDexNumber={filters.sortByDexNumber}
            dexNumberOrder={filters.dexNumberOrder}
            onDexNumberSortChange={(enabled, order) => {
              onFiltersChange({
                ...filters,
                sortByDexNumber: enabled,
                dexNumberOrder: order,
              });
            }}
          />
        </div>

        {/* 이름 검색 (항상 마지막에) */}
        <div className="pt-2 border-t">
          <div className="max-w-sm">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              이름 검색
            </label>
            <Input
              placeholder="이름으로 검색"
              className="h-9 text-xs"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
