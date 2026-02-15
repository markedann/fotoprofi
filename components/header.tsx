"use client";

import Link from "next/link";
import { Camera, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Header({ onScrollToUpload }: { onScrollToUpload: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Camera className="h-4.5 w-4.5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Foto<span className="text-primary">Profi</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
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
            className="hidden rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] sm:block"
          >
            Foto erstellen
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/50 bg-background/95 px-5 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {[
              { href: "/#features", label: "Vorteile" },
              { href: "/#how-it-works", label: "So funktioniert's" },
              { href: "/#faq", label: "FAQ" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
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
