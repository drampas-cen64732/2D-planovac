/**
 * Mock historical monthly returns (%) for asset classes used in the simulator.
 *
 * Range: January 2021 → March 2026 (63 monthly samples).
 * Values are illustrative and chosen to reflect realistic market behaviour:
 *  - 2021: post-COVID recovery, equities and commodities strong
 *  - 2022: bear market (rates shock), broad drawdown
 *  - 2023: tech-led recovery
 *  - 2024: continued growth, gold rally
 *  - 2025: mixed / softer growth
 *  - 2026 (YTD): modest positive returns
 *
 * These are NOT financial advice. They exist only to power the demo UI.
 */

export type AssetClassKey =
  | "stocks"
  | "bonds"
  | "realEstate"
  | "commodities"
  | "cash"
  | "alternatives"
  | "crypto";

export interface AssetClassMeta {
  key: AssetClassKey;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  /** Annualised expected volatility (%) used for the analytical report. */
  volatility: number;
}

export const ASSET_CLASSES: Record<AssetClassKey, AssetClassMeta> = {
  stocks: {
    key: "stocks",
    label: "Globální Akcie (ETF)",
    shortLabel: "Akcie",
    description: "Diverzifikované globální akciové ETF (MSCI World)",
    color: "#1e5fb8",
    volatility: 15.8,
  },
  bonds: {
    key: "bonds",
    label: "Korporátní Dluhopisy",
    shortLabel: "Dluhopisy",
    description: "Investiční stupeň, krátká až střední durace",
    color: "#0a1e3f",
    volatility: 5.2,
  },
  realEstate: {
    key: "realEstate",
    label: "Nemovitostní fondy",
    shortLabel: "Reality",
    description: "REIT / nemovitostní fondy komerčních nemovitostí",
    color: "#c9a96e",
    volatility: 11.4,
  },
  commodities: {
    key: "commodities",
    label: "Komodity & Zlato",
    shortLabel: "Komodity",
    description: "Diverzifikovaný komoditní koš s expozicí na zlato",
    color: "#a16207",
    volatility: 14.2,
  },
  cash: {
    key: "cash",
    label: "Peněžní trh / Hotovost",
    shortLabel: "Hotovost",
    description: "Repo sazba ČNB / krátké instrumenty peněžního trhu",
    color: "#64748b",
    volatility: 0.6,
  },
  alternatives: {
    key: "alternatives",
    label: "Alternativní investice",
    shortLabel: "Alternativy",
    description: "Hedge fondy, private equity, infrastruktura",
    color: "#7c3aed",
    volatility: 9.5,
  },
  crypto: {
    key: "crypto",
    label: "Krypto aktiva",
    shortLabel: "Krypto",
    description: "Bitcoin a vybraná digitální aktiva",
    color: "#f59e0b",
    volatility: 62.0,
  },
};

/** Each entry is a list of 63 monthly returns in percent. */
type ReturnSeries = number[];

/* eslint-disable prettier/prettier */
const stocks: ReturnSeries = [
  // 2021 — strong recovery (+22% year)
  1.8, 2.5, 4.1, 5.0, 0.7, 2.3, 2.4, 2.9, -4.0, 6.8, -0.6, 4.6,
  // 2022 — bear market (~-18%)
  -5.2, -2.8, 3.6, -8.7, 0.4, -8.2, 9.0, -4.0, -9.1, 8.1, 5.5, -5.9,
  // 2023 — strong rebound (~+25%)
  6.3, -2.5, 3.7, 1.6, 0.5, 6.5, 3.2, -1.5, -4.9, -2.1, 9.0, 4.5,
  // 2024 — continued growth (~+18%)
  1.7, 5.3, 3.2, -4.1, 4.9, 3.5, 1.2, 2.4, 2.1, -1.0, 5.9, -2.4,
  // 2025 — softer (~+8%)
  3.0, -1.2, 1.6, 2.8, 1.4, -2.0, 0.8, 2.2, -1.5, 3.4, 0.6, -0.7,
  // 2026 YTD (Jan–Mar) — mild positive
  1.2, 0.7, 1.5,
];

