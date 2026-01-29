import type { Metadata } from "next";
import { TypeChartViewerGate } from "./_components/TypeChartViewerGate";

export const metadata: Metadata = {
  title: "타입 상성표 - 포켓몬 게임 어시스턴트",
  description: "세대별 타입 상성표를 확인하세요.",
  openGraph: {
    title: "타입 상성표",
    description: "세대별 타입 상성표를 확인하세요.",
    type: "website",
  },
};

export default function TypeChartPage() {
  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">타입 상성표</h2>
          <p className="text-sm text-muted-foreground">6세대+를 기본으로, 1세대/2~5세대도 확인할 수 있어요.</p>
        </div>
      </header>

      <TypeChartViewerGate />
    </section>
  );
}
