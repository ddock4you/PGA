"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { Button } from "@/components/ui/button";
import { PokemonDetailHeader } from "@/features/pokemon/components/detail/PokemonDetailHeader";
import { PokemonDetailOverview } from "@/features/pokemon/components/detail/PokemonDetailOverview";
import { PokemonDetailTabs } from "@/features/pokemon/components/detail/PokemonDetailTabs";
import type {
  PokeApiEncounter,
  PokeApiEvolutionChain,
  PokeApiPokemon,
  PokeApiPokemonSpecies,
} from "@/features/pokemon/types/pokeApiTypes";
import { useDetailScroll } from "./_hooks/useDetailScroll";

interface PokemonDetailClientProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  evolutionChain?: PokeApiEvolutionChain;
  encounters?: PokeApiEncounter[];
  language?: string;
}

export function PokemonDetailClient({
  pokemon,
  species,
  evolutionChain,
  encounters,
  language = "ko",
}: PokemonDetailClientProps) {
  const router = useRouter();

  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("scrollTo") === "obtaining-methods" ? "info" : "overview";
  };

  const initialTab = getInitialTab();
  const [activeTab, setActiveTab] = useState(initialTab);

  const BACK_BUTTON_ICON = useMemo(
    () => <ArrowLeft className="h-5 w-5" />,
    []
  );

  useDetailScroll("obtaining-methods", window.location.search.includes("scrollTo=obtaining-methods"));
  useDetailScroll("evolution-chain", activeTab === "evolution");

  return (
    <div className="space-y-6 animate-in fade-in duration-500" style={{ paddingTop: "1rem" }}>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          {BACK_BUTTON_ICON}
        </Button>
        <span className="text-sm font-medium text-muted-foreground">도감 상세</span>
      </div>

      <PokemonDetailHeader pokemon={pokemon} species={species} language={language} />
      <PokemonDetailOverview pokemon={pokemon} species={species} language={language} />
      <PokemonDetailTabs
        pokemon={pokemon}
        species={species}
        evolutionChain={evolutionChain}
        encounters={encounters}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
