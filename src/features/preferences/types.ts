export type Theme = "light" | "dark";

export type TypeChartId = "gen6plus" | "gen2to5" | "gen1";

export interface PreferencesState {
  theme: Theme;
  selectedGameId: string | null;
  selectedGenerationId: string | null;
  selectedVersionGroup: string | null;
  typeChartId: TypeChartId;
}

export interface PreferencesContextValue {
  state: PreferencesState;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSelectedGameId: (gameId: string | null) => void;
  setSelectedGenerationId: (generationId: string | null) => void;
  setSelectedVersionGroup: (group: string | null) => void;
  setTypeChartId: (chartId: TypeChartId) => void;
}
