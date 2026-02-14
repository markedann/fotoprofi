"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Ist der Service wirklich kostenlos?",
    answer:
      "Ja, FotoProfi ist komplett kostenlos. Du kannst so viele Fotos erstellen, wie du moechtest.",
  },
  {
    question: "Werden meine Fotos gespeichert?",
    answer:
      "Nein. Deine Fotos werden ausschliesslich zur Verarbeitung verwendet und danach sofort geloescht. Wir speichern keine persoenlichen Daten.",
  },
  {
    question: "Erfuellt das Foto die deutschen Anforderungen?",
    answer:
      "Unsere KI erstellt Fotos im Format 35x45 mm mit biometrischem Standard. Das Ergebnis ist fuer Reisepass, Personalausweis und Fuehrerschein geeignet.",
  },
  {
    question: "Welche Fotos kann ich hochladen?",
    answer:
      "Am besten funktioniert ein frontales Selfie mit guter Beleuchtung. Unterstuetzt werden JPG, PNG und WebP bis maximal 10 MB.",
  },
  {
    question: "Kann ich das Foto fuer Bewerbungen verwenden?",
    answer:
      "Ja! Das generierte Foto eignet sich hervorragend als professionelles Bewerbungsfoto.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            FAQ
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Haeufig gestellte <span className="text-primary">Fragen</span>
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-xl border transition-all ${
                openIndex === i
                  ? "border-primary/30 bg-card shadow-sm"
                  : "border-border bg-card hover:border-primary/20"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="pr-4 text-sm font-semibold text-foreground">
                  {faq.question}
                </span>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                    openIndex === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  openIndex === i
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
