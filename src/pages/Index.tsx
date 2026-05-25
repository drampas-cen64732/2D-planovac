import { useState } from "react";
import { ChevronDown, BarChart3, Settings2 } from "lucide-react";
import Header from "@/components/Header";
import PresetPortfolios from "@/components/PresetPortfolios";
import CustomPortfolioBuilder from "@/components/CustomPortfolioBuilder";

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  description,
  icon,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-premium">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-muted/40 md:px-7 md:py-5"
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/40 text-ep-navy">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-ep-navy md:text-lg">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-muted-foreground md:text-sm">
                {description}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={[
            "h-5 w-5 text-muted-foreground transition-transform duration-300",
            open ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      <div
        className={[
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-5 py-6 md:px-7 md:py-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-10 md:py-12">
        {/* Hero */}
        <section className="mb-8 md:mb-10">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-ep-gradient p-6 text-white shadow-premium md:p-10">
            <div className="absolute inset-0 bg-ep-radial" />
            <div className="relative max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-ep-gold/40 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-ep-gold">
                Return Analyzer Pro
              </span>
              <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight md:text-5xl">
                Zpětná modelace investičních strategií
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                Prozkoumejte, jak by se vyvíjela vaše počáteční investice
                v rámci tří doporučených profilů Erste Premier — nebo si
                sestavte vlastní portfolio a získejte detailní analytický
                report s metrikami rizika a výnosu.
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <CollapsibleSection
            defaultOpen
            title="Přednastavená portfolia"
            description="Tři doporučené profily reflektující rizikový apetit klienta."
            icon={<BarChart3 className="h-5 w-5" strokeWidth={1.7} />}
          >
            <PresetPortfolios />
          </CollapsibleSection>

          <CollapsibleSection
            title="Vlastní portfolio (Builder)"
            description="Sestavte si individuální alokaci a porovnejte ji s benchmarkem."
            icon={<Settings2 className="h-5 w-5" strokeWidth={1.7} />}
          >
            <CustomPortfolioBuilder />
          </CollapsibleSection>
        </div>

        <footer className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Erste Premier — Demo · Modelace na
          základě hypotetických historických dat. Nejedná se o investiční
          doporučení.
        </footer>
      </main>
    </div>
  );
};

export default Index;
