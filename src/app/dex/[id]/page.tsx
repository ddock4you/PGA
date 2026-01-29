import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonEncounters,
} from "@/features/pokemon/api/pokemonApi.server";
import { PokemonDetailClient } from "./PokemonDetailClient";
import { DexCsvDataProvider } from "@/lib/dexCsvProvider";
import { loadDexCsvData } from "@/lib/dexCsvData";
import type {
  PokeApiEncounter,
  PokeApiEvolutionChain,
  PokeApiPokemon,
  PokeApiPokemonSpecies,
} from "@/features/pokemon/types/pokeApiTypes";
import { cache } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const loadPokemonDetail = cache(async (id: string) => {
  const pokemonPromise = fetchPokemon(id);
  const speciesPromise = fetchPokemonSpecies(id);
  const encountersPromise = fetchPokemonEncounters(id);

  const evolutionChainPromise = speciesPromise.then((species) =>
    species.evolution_chain?.url
      ? fetchEvolutionChain(species.evolution_chain.url)
      : Promise.resolve(undefined)
  );

  const [pokemon, species, encounters, evolutionChain] = await Promise.all([
    pokemonPromise,
    speciesPromise,
    encountersPromise,
    evolutionChainPromise,
  ]);

  return { pokemon, species, evolutionChain, encounters };
});

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { pokemon, species } = await loadPokemonDetail(id);

    const koreanName =
      species.names.find((name) => name.language.name === "ko")?.name || pokemon.name;
    const koreanFlavorText = species.flavor_text_entries.find(
      (entry) => entry.language.name === "ko"
    )?.flavor_text;

    const artworkUrl =
      pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${koreanName} - 포켓몬 도감`,
      description: koreanFlavorText || `${koreanName} 포켓몬의 상세 정보`,
      image: artworkUrl,
      author: {
        "@type": "Organization",
        name: "포켓몬 게임 어시스턴트",
      },
      publisher: {
        "@type": "Organization",
        name: "포켓몬 게임 어시스턴트",
      },
      mainEntity: {
        "@type": "DefinedTerm",
        name: koreanName,
        description: koreanFlavorText || `${koreanName} 포켓몬`,
        termCode: pokemon.id.toString(),
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "포켓몬 도감",
          description: "포켓몬 게임의 포켓몬 도감",
        },
      },
    };

    return {
      title: `${koreanName} - 포켓몬 도감`,
      description: koreanFlavorText || `${koreanName} 포켓몬의 상세 정보`,
      openGraph: {
        title: `${koreanName} - 포켓몬 도감`,
        description: koreanFlavorText || `${koreanName} 포켓몬의 상세 정보`,
        images: [
          {
            url: artworkUrl,
            width: 400,
            height: 400,
            alt: koreanName,
          },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${koreanName} - 포켓몬 도감`,
        description: koreanFlavorText || `${koreanName} 포켓몬의 상세 정보`,
        images: [artworkUrl],
      },
      other: {
        "article:section": "포켓몬",
        "article:tag": pokemon.types.map((t) => t.type.name).join(", "),
        "article:published_time": species.generation?.name || "unknown",
        "structured-data": JSON.stringify(jsonLd),
      },
    };
  } catch {
    return {
      title: "포켓몬 정보 - 포켓몬 도감",
      description: "포켓몬 상세 정보를 확인하세요.",
    };
  }
}

// 서버 사이드 데이터 prefetch
export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;

  let pokemon: PokeApiPokemon;
  let species: PokeApiPokemonSpecies;
  let evolutionChain: PokeApiEvolutionChain | undefined;
  let encounters: PokeApiEncounter[];

  try {
    const detail = await loadPokemonDetail(id);
    pokemon = detail.pokemon;
    species = detail.species;
    evolutionChain = detail.evolutionChain;
    encounters = detail.encounters;
  } catch {
    notFound();
  }

  const csvData = await loadDexCsvData();

  return (
    <DexCsvDataProvider data={csvData}>
      <PokemonDetailClient
        pokemon={pokemon}
        species={species}
        evolutionChain={evolutionChain}
        encounters={encounters}
      />
    </DexCsvDataProvider>
  );
}
