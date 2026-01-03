import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchPokemonEncounters,
} from "@/features/pokemon/api/pokemonApi";
import { PokemonDetailClient } from "./PokemonDetailClient";
import { DexCsvDataProvider } from "@/lib/dexCsvProvider";
import { loadDexCsvData } from "@/lib/dexCsvData";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const [pokemon, species] = await Promise.all([fetchPokemon(id), fetchPokemonSpecies(id)]);

    const koreanName =
      species.names.find((name: any) => name.language.name === "ko")?.name || pokemon.name;
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
        "article:tag": pokemon.types.map((t: any) => t.type.name).join(", "),
        "article:published_time": species.generation?.name || "unknown",
        "structured-data": JSON.stringify(jsonLd),
      },
    };
  } catch (error) {
    return {
      title: "포켓몬 정보 - 포켓몬 도감",
      description: "포켓몬 상세 정보를 확인하세요.",
    };
  }
}

// 서버 사이드 데이터 prefetch
export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const [pokemon, species] = await Promise.all([fetchPokemon(id), fetchPokemonSpecies(id)]);
    const evolutionChain = species.evolution_chain?.url
      ? await fetchEvolutionChain(species.evolution_chain.url)
      : undefined;
    const encounters = await fetchPokemonEncounters(id);
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
  } catch (error) {
    notFound();
  }
}
