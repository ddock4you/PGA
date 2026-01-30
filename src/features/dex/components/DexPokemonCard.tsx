import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEnglishTypeName } from "@/utils/pokemonTypes";
import { getTypeBadgeClass } from "@/utils/typeBadge";
import type { DexPokemonSummary } from "@/lib/csvTransforms/pokemonSummary";

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
          <Image
            src={spriteUrl}
            alt={name}
            width={60}
            height={60}
            className="h-full w-full object-contain"
            priority={false}
          />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">{number}</p>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <div className="flex gap-1">
            {types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className={`text-xs px-2 py-0.5 ${getTypeBadgeClass(getEnglishTypeName(type))}`}
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
