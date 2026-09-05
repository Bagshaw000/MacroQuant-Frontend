// Types for the Commitment of Traders (COT) feed served by /util
// (proxied from https://domianmt5.xyz/v1/cot).
//
// Shape:
//   CotResponse
//   └─ market group ("Currency" | "Indicies" | "Financial" | "Crypto")
//      └─ instrument name ("CANADIAN DOLLAR", ...)
//         ├─ week-ending date ("2026-08-25", ...) -> CotWeeklyReport
//         └─ "pct_change"                          -> CotPctChange

/** Top-level market groups returned by the feed. */
export type CotMarketGroupName =
  | "Currency"
  | "Indicies"
  | "Financial"
  | "Crypto";

/**
 * A single weekly CFTC report row for one instrument.
 * Every numeric field arrives as a string and must be `Number(...)`-parsed.
 */
export interface CotWeeklyReport {
  market_and_exchange_names: string;
  market: string;
  /** ISO date, e.g. "2026-08-25". */
  report_date_as_yyyy_mm_dd: string;
  dealer_net: string;
  dealer_positions_long_all: string;
  dealer_positions_short_all: string;
  asset_mgr_net: string;
  asset_mgr_positions_long_all: string;
  asset_mgr_positions_short_all: string;
  commercial_net: string;
  lev_money_positions_long_all: string;
  lev_money_positions_short_all: string;
  large_spec_net: string;
  other_rept_net: string;
  open_interest_all: string;
}

/** Metrics for which the feed provides percentage-change series. */
export type CotPctMetric =
  | "large_spec_net"
  | "commercial_net"
  | "dealer_net"
  | "other_rept_net";

/** Look-back windows for the percentage-change series. */
export type CotPctHorizon = "1_month" | "3_month" | "6_month" | "1_year";

/**
 * Percentage change per metric, per horizon, keyed by the report date it was
 * computed for, e.g. `pct_change.large_spec_net["1_month"]["2026-08-25"]`.
 */
export type CotPctChange = Record<
  CotPctMetric,
  Record<CotPctHorizon, Record<string, number>>
>;

/**
 * One instrument's history: many date-keyed weekly reports plus a single
 * `pct_change` entry. Iterate with {@link cotWeeklyEntries} to get just the
 * weekly rows with correct typing.
 */
export type CotInstrument = { pct_change: CotPctChange } & {
  [weekEnding: string]: CotWeeklyReport | CotPctChange;
};

/** All instruments in one market group, keyed by instrument name. */
export type CotMarketGroup = Record<string, CotInstrument>;

/** The full payload from `/util`, keyed by market group name. */
export type CotResponse = Partial<Record<CotMarketGroupName, CotMarketGroup>>;

/** An error payload the proxy route returns instead of data. */
export interface CotErrorResponse {
  error: string;
}

/** `[date, report]` pairs for an instrument, excluding the `pct_change` key. */
export function cotWeeklyEntries(
  instrument: CotInstrument,
): Array<[string, CotWeeklyReport]> {
  return Object.entries(instrument).filter(
    ([key]) => key !== "pct_change",
  ) as Array<[string, CotWeeklyReport]>;
}

/** The most recent weekly report for an instrument, or `undefined` if none. */
export function latestCotReport(
  instrument: CotInstrument,
): CotWeeklyReport | undefined {
  return cotWeeklyEntries(instrument)
    .sort(([a], [b]) => a.localeCompare(b))
    .at(-1)?.[1];
}
