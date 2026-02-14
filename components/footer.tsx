import Link from "next/link";
import { Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-pink-100 bg-white px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-md shadow-pink-200/40">
            <Camera className="h-4 w-4" />
          </div>
          <span className="text-sm font-extrabold text-gray-800">
            Foto<span className="text-pink-500">Profi</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold">
          <Link
            href="/impressum"
            className="text-gray-500 transition-colors hover:text-pink-500"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="text-gray-500 transition-colors hover:text-pink-500"
          >
            Datenschutzerklaerung
          </Link>
          <a
            href="#faq"
            className="text-gray-500 transition-colors hover:text-pink-500"
          >
            FAQ
          </a>
        </nav>

        <div className="text-center text-xs text-gray-400">
          <p>
            Kostenloser Service zur Erstellung professioneller Passfotos mit KI.
          </p>
          <p className="mt-1">
            Keine Speicherung persoenlicher Daten. DSGVO-konform.
          </p>
        </div>
      </div>
    </footer>
  );
}
