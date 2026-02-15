"use client";

import { ArrowRight } from "lucide-react";

const examples = [
  {
    before: "/images/example-before-1.jpg",
    after: "/images/example-after-1.jpg",
    label: "Bewerbungsfoto",
  },
  {
    before: "/images/example-before-2.jpg",
    after: "/images/example-after-2.jpg",
    label: "Passfoto",
  },
];

export function BeforeAfter() {
  return (
    <section id="before-after" className="relative px-5 py-20 md:py-28">
      {/* Subtle glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Ergebnisse
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Vorher & Nachher
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Sieh dir an, wie unsere KI aus einem einfachen Selfie ein professionelles Passfoto erstellt.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="flex items-stretch">
                {/* Before */}
                <div className="relative flex-1">
                  <div className="absolute left-3 top-3 z-10 rounded-md bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                    Vorher
                  </div>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={example.before}
                      alt={`Vorher - ${example.label}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center px-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* After */}
                <div className="relative flex-1">
                  <div className="absolute right-3 top-3 z-10 rounded-md bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground backdrop-blur-sm">
                    Nachher
                  </div>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={example.after}
                      alt={`Nachher - ${example.label}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border px-5 py-3.5">
                <p className="text-center text-sm font-semibold text-foreground">
                  {example.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
