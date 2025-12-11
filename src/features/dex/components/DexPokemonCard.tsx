import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TYPE_COLORS, getEnglishTypeName } from "../utils/dataTransforms";

export interface DexPokemonSummary {
  id: number;
  name: string;
  number: string;
  types: string[];
}

interface DexPokemonCardProps extends DexPokemonSummary {
  onClick: () => void;
}

export function DexPokemonCard(props: DexPokemonCardProps) {
  const { id, name, number, types, onClick } = props;
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <Card
      className="card-pokemon cursor-pointer transition hover:bg-card/90 border"
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
          <div className="flex gap-1">
            {types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className={`text-xs px-2 py-0.5 ${
                  TYPE_COLORS[getEnglishTypeName(type)] || "bg-gray-400 text-white"
                }`}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
