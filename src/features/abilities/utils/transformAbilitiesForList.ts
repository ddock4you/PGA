import type { CsvAbility, CsvAbilityName } from "@/types/csvTypes";
import type { DexAbilitySummary } from "@/features/abilities/types/abilityList";

export function transformAbilitiesForList(
  csvAbilities: CsvAbility[],
  csvAbilityNames: CsvAbilityName[],
  primaryLanguageId: number = 3,
  secondaryLanguageId: number = 9
): DexAbilitySummary[] {
  const primaryNameByAbilityId = new Map<number, string>();
  const secondaryNameByAbilityId = new Map<number, string>();

  for (const row of csvAbilityNames) {
    if (row.local_language_id === primaryLanguageId) {
      if (!primaryNameByAbilityId.has(row.ability_id)) {
        primaryNameByAbilityId.set(row.ability_id, row.name);
      }
    } else if (row.local_language_id === secondaryLanguageId) {
      if (!secondaryNameByAbilityId.has(row.ability_id)) {
        secondaryNameByAbilityId.set(row.ability_id, row.name);
      }
    }
  }

  return csvAbilities
    .filter((ability) => ability.is_main_series === 1)
    .map((ability) => {
      const primaryName = primaryNameByAbilityId.get(ability.id) ?? ability.identifier;
      const secondaryName = secondaryNameByAbilityId.get(ability.id);
      const displayName = secondaryName ? `${primaryName} (${secondaryName})` : primaryName;

      return {
        id: ability.id,
        name: displayName,
        generation: ability.generation_id,
        description: "특성 효과 정보",
        identifier: ability.identifier,
      };
    })
    .sort((a, b) => a.id - b.id);
}
