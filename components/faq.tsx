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
    <section id="faq" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Haeufig gestellte <span className="text-pink-500">Fragen</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-3xl border-2 bg-white transition-all ${
                openIndex === i
                  ? "border-pink-300 shadow-lg shadow-pink-100/40"
                  : "border-pink-100/60 hover:border-pink-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="pr-4 text-base font-bold text-gray-800">
                  {faq.question}
                </span>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                  openIndex === i ? "bg-pink-500 text-white" : "bg-pink-100 text-pink-500"
                }`}>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
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
                  <p className="px-6 pb-5 text-sm leading-relaxed text-gray-500">
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
