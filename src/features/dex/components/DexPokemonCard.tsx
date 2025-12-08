import { Card, CardContent } from "@/components/ui/card";

export interface DexPokemonSummary {
  id: number;
  name: string;
  number: string;
}

interface DexPokemonCardProps extends DexPokemonSummary {
  onClick: () => void;
}

export function DexPokemonCard(props: DexPokemonCardProps) {
  const { id, name, number, onClick } = props;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <Card
      className="bg-card/80 cursor-pointer transition hover:bg-card/90"
      onClick={onClick}
      role="button"
      aria-label={`${name} 상세 보기`}
    >
      <CardContent className="flex items-center gap-3 py-3">
        <div className="flex size-12 items-center justify-center rounded-md bg-muted text-[10px] text-muted-foreground overflow-hidden">
          <img src={spriteUrl} alt={name} className="h-full w-full object-contain" loading="lazy" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">{number}</p>
          <p className="text-sm font-semibold text-foreground">{name}</p>
        </div>
      </CardContent>
    </Card>
  );
}
