import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PokeApiPokemon } from "../../api/pokemonApi";

interface PokemonStatsChartProps {
  stats: PokeApiPokemon["stats"];
}

const statNameMap: Record<string, string> = {
  hp: "HP",
  attack: "공격",
  defense: "방어",
  "special-attack": "특공",
  "special-defense": "특방",
  speed: "스피드",
};

// Recharts Radar Chart requires specific data format
export function PokemonStatsChart({ stats }: PokemonStatsChartProps) {
  const chartData = stats.map((s) => ({
    subject: statNameMap[s.stat.name] || s.stat.name,
    value: s.base_stat,
    fullMark: 255, // Max possible base stat is roughly 255
  }));

  const chartConfig = {
    value: {
      label: "종족값",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-sm font-medium">종족값 (Base Stats)</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="var(--color-value)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
