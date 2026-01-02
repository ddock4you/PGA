import { Metadata } from "next";
import { DexPokemonTab } from "@/features/dex/components/DexPokemonTab";
import { DexFilterProvider } from "@/features/dex/contexts/DexFilterContext";

export const metadata: Metadata = {
  title: "포켓몬 도감 - 포켓몬 게임 어시스턴트",
  description: "다양한 포켓몬을 탐색하고 상세 정보를 확인하세요.",
  openGraph: {
    title: "포켓몬 도감",
    description: "다양한 포켓몬을 탐색하고 상세 정보를 확인하세요.",
    type: "website",
  },
};

export default function DexPage() {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">포켓몬 도감</h2>
          <p className="text-sm text-muted-foreground">다양한 포켓몬을 탐색하세요.</p>
        </div>
      </header>

      <DexFilterProvider>
        <DexPokemonTab />
      </DexFilterProvider>
    </section>
  );
}
