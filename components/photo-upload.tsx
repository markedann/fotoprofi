"use client";

import { forwardRef, useCallback, useRef, useState } from "react";
import {
  Upload,
  X,
  Loader2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Camera,
} from "lucide-react";

type Status = "idle" | "preview" | "loading" | "done" | "error";

export const PhotoUpload = forwardRef<HTMLDivElement>(function PhotoUpload(
  _,
  ref
) {
  const [status, setStatus] = useState<Status>("idle");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<File | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Bitte lade eine Bilddatei hoch.");
      setStatus("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Das Bild darf maximal 10 MB gross sein.");
      setStatus("error");
      return;
    }
    fileRef.current = file;
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setResultUrl(null);
    setError(null);
    setStatus("preview");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const compressImage = (file: File, maxSize = 2048): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/jpeg",
          0.92
        );
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!fileRef.current) return;
    setStatus("loading");
    setError(null);

    try {
      const compressed = await compressImage(fileRef.current);
      const formData = new FormData();
      formData.append("image", compressed, "photo.jpg");

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Fehler bei der Verarbeitung.");
      }

      if (!data.image) {
        throw new Error("Kein Bild erhalten. Bitte versuchen Sie es erneut.");
      }

      setResultUrl(data.image);
      setStatus("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten."
      );
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    fileRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "passfoto.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement("a");
      a.href = resultUrl;
      a.download = "passfoto.png";
      a.target = "_blank";
      a.click();
    }
  };

  return (
    <section id="upload" className="relative px-4 py-20 md:py-28" ref={ref}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-blob absolute -left-20 bottom-0 h-72 w-72 bg-pink-100/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Foto <span className="text-pink-500">hochladen</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Lade dein Selfie hoch und erhalte ein professionelles Passfoto.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border-2 border-pink-200/60 bg-white shadow-2xl shadow-pink-100/40">
          {/* Idle / Drop Zone */}
          {status === "idle" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center px-8 py-24 transition-all ${
                dragActive
                  ? "bg-pink-50"
                  : "hover:bg-pink-50/50"
              }`}
            >
              <div className="animate-float mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-400 to-rose-400 text-white shadow-xl shadow-pink-200/50">
                <Camera className="h-9 w-9" />
              </div>
              <p className="mb-2 text-lg font-bold text-gray-800">
                Foto hierher ziehen oder klicken
              </p>
              <p className="text-sm text-gray-400">
                JPG, PNG oder WebP - max. 10 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          )}

          {/* Preview */}
          {status === "preview" && originalUrl && (
            <div className="p-8">
              <div className="relative mx-auto mb-8 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl bg-pink-50 ring-4 ring-pink-100">
                <img
                  src={originalUrl}
                  alt="Hochgeladenes Foto"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={handleReset}
                  className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900"
                  aria-label="Entfernen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleGenerate}
                className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-pink-300/30 transition-all hover:shadow-2xl hover:shadow-pink-400/40 active:scale-[0.98]"
              >
                Passfoto generieren
              </button>
            </div>
          )}

          {/* Loading */}
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center px-8 py-24">
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-ping rounded-full bg-pink-200/50" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-white">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              </div>
              <p className="mb-2 text-lg font-bold text-gray-800">
                Dein Foto wird verarbeitet...
              </p>
              <p className="text-sm text-gray-400">
                Dies kann bis zu 60 Sekunden dauern.
              </p>
            </div>
          )}

          {/* Done */}
          {status === "done" && resultUrl && (
            <div className="p-8">
              <div className="mb-5 flex items-center justify-center gap-2 text-base font-bold text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
                Dein Passfoto ist fertig!
              </div>

              <div className="mb-8 grid grid-cols-2 gap-6">
                {originalUrl && (
                  <div>
                    <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                      Vorher
                    </p>
                    <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-pink-50 ring-2 ring-pink-100">
                      <img
                        src={originalUrl}
                        alt="Originalbild"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                    Nachher
                  </p>
                  <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-emerald-50 ring-2 ring-emerald-200">
                    <img
                      src={resultUrl}
                      alt="Generiertes Passfoto"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-pink-300/30 transition-all hover:shadow-2xl active:scale-[0.98]"
                >
                  <Download className="h-5 w-5" />
                  Herunterladen
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-pink-200 px-6 py-3.5 text-base font-bold text-gray-700 transition-all hover:border-pink-300 hover:bg-pink-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Neu
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center px-8 py-20">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <p className="mb-2 text-lg font-bold text-gray-800">
                Fehler aufgetreten
              </p>
              <p className="mb-8 max-w-sm text-center text-sm text-gray-500">
                {error}
              </p>
              <button
                onClick={handleReset}
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-10 py-3.5 text-base font-bold text-white shadow-lg shadow-pink-300/30 transition-all hover:shadow-xl active:scale-[0.98]"
              >
                Erneut versuchen
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});
