"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePokemonDetail } from "@/features/pokemon/hooks/usePokemonDetail";
import { PokemonDetailHeader } from "@/features/pokemon/components/detail/PokemonDetailHeader";
import { PokemonDetailOverview } from "@/features/pokemon/components/detail/PokemonDetailOverview";
import { PokemonDetailTabs } from "@/features/pokemon/components/detail/PokemonDetailTabs";
import { smoothScrollToElement, SCROLL_CONSTANTS } from "@/hooks/useSmoothScroll";

// 스크롤 관련 설정 (공통 hook에서 가져옴)
// 필요시 SCROLL_CONSTANTS를 직접 수정하거나 다른 값 사용 가능
const SCROLL_DURATION = SCROLL_CONSTANTS.DEFAULT_DURATION;
const SCROLL_DELAY = SCROLL_CONSTANTS.TAB_SWITCH_DELAY;

interface PokemonDetailClientProps {
  initialPokemon: any;
  initialSpecies: any;
  pokemonId: string;
}

export function PokemonDetailClient({ initialPokemon, initialSpecies, pokemonId }: PokemonDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const language = "ko";

  const { pokemon, species, evolutionChain, encounters, isLoading, isError } = usePokemonDetail(
    pokemonId,
    {
      initialData: {
        pokemon: initialPokemon,
        species: initialSpecies,
      },
    }
  );

  // URL 쿼리 파라미터에서 스크롤 타겟 확인 및 처리
  useEffect(() => {
    const scrollTo = searchParams.get("scrollTo");

    if (scrollTo === "obtaining-methods") {
      // 정보 탭으로 전환
      setActiveTab("info");

      // 탭 전환이 완료될 때까지 대기 후 스크롤 시작
      setTimeout(() => {
        smoothScrollToElement("obtaining-methods", SCROLL_DURATION);
      }, SCROLL_DELAY);
    }
  }, [searchParams]);

  // 진화 탭으로 변경 시 스크롤 처리
  useEffect(() => {
    if (activeTab === "evolution") {
      // 탭 전환이 완료될 때까지 대기 후 진화 섹션으로 스크롤
      setTimeout(() => {
        smoothScrollToElement("evolution-chain", SCROLL_DURATION);
      }, SCROLL_DELAY);
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">포켓몬 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !pokemon || !species) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">포켓몬 정보를 불러오지 못했습니다.</p>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로 가기
        </Button>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 animate-in fade-in duration-500"
      style={{ paddingTop: "1rem" } as React.CSSProperties}
    >
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



