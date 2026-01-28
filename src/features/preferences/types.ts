export type Theme = "light" | "dark";

export interface PreferencesState {
  theme: Theme;
  selectedGameId: string | null;
  selectedGenerationId: string | null;
  selectedVersionGroup: string | null;
}

export interface PreferencesContextValue {
  state: PreferencesState;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSelectedGameId: (gameId: string | null) => void;
  setSelectedGenerationId: (generationId: string | null) => void;
  setSelectedVersionGroup: (group: string | null) => void;
}
