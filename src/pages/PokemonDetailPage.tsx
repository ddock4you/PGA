import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePokemonDetail } from "@/features/pokemon/hooks/usePokemonDetail";
import { PokemonDetailHeader } from "@/features/pokemon/components/detail/PokemonDetailHeader";
import { PokemonDetailOverview } from "@/features/pokemon/components/detail/PokemonDetailOverview";
import { PokemonDetailTabs } from "@/features/pokemon/components/detail/PokemonDetailTabs";

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith("ko") ? "ko" : "en";

  const { pokemon, species, evolutionChain, isLoading, isError } = usePokemonDetail(id ?? "");

  if (!id) return null;

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
        <Button variant="outline" onClick={() => navigate(-1)}>
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
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">도감 상세</span>
      </div>

      <PokemonDetailHeader pokemon={pokemon} species={species} language={language} />
      <PokemonDetailOverview pokemon={pokemon} species={species} language={language} />
      <PokemonDetailTabs pokemon={pokemon} species={species} evolutionChain={evolutionChain} />
    </div>
  );
}
