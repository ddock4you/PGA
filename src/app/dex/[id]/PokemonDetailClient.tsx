"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { Button } from "@/components/ui/button";
import { PokemonDetailHeader } from "@/features/pokemon/components/detail/PokemonDetailHeader";
import { PokemonDetailOverview } from "@/features/pokemon/components/detail/PokemonDetailOverview";
import { PokemonDetailTabs } from "@/features/pokemon/components/detail/PokemonDetailTabs";
import { smoothScrollToElement, SCROLL_CONSTANTS } from "@/hooks/useSmoothScroll";
import type {
  PokeApiEncounter,
  PokeApiEvolutionChain,
  PokeApiPokemon,
  PokeApiPokemonSpecies,
} from "@/features/pokemon/api/pokemonApi";

// 스크롤 관련 설정 (공통 hook에서 가져옴)
// 필요시 SCROLL_CONSTANTS를 직접 수정하거나 다른 값 사용 가능
const SCROLL_DURATION = SCROLL_CONSTANTS.DEFAULT_DURATION;
const SCROLL_DELAY = SCROLL_CONSTANTS.TAB_SWITCH_DELAY;

interface PokemonDetailClientProps {
  pokemon: PokeApiPokemon;
  species: PokeApiPokemonSpecies;
  evolutionChain?: PokeApiEvolutionChain;
  encounters?: PokeApiEncounter[];
}

export function PokemonDetailClient({
  pokemon,
  species,
  evolutionChain,
  encounters,
}: PokemonDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("scrollTo") === "obtaining-methods" ? "info" : "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const language = "ko";
  // URL 쿼리 파라미터에서 스크롤 타겟 확인 및 처리
  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");

    if (scrollTo === "obtaining-methods") {
      const timer = setTimeout(() => {
        smoothScrollToElement("obtaining-methods", SCROLL_DURATION);
      }, SCROLL_DELAY);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === "evolution") {
      setTimeout(() => {
        smoothScrollToElement("evolution-chain", SCROLL_DURATION);
      }, SCROLL_DELAY);
    }
  }, [activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500" style={{ paddingTop: "1rem" }}>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
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
