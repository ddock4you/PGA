import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDexCsvData } from "../hooks/useDexCsvData";
import type { CsvAbility, CsvAbilityName } from "../types/csvTypes";

interface DexAbilityFilterProps {
  generationId: string;
  selectedAbilityId?: number;
  onAbilityChange: (abilityId?: number) => void;
}

export function DexAbilityFilter({
  generationId,
  selectedAbilityId,
  onAbilityChange,
}: DexAbilityFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { abilitiesData, abilityNamesData } = useDexCsvData();

  // 3세대 이상인지 확인 (특성 필터 활성화 조건)
  const isAbilityFilterEnabled = parseInt(generationId) >= 3;

  // 현재 세대 이하의 특성들만 필터링
  const availableAbilities = useMemo(() => {
    if (!abilitiesData || !abilityNamesData) return [];

    return abilitiesData
      .filter((ability) => ability.generation_id <= parseInt(generationId))
      .map((ability) => {
        const nameData = abilityNamesData.find(
          (name) => name.ability_id === ability.id && name.local_language_id === 1 // 한국어
        );
        return {
          ...ability,
          name: nameData?.name || ability.identifier,
        };
      })
      .sort((a, b) => a.generation_id - b.generation_id || a.name.localeCompare(b.name));
  }, [abilitiesData, abilityNamesData, generationId]);

  // 검색어로 필터링된 특성들
  const filteredAbilities = useMemo(() => {
    if (!searchQuery.trim()) return availableAbilities;
    return availableAbilities.filter(
      (ability) =>
        ability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ability.identifier.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableAbilities, searchQuery]);

  if (!isAbilityFilterEnabled) {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">특성</label>
        <div className="h-9 rounded-md border bg-muted px-2 text-xs text-muted-foreground flex items-center">
          3세대 이상에서 사용 가능
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">특성</label>
      <div className="space-y-2">
        {/* 검색 인풋 - 스크롤 시 고정 */}
        <div className="sticky top-0 z-10">
          <Input
            placeholder="특성 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs"
          />
        </div>

        {/* 특성 선택 */}
        <Select
          value={selectedAbilityId?.toString() || undefined}
          onValueChange={(value) => onAbilityChange(value ? parseInt(value) : undefined)}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="특성 선택 (모든 특성)" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {filteredAbilities.map((ability) => (
              <SelectItem key={ability.id} value={ability.id.toString()}>
                {ability.name} ({ability.identifier})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
