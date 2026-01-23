"use client";

import { useEffect, useState } from "react";
import { fetchAllTypes, type PokeApiType } from "@/features/pokemonTypes/api/typeApi";

let cachedTypes: PokeApiType[] | null = null;
let typesPromise: Promise<PokeApiType[]> | null = null;

async function loadAllTypes(): Promise<PokeApiType[]> {
  if (cachedTypes) {
    return cachedTypes;
  }

  if (typesPromise) {
    return typesPromise;
  }

  typesPromise = fetchAllTypes().then((result) => {
    cachedTypes = result;
    typesPromise = null;
    return result;
  });

  return typesPromise;
}

export function useAllTypesQuery() {
  const [data, setData] = useState<PokeApiType[] | null>(cachedTypes);
  const [isLoading, setIsLoading] = useState(!cachedTypes);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (cachedTypes) {
      return;
    }

    let isMounted = true;
    setTimeout(() => {
      setIsLoading(true);
    }, 0);

    loadAllTypes()
      .then((types) => {
        if (!isMounted) return;
        setData(types);
        setIsLoading(false);
        setIsError(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsLoading(false);
        setIsError(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, isError };
}