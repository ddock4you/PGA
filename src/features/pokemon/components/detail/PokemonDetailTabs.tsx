import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  PokeApiEvolutionChain,
} from "../../api/pokemonApi";
import { PokemonStatsChart } from "./PokemonStatsChart";
import { PokemonTypeEffectiveness } from "./PokemonTypeEffectiveness";
import { PokemonMovesSection } from "./PokemonMovesSection";
import { PokemonEvolutionChain } from "./PokemonEvolutionChain";
import { PokemonDetailInfo } from "./PokemonDetailInfo";

interface PokemonDetailTabsProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  evolutionChain?: PokeApiEvolutionChain;
}

export function PokemonDetailTabs({ pokemon, species, evolutionChain }: PokemonDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="moves">기술</TabsTrigger>
        <TabsTrigger value="evolution">진화</TabsTrigger>
        <TabsTrigger value="info">정보</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <PokemonStatsChart stats={pokemon.stats} />
          <PokemonTypeEffectiveness types={pokemon.types} />
        </div>
      </TabsContent>

      <TabsContent value="moves">
        <PokemonMovesSection moves={pokemon.moves} />
      </TabsContent>

      <TabsContent value="evolution">
        {evolutionChain ? (
          <PokemonEvolutionChain chain={evolutionChain} />
        ) : (
          <div className="py-8 text-center text-muted-foreground">진화 정보가 없습니다.</div>
        )}
      </TabsContent>

      <TabsContent value="info">
        <PokemonDetailInfo pokemon={pokemon} species={species} />
      </TabsContent>
    </Tabs>
  );
}
