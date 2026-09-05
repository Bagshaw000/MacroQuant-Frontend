# MacroQuant

A macro-economics and COT (Commitment of Traders) positioning dashboard.

**Live at [www.themacroquant.com](https://www.themacroquant.com)**

## What it is

MacroQuant tracks growth/inflation regimes across eleven major economies and futures positioning across eleven instruments, drawing on two independent data feeds:

- **Macro indicators** — CPI, PPI, unemployment, retail sales, and inflation, from [London Strategic Edge](https://londonstrategicedge.com/)
- **CFTC positioning** — the weekly Commitment of Traders disaggregated futures report, direct from the [CFTC](https://www.cftc.gov/)

## Pages

- `/dashboard` — global indicator averages, the cross-section quadrant chart, composite ranking, and a COT positioning overview
- `/dashboard/[code]` — per-economy detail: latest readings, cross-section narrative, indicator history charts
- `/positioning` — the full COT positioning table across all tracked instruments
- `/positioning/[instrument]` — per-instrument detail: trader-category legs, positioning change over time, and 52 weeks of raw data
- `/methodology` — how to read every page, and the formulas behind the scores (verified against the live feed, not assumed)

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Recharts
- SWR for data fetching

## Local development

The app lives in `macroquant/`:

```bash
cd macroquant
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
