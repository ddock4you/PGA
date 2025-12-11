import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PokeApiEvolutionChain, PokeApiEvolutionChainLink } from "../../api/pokemonApi";

interface PokemonEvolutionChainProps {
  chain: PokeApiEvolutionChain;
}

export function PokemonEvolutionChain({ chain }: PokemonEvolutionChainProps) {
  return (
    <Card id="evolution-chain">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">진화 경로</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-6 py-4 sm:flex-row sm:flex-wrap sm:gap-2">
          <EvolutionNode node={chain.chain} />
        </div>
      </CardContent>
    </Card>
  );
}

function EvolutionNode({ node }: { node: PokeApiEvolutionChainLink }) {
  const idMatch = node.species.url.match(/\/pokemon-species\/(\d+)\//);
  const id = idMatch ? idMatch[1] : "0";
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
      {/* 포켓몬 카드 */}
      <Link
        to={`/dex/${id}`}
        className="flex flex-col items-center gap-2 rounded-lg border p-3 transition hover:bg-muted/50 min-w-[100px]"
      >
        <div className="h-16 w-16">
          <img src={spriteUrl} alt={node.species.name} className="h-full w-full object-contain" />
        </div>
        <span className="text-xs font-medium capitalize">{node.species.name}</span>
      </Link>

      {/* 다음 단계가 있다면 화살표와 다음 노드들 */}
      {node.evolves_to.length > 0 && (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-2">
          {node.evolves_to.map((nextNode) => (
            <div
              key={nextNode.species.name}
              className="flex flex-col items-center sm:flex-row gap-2"
            >
              <div className="flex flex-col items-center gap-1 px-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <div className="h-4 w-[1px] bg-muted-foreground sm:hidden block my-1"></div>

                {/* 진화 조건 표시 */}
                <div className="flex flex-col gap-1">
                  {nextNode.evolution_details.map((detail, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-[10px] h-auto py-0.5 px-1.5 whitespace-nowrap"
                    >
                      {getEvolutionTriggerText(detail)}
                    </Badge>
                  ))}
                </div>
              </div>
              <EvolutionNode node={nextNode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getEvolutionTriggerText(detail: PokeApiEvolutionChainLink["evolution_details"][0]) {
  const parts = [];

  if (detail.min_level) parts.push(`Lv.${detail.min_level}`);
  if (detail.item) parts.push(`${detail.item.name}`);
  if (detail.trigger.name === "trade") parts.push("통신교환");
  if (detail.min_happiness) parts.push(`친밀도 ${detail.min_happiness}`);
  if (detail.time_of_day) parts.push(detail.time_of_day); // day, night

  // 기타 조건들...
  if (parts.length === 0) return detail.trigger.name; // 기본 트리거 이름 (levelup 등)

  return parts.join(" + ");
}
