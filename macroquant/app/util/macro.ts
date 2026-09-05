// Types for the macro endpoints proxied via /api/macro/*.

/** GET /api/macro/global_avg — cross-economy averages of each indicator. */
export interface GlobalAvg {
  cpi: number;
  retail: number;
  unemp: number;
  ppi: number;
  inflation: number;
}

/** ISO-3166 alpha-3 codes for the economies the feed covers. */
export type CountryCode =
  | "AUS"
  | "BRA"
  | "CAN"
  | "CHN"
  | "DEU"
  | "FRA"
  | "JPN"
  | "KOR"
  | "USA"
  | "GBR"
  | "IND";

/** Price/demand regime classification for a country. */
export type Quadrant =
  | "Stagflation"
  | "Overheating"
  | "Goldilocks"
  | "Weak"
  | "Disinflation";

/**
 * One country's row in the cross-section. Any of the score/contribution fields
 * can be `null` when the underlying indicator is missing for that country.
 */
export interface CrossSectionCountry {
  price: number | null;
  demand: number | null;
  composite: number | null;
  contrib_cpi: number | null;
  contrib_ppi: number | null;
  contrib_unemp: number | null;
  contrib_ret: number | null;
  quadrant: Quadrant;
  price_median: number;
  demand_median: number;
}

export interface CrossSectionMeta {
  price_median: number;
  demand_median: number;
  countries: CountryCode[];
  /** ISO timestamp. */
  updated: string;
}

export interface CrossSectionSummary {
  /**
   * Free-text narrative: a per-country paragraph (sentences run together,
   * each prefixed "XXX: "), then "Cross-section:" and "Read-through:"
   * paragraphs, the three separated by blank lines.
   */
  summary: string;
  /** ISO timestamp the narrative was generated. */
  updated: string;
  /** ISO timestamp of the data the narrative describes. */
  source_updated: string;
}

/** GET /api/macro/cross_section — per-country regime scores plus a narrative. */
export interface CrossSection {
  meta: CrossSectionMeta;
  countries: Record<CountryCode, CrossSectionCountry>;
  summary: CrossSectionSummary;
}

/** Macro indicator keys used in the cycle payload's `z_scores` / `values`. */
export type MacroIndicator = "cpi" | "retail" | "unemp" | "ppi" | "inflation";

/**
 * Growth/inflation quadrant in the cycle payload. Note these labels differ from
 * {@link Quadrant} used by the cross-section (e.g. "Overheat" vs "Overheating").
 */
export type CycleQuadrant =
  | "Reflation"
  | "Overheat"
  | "Stagflation"
  | "Recession";

/**
 * Business-cycle ("investment clock") phase. Only "Slowdown" and "Contraction"
 * appear in current data; "Recovery" and "Expansion" are the other two phases
 * the model can emit.
 */
export type RingPhase = "Recovery" | "Expansion" | "Slowdown" | "Contraction";

/** One economy's entry in the `/api/macro/economies` payload. */
export interface Economy {
  growth: number;
  inflation: number;
  composite: number;
  quadrant: CycleQuadrant;
  ring_phase: RingPhase;
  /** Per-indicator standardized scores; indicators with no data are omitted. */
  z_scores: Partial<Record<MacroIndicator, number>>;
  /** Latest raw indicator readings; indicators with no data are omitted. */
  values: Partial<Record<MacroIndicator, number>>;
  /** Sentiment overlay; always `null` in current payloads. */
  new_sentiment: number | null;
}

/**
 * GET /api/macro/economies — per-country growth/inflation scores, quadrant,
 * cycle phase, and the z-scores / raw values behind them.
 */
export type Economies = Record<CountryCode, Economy>;

/**
 * GET /api/macro/cross_section/<country> — one country's cross-section row
 * plus a country-specific narrative. Same fields as {@link CrossSectionCountry}
 * with its own `summary` (distinct from {@link CrossSection}'s group-wide one).
 */
export interface CountryCrossSection extends CrossSectionCountry {
  summary: CrossSectionSummary;
}

/**
 * GET /api/macro/economy/timeseries/<country> — historical readings per
 * indicator as `[date, value]` pairs at irregular (roughly monthly) intervals,
 * oldest first. Indicators with no history are omitted.
 */
export type EconomyTimeseries = Partial<
  Record<MacroIndicator, Array<[string, number]>>
>;
