import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PokeApiPokemon, PokeApiPokemonSpecies } from "@/features/pokemon/types/pokeApiTypes";

export function PhysicalInfoCard({
  pokemon,
  species,
}: {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
}) {
  const genderText =
    species.gender_rate === -1
      ? "무성"
      : species.gender_rate !== undefined
        ? `수컷 ${(1 - species.gender_rate / 8) * 100}%, 암컷 ${(species.gender_rate / 8) * 100}%`
        : "-";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">신체 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">키</span>
          <span>{pokemon.height / 10} m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">몸무게</span>
          <span>{pokemon.weight / 10} kg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">성비</span>
          <span>{genderText}</span>
        </div>
      </CardContent>
    </Card>
  );
}
