import { Metadata } from "next";
import { ItemsList } from "@/features/items/components/ItemsList";

export const metadata: Metadata = {
  title: "도구 리스트 - 포켓몬 게임 어시스턴트",
  description: "다양한 도구를 탐색하고 상세 정보를 확인하세요.",
  openGraph: {
    title: "도구 리스트",
    description: "다양한 도구를 탐색하고 상세 정보를 확인하세요.",
    type: "website",
  },
};

export default function ItemsPage() {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">도구</h2>
          <p className="text-sm text-muted-foreground">다양한 도구를 탐색하세요.</p>
        </div>
      </header>

      <ItemsList />
    </section>
  );
}
