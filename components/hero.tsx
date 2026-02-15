"use client";

import { ArrowDown, Shield, Sparkles, Zap } from "lucide-react";

export function Hero({ onScrollToUpload }: { onScrollToUpload: () => void }) {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-32 md:pb-36 md:pt-44">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] translate-x-1/4 rounded-full bg-accent/[0.04] blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(210 20% 96%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 20% 96%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20">
            <Sparkles className="h-3 w-3 text-accent" />
          </span>
          <span className="font-medium">100% kostenlos</span>
          <span className="text-border">|</span>
          <span className="font-medium">Keine Registrierung</span>
        </div>

        <h1 className="text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Dein professionelles
          <br />
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Passfoto
          </span>{" "}
          in Sekunden
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Lade ein Selfie hoch und unsere KI erstellt ein biometrisches Passfoto
          nach deutschen Standards -- fuer Reisepass, Ausweis und Bewerbungen.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onScrollToUpload}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2.5">
              Jetzt Foto erstellen
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </span>
          </button>
        </div>

        {/* Stats row */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6">
          {[
            { icon: Zap, value: "< 30s", label: "Ergebnis" },
            { icon: Shield, value: "DSGVO", label: "Konform" },
            { icon: Sparkles, value: "100%", label: "Kostenlos" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <stat.icon className="h-4.5 w-4.5" />
              </div>
              <span className="font-display text-lg font-bold text-foreground md:text-xl">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