const bonds: ReturnSeries = [
  // 2021 — flat to slightly negative
  -0.7, -1.5, -1.2, 0.7, 0.3, 0.7, 1.1, -0.4, -1.0, -0.3, 0.4, -0.3,
  // 2022 — historic drawdown (~-12%)
  -2.0, -1.1, -2.8, -3.8, 0.6, -1.6, 2.4, -2.9, -4.3, -1.3, 3.7, -0.5,
  // 2023 — recovery (~+5.5%)
  3.2, -2.6, 2.8, 0.6, -1.1, -0.4, 0.1, -0.6, -2.5, 1.3, 4.5, 3.8,
  // 2024 — coupon-driven returns (~+3.5%)
  -0.3, -1.4, 0.9, -2.5, 1.7, 0.9, 2.4, 1.5, 1.2, -1.6, 1.1, 0.4,
  // 2025 — stable income (~+4%)
  0.7, 0.5, 0.3, 0.6, 0.4, -0.4, 0.5, 0.6, 0.2, 0.3, 0.5, 0.2,
  // 2026 YTD
  0.4, 0.3, 0.3,
];

const realEstate: ReturnSeries = [
  // 2021 — REITs recovery
  0.5, 4.2, 4.8, 7.9, 0.8, 2.6, 4.5, 2.0, -5.5, 7.4, -0.8, 9.6,
  // 2022 — bad year (~-25%)
  -7.3, -2.9, 6.8, -3.7, -4.5, -7.8, 8.4, -5.8, -12.6, 3.6, 5.0, -4.6,
  // 2023 — choppy (~+9%)
  10.1, -5.0, -1.2, 1.0, -3.7, 5.5, 2.5, -3.0, -7.5, -4.0, 11.3, 8.7,
  // 2024 — recovery (~+12%)
  -4.5, 1.6, 1.8, -7.7, 4.8, 2.1, 6.9, 5.7, 3.0, -3.6, 4.5, -2.6,
  // 2025 — mild gains (~+6%)
  1.5, -0.7, 2.3, 1.0, 0.8, -1.2, 0.9, 1.8, -0.5, 1.0, 0.4, -0.2,
  // 2026 YTD
  1.0, 0.5, 0.7,
];

const commodities: ReturnSeries = [
  // 2021 — strong (~+27%)
  3.5, 6.2, -1.3, 8.3, 2.7, 1.9, 1.6, -2.3, 4.9, 3.5, -7.3, 3.5,
  // 2022 — strong start, weaker end (~+16%)
  8.0, 6.2, 8.6, 4.1, 1.5, -10.9, -5.7, -1.1, -8.1, 2.0, 2.7, -1.6,
  // 2023 — flat (~-7%)
  -2.6, -4.6, -3.1, 0.7, -6.0, 4.0, 6.5, -0.5, -0.7, -1.7, -1.6, 2.6,
  // 2024 — gold rally (~+14%)
  -0.5, -1.4, 4.2, 2.4, 1.8, -1.5, 3.9, 0.8, 5.5, 2.1, 0.7, -2.5,
  // 2025 — mixed (~+5%)
  2.0, -1.0, 1.4, 0.8, -0.5, 1.6, 0.4, -0.8, 1.0, 0.9, 0.2, -0.3,
  // 2026 YTD
  1.5, 0.8, 0.4,
];

const cash: ReturnSeries = [
  // 2021 — near zero
  0.02, 0.02, 0.02, 0.04, 0.05, 0.06, 0.08, 0.1, 0.12, 0.14, 0.18, 0.22,
  // 2022 — rate hikes (~+2.5%)
  0.25, 0.3, 0.35, 0.45, 0.5, 0.55, 0.55, 0.55, 0.55, 0.55, 0.6, 0.6,
  // 2023 — high rates (~+6.5%)
  0.6, 0.58, 0.58, 0.58, 0.58, 0.55, 0.55, 0.55, 0.55, 0.52, 0.5, 0.48,
  // 2024 — easing (~+5%)
  0.45, 0.42, 0.4, 0.4, 0.38, 0.36, 0.34, 0.32, 0.3, 0.3, 0.28, 0.28,
  // 2025 — stable lower (~+3.2%)
  0.27, 0.27, 0.26, 0.26, 0.25, 0.25, 0.25, 0.25, 0.24, 0.24, 0.23, 0.23,
  // 2026 YTD
  0.22, 0.22, 0.22,
];

