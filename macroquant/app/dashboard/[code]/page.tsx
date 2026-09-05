"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type {
  CountryCrossSection,
  Economies,
  Economy,
  EconomyTimeseries,
  MacroIndicator,
} from "@/app/util/macro";

const pct = (v: number | undefined) => (v == null ? "—" : `${v}%`);

const indicatorLabels: Record<MacroIndicator, string> = {
  cpi: "CPI",
  retail: "Retail",
  unemp: "Unemployment",
  ppi: "PPI",
  inflation: "Inflation",
};

function IndicatorChart({
  indicator,
  points,
}: {
  indicator: MacroIndicator;
  points: Array<[string, number]>;
}) {
  const data = points.map(([date, value]) => ({ date, value }));
  const chartConfig = {
    value: { label: indicatorLabels[indicator], color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <div className="border bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          {indicatorLabels[indicator]}
        </span>
        <span className="text-sm font-medium">
          {pct(points.at(-1)?.[1])}
        </span>
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-40 w-full">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            minTickGap={32}
            tick={{ fontSize: 9 }}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={34}
            tick={{ fontSize: 9 }}
            domain={["auto", "auto"]}
            label={{
              value: "%",
              position: "insideTopLeft",
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

export default function EconomyDetailPage() {
  const router = useRouter();
  const { code: rawCode } = useParams<{ code: string }>();
  const code = rawCode.toUpperCase();

  const { data: economies, isLoading: economiesLoading } =
    useSWR<Economies>("/api/macro/economies");
  const { data: crossSection, isLoading: crossSectionLoading } =
    useSWR<CountryCrossSection>(`/api/macro/cross_section/${code}`);
  const { data: timeseries, isLoading: timeseriesLoading } =
    useSWR<EconomyTimeseries>(`/api/macro/economy/timeseries/${code}`);

  if (economiesLoading || crossSectionLoading || timeseriesLoading) {
    return <div className="text-sm text-neutral-500">Loading…</div>;
  }

  const economy = (economies as Record<string, Economy> | undefined)?.[code];

  if (!economy) {
    return (
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-4 text-xs text-neutral-600"
        >
          ← Back
        </button>
        <p className="text-sm">No data for &ldquo;{rawCode}&rdquo;.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <button
        onClick={() => router.back()}
        className="mb-4 text-xs text-neutral-600"
      >
        ← Back
      </button>

      <h1 className="mb-1 font-ibm-mono text-2xl">{code}</h1>
      <p className="mb-8 text-xs text-neutral-600">
        {economy.ring_phase} · {economy.quadrant}
      </p>

      <h2 className="mb-2 text-sm">Latest readings</h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(economy.values).map(([key, value]) => (
          <div key={key} className="border bg-white p-3">
            <div className="mb-1 text-[10px] uppercase text-neutral-500">
              {key}
            </div>
            <div className="text-lg font-light">{pct(value)}</div>
          </div>
        ))}
      </div>

      {crossSection && (
        <div className="mb-8">
          <h2 className="mb-2 text-sm">Cross-section</h2>
          <div className="border bg-white p-4">
            {/* <p className="mb-2 text-sm text-neutral-700">
              Composite {crossSection.composite ?? "—"} · price{" "}
              {crossSection.price ?? "—"} · demand {crossSection.demand ?? "—"}
            </p> */}
            <p className="text-xs/5 text-neutral-600">
              {crossSection.summary.summary}
            </p>
          </div>
        </div>
      )}

      {timeseries && Object.keys(timeseries).length > 0 && (
        <div>
          <h2 className="mb-2 text-sm">Indicator history</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              Object.entries(timeseries) as Array<
                [MacroIndicator, Array<[string, number]>]
              >
            ).map(([key, points]) => (
              <IndicatorChart key={key} indicator={key} points={points} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
