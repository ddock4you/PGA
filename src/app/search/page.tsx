import { Metadata } from "next";
import { SearchPageClient } from "@/features/search/components/SearchPageClient";

export const metadata: Metadata = {
  title: "검색 - 포켓몬 게임 어시스턴트",
  description: "포켓몬, 기술, 특성, 도구를 통합 검색하세요.",
};

export default function SearchPage() {
  return <SearchPageClient />;
}
