// Types for the positioning-scores endpoints: each futures instrument's COT
// trader categories (asset managers, leveraged money, dealers) scored,
// percentile-ranked against history, and summarised.

import type { CotWeeklyReport } from "@/app/util/cot";

/** The three CFTC trader categories scored by the positioning endpoints. */
export type PositioningLegKey = "asset_mgr" | "lev_money" | "dealer";

/** Instruments covered by the positioning feed. */
export type InstrumentName =
  | "AUSTRALIAN DOLLAR"
  | "BITCOIN"
  | "BRITISH POUND"
  | "DOW JONES INDUSTRIAL AVERAGE"
  | "EURO FX"
  | "FED FUNDS"
  | "JAPANESE YEN"
  | "S&P 500 STOCK INDEX"
  | "S&P 500 VIX"
  | "USD INDEX"
  | "UST 10Y NOTE";

/** Crowding label assigned to a trader category's net positioning. */
export type PositioningLabel =
  | "crowded short"
  | "stretched short"
  | "leaning short"
  | "balanced"
  | "leaning long"
  | "stretched long"
  | "crowded long";

/** One trader category's positioning in one instrument. */
export interface PositioningLeg {
  /** Net position as a percent of open interest. */
  net_pct_oi: number;
  /** Percentile of `net_pct_oi` against its own history (0–100). */
  percentile: number;
  /** Crowding score, roughly -100 (crowded short) to +100 (crowded long). */
  score: number;
  /** Standardized score (z-score) of current net positioning. */
  z: number;
  /** 4-week change in net positioning. */
  mom_4w: number;
  label: PositioningLabel;
}

/** The three CFTC trader categories plus a narrative for one instrument. */
export interface InstrumentPositioning {
  /** Asset managers / institutional. */
  asset_mgr: PositioningLeg;
  /** Leveraged money / hedge funds. */
  lev_money: PositioningLeg;
  /** Dealers / intermediaries. */
  dealer: PositioningLeg;
  /** Plain-language read of the three legs. */
  summary: string;
}

export interface PositioningMeta {
  instruments: InstrumentName[];
  /** ISO timestamp. */
  updated: string;
}

/**
 * GET /api/cot/cot_pos — per-instrument COT positioning scores.
 * `instruments` is keyed by the names listed in `meta.instruments`.
 */
export interface Positioning {
  meta: PositioningMeta;
  instruments: Record<InstrumentName, InstrumentPositioning>;
}

/**
 * Trader categories in the `asset_changes` endpoint. Note this set differs
 * from {@link PositioningLeg}'s: it adds `other_rept` (other reportables).
 */
export type ChangesGroupKey = "dealer" | "asset_mgr" | "lev_money" | "other_rept";

/** Percent change in net position over each look-back window; `null` when unavailable. */
export interface ChangesPctChange {
  "1_month": number | null;
  "3_month": number | null;
  "6_month": number | null;
  "1_year": number | null;
}

/** One trader category's weekly net-position history for one instrument. */
export interface ChangesGroup {
  /** `[week-ending date, net position]` pairs, oldest first. */
  net: Array<[string, number]>;
  pct_change: ChangesPctChange;
}

/**
 * GET /api/cot/asset_changes/<instrument> — weekly net-position history per
 * trader category, for a single instrument (path-encode the name, e.g.
 * `S%26P%20500%20VIX`).
 */
export interface InstrumentChanges {
  asset: string;
  market: string;
  /** Number of weeks of history in each group's `net` series. */
  weeks: number;
  /** ISO date of the most recent week. */
  as_of: string;
  groups: Record<ChangesGroupKey, ChangesGroup>;
}

/**
 * A raw weekly CFTC report row as returned inside `FullInstrument.raw`.
 * Identical to {@link CotWeeklyReport} plus a top-level `date` (equal to
 * `report_date_as_yyyy_mm_dd`).
 */
export interface FullInstrumentRawReport extends CotWeeklyReport {
  date: string;
}

/**
 * GET /api/cot/instrument/<instrument> — everything about one instrument in
 * a single call: the current positioning snapshot, weekly %-of-OI series,
 * the changes/pct_change breakdown, a narrative, and the raw weekly reports
 * behind it all. Superset of {@link InstrumentPositioning} and
 * {@link InstrumentChanges} for the same instrument.
 */
export interface FullInstrument {
  asset: string;
  market: string;
  /** Number of weeks of history behind `net_pct_oi` and `raw`. */
  weeks: number;
  /** ISO date of the most recent week. */
  as_of: string;
  /** Current snapshot per trader category (no `other_rept` here). */
  positioning: Record<PositioningLegKey, PositioningLeg>;
  /** Weekly `[date, %-of-OI]` series per trader category. */
  net_pct_oi: Record<PositioningLegKey, Array<[string, number]>>;
  /** Same shape as {@link InstrumentChanges.groups} (adds `other_rept`). */
  changes: Record<ChangesGroupKey, ChangesGroup>;
  /** Plain-language read across all categories. */
  summary: string;
  /** Raw weekly CFTC rows, oldest first. */
  raw: FullInstrumentRawReport[];
}
