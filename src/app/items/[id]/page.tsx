import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchItem } from "@/features/items/api/itemsApi";
import { ItemDetailClient } from "./ItemDetailClient";

interface PageProps {
  params: { id: string };
}

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const item = await fetchItem(resolvedParams.id);

    // 한국어 이름 찾기 (임시로 영문 사용 - 추후 한국어 매핑 적용)
    const koreanName = item.name;

    const description =
      item.effect_entries?.find((e: any) => e.language.name === "ko")?.short_effect ||
      item.effect_entries?.find((e: any) => e.language.name === "en")?.short_effect ||
      `${koreanName} 도구의 상세 정보`;

    return {
      title: `${koreanName} - 도구 정보`,
      description: description,
      openGraph: {
        title: `${koreanName} - 도구 정보`,
        description: description,
        type: "article",
      },
      other: {
        "article:section": "도구",
        "article:tag": item.category?.name || "아이템",
      },
      structuredData: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${koreanName} - 도구 정보`,
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
          termCode: item.id.toString(),
          inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "포켓몬 도구",
            description: "포켓몬 게임의 도구 목록",
          },
        },
      },
    };
  } catch (error) {
    return {
      title: "도구 정보",
      description: "도구의 상세 정보를 확인하세요.",
    };
  }
}

// 서버 사이드 데이터 prefetch
export default async function ItemDetailPage({ params }: PageProps) {
  try {
    // 서버 사이드에서 데이터 미리 가져오기
    const resolvedParams = await params;
    const item = await fetchItem(resolvedParams.id);

    return <ItemDetailClient initialItem={item} itemId={resolvedParams.id} />;
  } catch (error) {
    notFound();
  }
}