const alternatives: ReturnSeries = [
  // 2021 (~+13%)
  1.3, 1.6, 2.0, 2.1, 0.7, 1.2, 1.0, 1.3, -1.4, 2.6, 0.1, 1.8,
  // 2022 (~-6%)
  -2.0, -0.9, 1.8, -3.8, 0.3, -3.1, 3.7, -1.4, -3.5, 3.4, 2.1, -2.0,
  // 2023 (~+9%)
  2.4, -0.6, 1.6, 0.9, 0.5, 2.5, 1.4, -0.4, -1.6, -0.6, 3.4, 1.7,
  // 2024 (~+9%)
  0.9, 1.9, 1.3, -1.0, 1.9, 1.5, 0.7, 1.1, 1.1, -0.2, 2.1, -0.6,
  // 2025 (~+6%)
  1.2, -0.3, 0.7, 1.1, 0.6, -0.5, 0.5, 1.0, -0.3, 1.2, 0.4, -0.1,
  // 2026 YTD
  0.6, 0.4, 0.6,
];

const crypto: ReturnSeries = [
  // 2021 — huge gains (~+60%)
  14.0, 36.0, 30.0, -1.5, -35.0, -6.0, 18.0, 13.0, -7.0, 40.0, -7.0, -19.0,
  // 2022 — collapse (~-65%)
  -16.0, 12.0, 5.0, -17.0, -16.0, -37.0, 17.0, -14.0, -3.0, 5.0, -16.0, -3.0,
  // 2023 — recovery (~+155%)
  39.0, 0.0, 23.0, 3.0, -7.0, 12.0, -4.0, -11.0, 4.0, 28.0, 9.0, 12.0,
  // 2024 — strong (~+120%)
  0.0, 43.0, 16.0, -15.0, 11.0, -7.0, 3.0, -8.0, 7.0, 11.0, 38.0, -3.0,
  // 2025 — mixed (~+15%)
  5.0, -7.0, 4.0, 9.0, 2.0, -6.0, 1.0, 7.0, -4.0, 8.0, -2.0, -3.0,
  // 2026 YTD
  3.0, -1.0, 4.0,
];
/* eslint-enable prettier/prettier */

export const HISTORICAL_RETURNS: Record<AssetClassKey, ReturnSeries> = {
  stocks,
  bonds,
  realEstate,
  commodities,
  cash,
  alternatives,
  crypto,
};

/**
 * Build the array of (year, month) labels matching the return series above.
 */
export function buildMonthlyTimeline(): { date: Date; label: string }[] {
  const start = new Date(2021, 0, 1);
  const out: { date: Date; label: string }[] = [];
  const length = stocks.length;
  for (let i = 0; i < length; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    out.push({
      date: d,
      label: d.toLocaleDateString("cs-CZ", {
        month: "short",
        year: "numeric",
      }),
    });
  }
  return out;
}

/** Benchmark series: a simulated S&P 500 monthly return (%). */
export const BENCHMARK_SP500: ReturnSeries = stocks.map((v) => v * 1.05 + 0.05);

/** Inflation series (CPI YoY divided to monthly, approximate). */
export const BENCHMARK_INFLATION: ReturnSeries = [
  // 2021 ~3.8%
  0.2, 0.2, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.4, 0.4, 0.4,
  // 2022 ~15% CZ
  0.9, 1.0, 1.1, 1.2, 1.3, 1.3, 1.3, 1.2, 1.1, 1.1, 1.0, 1.0,
  // 2023 ~10.7% CZ
  1.0, 0.9, 0.9, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.7, 0.7, 0.7,
  // 2024 ~2.4% CZ
  0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
  // 2025 ~2.3%
  0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2,
  // 2026 YTD
  0.2, 0.2, 0.2,
];
