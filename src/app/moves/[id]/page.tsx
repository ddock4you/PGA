import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchMove } from "@/features/moves/api/movesApi";
import { MoveDetailClient } from "./MoveDetailClient";

interface PageProps {
  params: { id: string };
}

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const move = await fetchMove(resolvedParams.id);

    // 한국어 이름 찾기 (임시로 영문 사용 - 추후 한국어 매핑 적용)
    const koreanName = move.name;

    const description =
      move.effect_entries?.find((e: any) => e.language.name === "ko")?.short_effect ||
      move.effect_entries?.find((e: any) => e.language.name === "en")?.short_effect ||
      `${koreanName} 기술의 상세 정보`;

    return {
      title: `${koreanName} - 기술 정보`,
      description: `${description} (위력: ${move.power || "N/A"}, 명중률: ${
        move.accuracy || "N/A"
      }%)`,
      openGraph: {
        title: `${koreanName} - 기술 정보`,
        description: description,
        type: "article",
      },
      other: {
        "article:section": "기술",
        "article:tag": move.damage_class.name,
      },
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${koreanName} - 기술 정보`,
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
          termCode: move.id.toString(),
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "포켓몬 기술",
            description: "포켓몬 게임의 기술 목록",
          },
        },
      },
    };
  } catch (error) {
    return {
      title: "기술 정보",
      description: "기술의 상세 정보를 확인하세요.",
    };
  }
}

// 서버 사이드 데이터 prefetch
export default async function MoveDetailPage({ params }: PageProps) {
  try {
    // 서버 사이드에서 데이터 미리 가져오기
    const resolvedParams = await params;
    const move = await fetchMove(resolvedParams.id);

    return <MoveDetailClient initialMove={move} moveId={resolvedParams.id} />;
  } catch (error) {
    notFound();
  }
}
