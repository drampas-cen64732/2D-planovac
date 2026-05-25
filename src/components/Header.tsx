import { Coins, TrendingUp } from "lucide-react";
import { useInvestment } from "@/context/InvestmentContext";
import type { Currency } from "@/context/InvestmentContext";

export default function Header() {
  const { currency, setCurrency, initialInvestment, setInitialInvestment } =
    useInvestment();

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    setInitialInvestment(Math.max(0, parsed));
  };

  const minStep = currency === "CZK" ? 50_000 : 2_000;

  return (
    <header className="sticky top-0 z-40 bg-ep-gradient text-white shadow-premium">
      <div className="absolute inset-0 bg-ep-radial pointer-events-none" />
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-10 md:py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-md border border-ep-gold/40 bg-white/5 backdrop-blur">
            <TrendingUp className="h-5 w-5 text-ep-gold" strokeWidth={1.6} />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-xl font-semibold tracking-[0.18em] text-white md:text-2xl">
              ERSTE&nbsp;PREMIER
            </div>
            <div className="text-[11px] uppercase tracking-[0.32em] text-ep-gold/90 md:text-xs">
              Zpětné modelace
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Currency selector */}
          <div
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur"
            role="tablist"
            aria-label="Volba měny"
          >
            {(["CZK", "EUR"] as Currency[]).map((c) => {
              const active = currency === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCurrency(c)}
                  className={[
                    "rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider transition-all",
                    active
                      ? "bg-ep-gold text-ep-navy shadow-md"
                      : "text-white/70 hover:text-white",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Initial investment input */}
          <label className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur transition focus-within:border-ep-gold/70 focus-within:bg-white/10">
            <Coins className="h-4 w-4 text-ep-gold" strokeWidth={1.8} />
            <span className="hidden text-[10px] uppercase tracking-[0.28em] text-white/60 md:inline">
              Počáteční investice
            </span>
            <input
              type="text"
              inputMode="numeric"
              aria-label="Počáteční investice"
              value={initialInvestment.toLocaleString(
                currency === "CZK" ? "cs-CZ" : "de-DE"
              )}
              onChange={handleAmount}
              className="w-32 bg-transparent text-right font-semibold text-white outline-none placeholder:text-white/40 md:w-36"
            />
            <span className="text-xs font-semibold tracking-wider text-ep-gold/90">
              {currency}
            </span>
          </label>

          {/* Quick step */}
          <div className="hidden gap-1 sm:flex">
            <button
              type="button"
              onClick={() =>
                setInitialInvestment(Math.max(0, initialInvestment - minStep))
              }
              className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Snížit počáteční investici"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setInitialInvestment(initialInvestment + minStep)}
              className="rounded-md border border-white/15 px-2 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Zvýšit počáteční investici"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
