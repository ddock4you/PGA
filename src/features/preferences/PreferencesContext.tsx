"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PREFERENCES_STORAGE_KEY } from "./constants";
import { applyThemeToDocument } from "./theme";
import type { PreferencesContextValue, PreferencesState, Theme } from "./types";

const defaultState: PreferencesState = {
  theme: "light",
  selectedGameId: null,
  selectedGenerationId: null,
  selectedVersionGroup: null,
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

function loadInitialState(): PreferencesState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);

    if (!raw) {
      // White(=light) is always the default theme.
      // Note: if a user previously selected dark, it will be loaded from storage.
      return defaultState;
    }

    const parsed = JSON.parse(raw) as Partial<PreferencesState>;

    return {
      ...defaultState,
      ...parsed,
    };
  } catch {
    return defaultState;
  }
}

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [state, setState] = useState<PreferencesState>(() => loadInitialState());

  useEffect(() => {
    applyThemeToDocument(state.theme);
  }, [state.theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage failure
    }
  }, [state]);

  const setTheme = useCallback((theme: Theme) => {
    setState((prev) => ({
      ...prev,
      theme,
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }, []);

  const setSelectedGameId = useCallback((gameId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedGameId: gameId,
    }));
  }, []);

  const setSelectedGenerationId = useCallback((generationId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedGenerationId: generationId,
    }));
  }, []);

  const setSelectedVersionGroup = useCallback((group: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedVersionGroup: group,
    }));
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      state,
      setTheme,
      toggleTheme,
      setSelectedGameId,
      setSelectedGenerationId,
      setSelectedVersionGroup,
    }),
    [
      state,
      setTheme,
      toggleTheme,
      setSelectedGameId,
      setSelectedGenerationId,
      setSelectedVersionGroup,
    ]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);

  if (!ctx) {
    throw new Error("usePreferences 훅은 PreferencesProvider 내부에서만 사용할 수 있습니다.");
  }

  return ctx;
}
