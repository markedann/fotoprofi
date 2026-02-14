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
    <section id="before-after" className="relative px-4 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-md bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Ergebnisse
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Vorher &amp; Nachher
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
            Sieh dir an, wie unsere KI aus einem einfachen Selfie ein professionelles Passfoto erstellt.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
            >
              <div className="flex items-stretch">
                {/* Before */}
                <div className="relative flex-1">
                  <div className="absolute left-3 top-3 z-10 rounded-md bg-foreground/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
                    Vorher
                  </div>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={example.before}
                      alt={`Vorher - ${example.label}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* Arrow divider */}
                <div className="flex items-center justify-center px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* After */}
                <div className="relative flex-1">
                  <div className="absolute right-3 top-3 z-10 rounded-md bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                    Nachher
                  </div>
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={example.after}
                      alt={`Nachher - ${example.label}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border px-5 py-3">
                <p className="text-center text-sm font-medium text-muted-foreground">
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
