import { Metadata } from "next";
import { MovesList } from "@/features/moves/components/MovesList";

export const metadata: Metadata = {
  title: "기술 리스트 - 포켓몬 게임 어시스턴트",
  description: "다양한 기술을 탐색하고 상세 정보를 확인하세요.",
  openGraph: {
    title: "기술 리스트",
    description: "다양한 기술을 탐색하고 상세 정보를 확인하세요.",
    type: "website",
  },
};

export default function MovesPage() {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">기술</h2>
          <p className="text-sm text-muted-foreground">다양한 기술을 탐색하세요.</p>
        </div>
      </header>

      <MovesList />
    </section>
  );
}
