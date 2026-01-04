"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { DexCsvDataContext } from "@/lib/dexCsvProvider";
import type { DexCsvData } from "@/lib/dexCsvData";

export function useDexCsvData() {
  const context = useContext(DexCsvDataContext);

  const [state, setState] = useState<{
    data: DexCsvData | null;
    isLoading: boolean;
    errors: Error[];
  }>(() => ({
    data: context ?? null,
    isLoading: context ? false : true,
    errors: [],
  }));

  useEffect(() => {
    if (context) {
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        const dexCsvModule = await import("@/lib/dexCsvData");
        const loaded = await dexCsvModule.loadDexCsvData();
        if (!isMounted) return;
        setState({ data: loaded, isLoading: false, errors: [] });
      } catch (error) {
        if (!isMounted) return;
        setState({
          data: null,
          isLoading: false,
          errors: [error instanceof Error ? error : new Error(String(error))],
        });
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [context]);

  const memoizedData = useMemo(() => state.data ?? ({} as DexCsvData), [state.data]);

  const baseData = context ?? memoizedData;

  return {
    pokemonData: baseData.pokemonData ?? [],
    movesData: baseData.movesData ?? [],
    moveNamesData: baseData.moveNamesData ?? [],
    machinesData: baseData.machinesData ?? [],
    versionGroupsData: baseData.versionGroupsData ?? [],
    naturesData: baseData.naturesData ?? [],
    abilitiesData: baseData.abilitiesData ?? [],
    abilityNamesData: baseData.abilityNamesData ?? [],
    pokemonSpeciesNamesData: baseData.pokemonSpeciesNamesData ?? [],
    itemsData: baseData.itemsData ?? [],
    itemNamesData: baseData.itemNamesData ?? [],
    pokemonTypesData: baseData.pokemonTypesData ?? [],
    pokemonAbilitiesData: baseData.pokemonAbilitiesData ?? [],
    isLoading: context ? false : state.isLoading,
    isError: context ? false : state.errors.length > 0,
    errors: context ? [] : state.errors,
  };
}
