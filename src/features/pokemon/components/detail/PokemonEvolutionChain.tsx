import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PokeApiEvolutionChain, PokeApiEvolutionChainLink } from "../../api/pokemonApi";

interface PokemonEvolutionChainProps {
  chain: PokeApiEvolutionChain;
}

export function PokemonEvolutionChain({ chain }: PokemonEvolutionChainProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">진화 경로</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <EvolutionNode node={chain.chain} />
        </div>
      </CardContent>
    </Card>
  );
}

function EvolutionNode({ node }: { node: PokeApiEvolutionChainLink }) {
  // Extract ID from URL (https://pokeapi.co/api/v2/pokemon-species/1/)
  const idMatch = node.species.url.match(/\/pokemon-species\/(\d+)\//);
  const id = idMatch ? idMatch[1] : "0";
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/dex/${id}`}
        className="flex flex-col items-center rounded-lg border p-2 transition hover:bg-muted/50"
      >
        <div className="h-16 w-16">
          <img src={spriteUrl} alt={node.species.name} className="h-full w-full object-contain" />
        </div>
        <span className="text-xs font-medium capitalize">{node.species.name}</span>
      </Link>

      {node.evolves_to.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {node.evolves_to.map((nextNode, index) => (
            <div key={nextNode.species.name} className="flex items-center gap-2">
              {/* Only show arrow if it's a direct connection visually. 
                   In a flex-row layout, it works. 
                   For multiple evolutions (Evee), we might need a vertical stack.
               */}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <EvolutionNode node={nextNode} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
