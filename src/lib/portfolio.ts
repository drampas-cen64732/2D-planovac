import {
  ASSET_CLASSES,
  BENCHMARK_INFLATION,
  BENCHMARK_SP500,
  HISTORICAL_RETURNS,
  buildMonthlyTimeline,
  type AssetClassKey,
} from "@/data/marketData";

export type Allocation = Partial<Record<AssetClassKey, number>>;

export interface PerformancePoint {
  date: string;
  /** Portfolio value at this date in the user's chosen currency. */
  portfolio: number;
  /** Benchmark value (S&P 500). */
  benchmark: number;
  /** Inflation-adjusted purchasing power of initial amount. */
  inflation: number;
  /** Raw date object — useful for sorting / debugging. */
  ts: number;
}

export interface PortfolioStats {
  /** Annualised return (% p.a.) — geometric. */
  cagr: number;
  /** Realised annualised volatility (%). */
  volatility: number;
  /** Sharpe ratio using cash series as risk-free proxy. */
  sharpe: number;
  /** Maximum drawdown (%, negative number). */
  maxDrawdown: number;
  /** Total return over the whole period (%). */
  totalReturn: number;
  /** 1y / 3y / 5y annualised performance (%). */
  performance1y: number;
  performance3y: number;
  performance5y: number;
  /** Final portfolio value in the user's currency. */
  finalValue: number;
}

/**
 * Combine monthly returns of each asset class according to allocation weights.
 * Weights are interpreted as percentages summing to 100.
 */
export function weightedMonthlyReturns(allocation: Allocation): number[] {
  const timeline = buildMonthlyTimeline();
  const out = new Array<number>(timeline.length).fill(0);

  (Object.keys(allocation) as AssetClassKey[]).forEach((key) => {
    const weight = (allocation[key] ?? 0) / 100;
    if (weight <= 0) return;
    const series = HISTORICAL_RETURNS[key];
    for (let i = 0; i < series.length; i++) {
      out[i] += series[i] * weight;
    }
  });

  return out;
}

/** Compound a list of monthly returns (in %) into a value series. */
function compoundSeries(initial: number, monthlyPct: number[]): number[] {
  const values: number[] = [];
  let val = initial;
  for (const r of monthlyPct) {
    val = val * (1 + r / 100);
    values.push(val);
  }
  return values;
}

export function buildPerformanceSeries(
  allocation: Allocation,
  initialInvestment: number
): PerformancePoint[] {
  const timeline = buildMonthlyTimeline();
  const portfolioReturns = weightedMonthlyReturns(allocation);
  const portfolioValues = compoundSeries(initialInvestment, portfolioReturns);
  const benchmarkValues = compoundSeries(initialInvestment, BENCHMARK_SP500);
  // Inflation reduces purchasing power
  const inflationValues = compoundSeries(
    initialInvestment,
    BENCHMARK_INFLATION.map((v) => -v)
  );

  return timeline.map((t, i) => ({
    date: t.label,
    portfolio: portfolioValues[i],
    benchmark: benchmarkValues[i],
    inflation: inflationValues[i],
    ts: t.date.getTime(),
  }));
}

/**
 * Annualised geometric return between two values, given the number of months.
 */
function annualisedReturn(startVal: number, endVal: number, months: number) {
  if (startVal <= 0 || months <= 0) return 0;
  const years = months / 12;
  return (Math.pow(endVal / startVal, 1 / years) - 1) * 100;
}

function stddev(values: number[]) {
  if (values.length === 0) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / values.length;
  return Math.sqrt(variance);
}

export function computeStats(
  allocation: Allocation,
  initialInvestment: number
): PortfolioStats {
  const monthlyReturns = weightedMonthlyReturns(allocation);
  const values = compoundSeries(initialInvestment, monthlyReturns);
  const months = monthlyReturns.length;
  const finalValue = values[values.length - 1];

  const totalReturn = ((finalValue - initialInvestment) / initialInvestment) * 100;
  const cagr = annualisedReturn(initialInvestment, finalValue, months);

  // Annualised volatility from monthly stdev
  const monthlyStd = stddev(monthlyReturns);
  const volatility = monthlyStd * Math.sqrt(12);

  // Risk-free proxy: average cash return (annualised)
  const cashSeries = HISTORICAL_RETURNS.cash;
  const meanCashMonthly =
    cashSeries.reduce((a, b) => a + b, 0) / cashSeries.length;
  const riskFreeAnnual = meanCashMonthly * 12;
  const sharpe = volatility > 0 ? (cagr - riskFreeAnnual) / volatility : 0;

  // Max drawdown
  let peak = values[0];
  let maxDD = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    const dd = (v - peak) / peak;
    if (dd < maxDD) maxDD = dd;
  }
  const maxDrawdown = maxDD * 100;

  // Trailing performance windows (using monthly granularity)
  const last = values[values.length - 1];
  const perf = (monthsBack: number) => {
    const idx = values.length - 1 - monthsBack;
    if (idx < 0) return 0;
    const start = values[idx];
    return annualisedReturn(start, last, monthsBack);
  };
  const performance1y = perf(12);
  const performance3y = perf(36);
  const performance5y = perf(60);

  return {
    cagr,
    volatility,
    sharpe,
    maxDrawdown,
    totalReturn,
    performance1y,
    performance3y,
    performance5y,
    finalValue,
  };
}

/**
 * Sum of allocation weights, returns 0 if undefined.
 */
export function allocationSum(allocation: Allocation): number {
  return (Object.keys(allocation) as AssetClassKey[]).reduce(
    (s, k) => s + (allocation[k] ?? 0),
    0
  );
}

/** List allocation entries in display order, skipping zero weights. */
export function allocationEntries(allocation: Allocation) {
  return (Object.keys(allocation) as AssetClassKey[])
    .filter((k) => (allocation[k] ?? 0) > 0)
    .map((k) => ({
      key: k,
      weight: allocation[k] ?? 0,
      meta: ASSET_CLASSES[k],
    }));
}
