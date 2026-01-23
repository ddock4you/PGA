"use client";

import { useEffect } from "react";
import {
  GENERATION_VERSION_GROUP_MAP,
  getVersionGroupByGameId,
} from "@/features/generation/constants/generationData";
import { usePreferences } from "@/features/preferences/contexts";
import type { ParsedSearchQueryParams } from "@/lib/utils";

export function useSyncSearchPreferences(parsed: ParsedSearchQueryParams) {
  const { state, setSelectedGenerationId, setSelectedGameId, setSelectedVersionGroup } =
    usePreferences();
  const { selectedGenerationId, selectedGameId, selectedVersionGroup } = state;

  useEffect(() => {
    if (parsed.generationId && parsed.generationId !== selectedGenerationId) {
      setSelectedGenerationId(parsed.generationId);
      if (!parsed.gameId) {
        setSelectedVersionGroup(GENERATION_VERSION_GROUP_MAP[parsed.generationId] ?? null);
      }
    }

    if (parsed.gameId && parsed.gameId !== selectedGameId) {
      setSelectedGameId(parsed.gameId);
      const versionGroup =
        getVersionGroupByGameId(parsed.gameId) ??
        (parsed.generationId
          ? GENERATION_VERSION_GROUP_MAP[parsed.generationId]
          : selectedVersionGroup);
      setSelectedVersionGroup(versionGroup ?? null);
    }
  }, [
    parsed,
    selectedGenerationId,
    selectedGameId,
    selectedVersionGroup,
    setSelectedGenerationId,
    setSelectedGameId,
    setSelectedVersionGroup,
  ]);
}
