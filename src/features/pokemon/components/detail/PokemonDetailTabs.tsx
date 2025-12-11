import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  PokeApiPokemon,
  PokeApiPokemonSpecies,
  PokeApiEvolutionChain,
  PokeApiEncounter,
} from "../../api/pokemonApi";
import { PokemonStatsChart } from "./PokemonStatsChart";
import { PokemonTypeEffectiveness } from "./PokemonTypeEffectiveness";
import { PokemonAttackEffectivenessSection } from "./PokemonAttackEffectivenessSection";
import { PokemonMovesSection } from "./PokemonMovesSection";
import { PokemonEvolutionChain } from "./PokemonEvolutionChain";
import { PokemonDetailInfo } from "./PokemonDetailInfo";

interface PokemonDetailTabsProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  evolutionChain?: PokeApiEvolutionChain;
  encounters?: PokeApiEncounter[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export function PokemonDetailTabs({
  pokemon,
  species,
  evolutionChain,
  encounters,
  activeTab = "overview",
  onTabChange,
}: PokemonDetailTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="sticky z-20 grid w-full grid-cols-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 top-(--header-height)">
        <TabsTrigger value="overview">개요</TabsTrigger>
        <TabsTrigger value="moves">기술</TabsTrigger>
        <TabsTrigger value="evolution">진화</TabsTrigger>
        <TabsTrigger value="info">정보</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <PokemonStatsChart stats={pokemon.stats} />
          <div className="space-y-4">
            <PokemonAttackEffectivenessSection types={pokemon.types} />
            <PokemonTypeEffectiveness types={pokemon.types} />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="moves" className="mt-4">
        <PokemonMovesSection
          moves={pokemon.moves}
          species={species}
          evolutionChain={evolutionChain}
        />
      </TabsContent>

      <TabsContent value="evolution" className="mt-4">
        {evolutionChain ? (
          <PokemonEvolutionChain chain={evolutionChain} />
        ) : (
          <div className="py-8 text-center text-muted-foreground">진화 정보가 없습니다.</div>
        )}
      </TabsContent>

      <TabsContent value="info" className="mt-4">
        <PokemonDetailInfo
          pokemon={pokemon}
          species={species}
          encounters={encounters}
          evolutionChain={evolutionChain}
          onTabChange={onTabChange}
        />
      </TabsContent>
    </Tabs>
  );
}
