import { useState } from "react";
import { SearchLandingForm } from "@/features/search/components/SearchLandingForm";

function GenerationHelpDialog(props: { open: boolean; onClose: () => void }) {
  const { open, onClose } = props;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="mx-4 max-w-md rounded-xl bg-card p-5 text-xs text-card-foreground shadow-lg">
        <h2 className="text-sm font-semibold">내 게임은 몇 세대인가요?</h2>
        <p className="mt-2 text-muted-foreground">
          대략적으로는 사용하는 콘솔과 대표 게임 이름으로 세대를 구분할 수 있습니다.
        </p>
        <ul className="mt-3 space-y-1 text-muted-foreground">
          <li>- 닌텐도 스위치 · 스칼렛/바이올렛 → 9세대</li>
          <li>- 닌텐도 스위치 · 소드/실드 → 8세대</li>
          <li>- 3DS · 썬/문, 울트라썬/울트라문 → 7세대</li>
          <li>- DS · 다이아몬드/펄, 블랙/화이트 등 → 4~5세대</li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          정확한 매핑은 나중에 세대/게임 선택 기능이 연결되면 자동으로 처리될 예정입니다.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-primary px-3 py-1.5 text-[11px] text-primary-foreground"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="mt-1 underline underline-offset-4 hover:text-foreground"
        >
          내 게임이 몇 세대인지 모르겠나요?
        </button>
      </div>

      <GenerationHelpDialog open={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </section>
  );
}
