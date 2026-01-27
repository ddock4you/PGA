export const parseIdFromUrl = (url?: string): number | undefined => {
  if (!url) return undefined;
  const parts = url.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  const id = Number(last);
  return Number.isFinite(id) ? id : undefined;
};

export const formatStat = (value?: number | null) =>
  value === null || value === undefined ? "-" : value;

export const getGenerationFromVersionGroupUrl = (url?: string) => {
  const id = parseIdFromUrl(url);
  return id !== undefined ? getGenerationIdFromVersionGroup(id) : undefined;
};

// TODO: getGenerationIdFromVersionGroup 함수는 dex utils에서 가져와야 함
// 임시로 여기서 정의
const getGenerationIdFromVersionGroup = (versionGroupId: number): number => {
  // This is a simplified mapping - should be imported from generation utils
  const mappings: Record<number, number> = {
    1: 1,
    2: 1,
    3: 1, // Red/Blue/Yellow
    4: 2,
    5: 2, // Gold/Silver/Crystal
    6: 3,
    7: 3,
    8: 3, // Ruby/Sapphire/Emerald
    9: 4,
    10: 4, // Diamond/Pearl/Platinum
    11: 5,
    12: 5, // HeartGold/SoulSilver
    13: 6,
    14: 6, // Black/White
    15: 6, // Black 2/White 2
    16: 7,
    17: 7, // X/Y
    18: 7, // Omega Ruby/Alpha Sapphire
    19: 8,
    20: 8, // Sword/Shield
    21: 8, // Brilliant Diamond/Shining Pearl
    22: 8, // Legends: Arceus
    23: 9,
    24: 9, // Scarlet/Violet
  };
  return mappings[versionGroupId] || 1;
};
