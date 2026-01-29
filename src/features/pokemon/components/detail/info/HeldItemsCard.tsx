import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDexCsvData } from "@/hooks/useDexCsvData";
import { useHeldItemsForGame } from "@/features/pokemon/hooks/useHeldItemsForGame";
import type { PokeApiPokemon } from "@/features/pokemon/types/pokeApiTypes";

export function HeldItemsCard({
  pokemon,
  selectedGameId,
}: {
  pokemon: PokeApiPokemon;
  selectedGameId?: string;
}) {
  const { itemsData } = useDexCsvData();
  const rows = useHeldItemsForGame({
    heldItems: pokemon.held_items,
    selectedGameId,
    itemsData,
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">야생 소지 도구</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {rows.length > 0 ? (
          rows.map((item) => (
            <div key={item.itemName} className="flex items-center justify-between">
              <span className="capitalize">{item.koreanItemName}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.rarity}%</span>
                {item.showVersionBadge ? (
                  <Badge variant="outline" className="text-xs">
                    {item.versionName}
                  </Badge>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground">없음</div>
        )}
      </CardContent>
    </Card>
  );
}
