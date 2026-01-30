export interface LocalizedNameEntry {
  name: string;
  language: {
    name: string;
  };
}

export interface AbilityWithNames {
  name: string;
  names?: LocalizedNameEntry[];
}

export function getAbilityDisplayName(
  ability: AbilityWithNames,
  preferredLanguage = "ko"
): string {
  const preferred = ability.names?.find((entry) => entry.language?.name === preferredLanguage);
  if (preferred?.name) {
    return preferred.name;
  }

  const english = ability.names?.find((entry) => entry.language?.name === "en");
  if (english?.name) {
    return english.name;
  }

  return ability.name;
}
