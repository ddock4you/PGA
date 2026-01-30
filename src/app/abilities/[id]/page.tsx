import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAbility } from "@/features/abilities/api/abilitiesApi.server";
import type { PokeApiAbility } from "@/features/abilities/types/pokeApiAbility";
import { getAbilityDisplayName } from "@/features/abilities/utils/getAbilityDisplayName";
import { AbilityDetailClient } from "./AbilityDetailClient";
import { DexCsvDataProvider } from "@/lib/dexCsvProvider";
import { loadDexCsvData } from "@/lib/dexCsvData";

interface PageProps {
  params: Promise<{ id: string }>;
}

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const ability = await fetchAbility(id);

    const koreanName = getAbilityDisplayName(ability);
    const description =
      ability.effect_entries?.find((entry) => entry.language.name === "ko")?.short_effect ||
      ability.effect_entries?.find((entry) => entry.language.name === "en")?.short_effect ||
      `${koreanName} 특성의 상세 정보`;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${koreanName} - 특성 정보`,
      description: description,
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
        description: description,
        termCode: ability.id.toString(),
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "포켓몬 특성",
          description: "포켓몬 게임의 특성 목록",
        },
      },
    };

    return {
      title: `${koreanName} - 특성 정보`,
      description: description,
      openGraph: {
        title: `${koreanName} - 특성 정보`,
        description: description,
        type: "article",
      },
      other: {
        "article:section": "특성",
        "structured-data": JSON.stringify(structuredData),
      },
    };
  } catch {
    return {
      title: "특성 정보",
      description: "특성의 상세 정보를 확인하세요.",
    };
  }
}

// 서버 사이드 데이터 prefetch
export default async function AbilityDetailPage({ params }: PageProps) {
  const { id } = await params;

  let ability: PokeApiAbility;
  try {
    ability = await fetchAbility(id);
  } catch {
    notFound();
  }

  const csvData = await loadDexCsvData();

  return (
    <DexCsvDataProvider data={csvData}>
      <AbilityDetailClient ability={ability} />
    </DexCsvDataProvider>
  );
}
