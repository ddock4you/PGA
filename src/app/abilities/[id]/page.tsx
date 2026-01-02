import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAbility } from "@/lib/pokeapi";
import { AbilityDetailClient } from "./AbilityDetailClient";

interface PageProps {
  params: { id: string };
}

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const ability = await fetchAbility(params.id);

    // 한국어 이름 찾기 (임시로 영문 사용 - 추후 한국어 매핑 적용)
    const koreanName = ability.name;

    const description =
      ability.effect_entries?.find((e: any) => e.language.name === "ko")?.short_effect ||
      ability.effect_entries?.find((e: any) => e.language.name === "en")?.short_effect ||
      `${koreanName} 특성의 상세 정보`;

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
      },
      structuredData: {
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
      },
    };
  } catch (error) {
    return {
      title: "특성 정보",
      description: "특성의 상세 정보를 확인하세요.",
    };
  }
}

// 서버 사이드 데이터 prefetch
export default async function AbilityDetailPage({ params }: PageProps) {
  try {
    // 서버 사이드에서 데이터 미리 가져오기
    const ability = await fetchAbility(params.id);

    return <AbilityDetailClient initialAbility={ability} abilityId={params.id} />;
  } catch (error) {
    notFound();
  }
}
