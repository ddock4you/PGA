import type { Metadata } from "next";
import { SearchPageClient } from "@/features/search/components/SearchPageClient";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const qRaw = resolvedSearchParams.q;
  const query = (Array.isArray(qRaw) ? qRaw[0] : qRaw)?.trim();

  if (!query) {
    return {
      title: "검색 - 포켓몬 게임 어시스턴트",
      description: "포켓몬, 기술, 특성, 도구를 통합 검색하세요.",
    };
  }

  return {
    title: `"${query}" 검색 결과 - 포켓몬 게임 어시스턴트`,
    description: `"${query}"에 대한 포켓몬, 기술, 특성, 도구 검색 결과를 확인하세요.`,
    openGraph: {
      title: `"${query}" 검색 결과`,
      description: `"${query}"에 대한 포켓몬, 기술, 특성, 도구 검색 결과를 확인하세요.`,
      type: "website",
    },
  };
}

export default function SearchPage() {
  return <SearchPageClient />;
}
