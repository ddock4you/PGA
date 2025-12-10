import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import i18n from "i18next";

type Theme = "light" | "dark";

type LanguageCode = "ko" | "en" | "ja";

interface PreferencesState {
  theme: Theme;
  primaryLanguage: LanguageCode;
  secondaryLanguage: LanguageCode | null;
  selectedGameId: string | null;
  selectedGenerationId: string | null;
  selectedVersionGroup: string | null;
}

interface PreferencesContextValue {
  state: PreferencesState;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setPrimaryLanguage: (lang: LanguageCode) => void;
  setSecondaryLanguage: (lang: LanguageCode | null) => void;
  setSelectedGameId: (gameId: string | null) => void;
  setSelectedGenerationId: (generationId: string | null) => void;
  setSelectedVersionGroup: (group: string | null) => void;
}

const PREFERENCES_STORAGE_KEY = "pga.preferences.v1";

const defaultState: PreferencesState = {
  theme: "dark",
  primaryLanguage: "ko",
  secondaryLanguage: null,
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
      const prefersDark =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

      return {
        ...defaultState,
        theme: prefersDark ? "dark" : "light",
      };
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

  // 테마 상태 → documentElement.classList("dark") 및 color-scheme 반영
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    if (state.theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.style.colorScheme = state.theme;
  }, [state.theme]);

  // Preferences 전체를 localStorage 에 저장
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // 저장 실패는 조용히 무시
    }
  }, [state]);

  // primaryLanguage 변경 시 i18n에 반영
  useEffect(() => {
    if (!i18n.isInitialized) return;

    void i18n.changeLanguage(state.primaryLanguage);
  }, [state.primaryLanguage]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      state,
      setTheme: (theme) =>
        setState((prev) => ({
          ...prev,
          theme,
        })),
      toggleTheme: () =>
        setState((prev) => ({
          ...prev,
          theme: prev.theme === "dark" ? "light" : "dark",
        })),
      setPrimaryLanguage: (lang) =>
        setState((prev) => ({
          ...prev,
          primaryLanguage: lang,
        })),
      setSecondaryLanguage: (lang) =>
        setState((prev) => ({
          ...prev,
          secondaryLanguage: lang,
        })),
      setSelectedGameId: (gameId) =>
        setState((prev) => ({
          ...prev,
          selectedGameId: gameId,
        })),
      setSelectedGenerationId: (generationId) =>
        setState((prev) => ({
          ...prev,
          selectedGenerationId: generationId,
        })),
      setSelectedVersionGroup: (group) =>
        setState((prev) => ({
          ...prev,
          selectedVersionGroup: group,
        })),
    }),
    [state]
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
