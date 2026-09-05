"use client";

import { CotPositioningTable } from "@/component/cot-positioning-table";
import { DisclaimerFooter } from "@/component/disclaimer-footer";

export default function PositioningPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12">
        <h1 className="mb-2 font-ibm-mono text-3xl">
          Commitment of Traders — Positioning
        </h1>
        <p className="text-sm/5">
          Where speculators, real-money institutions, and dealers stand
          across eleven major futures markets, drawn from the CFTC&rsquo;s
          weekly disaggregated report. Select a row for the full weekly
          history behind it.
        </p>
      </div>

      <CotPositioningTable />

      <DisclaimerFooter />
    </div>
  );
}
