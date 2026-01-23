"use client";
import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { DEFAULT_DEX_FILTERS, type DexFilters } from "../types/filterTypes";
import type {
  DexFilterAction,
  DexFilterContextType,
  DexFilterProviderProps,
} from "../types/ui";

// Context 생성
const DexFilterContext = createContext<DexFilterContextType | undefined>(undefined);

// localStorage 키
const DEX_FILTERS_STORAGE_KEY = "dex-filters";
const DEX_SEARCH_STORAGE_KEY = "dex-search-query";

// Reducer 함수
function dexFilterReducer(
  state: { filters: DexFilters; searchQuery: string },
  action: DexFilterAction
) {
  switch (action.type) {
    case "UPDATE_FILTERS": {
      const newFilters = { ...state.filters, ...action.payload };
      return { ...state, filters: newFilters };
    }

    case "UPDATE_SEARCH":
      return { ...state, searchQuery: action.payload };

    case "UPDATE_PAGINATION":
      return { ...state, filters: { ...state.filters, currentPage: action.payload } };

    case "RESET_FILTERS":
      return { filters: { ...DEFAULT_DEX_FILTERS, dexGenerationId: "9" }, searchQuery: "" };

    case "LOAD_FROM_STORAGE":
      return action.payload;

    default:
      return state;
  }
}

const DEFAULT_STATE = {
  filters: { ...DEFAULT_DEX_FILTERS, dexGenerationId: "9" },
  searchQuery: "",
};

function loadFromStorage(): { filters: DexFilters; searchQuery: string } {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const filtersData = localStorage.getItem(DEX_FILTERS_STORAGE_KEY);
    const searchData = localStorage.getItem(DEX_SEARCH_STORAGE_KEY);

    const savedFilters = filtersData ? JSON.parse(filtersData) : null;
    const savedSearch = searchData || "";

    const filters: DexFilters = savedFilters
      ? {
          ...DEFAULT_DEX_FILTERS,
          ...savedFilters,
        }
      : { ...DEFAULT_DEX_FILTERS, dexGenerationId: "9" };

    return { filters, searchQuery: savedSearch };
  } catch (error) {
    console.warn("Failed to load dex filters from storage:", error);
    return DEFAULT_STATE;
  }
}

function saveToStorage(filters: DexFilters, searchQuery: string) {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }

  try {
    localStorage.setItem(DEX_FILTERS_STORAGE_KEY, JSON.stringify(filters));
    localStorage.setItem(DEX_SEARCH_STORAGE_KEY, searchQuery);
  } catch (error) {
    console.warn("Failed to save dex filters to storage:", error);
  }
}

// Provider 컴포넌트
export function DexFilterProvider({ children }: DexFilterProviderProps) {
  const [state, dispatch] = useReducer(dexFilterReducer, DEFAULT_STATE);

  useEffect(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    const storedData = loadFromStorage();
    dispatch({ type: "LOAD_FROM_STORAGE", payload: storedData });
  }, []);

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    saveToStorage(state.filters, state.searchQuery);
  }, [state.filters, state.searchQuery]);

  const updateFilters = useCallback((newFilters: DexFilters | Partial<DexFilters>) => {
    dispatch({ type: "UPDATE_FILTERS", payload: newFilters });
  }, []);

  const updateSearchQuery = useCallback((query: string) => {
    dispatch({ type: "UPDATE_SEARCH", payload: query });
  }, []);

  const updatePagination = useCallback((page: number) => {
    dispatch({ type: "UPDATE_PAGINATION", payload: page });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);

  const contextValue: DexFilterContextType = {
    filters: state.filters,
    searchQuery: state.searchQuery,
    updateFilters,
    updateSearchQuery,
    updatePagination,
    resetFilters,
  };

  return <DexFilterContext.Provider value={contextValue}>{children}</DexFilterContext.Provider>;
}

// Context 사용을 위한 커스텀 훅
export function useDexFilters() {
  const context = useContext(DexFilterContext);
  if (context === undefined) {
    throw new Error("useDexFilters must be used within a DexFilterProvider");
  }
  return context;
}
