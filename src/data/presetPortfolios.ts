import type { Allocation } from "@/lib/portfolio";

export interface PresetPortfolio {
  id: "conservative" | "balanced" | "dynamic";
  name: string;
  tagline: string;
  riskLabel: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  allocation: Allocation;
}

export const PRESET_PORTFOLIOS: PresetPortfolio[] = [
  {
    id: "conservative",
    name: "Konzervativní profil",
    tagline:
      "Pro klienty preferující stabilitu kapitálu a pravidelný výnos.",
    riskLabel: "Nízké riziko",
    riskLevel: 2,
    allocation: {
      stocks: 20,
      bonds: 70,
      alternatives: 10,
    },
  },
  {
    id: "balanced",
    name: "Vyvážený profil",
    tagline:
      "Vyvážená kombinace růstu a ochrany kapitálu pro dlouhodobý horizont.",
    riskLabel: "Střední riziko",
    riskLevel: 3,
    allocation: {
      stocks: 50,
      bonds: 40,
      commodities: 10,
    },
  },
  {
    id: "dynamic",
    name: "Dynamický profil",
    tagline:
      "Maximální růstový potenciál pro klienty s dlouhodobým horizontem.",
    riskLabel: "Vysoké riziko",
    riskLevel: 5,
    allocation: {
      stocks: 80,
      commodities: 15,
      crypto: 5,
    },
  },
];
