"use client";

import {
  LabelList,
  ReferenceArea,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Economies } from "@/app/util/macro";

const chartConfig = {
  economy: { label: "Economy", color: "var(--chart-3)" },
} satisfies ChartConfig;

type QuadrantPoint = {
  code: string;
  growth: number;
  inflation: number;
  quadrant: string;
};

function QuadrantTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: QuadrantPoint }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{p.code}</div>
      <div className="text-muted-foreground">{p.quadrant}</div>
      <div className="mt-1 grid grid-cols-2 gap-x-3 font-mono tabular-nums">
        <span className="text-muted-foreground">growth</span>
        <span className="text-right">{p.growth.toFixed(2)}</span>
        <span className="text-muted-foreground">inflation</span>
        <span className="text-right">{p.inflation.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function MacroQuadrant({ economies }: { economies: Economies }) {
  const data: QuadrantPoint[] = Object.entries(economies).map(([code, e]) => ({
    code,
    growth: e.growth,
    inflation: e.inflation,
    quadrant: e.quadrant,
  }));

  // Symmetric axis bounds so the 0/0 crosshair sits dead centre.
  const bound =
    Math.ceil(
      Math.max(
        1,
        ...data.flatMap((d) => [Math.abs(d.growth), Math.abs(d.inflation)]),
      ),
    ) + 0.25;

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
      <ScatterChart margin={{ top: 12, right: 16, bottom: 20, left: 4 }}>
        <ReferenceArea
          x1={0}
          x2={bound}
          y1={0}
          y2={bound}
          fill="var(--muted)"
          fillOpacity={0.6}
          label={{
            value: "Overheat",
            position: "insideTopRight",
            fontSize: 11,
            fill: "var(--muted-foreground)",
          }}
        />
        <ReferenceArea
          x1={-bound}
          x2={0}
          y1={0}
          y2={bound}
          fill="var(--muted)"
          fillOpacity={0.25}
          label={{
            value: "Stagflation",
            position: "insideTopLeft",
            fontSize: 11,
            fill: "var(--muted-foreground)",
          }}
        />
        <ReferenceArea
          x1={0}
          x2={bound}
          y1={-bound}
          y2={0}
          fill="var(--muted)"
          fillOpacity={0.25}
          label={{
            value: "Reflation",
            position: "insideBottomRight",
            fontSize: 11,
            fill: "var(--muted-foreground)",
          }}
        />
        <ReferenceArea
          x1={-bound}
          x2={0}
          y1={-bound}
          y2={0}
          fill="var(--muted)"
          fillOpacity={0.6}
          label={{
            value: "Recession",
            position: "insideBottomLeft",
            fontSize: 11,
            fill: "var(--muted-foreground)",
          }}
        />

        <ReferenceLine x={0} stroke="var(--border)" />
        <ReferenceLine y={0} stroke="var(--border)" />

        <XAxis
          type="number"
          dataKey="growth"
          domain={[-bound, bound]}
          tickCount={5}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10 }}
          label={{
            value: "Growth →",
            position: "insideBottom",
            offset: -10,
            fontSize: 11,
          }}
        />
        <YAxis
          type="number"
          dataKey="inflation"
          domain={[-bound, bound]}
          tickCount={5}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10 }}
          label={{
            value: "Inflation →",
            angle: -90,
            position: "insideLeft",
            fontSize: 11,
          }}
        />
        <ZAxis range={[110, 110]} />

        <ChartTooltip cursor={false} content={<QuadrantTooltip />} />

        <Scatter data={data} fill="var(--color-economy)">
          <LabelList
            dataKey="code"
            position="top"
            offset={6}
            className="fill-foreground"
            fontSize={10}
          />
        </Scatter>
      </ScatterChart>
    </ChartContainer>
  );
}
