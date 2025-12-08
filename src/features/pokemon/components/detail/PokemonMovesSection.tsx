import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { GENERATION_VERSION_GROUP_MAP } from "@/features/generation/constants/generationData";
import type { PokeApiPokemon } from "../../api/pokemonApi";

interface PokemonMovesSectionProps {
  moves: PokeApiPokemon["moves"];
}

export function PokemonMovesSection({ moves }: PokemonMovesSectionProps) {
  const { state } = usePreferences();
  const selectedGenerationId = state.selectedGenerationId || "1";
  const targetVersionGroup = GENERATION_VERSION_GROUP_MAP[selectedGenerationId] || "red-blue";

  // Filter to only Level Up moves for the selected generation's version group
  // And sort by level
  const levelUpMoves = moves
    .map((m) => {
      // Find the "level-up" method entry for the selected version group
      const levelUpEntry = m.version_group_details.find(
        (d) =>
          d.move_learn_method.name === "level-up" && d.version_group.name === targetVersionGroup
      );
      return {
        name: m.move.name,
        level: levelUpEntry?.level_learned_at ?? 0,
        valid: !!levelUpEntry,
      };
    })
    .filter((m) => m.valid)
    .sort((a, b) => a.level - b.level);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          자력기 (Level Up Moves) - {selectedGenerationId}세대
        </CardTitle>
      </CardHeader>
      <CardContent>
        {levelUpMoves.length === 0 ? (
          <p className="text-sm text-muted-foreground">레벨업으로 배우는 기술 데이터가 없습니다.</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Lv.</TableHead>
                  <TableHead>기술 이름</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levelUpMoves.map((move, idx) => (
                  <TableRow key={`${move.name}-${move.level}-${idx}`}>
                    <TableCell className="font-medium">{move.level}</TableCell>
                    <TableCell className="capitalize">{move.name.replace("-", " ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
