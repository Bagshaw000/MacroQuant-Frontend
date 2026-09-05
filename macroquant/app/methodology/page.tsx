"use client";

import { DisclaimerFooter } from "@/component/disclaimer-footer";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-2 text-sm font-medium">{title}</h2>
      <div className="border bg-white p-4 text-xs/6 text-neutral-600">
        {children}
      </div>
    </section>
  );
}

function Term({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-1">
      <dt className="shrink-0 font-medium text-neutral-700">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12">
        <h1 className="mb-2 font-ibm-mono text-3xl">Methodology</h1>
        <p className="text-sm/5 text-neutral-700">
          How to read every page on this site, and the formulas and data sources behind them. Where a calculation is documented below, it was verified against the live feed rather than assumed.
        </p>
      </div>

      <Section title="Data sources">
        <p className="mb-2">
          Two independent sources feed this site, joined only at the page level:
        </p>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <Term term="Macro indicators">
            CPI, PPI, unemployment, retail sales, and a broader &ldquo;inflation&rdquo; series across eleven economies (AUS, BRA, CAN, CHN, DEU, FRA, JPN, KOR, USA, GBR, IND), refreshed on each release. Sourced from{" "}
            <a
              href="https://londonstrategicedge.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              London Strategic Edge
            </a>
            .
          </Term>
          <Term term="CFTC positioning">
            The weekly Commitment of Traders (COT) disaggregated futures report, covering eleven instruments across currencies, indices, rates, and crypto. Sourced directly from the{" "}
            <a
              href="https://www.cftc.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              CFTC
            </a>
            .
          </Term>
        </dl>
        <p className="mt-2">
          Every payload carries an <code>updated</code>{" "}
          (and sometimes <code>as_of</code> or <code>source_updated</code>){" "}
          timestamp; treat those as the authoritative freshness check rather than assuming the page is live.
        </p>
      </Section>

      <Section title="Global macro overview (dashboard)">
        <p>
          The five &ldquo;GLOBAL … AVG&rdquo; tiles are a simple mean of each economy&rsquo;s latest reading for that indicator across all eleven economies — not weighted by GDP, trade share, or anything else. They give a same-page sense of the group&rsquo;s centre of gravity before you look at any single country.
        </p>
      </Section>

      <Section title="Cross-section & composite ranking">
        <p className="mb-2">
          Each economy gets a <strong>price</strong>{" "}
          score and a <strong>demand</strong>{" "}
          score, each a 0–100 percentile against that indicator&rsquo;s own history — <strong>higher price means better-contained inflation</strong>, and higher demand means stronger growth. Both are compared against the group&rsquo;s median (<code>price_median</code>, <code>demand_median</code>){" "}
          to place the economy in a regime — <em>Goldilocks</em>{" "}
          (contained inflation, strong demand), <em>Overheating</em>{" "}
          (hot inflation, strong demand), <em>Weak</em>{" "}
          (contained inflation, soft demand), or <em>Stagflation</em>{" "}
          (hot inflation, soft demand). We haven&rsquo;t been able to pin the exact threshold the backend uses for &ldquo;above&rdquo; vs &ldquo;below&rdquo; median with certainty — treat the quadrant label as directionally right, not a precise cut.
        </p>
        <p className="mb-2">
          The <strong>composite</strong>{" "}
          score is not independently modelled — it is the sum of the four <code>contrib_*</code> fields:
        </p>
        <pre className="mb-2 overflow-x-auto border bg-white p-2 text-[11px] text-neutral-700">
          composite = contrib_cpi + contrib_ppi + contrib_unemp + contrib_ret
        </pre>
        <p className="mb-2">
          We confirmed this by summing the four contributions for every economy with a non-null composite and matching the published total to within rounding. The Composite ranking chart&rsquo;s stacked bars are literally this sum, segment by segment — the bar length is not decorative, it{" "}
          <em>is</em> the calculation.
        </p>
        <p>
          The prose under &ldquo;Where the cycle stands&rdquo; and on each country&rsquo;s own page is a generated narrative, not a fixed template — it names the largest driver by picking the <code>contrib_*</code>{" "}
          field furthest from zero, but the sentence structure and phrasing come from the same model each time.
        </p>
      </Section>

      <Section title="Economies at a glance & country pages">
        <p className="mb-2">
          &ldquo;Cycle&rdquo; (<code>ring_phase</code>){" "}
          and the country page&rsquo;s quadrant (<code>quadrant</code>{" "}
          on the <code>economies</code> endpoint) use a{" "}
          <strong>different vocabulary from the cross-section above</strong>{" "}
          — e.g. <em>Overheat</em>/<em>Recession</em>{" "}
          here vs <em>Overheating</em>/<em>Weak</em>{" "}
          there, and phases like <em>Contraction</em>/<em>Slowdown</em>/<em>Recovery</em>/<em>Expansion</em>{" "}
          that don&rsquo;t appear in the cross-section at all. They are two separate classifications computed from the same underlying growth/inflation signal, not a relabeling of one another — don&rsquo;t assume a country&rsquo;s cross-section quadrant and its cycle phase always tell the same story.
        </p>
        <p className="mb-2">
          &ldquo;Latest readings&rdquo; are the most recent raw print for each indicator. &ldquo;Indicator history&rdquo; plots the full available series per indicator — points land on irregular, roughly monthly dates (whenever that indicator was actually released), so the x-axis spacing is not uniform time.
        </p>
        <p>
          The &ldquo;Cross-section&rdquo; paragraph on a country page comes from a country-scoped endpoint with its own narrative — it is written specifically about that one economy, not extracted from the group-wide summary shown on the main Cross-section page.
        </p>
      </Section>

      <Section title="COT positioning">
        <p className="mb-2">
          Positioning is read from the CFTC&rsquo;s disaggregated futures report, split into three trader categories:
        </p>
        <dl className="mb-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-3">
          <Term term="Asset Mgr">
            Real-money institutions — pensions, insurers, asset managers.
          </Term>
          <Term term="Lev Money">Leveraged funds — hedge funds, CTAs.</Term>
          <Term term="Dealer">
            Intermediaries who typically hedge client flow rather than take a directional view.
          </Term>
        </dl>
        <dl className="mb-3 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <Term term="net_pct_oi">
            That category&rsquo;s net long/short position as a % of total open interest for the instrument.
          </Term>
          <Term term="percentile">
            Where today&rsquo;s <code>net_pct_oi</code>{" "}
            ranks (0–100) against that category&rsquo;s own history in this instrument.
          </Term>
          <Term term="z">
            Standard deviations from the historical mean — a second, distribution-aware read. It can disagree with the percentile: we found two legs sharing the same percentile but different <code>z</code>
            , which means it is computed independently rather than derived from the percentile.
          </Term>
          <Term term="mom_4w">
            4-week change in <code>net_pct_oi</code>{" "}
            — how fast the category is adding or unwinding, independent of how extreme it already is.
          </Term>
        </dl>
        <p className="mb-2">
          <strong>score</strong>{" "}
          is an exact, verified transform of the percentile.
        </p>
        <pre className="mb-2 overflow-x-auto border bg-white p-2 text-[11px] text-neutral-700">
          score = round((percentile − 50) × 2)
        </pre>
        <p>
          So 0 is the historical median stance, +100 is the most net-long that category has ever been in this instrument, −100 the most net-short.{" "}
          <strong>label</strong>{" "}
          buckets that score by distance from the median — from the data, the boundaries sit close to{" "}
          <strong>20 / 60 / 90</strong>: roughly balanced under 20, leaning 20–60, stretched 60–90, crowded above 90, signed long or short by the sign of the score.
        </p>
      </Section>

      <Section title="Instrument detail pages">
        <p className="mb-2">
          The three leg cards at the top are the same <code>score</code> / <code>label</code> / <code>z</code> / <code>net_pct_oi</code> / <code>mom_4w</code>{" "}
          fields described above, for this one instrument.
        </p>
        <p className="mb-2">
          &ldquo;Positioning change over time&rdquo; shows each category&rsquo;s latest net position, plus its percent change over four look-back windows (1/3/6/12 months). A <code>null</code>{" "}
          for a window (usually 1-year) means there isn&rsquo;t enough history yet to compute it, not that the change was zero.
        </p>
        <p>
          The raw weekly data table shows the underlying CFTC net positions directly, most recent week first. Numbers are colored{" "}
          <span className="text-emerald-600">green</span>{" "}
          when that column&rsquo;s value rose from the prior week and{" "}
          <span className="text-red-600">red</span>{" "}
          when it fell — the comparison is always against the immediately preceding week in the same column, independent of the other columns in that row.
        </p>
      </Section>

      <Section title="Limitations">
        <ul className="list-disc space-y-1 pl-4">
          <li>
            Any indicator, contribution, or score can be <code>null</code>{" "}
            when that data point doesn&rsquo;t exist for a given economy or period — treat missing as &ldquo;unknown,&rdquo; not zero.
          </li>
          <li>
            Regime and quadrant labels (Stagflation, Overheating, Cycle phase, etc.) are model-derived classifications, not official designations — they can and do relabel the same economy differently across the cross-section and economies endpoints, as noted above.
          </li>
          <li>
            Narrative text (summaries, the &ldquo;why&rdquo; behind a number) is generated per refresh and can vary in wording between snapshots even when the underlying numbers are unchanged.
          </li>
          <li>
            Everything on this site is informational. See the disclaimer below before acting on anything shown here.
          </li>
        </ul>
      </Section>

      <DisclaimerFooter />
    </div>
  );
}
