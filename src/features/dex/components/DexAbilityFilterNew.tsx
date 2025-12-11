import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDexCsvData } from "../hooks/useDexCsvData";
import type { CsvAbility, CsvAbilityName } from "../types/csvTypes";

interface DexAbilityFilterNewProps {
  generationId: string;
  selectedAbilityId?: number;
  onAbilityChange: (abilityId?: number) => void;
}

export function DexAbilityFilterNew({
  generationId,
  selectedAbilityId,
  onAbilityChange,
}: DexAbilityFilterNewProps) {
  const [open, setOpen] = useState(false);
  const { abilitiesData, abilityNamesData } = useDexCsvData();

  // 3세대 이상인지 확인
  const isAbilityFilterEnabled = parseInt(generationId) >= 3;

  // 세대별로 그룹화된 특성들
  const groupedAbilities = useMemo(() => {
    if (!abilitiesData || !abilityNamesData) return {};

    const grouped: Record<
      string,
      Array<{ id: number; name: string; identifier: string; searchText: string }>
    > = {};

    abilitiesData
      .filter((ability) => ability.generation_id <= parseInt(generationId))
      .forEach((ability) => {
        const nameData = abilityNamesData.find(
          (name) => name.ability_id === ability.id && name.local_language_id === 3 // 한국어
        );
        const abilityName = nameData?.name || ability.identifier;

        const genKey = `${ability.generation_id}세대`;
        if (!grouped[genKey]) {
          grouped[genKey] = [];
        }
        grouped[genKey].push({
          id: ability.id,
          name: abilityName,
          identifier: ability.identifier,
          searchText: `${abilityName} ${ability.identifier}`, // 검색용 텍스트 (한글 + 영어)
        });
      });

    // 각 그룹 내에서 이름으로 정렬
    Object.keys(grouped).forEach((genKey) => {
      grouped[genKey].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [abilitiesData, abilityNamesData, generationId]);

  const selectedAbility = useMemo(() => {
    if (!selectedAbilityId || !abilitiesData || !abilityNamesData) return null;

    const ability = abilitiesData.find((a) => a.id === selectedAbilityId);
    if (!ability) return null;

    const nameData = abilityNamesData.find(
      (name) => name.ability_id === ability.id && name.local_language_id === 3
    );

    return {
      id: ability.id,
      name: nameData?.name || ability.identifier,
      identifier: ability.identifier,
      searchText: `${nameData?.name || ability.identifier} ${ability.identifier}`,
    };
  }, [selectedAbilityId, abilitiesData, abilityNamesData]);

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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-9 text-xs"
          >
            {selectedAbility ? selectedAbility.name : "특성 선택 (모든 특성)"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="특성 검색..." className="h-9" />
            <CommandList>
              <CommandEmpty>특성을 찾을 수 없습니다.</CommandEmpty>
              {/* 모든 특성 선택 옵션 */}
              <CommandItem
                value="모든 특성 all abilities"
                onSelect={() => {
                  onAbilityChange(undefined);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4", !selectedAbilityId ? "opacity-100" : "opacity-0")}
                />
                모든 특성
              </CommandItem>
              {/* 세대별 그룹화된 특성들 */}
              {Object.entries(groupedAbilities).map(([genKey, abilities]) => (
                <CommandGroup key={genKey} heading={genKey}>
                  {abilities.map((ability) => (
                    <CommandItem
                      key={ability.id}
                      value={ability.searchText}
                      onSelect={() => {
                        onAbilityChange(ability.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedAbilityId === ability.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {ability.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
