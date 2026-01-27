import { LANGUAGE_MAP } from "../types/unifiedSearchTypes";
import type { LanguageCode } from "../types/unifiedSearchTypes";

// 언어 ID에서 언어 코드를 가져오는 함수
export function getLanguageCode(languageId: number): LanguageCode | null {
  return LANGUAGE_MAP[languageId as keyof typeof LANGUAGE_MAP] || null;
}

// 이름 배열에서 한국어 이름을 추출하는 함수
export function extractLocalizedNames(
  names: Array<{ local_language_id: number; name: string }>
): string {
  for (const nameEntry of names) {
    const lang = getLanguageCode(nameEntry.local_language_id);
    if (lang === "ko") {
      return nameEntry.name;
    }
  }

  // 한국어 이름이 없으면 영어 이름 반환 (fallback)
  for (const nameEntry of names) {
    const lang = getLanguageCode(nameEntry.local_language_id);
    if (lang === "en") {
      return nameEntry.name;
    }
  }

  // 영어 이름도 없으면 첫 번째 이름 반환
  return names[0]?.name || "";
}

// 단일 이름 항목에서 다국어 이름을 추출하는 함수 (ID 기반 그룹화용)
export function groupNamesById<T extends { id: number }>(
  _items: T[],
  names: Array<{ id: number; local_language_id: number; name: string }>
): Map<number, Array<{ local_language_id: number; name: string }>> {
  const nameGroups = new Map<number, Array<{ local_language_id: number; name: string }>>();

  // ID별로 이름 그룹화
  for (const nameEntry of names) {
    const id = nameEntry.id as number;
    if (!nameGroups.has(id)) {
      nameGroups.set(id, []);
    }
    nameGroups.get(id)!.push({
      local_language_id: nameEntry.local_language_id,
      name: nameEntry.name,
    });
  }

  return nameGroups;
}

// 특정 ID의 한국어 이름을 가져오는 함수
export function getLocalizedNamesForId(
  id: number,
  nameGroups: Map<number, Array<{ local_language_id: number; name: string }>>
): string {
  const names = nameGroups.get(id) || [];
  return extractLocalizedNames(names);
}
