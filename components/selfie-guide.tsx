"use client";

import {
  Sun,
  Eye,
  Shirt,
  Smartphone,
  Check,
  X,
} from "lucide-react";

const tips = [
  {
    icon: Sun,
    title: "Gute Beleuchtung",
    description: "Nutze natuerliches Tageslicht oder gleichmaessige Beleuchtung. Vermeide starke Schatten im Gesicht.",
  },
  {
    icon: Eye,
    title: "Direkt in die Kamera",
    description: "Schaue frontal in die Kamera. Kopf gerade halten, nicht neigen oder drehen.",
  },
  {
    icon: Shirt,
    title: "Kleidung egal",
    description: "Die KI ersetzt dein Outfit durch professionelle Kleidung. Trage, was du moechtest.",
  },
  {
    icon: Smartphone,
    title: "Hochformat bevorzugt",
    description: "Ein Portrait-Foto funktioniert am besten. Halte dein Handy senkrecht.",
  },
];

const doList = [
  "Neutraler Gesichtsausdruck",
  "Augen vollstaendig geoeffnet",
  "Gesicht gleichmaessig beleuchtet",
  "Frontal in die Kamera schauen",
];

const dontList = [
  "Sonnenbrille oder getoenste Glaeser",
  "Stark verdecktes Gesicht (Muetze, Tuch)",
  "Starke Filter oder Beauty-Modi",
  "Unscharfe oder pixelige Fotos",
];

export function SelfieGuide() {
  return (
    <section id="selfie-guide" className="relative px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Vorbereitung
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            So machst du das perfekte Selfie
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
            Befolge diese einfachen Tipps, damit unsere KI das bestmoegliche Passfoto fuer dich erstellen kann.
          </p>
        </div>

        {/* Tips grid */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <tip.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">
                {tip.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Do / Don't */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-accent">
              <Check className="h-4 w-4" />
              Richtig
            </h3>
            <ul className="space-y-2.5">
              {doList.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-destructive">
              <X className="h-4 w-4" />
              Vermeiden
            </h3>
            <ul className="space-y-2.5">
              {dontList.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <div className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-destructive/15">
                    <X className="h-3 w-3 text-destructive" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
