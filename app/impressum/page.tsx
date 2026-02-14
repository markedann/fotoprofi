import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum - FotoProfi",
};

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 rounded-full border-2 border-pink-200 bg-white px-5 py-2.5 text-sm font-bold text-pink-600 shadow-sm transition-all hover:border-pink-300 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurueck zur Startseite
        </Link>

        <div className="rounded-3xl border-2 border-pink-100 bg-white p-8 shadow-xl shadow-pink-100/20 md:p-12">
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900">
            Impressum
          </h1>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                Angaben gemaess 5 TMG
              </h2>
              <p>
                FotoProfi<br />
                Musterstrasse 1<br />
                12345 Musterstadt<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-gray-800">Kontakt</h2>
              <p>
                E-Mail: kontakt@fotoprofi.de
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                Verantwortlich fuer den Inhalt nach 55 Abs. 2 RStV
              </h2>
              <p>
                Max Mustermann<br />
                Musterstrasse 1<br />
                12345 Musterstadt
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                Haftungsausschluss
              </h2>
              <h3 className="mb-1 font-semibold text-gray-700">
                Haftung fuer Inhalte
              </h3>
              <p className="mb-3 text-sm">
                Die Inhalte unserer Seiten wurden mit groesster Sorgfalt erstellt.
                Fuer die Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte
                koennen wir jedoch keine Gewaehr uebernehmen. Als Diensteanbieter
                sind wir gemaess 7 Abs.1 TMG fuer eigene Inhalte auf diesen Seiten
                nach den allgemeinen Gesetzen verantwortlich.
              </p>
              <h3 className="mb-1 font-semibold text-gray-700">
                Haftung fuer Links
              </h3>
              <p className="text-sm">
                Unser Angebot enthaelt Links zu externen Webseiten Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb koennen wir fuer
                diese fremden Inhalte auch keine Gewaehr uebernehmen.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-lg font-bold text-gray-800">Urheberrecht</h2>
              <p className="text-sm">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
