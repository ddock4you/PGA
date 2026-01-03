import { useContext, useEffect, useMemo, useState } from "react";
import { DexCsvDataContext } from "@/lib/dexCsvProvider";
import type { DexCsvData } from "@/lib/dexCsvData";

export function useDexCsvData() {
  const context = useContext(DexCsvDataContext);

  if (context) {
    return {
      pokemonData: context.pokemonData,
      movesData: context.movesData,
      moveNamesData: context.moveNamesData,
      machinesData: context.machinesData,
      versionGroupsData: context.versionGroupsData,
      naturesData: context.naturesData,
      abilitiesData: context.abilitiesData,
      abilityNamesData: context.abilityNamesData,
      pokemonSpeciesNamesData: context.pokemonSpeciesNamesData,
      itemsData: context.itemsData,
      itemNamesData: context.itemNamesData,
      pokemonTypesData: context.pokemonTypesData,
      pokemonAbilitiesData: context.pokemonAbilitiesData,
      isLoading: false,
      isError: false,
      errors: [],
    };
  }

  const [state, setState] = useState<{
    data: DexCsvData | null;
    isLoading: boolean;
    errors: Error[];
  }>({
    data: null,
    isLoading: true,
    errors: [],
  });

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const module = await import("@/lib/dexCsvData");
        const loaded = await module.loadDexCsvData();
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
  }, []);

  const memoizedData = useMemo(() => state.data ?? ({} as DexCsvData), [state.data]);

  return {
    pokemonData: memoizedData.pokemonData ?? [],
    movesData: memoizedData.movesData ?? [],
    moveNamesData: memoizedData.moveNamesData ?? [],
    machinesData: memoizedData.machinesData ?? [],
    versionGroupsData: memoizedData.versionGroupsData ?? [],
    naturesData: memoizedData.naturesData ?? [],
    abilitiesData: memoizedData.abilitiesData ?? [],
    abilityNamesData: memoizedData.abilityNamesData ?? [],
    pokemonSpeciesNamesData: memoizedData.pokemonSpeciesNamesData ?? [],
    itemsData: memoizedData.itemsData ?? [],
    itemNamesData: memoizedData.itemNamesData ?? [],
    pokemonTypesData: memoizedData.pokemonTypesData ?? [],
    pokemonAbilitiesData: memoizedData.pokemonAbilitiesData ?? [],
    isLoading: state.isLoading,
    isError: state.errors.length > 0,
    errors: state.errors,
  };
}
