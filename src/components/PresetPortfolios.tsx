import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { CheckCircle2, LineChart, Shield, Sparkles, Zap } from "lucide-react";
import { PRESET_PORTFOLIOS } from "@/data/presetPortfolios";
import type { PresetPortfolio } from "@/data/presetPortfolios";
import {
  allocationEntries,
  computeStats,
  type Allocation,
} from "@/lib/portfolio";
import { useInvestment } from "@/context/InvestmentContext";
import PerformanceChart from "@/components/PerformanceChart";

function PerformanceCell({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={[
        "font-semibold tabular-nums",
        positive ? "text-emerald-600" : "text-rose-600",
      ].join(" ")}
    >
      {positive ? "+" : ""}
      {value.toFixed(2)} %
    </span>
  );
}

function RiskBadge({
  level,
  label,
}: {
  level: PresetPortfolio["riskLevel"];
  label: string;
}) {
  const tone =
    level <= 2
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : level === 3
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        tone,
      ].join(" ")}
    >
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={[
              "h-1.5 w-1.5 rounded-full",
              i < level ? "bg-current" : "bg-current/25 opacity-30",
            ].join(" ")}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

function PortfolioIcon({ id }: { id: PresetPortfolio["id"] }) {
  if (id === "conservative")
    return <Shield className="h-5 w-5 text-emerald-700" strokeWidth={1.7} />;
  if (id === "balanced")
    return <Sparkles className="h-5 w-5 text-amber-700" strokeWidth={1.7} />;
  return <Zap className="h-5 w-5 text-rose-700" strokeWidth={1.7} />;
}

function DonutChart({ allocation }: { allocation: Allocation }) {
  const entries = allocationEntries(allocation);
  const data = entries.map((e) => ({
    name: e.meta.shortLabel,
    value: e.weight,
    color: e.meta.color,
  }));
  return (
    <div className="relative h-[160px] w-[160px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={50}
            outerRadius={72}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Alokace
        </div>
        <div className="text-sm font-semibold text-ep-navy">100 %</div>
      </div>
    </div>
  );
}

function AllocationLegend({ allocation }: { allocation: Allocation }) {
  const entries = allocationEntries(allocation);
  return (
    <ul className="flex-1 space-y-2">
      {entries.map((e) => (
        <li key={e.key}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-700">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: e.meta.color }}
              />
              {e.meta.shortLabel}
            </span>
            <span className="font-semibold tabular-nums text-ep-navy">
              {e.weight} %
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full"
              style={{
                width: `${e.weight}%`,
                backgroundColor: e.meta.color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function PerformanceTable({
  stats,
}: {
  stats: ReturnType<typeof computeStats>;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        Historická výkonnost (% p.a.)
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[11px] text-muted-foreground">1 rok</div>
          <PerformanceCell value={stats.performance1y} />
        </div>
        <div className="border-x border-border/70">
          <div className="text-[11px] text-muted-foreground">3 roky</div>
          <PerformanceCell value={stats.performance3y} />
        </div>
        <div>
          <div className="text-[11px] text-muted-foreground">5 let</div>
          <PerformanceCell value={stats.performance5y} />
        </div>
      </div>
    </div>
  );
}

interface PresetPortfoliosProps {
  /** Override the default preset list (for tests). */
  presets?: PresetPortfolio[];
}

export default function PresetPortfolios({
  presets = PRESET_PORTFOLIOS,
}: PresetPortfoliosProps) {
  const { initialInvestment } = useInvestment();
  const [selectedId, setSelectedId] = useState<PresetPortfolio["id"] | null>(
    null
  );

  const stats = useMemo(() => {
    return Object.fromEntries(
      presets.map((p) => [p.id, computeStats(p.allocation, initialInvestment)])
    ) as Record<PresetPortfolio["id"], ReturnType<typeof computeStats>>;
  }, [presets, initialInvestment]);

  const selected = presets.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        {presets.map((p) => {
          const s = stats[p.id];
          const isSelected = selectedId === p.id;
          return (
            <article
              key={p.id}
              className={[
                "group relative flex flex-col rounded-2xl border bg-card p-5 shadow-premium transition-all duration-300",
                isSelected
                  ? "border-ep-gold/70 ring-2 ring-ep-gold/30 shadow-premium-hover"
                  : "border-border hover:-translate-y-0.5 hover:border-ep-blue/30 hover:shadow-premium-hover",
              ].join(" ")}
            >
              <header className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                    <PortfolioIcon id={p.id} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ep-navy">
                      {p.name}
                    </h3>
                    <RiskBadge level={p.riskLevel} label={p.riskLabel} />
                  </div>
                </div>
              </header>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {p.tagline}
              </p>

              <div className="mb-4 flex items-center gap-4">
                <DonutChart allocation={p.allocation} />
                <AllocationLegend allocation={p.allocation} />
              </div>

              <div className="mb-4">
                <PerformanceTable stats={s} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedId(p.id)}
                className={[
                  "mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                  isSelected
                    ? "bg-ep-gold text-ep-navy shadow-md"
                    : "bg-ep-navy text-white hover:bg-ep-blue",
                ].join(" ")}
                aria-pressed={isSelected}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Modelace načtena
                  </>
                ) : (
                  <>
                    <LineChart className="h-4 w-4" />
                    Zobrazit modelaci vývoje
                  </>
                )}
              </button>
            </article>
          );
        })}
      </div>

      {selected && (
        <div className="fade-in">
          <PerformanceChart
            allocation={selected.allocation}
            title={`Modelace — ${selected.name}`}
            subtitle="Vývoj počáteční investice v rámci vybraného přednastaveného portfolia."
          />
        </div>
      )}
    </div>
  );
}
