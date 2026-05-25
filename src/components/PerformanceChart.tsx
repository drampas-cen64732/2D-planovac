import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipProps } from "recharts";
import { useInvestment } from "@/context/InvestmentContext";
import {
  buildPerformanceSeries,
  type Allocation,
} from "@/lib/portfolio";

interface PerformanceChartProps {
  allocation: Allocation;
  title?: string;
  subtitle?: string;
  benchmarkLabel?: string;
}

export default function PerformanceChart({
  allocation,
  title = "Vývoj investice (modelace)",
  subtitle = "Hypotetický vývoj počáteční investice — měsíční granularita.",
  benchmarkLabel = "Benchmark (Index S&P 500)",
}: PerformanceChartProps) {
  const { initialInvestment, formatMoney } = useInvestment();

  const data = useMemo(
    () => buildPerformanceSeries(allocation, initialInvestment),
    [allocation, initialInvestment]
  );

  // Show ~ every 6th tick on the x-axis to avoid clutter
  const xTicks = useMemo(
    () => data.filter((_, i) => i % 6 === 0).map((d) => d.date),
    [data]
  );

  const finalValue = data[data.length - 1]?.portfolio ?? initialInvestment;
  const totalChange =
    ((finalValue - initialInvestment) / initialInvestment) * 100;
  const positive = totalChange >= 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-premium md:p-7">
      <div className="mb-4 flex flex-col gap-1 md:mb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ep-navy md:text-xl">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Konečná hodnota
          </div>
          <div className="font-semibold text-ep-navy md:text-lg">
            {formatMoney(finalValue)}
          </div>
          <div
            className={[
              "text-xs font-semibold tabular-nums",
              positive ? "text-emerald-600" : "text-rose-600",
            ].join(" ")}
          >
            {positive ? "▲" : "▼"} {totalChange.toFixed(2)} % celkem
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="ep-portfolio-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e5fb8" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#1e5fb8" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="ep-benchmark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a96e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#c9a96e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.18)" vertical={false} />
            <XAxis
              dataKey="date"
              ticks={xTicks}
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.3)" }}
            />
            <YAxis
              tickFormatter={(v: number) =>
                formatMoney(v, { compact: true }).replace(/\s/g, "")
              }
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "rgba(148,163,184,0.3)" }}
              width={70}
            />
            <Tooltip
              content={<EpTooltip benchmarkLabel={benchmarkLabel} />}
              cursor={{ stroke: "#143a73", strokeOpacity: 0.25, strokeWidth: 1 }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              iconType="circle"
              wrapperStyle={{ fontSize: 12, color: "#475569" }}
            />
            <Area
              type="monotone"
              name="Vybrané portfolio"
              dataKey="portfolio"
              stroke="#1e5fb8"
              strokeWidth={2.5}
              fill="url(#ep-portfolio-fill)"
              activeDot={{ r: 4 }}
            />
            <Area
              type="monotone"
              name={benchmarkLabel}
              dataKey="benchmark"
              stroke="#c9a96e"
              strokeWidth={2}
              strokeDasharray="5 4"
              fill="url(#ep-benchmark-fill)"
              activeDot={{ r: 3 }}
            />
            <Area
              type="monotone"
              name="Reálná hodnota po inflaci"
              dataKey="inflation"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="2 3"
              fill="transparent"
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

interface EpTooltipProps extends TooltipProps<number, string> {
  benchmarkLabel: string;
}

function EpTooltip({ active, payload, label, benchmarkLabel }: EpTooltipProps) {
  const { formatMoney } = useInvestment();
  if (!active || !payload || payload.length === 0) return null;
  const portfolio = payload.find((p) => p.dataKey === "portfolio");
  const benchmark = payload.find((p) => p.dataKey === "benchmark");
  const inflation = payload.find((p) => p.dataKey === "inflation");

  return (
    <div className="rounded-xl border border-border bg-white/95 px-4 py-3 shadow-premium backdrop-blur">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {portfolio && (
        <Row
          color="#1e5fb8"
          label="Portfolio"
          value={formatMoney(Number(portfolio.value))}
        />
      )}
      {benchmark && (
        <Row
          color="#c9a96e"
          label={benchmarkLabel}
          value={formatMoney(Number(benchmark.value))}
        />
      )}
      {inflation && (
        <Row
          color="#94a3b8"
          label="Reálná hodnota"
          value={formatMoney(Number(inflation.value))}
        />
      )}
    </div>
  );
}

function Row({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-0.5 text-sm">
      <span className="flex items-center gap-2 text-slate-600">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="font-semibold text-ep-navy tabular-nums">{value}</span>
    </div>
  );
}
