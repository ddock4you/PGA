// useLocalizedAbilityName: ability CSV + CSV 이름 테이블을 이용해 ID/identifier/API 응답을 한국어로 변환하는 공통 함수입니다.
"use client";

import { useCallback, useMemo } from "react";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import type { CsvAbility, CsvAbilityName } from "@/types/csvTypes";

type LocalizedNameEntry = {
  language?: {
    name?: string;
  };
  name: string;
};

type AbilityInput =
  | number
  | string
  | {
      id?: number;
      identifier?: string;
      name?: string;
      names?: LocalizedNameEntry[];
    };

interface UseLocalizedAbilityNameOptions {
  abilitiesData?: CsvAbility[];
  abilityNamesData?: CsvAbilityName[];
}

const KOREAN_LANGUAGE_NAME = "ko";

export function useLocalizedAbilityName(options: UseLocalizedAbilityNameOptions = {}) {
  const { abilitiesData: defaultAbilitiesData, abilityNamesData: defaultAbilityNamesData } =
    useDexCsvData();

  const abilitiesData = options.abilitiesData ?? defaultAbilitiesData;
  const abilityNamesData = options.abilityNamesData ?? defaultAbilityNamesData;

  // ability_names.csv에서 한국어 이름만 추려서 빠르게 찾을 수 있는 맵을 준비합니다.
  const abilityIdToKoreanName = useMemo(() => {
    const map = new Map<number, string>();
    abilityNamesData.forEach((entry) => {
      if (entry.local_language_id === 3) {
        map.set(entry.ability_id, entry.name);
      }
    });
    return map;
  }, [abilityNamesData]);

  // ability ID → identifier 맵은 identifier fallback용입니다.
  const abilityIdToIdentifier = useMemo(() => {
    const map = new Map<number, string>();
    abilitiesData?.forEach((ability) => {
      map.set(ability.id, ability.identifier);
    });
    return map;
  }, [abilitiesData]);

  // identifier → ability ID 매핑은 identifier로 입력받았을 때 ID 변환에 사용합니다.
  const identifierToAbilityId = useMemo(() => {
    const map = new Map<string, number>();
    abilitiesData?.forEach((ability) => {
      map.set(ability.identifier, ability.id);
    });
    return map;
  }, [abilitiesData]);

  const getKoreanNameFromApiNames = useCallback((names?: LocalizedNameEntry[]) => {
    if (!names) return undefined;
    return names.find((entry) => entry.language?.name === KOREAN_LANGUAGE_NAME)?.name;
  }, []);

  const resolveAbilityId = useCallback(
    (input?: AbilityInput) => {
      if (typeof input === "number") {
        return input;
      }

      if (typeof input === "string") {
        return identifierToAbilityId.get(input);
      }

      if (input?.id) {
        return input.id;
      }

      const identifier = input?.identifier ?? input?.name;
      if (identifier) {
        return identifierToAbilityId.get(identifier);
      }

      return undefined;
    },
    [identifierToAbilityId]
  );

  const normalizeIdentifier = useCallback((identifier?: string) => {
    if (!identifier) return "";
    return identifier.replace(/-/g, " ");
  }, []);

  // 입력값으로부터 영어/한국어 번역 또는 identifier를 선별해 최종 표시명을 반환합니다.
  const getLocalizedAbilityName = useCallback(
    (input?: AbilityInput) => {
      if (!input) return "";

      if (typeof input === "object") {
        const localized = getKoreanNameFromApiNames(input.names);
        if (localized) {
          return localized;
        }
      }

      const abilityId = resolveAbilityId(input);
      if (abilityId) {
        const koreanName = abilityIdToKoreanName.get(abilityId);
        if (koreanName) return koreanName;

        const identifier =
          abilityIdToIdentifier.get(abilityId) ??
          (typeof input === "object" ? input.identifier ?? input.name : undefined);
        if (identifier) {
          return normalizeIdentifier(identifier);
        }
      }

      if (typeof input === "string") {
        return normalizeIdentifier(input);
      }

      if (typeof input === "object") {
        return normalizeIdentifier(input.identifier ?? input.name);
      }

      return "";
    },
    [
      abilityIdToIdentifier,
      abilityIdToKoreanName,
      getKoreanNameFromApiNames,
      normalizeIdentifier,
      resolveAbilityId,
    ]
  );

  return { getLocalizedAbilityName };
}
