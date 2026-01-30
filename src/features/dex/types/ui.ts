import type { ReactNode } from "react";
import type { GameVersion } from "@/features/generation";
import type { DexFilters } from "./filterTypes";

export interface DexFilterContextType {
  filters: DexFilters;
  searchQuery: string;
  updateFilters: (filters: DexFilters | Partial<DexFilters>) => void;
  updateSearchQuery: (query: string) => void;
  updatePagination: (page: number) => void;
  resetFilters: () => void;
}

export interface DexFilterProviderProps {
  children: ReactNode;
}

export interface DexFilterBarProps {
  filters: DexFilters;
  searchQuery: string;
  onFiltersChange: (filters: DexFilters | Partial<DexFilters>) => void;
  onSearchQueryChange: (value: string) => void;
  onReset?: () => void;
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
