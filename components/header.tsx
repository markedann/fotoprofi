"use client";

import Link from "next/link";
import { Camera } from "lucide-react";

export function Header({ onScrollToUpload }: { onScrollToUpload: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-pink-200/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-300/40">
            <Camera className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-800">
            Foto<span className="text-pink-500">Profi</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-gray-500 md:flex">
          <a href="/#features" className="transition-colors hover:text-pink-500">
            Vorteile
          </a>
          <a href="/#how-it-works" className="transition-colors hover:text-pink-500">
            So funktioniert{"'"}s
          </a>
          <a href="/#faq" className="transition-colors hover:text-pink-500">
            FAQ
          </a>
        </nav>
        <button
          onClick={onScrollToUpload}
          className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-pink-300/40 transition-all hover:shadow-xl hover:shadow-pink-300/50 active:scale-95"
        >
          Foto erstellen
        </button>
      </div>
    </header>
  );
}
