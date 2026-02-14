"use client";

import { ArrowDown, Camera, Shield, Sparkles, Zap } from "lucide-react";

export function Hero({ onScrollToUpload }: { onScrollToUpload: () => void }) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-20 md:pb-28 md:pt-32">
      {/* Subtle background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -right-32 top-20 h-[24rem] w-[24rem] rounded-full bg-accent/[0.06] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          100% kostenlos &middot; Keine Registrierung
        </div>

        <h1 className="text-balance font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Professionelles{" "}
          <span className="text-primary">Passfoto</span>
          <br />
          aus deinem Selfie
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Lade ein Selfie hoch und unsere KI erstellt in Sekunden ein
          biometrisches Passfoto nach deutschen Standards &mdash; fuer
          Reisepass, Personalausweis und Bewerbungen.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onScrollToUpload}
            className="group flex w-full items-center justify-center gap-2.5 rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] sm:w-auto"
          >
            <Camera className="h-4.5 w-4.5" />
            Jetzt Foto erstellen
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">Ergebnis in unter 30 Sek.</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <span className="font-medium">DSGVO-konform</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">Keine Daten gespeichert</span>
          </div>
        </div>
      </div>
    </section>
  );
}
