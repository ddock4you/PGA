"use client";

import { useCallback } from "react";

const ARTWORK_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

type PokemonResource = {
  name?: string;
  url?: string;
};

function extractPokemonId(resource?: PokemonResource | string | number) {
  if (typeof resource === "number") return resource;
  if (typeof resource === "string") {
    const match = resource.match(/\/pokemon\/(\d+)\//) || resource.match(/^(\d+)$/);
    return match ? Number(match[1]) : undefined;
  }
  if (!resource?.url) return undefined;

  const match = resource.url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : undefined;
}

export function usePokemonArtwork() {
  const getArtworkUrl = useCallback((resource?: PokemonResource | string | number) => {
    const id = extractPokemonId(resource);
    if (!id) return "";
    return `${ARTWORK_BASE_URL}/${id}.png`;
  }, []);

  return { getArtworkUrl };
}
