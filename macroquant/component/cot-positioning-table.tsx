"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import type { Positioning } from "@/app/util/positioning";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * The CFTC COT positioning table (crowding by trader category, per
 * instrument) plus its methodology note. Rows link to the instrument's
 * detail page. Used on both the dashboard and the standalone /positioning
 * page so the two stay in sync.
 */
export function CotPositioningTable() {
  const router = useRouter();
  const {
    data: positioning,
    isLoading,
    error,
  } = useSWR<Positioning>("/api/cot/cot_pos");

  if (error) {
    return (
      <div className="text-xs text-neutral-500">
        Failed to load positioning data.
      </div>
    );
  }

  return (
    <div>
      <Table className="border bg-white">
        <TableHeader>
          <TableRow className="text-neutral-300 text-xs">
            <TableHead className="w-40">Asset</TableHead>
            <TableHead>Asset Mgr (score)</TableHead>
            <TableHead>Lev Money (score)</TableHead>
            <TableHead>Dealer (score)</TableHead>

            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || !positioning ? (
            <TableRow>
              <TableCell colSpan={5} className="text-xs text-neutral-500">
                Loading…
              </TableCell>
            </TableRow>
          ) : (
            Object.entries(positioning.instruments).map(([name, instrument]) => (
              <TableRow
                key={name}
                className="text-xs cursor-pointer"
                onClick={() =>
                  router.push(`/positioning/${encodeURIComponent(name)}`)
                }
              >
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell>
                  {instrument.asset_mgr.label} ({instrument.asset_mgr.score})
                </TableCell>
                <TableCell>
                  {instrument.lev_money.label} ({instrument.lev_money.score})
                </TableCell>
                <TableCell>
                  {instrument.dealer.label} ({instrument.dealer.score})
                </TableCell>
                <TableCell className="text-right text-shadow-blue-500">
                  View →
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-2 text-xs/5 text-neutral-600">
        <p>
          Each column is a CFTC trader category from the disaggregated
          futures report: <strong>Asset Mgr</strong> (real-money institutions
          — pensions, insurers, asset managers), <strong>Lev Money</strong>{" "}
          (leveraged funds — hedge funds, CTAs), and <strong>Dealer</strong>{" "}
          (intermediaries who typically hedge client flow rather than take a
          directional view).
        </p>
        <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
          <div className="flex gap-1">
            <dt className="shrink-0 font-medium text-neutral-700">score</dt>
            <dd>
              that category&rsquo;s positioning rescaled to −100…+100, where
              0 is its historical median stance in this instrument.
            </dd>
          </div>
          <div className="flex gap-1">
            <dt className="shrink-0 font-medium text-neutral-700">label</dt>
            <dd>
              score bucketed by distance from the median — roughly balanced
              (&lt;20), leaning (20–60), stretched (60–90), crowded (90+) —
              signed long or short.
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
