export const CSV_LANGUAGE_ID_KOREAN = 3;
export const CSV_LANGUAGE_ID_ENGLISH = 9;

const TYPE_ID_TO_ENGLISH_NAME: Record<number, string> = {
  1: "normal",
  2: "fighting",
  3: "flying",
  4: "poison",
  5: "ground",
  6: "rock",
  7: "bug",
  8: "ghost",
  9: "steel",
  10: "fire",
  11: "water",
  12: "grass",
  13: "electric",
  14: "psychic",
  15: "ice",
  16: "dragon",
  17: "dark",
  18: "fairy",
};

const TYPE_ID_TO_KOREAN_NAME: Record<number, string> = {
  1: "노말",
  2: "격투",
  3: "비행",
  4: "독",
  5: "땅",
  6: "바위",
  7: "벌레",
  8: "고스트",
  9: "강철",
  10: "불꽃",
  11: "물",
  12: "풀",
  13: "전기",
  14: "에스퍼",
  15: "얼음",
  16: "드래곤",
  17: "악",
  18: "페어리",
};

const KOREAN_TO_ENGLISH_TYPE_NAME: Record<string, string> = {
  노말: "normal",
  격투: "fighting",
  비행: "flying",
  독: "poison",
  땅: "ground",
  바위: "rock",
  벌레: "bug",
  고스트: "ghost",
  강철: "steel",
  불꽃: "fire",
  물: "water",
  풀: "grass",
  전기: "electric",
  에스퍼: "psychic",
  얼음: "ice",
  드래곤: "dragon",
  악: "dark",
  페어리: "fairy",
};

const ENGLISH_TO_KOREAN_TYPE_NAME: Record<string, string> = {
  normal: "노말",
  fighting: "격투",
  flying: "비행",
  poison: "독",
  ground: "땅",
  rock: "바위",
  bug: "벌레",
  ghost: "고스트",
  steel: "강철",
  fire: "불꽃",
  water: "물",
  grass: "풀",
  electric: "전기",
  psychic: "에스퍼",
  ice: "얼음",
  dragon: "드래곤",
  dark: "악",
  fairy: "페어리",
};

export const ALL_KOREAN_TYPE_NAMES: string[] = Array.from({ length: 18 }, (_, i) => {
  const typeId = i + 1;
  return TYPE_ID_TO_KOREAN_NAME[typeId] ?? "unknown";
});

export function getEnglishTypeName(koreanTypeName: string): string {
  return KOREAN_TO_ENGLISH_TYPE_NAME[koreanTypeName] || koreanTypeName.toLowerCase();
}

export function getKoreanTypeName(englishTypeName: string): string {
  return ENGLISH_TO_KOREAN_TYPE_NAME[englishTypeName] || englishTypeName;
}

export function getKoreanTypeNameFromId(typeId: number): string {
  return TYPE_ID_TO_KOREAN_NAME[typeId] || "unknown";
}

export function getEnglishTypeNameFromId(typeId: number): string {
  return TYPE_ID_TO_ENGLISH_NAME[typeId] || "unknown";
}
