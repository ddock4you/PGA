import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDexCsvData } from "../hooks/useDexCsvData";
import { transformPokemonForDex } from "../utils/dataTransforms";
import { DexFilterBar } from "./DexFilterBar";
import { DexPokemonCard, type DexPokemonSummary } from "./DexPokemonCard";

interface DexPokemonTabProps {
  generationId: string;
}

export function DexPokemonTab({ generationId }: DexPokemonTabProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { pokemonData, isLoading, isError } = useDexCsvData();

  const handleOpen = (pokemon: DexPokemonSummary) => {
    navigate(`/dex/${pokemon.id}`);
  };

  const pokemonSummaries: DexPokemonSummary[] = useMemo(() => {
    if (!pokemonData) return [];

    const allPokemon = transformPokemonForDex(pokemonData, generationId);

    return allPokemon.filter((p) => {
      if (!searchQuery.trim()) return true;
      return p.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
    });
  }, [searchQuery, pokemonData, generationId]);

  return (
    <div className="space-y-4">
      <DexFilterBar
        generationId={generationId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        showTypeFilter={true}
        description="세대/게임과 이름, 타입으로 포켓몬을 탐색할 수 있습니다."
      />

      {isLoading && (
        <p className="pt-2 text-xs text-muted-foreground">포켓몬 리스트를 불러오는 중입니다...</p>
      )}

      {isError && (
        <p className="pt-2 text-xs text-destructive">
          포켓몬 리스트를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {!isLoading && !isError && pokemonSummaries.length === 0 && (
        <p className="pt-2 text-xs text-muted-foreground">조건에 해당하는 포켓몬이 없습니다.</p>
      )}

      <section className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2 md:grid-cols-3">
        {pokemonSummaries.map((pokemon) => (
          <DexPokemonCard key={pokemon.id} {...pokemon} onClick={() => handleOpen(pokemon)} />
        ))}
      </section>
    </div>
  );
}
