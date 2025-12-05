import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { usePokemonSpeciesByGeneration } from "@/features/pokemon/hooks/usePokemonQueries";

interface DexFilterBarProps {
  generationId: string;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

function DexFilterBar({ generationId, searchQuery, onSearchQueryChange }: DexFilterBarProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">필터</CardTitle>
        <CardDescription className="text-xs">
          세대/게임과 이름으로 도감 리스트를 좁혀볼 수 있습니다. (타입/게임 선택은 추후 구현)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-xs sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">게임/세대</label>
          <div className="h-9 rounded-md border bg-muted px-2 text-xs text-muted-foreground">
            <div className="flex h-full items-center">세대 ID: {generationId}</div>
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">타입</label>
          <div className="h-9 rounded-md border bg-muted px-2 text-xs text-muted-foreground">
            <div className="flex h-full items-center">모든 타입 (추후 구현)</div>
          </div>
        </div>
        <div className="flex-1">
          <label className="mb-1 block font-medium text-muted-foreground">이름 검색</label>
          <Input
            placeholder="포켓몬 이름으로 검색"
            className="h-9 text-xs"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface DexPokemonSummary {
  name: string;
  number: string;
  types: string;
}

interface DexPokemonCardProps extends DexPokemonSummary {
  onClick: () => void;
}

function DexPokemonCard(props: DexPokemonCardProps) {
  const { name, number, types, onClick } = props;

  return (
    <Card
      className="bg-card/80 cursor-pointer transition hover:bg-card/90"
      onClick={onClick}
      role="button"
      aria-label={`${name} 상세 보기`}
    >
      <CardContent className="flex items-center gap-3 py-3">
        <div className="flex size-12 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground">
          이미지
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">{number}</p>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{types}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DexPokemonDetailSheet(props: { pokemon: DexPokemonSummary | null; onClose: () => void }) {
  const { pokemon, onClose } = props;

  if (!pokemon) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-card p-5 text-xs text-card-foreground shadow-xl sm:rounded-2xl">
        <header className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">{pokemon.number}</p>
            <h3 className="text-lg font-semibold">{pokemon.name}</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">{pokemon.types}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted"
          >
            닫기
          </button>
        </header>

        <div className="mt-4 space-y-3">
          <section>
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">기본 정보</p>
            <p className="text-[11px] text-muted-foreground">
              여기에는 종족값 요약, 대표 타입 아이콘, 간단 설명 등이 표시될 예정입니다.
            </p>
          </section>

          <section>
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">타입 상성</p>
            <p className="text-[11px] text-muted-foreground">
              복합 타입 기준으로 2배/0.5배/0배 상성이 간단한 그리드 형태로 들어갈 자리입니다.
            </p>
          </section>

          <section>
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">진화 & 기타</p>
            <p className="text-[11px] text-muted-foreground">
              진화 체인, 서식, 특성, EV, 포획도 등 추가 정보가 탭/섹션 구조로 표시될 예정입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function DexPage() {
  const { state } = usePreferences();

  // 기본값은 1세대. Preferences 에 세대가 설정되어 있으면 그것을 우선 사용.
  const effectiveGenerationId = state.selectedGenerationId ?? "1";

  const {
    data: speciesList,
    isLoading,
    isError,
  } = usePokemonSpeciesByGeneration(effectiveGenerationId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<DexPokemonSummary | null>(null);

  const handleOpen = (pokemon: DexPokemonSummary) => {
    setSelectedPokemon(pokemon);
  };

  const handleClose = () => {
    setSelectedPokemon(null);
  };

  const pokemonSummaries: DexPokemonSummary[] = useMemo(() => {
    if (!speciesList) return [];

    return speciesList
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        return s.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      })
      .map((s) => {
        let id = 0;
        if (s.url) {
          const match = s.url.match(/\/pokemon-species\/(\d+)\//);
          if (match) {
            id = Number.parseInt(match[1] ?? "0", 10);
          }
        }

        const number = id ? `No.${id.toString().padStart(3, "0")}` : "No.???";

        return {
          name: s.name,
          number,
          types: "타입 정보는 추후 추가 예정입니다.",
        };
      });
  }, [searchQuery, speciesList]);

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">포켓몬 도감</h2>
          <p className="text-sm text-muted-foreground">
            세대/게임과 타입을 선택해 포켓몬을 탐색할 수 있습니다. (현재는 1세대 중심의 기본
            리스트만 제공됩니다)
          </p>
        </div>
      </header>

      <DexFilterBar
        generationId={effectiveGenerationId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
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
        <p className="pt-2 text-xs text-muted-foreground">
          현재 세대와 검색 조건에 해당하는 포켓몬이 없습니다.
        </p>
      )}

      <section className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
        {pokemonSummaries.map((pokemon) => (
          <DexPokemonCard
            key={pokemon.number + pokemon.name}
            name={pokemon.name}
            number={pokemon.number}
            types={pokemon.types}
            onClick={() => handleOpen(pokemon)}
          />
        ))}
      </section>

      <DexPokemonDetailSheet pokemon={selectedPokemon} onClose={handleClose} />
    </section>
  );
}
