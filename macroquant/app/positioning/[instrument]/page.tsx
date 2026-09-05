"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import type {
  ChangesGroupKey,
  FullInstrument,
  FullInstrumentRawReport,
  PositioningLeg,
  PositioningLegKey,
} from "@/app/util/positioning";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const legs: Array<[label: string, key: PositioningLegKey]> = [
  ["Asset Mgr", "asset_mgr"],
  ["Lev Money", "lev_money"],
  ["Dealer", "dealer"],
];

const changeGroups: Array<[label: string, key: ChangesGroupKey]> = [
  ["Dealer", "dealer"],
  ["Asset Mgr", "asset_mgr"],
  ["Lev Money", "lev_money"],
  ["Other Reportables", "other_rept"],
];

const pctChange = (v: number | null) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v}%`;

const num = (v: string) => Number(v).toLocaleString("en-US");

const changeClass = (current: number, previous: number | undefined) => {
  if (previous == null || current === previous) return "";
  return current > previous ? "text-emerald-600" : "text-red-600";
};

const rawColumns: Array<[label: string, key: keyof FullInstrumentRawReport]> = [
  ["Open Interest", "open_interest_all"],
  ["Dealer Net", "dealer_net"],
  ["Asset Mgr Net", "asset_mgr_net"],
  ["Commercial Net", "commercial_net"],
  ["Large Spec Net", "large_spec_net"],
  ["Other Rept Net", "other_rept_net"],
];

const PAGE_COUNT = 4;

export default function PositioningDetailPage() {
  const router = useRouter();
  const { instrument: rawName } = useParams<{ instrument: string }>();
  const name = decodeURIComponent(rawName);
  const encodedName = encodeURIComponent(name);

  const { data: instrument, isLoading } = useSWR<FullInstrument>(
    `/api/cot/instrument/${encodedName}`,
  );

  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [encodedName]);

  if (isLoading) {
    return <div className="text-sm text-neutral-500">Loading…</div>;
  }

  if (!instrument) {
    return (
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-4 text-xs text-neutral-600"
        >
          ← Back
        </button>
        <p className="text-sm">No positioning data for &ldquo;{name}&rdquo;.</p>
      </div>
    );
  }

  const weeklyRows = [...instrument.raw].reverse();
  const pageSize = Math.ceil(weeklyRows.length / PAGE_COUNT);
  const pageRows = weeklyRows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="mx-auto max-w-6xl">
      <button
        onClick={() => router.back()}
        className="mb-4 text-xs text-neutral-600"
      >
        ← Back
      </button>

      <h1 className="mb-1 font-ibm-mono text-2xl">{instrument.asset}</h1>
      <p className="mb-8 text-xs text-neutral-600">
        {instrument.market} · as of {instrument.as_of} · {instrument.weeks}{" "}
        weeks
      </p>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {legs.map(([label, key]) => {
          const leg: PositioningLeg = instrument.positioning[key];
          return (
            <div key={key} className="border bg-white p-3">
              <div className="mb-1 text-xs text-neutral-500">{label}</div>
              <div className="text-sm font-medium">{leg.label}</div>
              <div className="mt-1 text-xs text-neutral-600">
                score {leg.score} · z {leg.z.toFixed(2)}
              </div>
              <div className="text-xs text-neutral-600">
                net_pct_oi {leg.net_pct_oi}% · 4w{" "}
                {leg.mom_4w > 0 ? "+" : ""}
                {leg.mom_4w}%
              </div>
            </div>
          );
        })}
      </div>

      <p className="mb-8 text-sm text-neutral-700">{instrument.summary}</p>

      <h2 className="mb-2 text-sm">Positioning change over time</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {changeGroups.map(([label, key]) => {
          const group = instrument.changes[key];
          const latest = group.net.at(-1);
          return (
            <div key={key} className="border bg-white p-3">
              <div className="mb-1 text-xs text-neutral-500">{label}</div>
              <div className="text-sm font-medium">
                {latest ? latest[1].toLocaleString("en-US") : "—"}
                <span className="ml-1 text-xs text-neutral-500">net</span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-neutral-600">
                <div>
                  <span className="text-neutral-400">1m</span>{" "}
                  {pctChange(group.pct_change["1_month"])}
                </div>
                <div>
                  <span className="text-neutral-400">3m</span>{" "}
                  {pctChange(group.pct_change["3_month"])}
                </div>
                <div>
                  <span className="text-neutral-400">6m</span>{" "}
                  {pctChange(group.pct_change["6_month"])}
                </div>
                <div>
                  <span className="text-neutral-400">1y</span>{" "}
                  {pctChange(group.pct_change["1_year"])}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mb-2 mt-10 text-sm">
        Raw weekly data · {weeklyRows.length} weeks · page {page + 1} of{" "}
        {PAGE_COUNT}
      </h2>
      <div className="overflow-x-auto border bg-white">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="text-neutral-500">
              <TableHead className="sticky left-0 z-10 whitespace-nowrap bg-white">
                Date
              </TableHead>
              {rawColumns.map(([label]) => (
                <TableHead key={label} className="whitespace-nowrap text-right">
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row, localIndex) => {
              const globalIndex = page * pageSize + localIndex;
              const previousRow = weeklyRows[globalIndex + 1];
              return (
                <TableRow key={row.date}>
                  <TableCell className="sticky left-0 z-10 whitespace-nowrap bg-white font-medium">
                    {row.date}
                  </TableCell>
                  {rawColumns.map(([label, key]) => {
                    const current = Number(row[key]);
                    const previous = previousRow
                      ? Number(previousRow[key])
                      : undefined;
                    return (
                      <TableCell
                        key={label}
                        className={`whitespace-nowrap text-right ${changeClass(current, previous)}`}
                      >
                        {num(row[key] as string)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="text-neutral-600 disabled:text-neutral-300"
        >
          ← Newer
        </button>
        <div className="flex gap-2">
          {Array.from({ length: PAGE_COUNT }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={
                i === page
                  ? "font-medium text-black"
                  : "text-neutral-500 hover:text-black"
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => setPage((p) => Math.min(PAGE_COUNT - 1, p + 1))}
          disabled={page === PAGE_COUNT - 1}
          className="text-neutral-600 disabled:text-neutral-300"
        >
          Older →
        </button>
      </div>
    </div>
  );
}
