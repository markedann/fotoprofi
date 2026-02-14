"use client";

import { ArrowDown, Camera, Shield, Sparkles, Zap } from "lucide-react";

export function Hero({ onScrollToUpload }: { onScrollToUpload: () => void }) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-24 md:pb-32 md:pt-36">
      {/* Bubblegum blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-32 -top-32 h-[28rem] w-[28rem] bg-pink-200/50 blur-3xl" />
        <div
          className="animate-blob absolute -right-20 top-20 h-[22rem] w-[22rem] bg-sky-200/50 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="animate-blob absolute bottom-0 left-1/3 h-80 w-80 bg-amber-100/40 blur-3xl"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-pink-200 bg-white/80 px-5 py-2.5 text-sm font-bold text-pink-600 shadow-sm backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          100% kostenlos &middot; Keine Registrierung
        </div>

        <h1 className="text-balance text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
          Professionelles{" "}
          <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 bg-clip-text text-transparent">
            Passfoto
          </span>
          <br />
          aus deinem Selfie
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-gray-500 md:text-xl">
          Lade ein Selfie hoch und unsere KI erstellt in Sekunden ein
          biometrisches Passfoto nach deutschen Standards &mdash; fuer
          Reisepass, Personalausweis und Bewerbungen.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onScrollToUpload}
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-10 py-4.5 text-lg font-bold text-white shadow-xl shadow-pink-300/30 transition-all hover:shadow-2xl hover:shadow-pink-400/40 active:scale-[0.97] sm:w-auto"
          >
            <Camera className="h-5 w-5" />
            Jetzt Foto erstellen
            <ArrowDown className="h-5 w-5 transition-transform group-hover:translate-y-1" />
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-gray-400">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-100">
              <Zap className="h-4 w-4 text-pink-500" />
            </div>
            Ergebnis in unter 30 Sek.
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
              <Shield className="h-4 w-4 text-sky-500" />
            </div>
            DSGVO-konform
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100">
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            Keine Daten gespeichert
          </div>
        </div>
      </div>
    </section>
  );
}
