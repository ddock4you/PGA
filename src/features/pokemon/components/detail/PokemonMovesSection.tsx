import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PokeApiPokemon } from "../../api/pokemonApi";

interface PokemonMovesSectionProps {
  moves: PokeApiPokemon["moves"];
}

export function PokemonMovesSection({ moves }: PokemonMovesSectionProps) {
  // Filter to only Level Up moves for MVP simplicity
  // And sort by level
  const levelUpMoves = moves
    .map((m) => {
      // Find the "level-up" method entry.
      // There might be multiple entries for different game versions.
      // We pick the one with the highest level just to have *some* logic,
      // or ideally the one from the latest version group.
      // For now, just find ANY level-up entry.
      const levelUpEntry = m.version_group_details.find(
        (d) => d.move_learn_method.name === "level-up"
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
        <CardTitle className="text-sm font-medium">자력기 (Level Up Moves)</CardTitle>
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
