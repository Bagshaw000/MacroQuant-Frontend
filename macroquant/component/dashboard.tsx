"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import type { CrossSection, Economies, GlobalAvg } from "@/app/util/macro";
import { MacroQuadrant } from "@/component/macro-quadrant";
import { CompositeRanking } from "@/component/composite-ranking";
import { CotPositioningTable } from "@/component/cot-positioning-table";
import { DisclaimerFooter } from "@/component/disclaimer-footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DashboardComp() {
  const router = useRouter();

  const {
    data: globalAvg,
    isLoading: globalAvgLoading,
    error: globalAvgError,
  } = useSWR<GlobalAvg>("/api/macro/global_avg");

  const {
    data: economies,
    isLoading: economiesLoading,
    error: economiesError,
  } = useSWR<Economies>("/api/macro/economies");

  const {
    data: crossSection,
    isLoading: crossSectionLoading,
    error: crossSectionError,
  } = useSWR<CrossSection>("/api/macro/cross_section");

  useEffect(() => {
    console.log(globalAvgLoading ? "Loading" : globalAvg);
  }, [globalAvg, globalAvgLoading]);

  if (globalAvgError || crossSectionError) {
    return <div>Failed to load macro data</div>;
  }

  const pct = (v: number | undefined) => (v == null ? "—" : `${v}%`);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12">
        <h1 className={`text-3xl font-ibm-mono mb-2`}>
          {" "}
          Global macro overview
        </h1>
        <p className="text-sm/5 ">
          Indicators across eleven major economies, twelve-month forecasts, and
          how the cycle transmits into equities, rates, credit, FX and
          commodities
        </p>
      </div>

      <div className="mb-12">
        {globalAvgLoading || !globalAvg ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row ">
            {Object.entries(globalAvg).map(([key, value]) => (
              <div
                key={key}
                className="border bg-white w-full min-h-20 p-4 flex flex-col items-start justify-center"
              >
                <span className="text-xs text-neutral-500 mb-1">
                  {" "}
                  GLOBAL {key.toUpperCase()} . AVG
                </span>
                <span className="text-2xl font-light">{value}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-12">
        <h1 className="mb-2"> Where the cycle stands</h1>

        <div className="p-4 text-xs/4 text-neutral-600 border bg-white">
          {crossSectionLoading || !crossSection ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-col gap-2">
              {crossSection.summary.summary
                .split(/\n+/)
                .flatMap((para) => para.split(/(?=[A-Z]{3}:\s)/))
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line, i) => {
                  const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
                  if (!match) return <p key={i}>{line}</p>;
                  const [, label, rest] = match;
                  return (
                    <p key={i}>
                      <strong>{label}:</strong>{" "}
                      {rest.charAt(0).toUpperCase() + rest.slice(1)}
                    </p>
                  );
                })}
            </div>
          )}
        </div>

        {/* {crossSectionLoading || !crossSection ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col md:flex-row flex-wrap gap-3">
            {Object.entries(crossSection.countries).map(([code, c]) => (
              <div key={code} className="border p-4">
                <span className="text-xs text-neutral-500">{code}</span>
                <div className="text-lg">{c.quadrant}</div>
                <div className="text-sm">
                  price {c.price ?? "—"} · demand {c.demand ?? "—"}
                </div>
              </div>
            ))}
          </div>
        )} */}
      </div>
      <div className="mb-12">
        <div className="flex mb-2 flex-col md:flex-row justify-between">
          <h1 className="text-sm">Economies at a glance</h1>
          <span className="text-xs text-neutral-600">
            {" "}
            Latest print. select a row for the country view
          </span>
        </div>

        <Table className="border bg-white">
          <TableHeader>
            <TableRow className="text-neutral-300 text-xs">
              <TableHead className="w-25">Economy</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>CPI</TableHead>
              <TableHead>PPI</TableHead>
              <TableHead>UNEMP</TableHead>
              <TableHead>INFLATION</TableHead>
              <TableHead>RETAIL</TableHead>

              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {economiesLoading || !economies ? (
              <TableRow>
                <TableCell colSpan={8} className="text-xs text-neutral-500">
                  Loading…
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(economies).map(([code, economy]) => (
                <TableRow
                  key={code}
                  className="text-xs cursor-pointer"
                  onClick={() => router.push(`/dashboard/${code}`)}
                >
                  <TableCell className="font-medium">{code}</TableCell>
                  <TableCell>{economy.ring_phase}</TableCell>
                  <TableCell>{pct(economy.values.cpi)}</TableCell>
                  <TableCell>{pct(economy.values.ppi)}</TableCell>
                  <TableCell>{pct(economy.values.unemp)}</TableCell>
                  <TableCell>{pct(economy.values.inflation)}</TableCell>
                  <TableCell>{pct(economy.values.retail)}</TableCell>
                  <TableCell className="text-right text-shadow-blue-500">
                    View →
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col md:flex-row gap-7 mb-12">
        <div className="md:flex-1">
          <div className="flex mb-2 flex-col md:flex-row justify-between">
            <h1 className="text-sm">Cross-section</h1>
            <span className="text-xs text-neutral-600">
              {" "}
              Growth vs inflation · z-scored across the eleven economies
            </span>
          </div>

          {economiesLoading || !economies ? (
            <div className="h-80 border bg-white p-2 flex items-center justify-center text-xs text-neutral-500">
              Loading…
            </div>
          ) : (
            <div className="h-80 border bg-white p-2">
              <MacroQuadrant economies={economies} />
            </div>
          )}

          <p className="mt-2 text-xs/5 text-neutral-600">
            Every economy is placed by growth and inflation momentum, each
            z-scored against the group, so the centre is the eleven-country
            average. Distance from the crosshair shows how firmly it sits in
            Reflation, Overheating, Stagflation or Recession.
          </p>
        </div>

        <div className="md:flex-1">
          <div className="flex mb-2 flex-col md:flex-row justify-between">
            <h1 className="text-sm">Composite ranking</h1>
            <span className="text-xs text-neutral-600">
              {" "}
              Strongest to weakest · bars split by CPI / PPI / unemployment /
              retail
            </span>
          </div>

          {crossSectionLoading || !crossSection ? (
            <div className="h-80 border bg-white p-2 flex items-center justify-center text-xs text-neutral-500">
              Loading…
            </div>
          ) : (
            <div className="h-80 border bg-white p-2 overflow-y-auto">
              <CompositeRanking crossSection={crossSection} />
            </div>
          )}

          <p className="mt-2 text-xs/5 text-neutral-600">
            Economies are ranked by composite score — the blended price and
            demand percentile, where 50 is the median. Each bar is split into
            its four drivers, so you can see whether CPI, PPI, unemployment or
            retail is doing the work.
          </p>
        </div>
      </div>

      <div>
        <div className="flex mb-2 flex-col md:flex-row justify-between">
          <h1 className="text-sm">COT positioning</h1>
          <span className="text-xs text-neutral-600">
            {" "}
            Crowding by trader category · label (score) ·{" "}
            <Link href="/positioning" className="underline">
              full page →
            </Link>
          </span>
        </div>

        <CotPositioningTable />
      </div>

      <DisclaimerFooter />
    </div>
  );
}
