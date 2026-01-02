import { Metadata } from "next";
import { AbilitiesList } from "@/features/abilities/components/AbilitiesList";

export const metadata: Metadata = {
  title: "특성 리스트 - 포켓몬 게임 어시스턴트",
  description: "다양한 특성을 탐색하고 상세 정보를 확인하세요.",
  openGraph: {
    title: "특성 리스트",
    description: "다양한 특성을 탐색하고 상세 정보를 확인하세요.",
    type: "website",
  },
};

export default function AbilitiesPage() {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">특성</h2>
          <p className="text-sm text-muted-foreground">다양한 특성을 탐색하세요.</p>
        </div>
      </header>

      <AbilitiesList />
    </section>
  );
}
