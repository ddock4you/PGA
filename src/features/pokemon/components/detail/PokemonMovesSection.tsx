import type { PokemonMovesSectionProps } from "./moves/types/moveTypes";
import { usePokemonMovesData } from "@/features/pokemon/hooks/usePokemonMovesData";
import { LevelUpMovesTable } from "./moves/components/LevelUpMovesTable";
import { TmHmMovesTable } from "./moves/components/TmHmMovesTable";
import { TutorMovesTable } from "./moves/components/TutorMovesTable";
import { OtherMethodMovesTable } from "./moves/components/OtherMethodMovesTable";
import { SpecialMethodMovesTable } from "./moves/components/SpecialMethodMovesTable";
import { PreviousStageMovesTable } from "./moves/components/PreviousStageMovesTable";
import { LegacyMovesTable } from "./moves/components/LegacyMovesTable";

export function PokemonMovesSection(props: PokemonMovesSectionProps) {
  const {
    selectedGenerationId,
    targetVersionGroup,
    levelUpRows,
    tmRows,
    tutorMoves,
    otherMethodRows,
    specialMethodRows,
    previousGenerationRows,
    previousStageRows,
    isPreviousStagesLoading,
    showCsvFallback,
  } = usePokemonMovesData(props);

  return (
    <div className="space-y-4">
      <LevelUpMovesTable rows={levelUpRows} selectedGenerationId={selectedGenerationId} />
      <TmHmMovesTable
        rows={tmRows}
        selectedGenerationId={selectedGenerationId}
        showCsvFallback={showCsvFallback}
      />
      <TutorMovesTable rows={tutorMoves} targetVersionGroup={targetVersionGroup} />
      <OtherMethodMovesTable rows={otherMethodRows} targetVersionGroup={targetVersionGroup} />
      {Array.from(specialMethodRows.entries()).map(([method, rows]) => (
        <SpecialMethodMovesTable key={method} method={method} rows={rows} />
      ))}
      <PreviousStageMovesTable rows={previousStageRows} isLoading={isPreviousStagesLoading} />
      <LegacyMovesTable rows={previousGenerationRows} />
    </div>
  );
}
