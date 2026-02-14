import Link from "next/link";
import { Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Camera className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-sm font-bold text-foreground">
            Foto<span className="text-primary">Profi</span>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link
            href="/impressum"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Impressum
          </Link>
          <Link
            href="/datenschutz"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Datenschutzerklaerung
          </Link>
          <a
            href="#faq"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
        </nav>

        <div className="text-center text-xs text-muted-foreground">
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
