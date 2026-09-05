"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { CrossSection } from "@/app/util/macro";

// The four drivers, in stack order. Their values sum to `composite`.
const chartConfig = {
  contrib_cpi: { label: "CPI", color: "var(--chart-1)" },
  contrib_ppi: { label: "PPI", color: "var(--chart-2)" },
  contrib_unemp: { label: "Unemployment", color: "var(--chart-3)" },
  contrib_ret: { label: "Retail", color: "var(--chart-4)" },
} satisfies ChartConfig;

type RankRow = {
  code: string;
  composite: number;
  quadrant: string;
  contrib_cpi: number;
  contrib_ppi: number;
  contrib_unemp: number;
  contrib_ret: number;
};

/**
 * Economies ranked by their cross-section `composite` score, each row carrying
 * the four `contrib_*` drivers that sum to it. Countries whose `composite` is
 * `null` (indicator gaps) are dropped.
 */
export function rankByComposite(crossSection: CrossSection): RankRow[] {
  return Object.entries(crossSection.countries)
    .flatMap(([code, c]) =>
      c.composite == null
        ? []
        : [
            {
              code,
              composite: c.composite,
              quadrant: c.quadrant,
              contrib_cpi: c.contrib_cpi ?? 0,
              contrib_ppi: c.contrib_ppi ?? 0,
              contrib_unemp: c.contrib_unemp ?? 0,
              contrib_ret: c.contrib_ret ?? 0,
            },
          ],
    )
    .sort((a, b) => b.composite - a.composite);
}

export function CompositeRanking({
  crossSection,
}: {
  crossSection: CrossSection;
}) {
  const data = rankByComposite(crossSection);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto w-full"
      style={{ height: data.length * 34 + 56 }}
    >
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 4, right: 40 }}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="code"
          width={36}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />

        <Bar
          dataKey="contrib_cpi"
          stackId="a"
          fill="var(--color-contrib_cpi)"
          radius={[4, 0, 0, 4]}
        />
        <Bar
          dataKey="contrib_ppi"
          stackId="a"
          fill="var(--color-contrib_ppi)"
        />
        <Bar
          dataKey="contrib_unemp"
          stackId="a"
          fill="var(--color-contrib_unemp)"
        />
        <Bar
          dataKey="contrib_ret"
          stackId="a"
          fill="var(--color-contrib_ret)"
          radius={[0, 4, 4, 0]}
        >
          <LabelList
            dataKey="composite"
            position="right"
            offset={8}
            className="fill-foreground"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
