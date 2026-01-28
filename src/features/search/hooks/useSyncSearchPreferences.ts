"use client";

import { useEffect } from "react";
import {
  GENERATION_VERSION_GROUP_MAP,
  getVersionGroupByGameId,
} from "@/features/generation/constants/generationData";
import { usePreferences } from "@/features/preferences";
import type { ParsedSearchQueryParams } from "@/lib/utils";

export function useSyncSearchPreferences(parsed: ParsedSearchQueryParams) {
  const { state, setSelectedGenerationId, setSelectedGameId, setSelectedVersionGroup } =
    usePreferences();
  const { selectedGenerationId, selectedGameId, selectedVersionGroup } = state;

  const safeGenerationId = parsed.generationId === "unified" ? null : parsed.generationId;

  useEffect(() => {
    if (safeGenerationId && safeGenerationId !== selectedGenerationId) {
      setSelectedGenerationId(safeGenerationId);
      if (!parsed.gameId) {
        setSelectedVersionGroup(GENERATION_VERSION_GROUP_MAP[safeGenerationId] ?? null);
      }
    }

    if (parsed.gameId && parsed.gameId !== selectedGameId) {
      setSelectedGameId(parsed.gameId);
      const versionGroup =
        getVersionGroupByGameId(parsed.gameId) ??
        (safeGenerationId
          ? GENERATION_VERSION_GROUP_MAP[safeGenerationId]
          : selectedVersionGroup);
      setSelectedVersionGroup(versionGroup ?? null);
    }
  }, [
    parsed,
    safeGenerationId,
    selectedGenerationId,
    selectedGameId,
    selectedVersionGroup,
    setSelectedGenerationId,
    setSelectedGameId,
    setSelectedVersionGroup,
  ]);
}
