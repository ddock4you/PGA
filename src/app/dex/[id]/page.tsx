import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPokemon, fetchPokemonSpecies } from "@/lib/pokeapi";
import { PokemonDetailClient } from "./PokemonDetailClient";

interface PageProps {
  params: { id: string };
}

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const [pokemon, species] = await Promise.all([
      fetchPokemon(params.id),
      fetchPokemonSpecies(params.id),
    ]);

    // 한국어 이름 찾기
    const koreanName =
      species.names.find((name: any) => name.language.name === "ko")?.name || pokemon.name;

    // 한국어 도감 설명 찾기
    const koreanFlavorText = species.flavor_text_entries.find(
      (entry) => entry.language.name === "ko"
    )?.flavor_text;

    // 구조화된 데이터 생성
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${koreanName} - 포켓몬 도감`,
      description: koreanFlavorText || `${koreanName} 포켓몬의 상세 정보`,
      image:
        pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
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
            url:
              pokemon.sprites.other["official-artwork"].front_default ||
              pokemon.sprites.front_default,
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
        images: [
          pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
        ],
      },
      other: {
        "article:section": "포켓몬",
        "article:tag": pokemon.types.map((t: any) => t.type.name).join(", "),
        "article:published_time": species.generation?.name || "unknown",
      },
      structuredData: jsonLd,
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
  try {
    // 서버 사이드에서 데이터 미리 가져오기
    const [pokemon, species] = await Promise.all([
      fetchPokemon(params.id),
      fetchPokemonSpecies(params.id),
    ]);

    return (
      <PokemonDetailClient
        initialPokemon={pokemon}
        initialSpecies={species}
        pokemonId={params.id}
      />
    );
  } catch (error) {
    notFound();
  }
}
