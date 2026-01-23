import type { ReactNode } from "react";
import type { GameVersion } from "@/features/generation/types/generationTypes";
import type { DexFilters } from "./filterTypes";

export interface DexFilterContextType {
  filters: DexFilters;
  searchQuery: string;
  updateFilters: (filters: DexFilters | Partial<DexFilters>) => void;
  updateSearchQuery: (query: string) => void;
  updatePagination: (page: number) => void;
  resetFilters: () => void;
}

export type DexFilterAction =
  | { type: "UPDATE_FILTERS"; payload: Partial<DexFilters> }
  | { type: "UPDATE_SEARCH"; payload: string }
  | { type: "UPDATE_PAGINATION"; payload: number }
  | { type: "RESET_FILTERS" }
  | { type: "LOAD_FROM_STORAGE"; payload: { filters: DexFilters; searchQuery: string } };

export interface DexFilterProviderProps {
  children: ReactNode;
}

export interface DexFilterBarProps {
  filters: DexFilters;
  searchQuery: string;
  onFiltersChange: (filters: DexFilters) => void;
  onSearchQueryChange: (value: string) => void;
  description?: string;
}

export interface DexTypeFilterProps {
  selectedTypes: number[];
  onTypesChange: (types: number[]) => void;
}

export interface DexGenerationSelectorProps {
  generationId: string;
  selectedGameVersion?: GameVersion;
  onGenerationChange: (generationId: string, gameVersion?: GameVersion) => void;
}
