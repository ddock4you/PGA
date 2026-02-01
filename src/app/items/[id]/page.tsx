import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchItem } from "@/features/items/api/itemsApi.server";
import { ItemDetailClient } from "@/features/items/components/ItemDetailClient";
import { DexCsvDataProvider } from "@/lib/dexCsvProvider";
import { loadDexCsvData } from "@/lib/dexCsvData";
import type { Item } from "@/types/pokeapi";

interface PageProps {
  params: Promise<{ id: string }>;
}

// SEO 메타데이터 생성 (서버 사이드)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const item = await fetchItem(id);

    // 한국어 이름 찾기 (임시로 영문 사용 - 추후 한국어 매핑 적용)
    const koreanName = item.name;

    const description =
      item.effect_entries?.find((entry) => entry.language.name === "ko")?.short_effect ||
      item.effect_entries?.find((entry) => entry.language.name === "en")?.short_effect ||
      `${koreanName} 도구의 상세 정보`;

    const structuredData = {
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
    };

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
        "structured-data": JSON.stringify(structuredData),
      },
    };
  } catch {
    return {
      title: "도구 정보",
      description: "도구의 상세 정보를 확인하세요.",
    };
  }
}

// 서버 사이드 데이터 prefetch
export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;

  let item: Item;
  try {
    item = await fetchItem(id);
  } catch {
    notFound();
  }

  const csvData = await loadDexCsvData();

  return (
    <DexCsvDataProvider data={csvData}>
      <ItemDetailClient item={item} />
    </DexCsvDataProvider>
  );
}
