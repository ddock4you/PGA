import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
  PolarRadiusAxis,
  Customized,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function PokemonStatsChart({ stats }: PokemonStatsChartProps) {
  // 100 이상 구간 축소 변환 로직
  const transformValue = (val: number) => {
    if (val <= 100) return val;
    return 100 + (val - 100) * 0.2;
  };

  // 반대 변환 (툴팁 표시용) - 사실 payload에 원본 값을 넣어두면 됨

  const chartData = stats.map((s) => ({
    subject: statNameMap[s.stat.name] || s.stat.name,
    originalValue: s.base_stat,
    value: transformValue(s.base_stat),
    fullMark: 150, // 차트의 최대 스케일 (변환된 값 기준)
  }));

  const chartConfig = {
    value: {
      label: "종족값",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // 100 기준선 커스텀 컴포넌트
  // PolarRadiusAxis나 ReferenceLine으로 원형 그리드를 특정하긴 어려움 (Recharts 한계)
  // Customized 컴포넌트로 SVG circle을 그릴 수 있음.
  // 중심(cx, cy)와 반지름(radius)을 받아서 그림.

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle className="text-sm font-medium">종족값 (Base Stats)</CardTitle>
        </CardHeader>
        <CardContent className="pb-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <RadarChart data={chartData} outerRadius="80%">
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {data.subject}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {data.originalValue}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarGrid gridType="polygon" />
              {/* 100 기준선 강조를 위한 커스텀 드로잉 */}
              <Customized
                component={({ cx, cy, polarRadius }) => {
                  // polarRadius는 차트의 반지름. 도메인(0~150)과 매핑 필요.
                  // Recharts 내부 스케일을 정확히 알기 어려우므로 대략적인 비율 계산
                  // domain max가 150(변환값 기준)이라고 가정하면 100은 2/3 지점.
                  if (!cx || !cy || !polarRadius) return null;
                  const r100 = (polarRadius as number) * (100 / 150); // 150은 domain max 추정치. domain을 명시해야 정확함.

                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r100}
                      fill="none"
                      stroke="red"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                      opacity={0.5}
                    />
                  );
                }}
              />
              <Radar
                name="종족값"
                dataKey="value"
                fill="var(--color-value)"
                fillOpacity={0.5}
                dot={{ r: 3, fillOpacity: 1 }}
              />
              <PolarRadiusAxis domain={[0, 150]} tick={false} axisLine={false} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 하단 종족값 테이블 */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-xs">Stat</TableHead>
                <TableHead className="text-center text-xs">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((s) => (
                <TableRow key={s.stat.name}>
                  <TableCell className="py-2 font-medium text-center">
                    {statNameMap[s.stat.name] || s.stat.name}
                  </TableCell>
                  <TableCell className="py-2 text-center">{s.base_stat}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell className="py-2 text-center">Total</TableCell>
                <TableCell className="py-2 text-center">
                  {stats.reduce((acc, cur) => acc + cur.base_stat, 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
