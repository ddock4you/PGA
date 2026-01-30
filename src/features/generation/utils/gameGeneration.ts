import type { GameVersion, GenerationInfo } from "../types/generationTypes";
import { GENERATION_GAME_MAPPING } from "../constants/generationData";

const generationById = new Map<string, GenerationInfo>(
  GENERATION_GAME_MAPPING.map((g) => [g.id, g])
);

const gameById = new Map<string, GameVersion>(
  GENERATION_GAME_MAPPING.flatMap((g) => g.versions.map((v) => [v.id, v] as const))
);

export function getGenerationInfoById(generationId: string): GenerationInfo | undefined {
  return generationById.get(generationId);
}

export function getGameVersionById(gameId: string): GameVersion | undefined {
  return gameById.get(gameId);
}

export function getGenerationInfoByGameId(gameId: string): GenerationInfo | undefined {
  const game = getGameVersionById(gameId);
  if (!game) return undefined;
  return getGenerationInfoById(game.generationId);
}

export function getGenerationIdByGameId(gameId: string): string | undefined {
  return getGameVersionById(gameId)?.generationId;
}

export function getVersionGroupByGameId(gameId: string): string | undefined {
  return getGameVersionById(gameId)?.versionGroup;
}

export function getGenerationLabel(generationId: string): string {
  const gen = getGenerationInfoById(generationId);
  return gen?.name ?? `${generationId}세대`;
}

export function getVersionIdsByGenerationId(generationId: string): string[] {
  const gen = getGenerationInfoById(generationId);
  return gen ? gen.versions.map((v) => v.id) : [];
}
