import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  PlayCircle,
  RotateCcw,
  Scale,
} from "lucide-react";
import { ASSET_CLASSES } from "@/data/marketData";
import type { AssetClassKey } from "@/data/marketData";
import {
  allocationSum,
  computeStats,
  type Allocation,
} from "@/lib/portfolio";
import { useInvestment } from "@/context/InvestmentContext";
import PerformanceChart from "@/components/PerformanceChart";

/** Asset classes available to the builder, in display order. */
const BUILDER_ASSETS: AssetClassKey[] = [
  "stocks",
  "bonds",
  "realEstate",
  "commodities",
  "cash",
];

const DEFAULT_ALLOCATION: Allocation = {
  stocks: 40,
  bonds: 30,
  realEstate: 10,
  commodities: 10,
  cash: 10,
};

interface SliderRowProps {
  assetKey: AssetClassKey;
  value: number;
  max: number;
  onChange: (next: number) => void;
}

function SliderRow({ assetKey, value, max, onChange }: SliderRowProps) {
  const meta = ASSET_CLASSES[assetKey];
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty("--val", `${value}%`);
    }
  }, [value]);

  const clamp = (n: number) => Math.max(0, Math.min(max, Math.round(n)));

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition hover:border-ep-blue/30">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: meta.color }}
          />
          <div>
            <div className="text-sm font-semibold text-ep-navy">
              {meta.label}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {meta.description}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value || 0)))}
            className="w-16 rounded-md border border-border bg-muted/40 px-2 py-1 text-right text-sm font-semibold tabular-nums text-ep-navy outline-none focus:border-ep-blue focus:ring-2 focus:ring-ep-blue/20"
            aria-label={`Procento — ${meta.label}`}
          />
          <span className="text-xs font-semibold text-muted-foreground">%</span>
        </div>
      </div>
      <input
        ref={sliderRef}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="ep-slider"
        aria-label={`Slider — ${meta.label}`}
      />
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "positive" | "negative";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600"
      : tone === "negative"
        ? "text-rose-600"
        : "text-ep-navy";
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold tabular-nums ${toneClass}`}>
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>
      )}
    </div>
  );
}

export default function CustomPortfolioBuilder() {
  const { initialInvestment, formatMoney } = useInvestment();
  const [allocation, setAllocation] = useState<Allocation>(DEFAULT_ALLOCATION);
  const [simulated, setSimulated] = useState<Allocation | null>(
    DEFAULT_ALLOCATION
  );

  const total = useMemo(() => allocationSum(allocation), [allocation]);
  const remaining = 100 - total;
  const valid = total === 100;

  const setWeight = (key: AssetClassKey, next: number) => {
    setAllocation((prev) => {
      const otherSum = (Object.keys(prev) as AssetClassKey[])
        .filter((k) => k !== key)
        .reduce((s, k) => s + (prev[k] ?? 0), 0);
      // Prevent exceeding 100 % total — clamp to available room.
      const maxAllowed = Math.max(0, 100 - otherSum);
      const clamped = Math.min(next, maxAllowed);
      return { ...prev, [key]: clamped };
    });
  };

  const maxFor = (key: AssetClassKey) => {
    const otherSum = (Object.keys(allocation) as AssetClassKey[])
      .filter((k) => k !== key)
      .reduce((s, k) => s + (allocation[k] ?? 0), 0);
    return Math.max(0, 100 - otherSum);
  };

  const resetAll = () => setAllocation(DEFAULT_ALLOCATION);
  const normalize = () => {
    if (total === 0) {
      setAllocation(DEFAULT_ALLOCATION);
      return;
    }
    setAllocation((prev) => {
      const next: Allocation = {};
      const keys = Object.keys(prev) as AssetClassKey[];
      let running = 0;
      keys.forEach((k, idx) => {
        const v = prev[k] ?? 0;
        const scaled = Math.round((v / total) * 100);
        if (idx === keys.length - 1) {
          next[k] = 100 - running;
        } else {
          next[k] = scaled;
          running += scaled;
        }
      });
      return next;
    });
  };

  const runSimulation = () => {
    if (!valid) return;
    setSimulated({ ...allocation });
  };

  const stats = useMemo(
    () => (simulated ? computeStats(simulated, initialInvestment) : null),
    [simulated, initialInvestment]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Sliders */}
        <div className="space-y-3">
          {BUILDER_ASSETS.map((key) => (
            <SliderRow
              key={key}
              assetKey={key}
              value={allocation[key] ?? 0}
              max={maxFor(key)}
              onChange={(v) => setWeight(key, v)}
            />
          ))}
        </div>

        {/* Summary panel */}
        <aside className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-premium">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Celková alokace
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={[
                  "text-4xl font-bold tabular-nums",
                  valid
                    ? "text-emerald-600"
                    : total > 100
                      ? "text-rose-600"
                      : "text-ep-navy",
                ].join(" ")}
              >
                {total}
              </span>
              <span className="text-lg font-semibold text-muted-foreground">
                / 100 %
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={[
                  "h-full rounded-full transition-all",
                  valid
                    ? "bg-emerald-500"
                    : total > 100
                      ? "bg-rose-500"
                      : "bg-ep-blue-light",
                ].join(" ")}
                style={{ width: `${Math.min(100, total)}%` }}
              />
            </div>
          </div>

          {valid ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
              Alokace je vyvážená. Můžete spustit simulaci.
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              {total < 100
                ? `Pro spuštění simulace přidělte zbývajících ${remaining} %.`
                : `Snižte alokaci o ${Math.abs(remaining)} %.`}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={runSimulation}
              disabled={!valid}
              className={[
                "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                valid
                  ? "bg-ep-navy text-white shadow-md hover:bg-ep-blue"
                  : "cursor-not-allowed bg-slate-100 text-slate-400",
              ].join(" ")}
            >
              <PlayCircle className="h-4 w-4" />
              Spustit simulaci vlastního portfolia
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={normalize}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ep-navy transition hover:border-ep-blue/40 hover:bg-muted/40"
                title="Proporcionálně dorovnat na 100 %"
              >
                <Scale className="h-3.5 w-3.5" />
                Dorovnat na 100 %
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-ep-navy transition hover:border-ep-blue/40 hover:bg-muted/40"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Výchozí alokace
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
            <strong className="text-ep-navy">Upozornění:</strong> Modelace
            vychází z hypotetických historických dat a slouží pouze pro
            ilustraci. Minulé výnosy nejsou zárukou výnosů budoucích.
          </div>
        </aside>
      </div>

      {simulated && stats && (
        <div className="fade-in space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-premium md:p-7">
            <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-ep-navy md:text-xl">
                  Analytický report — Vlastní portfolio
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vyhodnocení na základě měsíčních dat 2021 – Q1 2026.
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Konečná hodnota
                </div>
                <div className="text-xl font-bold text-ep-navy">
                  {formatMoney(stats.finalValue)}
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile
                label="Roční výnos (CAGR)"
                value={`${stats.cagr.toFixed(2)} %`}
                tone={stats.cagr >= 0 ? "positive" : "negative"}
                hint="Geometrický průměr za sledované období."
              />
              <StatTile
                label="Volatilita (p.a.)"
                value={`${stats.volatility.toFixed(2)} %`}
                hint="Realizovaná roční volatilita měsíčních výnosů."
              />
              <StatTile
                label="Sharpe Ratio"
                value={stats.sharpe.toFixed(2)}
                tone={stats.sharpe >= 1 ? "positive" : "neutral"}
                hint="Výnos nad bezrizikovou sazbu na jednotku rizika."
              />
              <StatTile
                label="Max. Drawdown"
                value={`${stats.maxDrawdown.toFixed(2)} %`}
                tone="negative"
                hint="Největší pokles od vrcholu k dnu."
              />
            </div>
          </div>

          <PerformanceChart
            allocation={simulated}
            title="Modelace — Vlastní portfolio"
            subtitle="Vážený průměr historických výnosů jednotlivých aktiv dle vaší alokace."
          />
        </div>
      )}
    </div>
  );
}
