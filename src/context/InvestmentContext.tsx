import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Currency = "CZK" | "EUR";

export interface InvestmentContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  initialInvestment: number; // value in selected currency
  setInitialInvestment: (n: number) => void;
  /** CZK -> EUR static rate for demo purposes */
  fxRate: number;
  formatMoney: (amount: number, opts?: { compact?: boolean }) => string;
}

const InvestmentContext = createContext<InvestmentContextValue | null>(null);

const FX_CZK_TO_EUR = 0.04; // 1 CZK ~ 0.04 EUR (demo)

export function InvestmentProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("CZK");
  const [initialInvestment, setInitialInvestment] = useState<number>(1_000_000);

  const setCurrency = (next: Currency) => {
    setCurrencyState((prev) => {
      if (prev === next) return prev;
      // Convert the displayed initial investment when switching currency.
      setInitialInvestment((amount) => {
        if (prev === "CZK" && next === "EUR") {
          return Math.round(amount * FX_CZK_TO_EUR);
        }
        if (prev === "EUR" && next === "CZK") {
          return Math.round(amount / FX_CZK_TO_EUR);
        }
        return amount;
      });
      return next;
    });
  };

  const value = useMemo<InvestmentContextValue>(() => {
    const formatMoney: InvestmentContextValue["formatMoney"] = (
      amount,
      opts
    ) => {
      const locale = currency === "CZK" ? "cs-CZ" : "de-DE";
      const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
        notation: opts?.compact ? "compact" : "standard",
      });
      return formatter.format(amount);
    };
    return {
      currency,
      setCurrency,
      initialInvestment,
      setInitialInvestment,
      fxRate: FX_CZK_TO_EUR,
      formatMoney,
    };
  }, [currency, initialInvestment]);

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestment(): InvestmentContextValue {
  const ctx = useContext(InvestmentContext);
  if (!ctx) {
    throw new Error("useInvestment must be used within InvestmentProvider");
  }
  return ctx;
}
