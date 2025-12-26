import { MovesList } from "@/features/moves/components/MovesList";

export function MovesPage() {
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
