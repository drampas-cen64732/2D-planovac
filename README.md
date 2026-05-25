# Erste Premier — Zpětné modelace (Return Analyzer Pro)

Prémiová fintech aplikace pro analýzu zpětných modelací investičních portfolií
v korporátní identitě **Erste Premier**.

## ✨ Funkce

- **Header** — globální selektor měny (CZK / EUR) a počáteční investice,
  které synchronizovaně ovlivňují všechny výpočty (React Context).
- **Přednastavená portfolia** — tři rizikové profily (Konzervativní,
  Vyvážený, Dynamický) s donut grafem alokace a historickou výkonností
  za 1 / 3 / 5 let.
- **Builder vlastního portfolia** — slidery pro 5 tříd aktiv, dynamická
  validace na 100 %, plus analytický report (CAGR, volatilita, Sharpe,
  max. drawdown).
- **Interaktivní graf vývoje** — `recharts` AreaChart s plynulým
  gradientem, vlastním tooltipem a benchmarkem (S&P 500, inflace).
- **Plně responzivní design**, optimalizováno pro velké obrazovky
  (`max-w-[1400px]`).

## 🛠️ Technologický stack

- React 18 + TypeScript + Vite
- Tailwind CSS (Erste Premier design tokeny: `ep-navy`, `ep-blue`,
  `ep-gold`, …)
- recharts (grafy)
- lucide-react (ikony)

## 🚀 Spuštění

```bash
npm install
npm run dev      # vývojový server
npm run build    # produkční build
npm run preview  # náhled produkčního buildu
```

Aplikace běží defaultně na `http://localhost:5173`.

## 📂 Struktura

```
src/
├── components/
│   ├── Header.tsx
│   ├── PerformanceChart.tsx
│   ├── PresetPortfolios.tsx
│   └── CustomPortfolioBuilder.tsx
├── context/
│   └── InvestmentContext.tsx        # globální stav (měna, počáteční částka)
├── data/
│   ├── marketData.ts                # mock měsíční historická data 2021–Q1 2026
│   └── presetPortfolios.ts          # definice 3 přednastavených profilů
├── lib/
│   └── portfolio.ts                 # vážené výpočty výkonnosti a statistik
├── pages/
│   └── Index.tsx                    # hlavní stránka s CollapsibleSection
├── index.css
└── main.tsx
```

## ⚠️ Disclaimer

Data jsou ilustrativní a slouží výhradně k demonstračním účelům. Aplikace
**neposkytuje investiční doporučení**. Minulé výnosy nejsou zárukou
budoucích.
