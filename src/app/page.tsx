import { Metadata } from "next";
import { SearchLandingForm } from "@/features/search/components/SearchLandingForm";

export const metadata: Metadata = {
  title: "포켓몬 게임 어시스턴트 - 홈",
  description: "플레이 중인 게임/세대를 선택하고 포켓몬·기술·특성·도구를 검색해보세요.",
};

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 pt-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">포켓몬 게임 어시스턴트</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          플레이 중인 게임/세대를 선택하고 포켓몬·기술·특성·도구를 검색해 보세요.
        </p>
      </div>
      <SearchLandingForm />
      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <p>예: 피카츄, 번개, 위협, 생명의구슬 ...</p>
      </div>
    </section>
  );
}
