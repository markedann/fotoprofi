"use client";

import Link from "next/link";
import { Camera, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header({ onScrollToUpload }: { onScrollToUpload: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Camera className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Foto<span className="text-primary">Profi</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="/#features" className="transition-colors hover:text-foreground">
            Vorteile
          </a>
          <a href="/#how-it-works" className="transition-colors hover:text-foreground">
            {"So funktioniert's"}
          </a>
          <a href="/#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToUpload}
            className="hidden rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.97] sm:block"
          >
            Foto erstellen
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-card px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="/#features"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Vorteile
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {"So funktioniert's"}
            </a>
            <a
              href="/#faq"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              FAQ
            </a>
            <button
              onClick={() => {
                setMobileOpen(false);
                onScrollToUpload();
              }}
              className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Foto erstellen
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
