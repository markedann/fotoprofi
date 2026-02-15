"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  X,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Camera,
  Sparkles,
  User,
  Shirt,
  ImageIcon,
  FileCheck,
  Briefcase,
} from "lucide-react";

type Status = "idle" | "preview" | "loading" | "done" | "error";
type PhotoType = "biometric" | "lebenslauf";

const photoTypeOptions: {
  value: PhotoType;
  label: string;
  description: string;
  icon: typeof Camera;
}[] = [
  {
    value: "biometric",
    label: "Biometrisches Passfoto",
    description: "Fuer Reisepass, Personalausweis, Fuehrerschein. Bart wird automatisch entfernt.",
    icon: FileCheck,
  },
  {
    value: "lebenslauf",
    label: "Bewerbungsfoto",
    description: "Fuer Lebenslauf & Bewerbungen. Natuerliches, professionelles Erscheinungsbild.",
    icon: Briefcase,
  },
];

const biometricSteps = [
  { icon: User, label: "Gesicht wird erkannt...", duration: 12 },
  { icon: ImageIcon, label: "Hintergrund wird entfernt...", duration: 18 },
  { icon: Sparkles, label: "Gesichtsbehaarung wird entfernt...", duration: 18 },
  { icon: Shirt, label: "Professionelle Kleidung wird hinzugefuegt...", duration: 20 },
  { icon: Camera, label: "Beleuchtung wird optimiert...", duration: 15 },
  { icon: FileCheck, label: "Biometrisches Format wird angepasst...", duration: 15 },
  { icon: CheckCircle2, label: "Qualitaetskontrolle...", duration: 22 },
];

const lebenslaufSteps = [
  { icon: User, label: "Gesicht wird erkannt...", duration: 14 },
  { icon: ImageIcon, label: "Hintergrund wird angepasst...", duration: 18 },
  { icon: Shirt, label: "Professionelle Kleidung wird hinzugefuegt...", duration: 22 },
  { icon: Sparkles, label: "Beleuchtung wird optimiert...", duration: 18 },
  { icon: Camera, label: "Professionelles Framing wird angepasst...", duration: 18 },
  { icon: CheckCircle2, label: "Qualitaetskontrolle...", duration: 30 },
];

const waitingMessages = [
  "Qualitaetskontrolle...",
  "Fast fertig, noch einen Moment...",
  "Feinschliff wird angewendet...",
  "Dein Foto wird finalisiert...",
  "Letzte Optimierungen...",
];

function GenerationTimer({ steps }: { steps: typeof biometricSteps }) {
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [waitMsgIndex, setWaitMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < steps.length; i++) {
      accumulated += steps[i].duration;
      if (elapsed < accumulated) {
        setCurrentStep(i);
        return;
      }
    }
    setCurrentStep(steps.length - 1);
  }, [elapsed, steps]);

  // Cycle through waiting messages when on the last step
  const isLastStep = currentStep === steps.length - 1;
  useEffect(() => {
    if (!isLastStep) return;
    const interval = setInterval(() => {
      setWaitMsgIndex((prev) => (prev + 1) % waitingMessages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isLastStep]);

  const totalDuration = steps.reduce((s, step) => s + step.duration, 0);
  // Asymptotic progress: moves quickly at first, then slows down and never fully stops.
  // If API takes longer than estimated totalDuration, progress keeps creeping toward 99%.
  const rawPercent = (elapsed / totalDuration) * 100;
  const progressPercent = rawPercent <= 90
    ? rawPercent
    : 90 + (10 * (1 - Math.exp(-(rawPercent - 90) / 30)));

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center px-6 py-16 md:px-8 md:py-20">
      {/* Animated circle */}
      <div className="relative mb-8">
        <svg className="h-28 w-28" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
            transform="rotate(-90 60 60)"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <StepIcon className="h-6 w-6 text-primary" />
          <span className="mt-1 text-xs font-semibold text-muted-foreground">
            {Math.round(progressPercent)}%
          </span>
        </div>
      </div>

      {/* Current step label */}
      <p className="mb-2 text-center text-base font-semibold text-foreground animate-fade-in-up" key={isLastStep ? waitMsgIndex : currentStep}>
        {isLastStep ? waitingMessages[waitMsgIndex] : steps[currentStep].label}
      </p>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        {Math.round(elapsed)} Sek. vergangen
      </p>

      {/* Steps list */}
      <div className="w-full max-w-xs space-y-2">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                isActive
                  ? "bg-primary/10 text-foreground font-medium"
                  : isCompleted
                  ? "text-muted-foreground/60"
                  : "text-muted-foreground/40"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? "bg-accent text-accent-foreground"
                    : isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <span className="text-[10px] font-bold">{i + 1}</span>
                )}
              </div>
              <span className={isCompleted ? "line-through" : ""}>
                {step.label.replace("...", "")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const PhotoUpload = forwardRef<HTMLDivElement>(function PhotoUpload(
  _,
  ref
) {
  const [status, setStatus] = useState<Status>("idle");
  const [photoType, setPhotoType] = useState<PhotoType>("biometric");
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
      formData.append("photoType", photoType);

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
    // photoType is preserved on reset
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    const filename = photoType === "biometric" ? "passfoto-biometrisch.png" : "bewerbungsfoto.png";
    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      const a = document.createElement("a");
      a.href = resultUrl;
      a.download = filename;
      a.target = "_blank";
      a.click();
    }
  };

  return (
    <section id="upload" className="relative px-4 py-16 md:py-24" ref={ref}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <span className="mb-3 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Upload
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Foto <span className="text-primary">hochladen</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Lade dein Selfie hoch und erhalte ein professionelles Passfoto.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {/* Idle / Drop Zone */}
          {status === "idle" && (
            <div className="flex flex-col">
              {/* Photo Type Selector */}
              <div className="border-b border-border px-6 py-5 md:px-8 md:py-6">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Welches Foto brauchst du?
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {photoTypeOptions.map((option) => {
                    const isSelected = photoType === option.value;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPhotoType(option.value)}
                        className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card hover:border-muted-foreground/30 hover:bg-secondary/50"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold leading-tight ${
                              isSelected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {option.label}
                          </p>
                          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                        <div
                          className={`ml-auto mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/30 bg-card"
                          }`}
                        >
                          {isSelected && (
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {photoType === "biometric" && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent/10 px-3 py-2.5">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    <p className="text-xs leading-relaxed text-accent">
                      <span className="font-semibold">Hinweis:</span> Bei biometrischen Fotos wird Gesichtsbehaarung (Bart) automatisch entfernt, um den offiziellen Anforderungen zu entsprechen.
                    </p>
                  </div>
                )}
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center px-8 py-16 transition-all ${
                  dragActive
                    ? "bg-primary/5"
                    : "hover:bg-secondary/50"
                }`}
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-7 w-7" />
                </div>
                <p className="mb-1.5 text-base font-semibold text-foreground">
                  Foto hierher ziehen oder klicken
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG oder WebP &mdash; max. 10 MB
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
            </div>
          )}

          {/* Preview */}
          {status === "preview" && originalUrl && (
            <div className="p-6 md:p-8">
              {/* Selected type badge */}
              <div className="mb-4 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {photoType === "biometric" ? (
                    <><FileCheck className="h-3 w-3" /> Biometrisches Passfoto</>
                  ) : (
                    <><Briefcase className="h-3 w-3" /> Bewerbungsfoto</>
                  )}
                </span>
              </div>
              <div className="relative mx-auto mb-6 aspect-[3/4] w-full max-w-xs overflow-hidden rounded-xl border border-border bg-secondary">
                <img
                  src={originalUrl}
                  alt="Hochgeladenes Foto"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={handleReset}
                  className="absolute right-2.5 top-2.5 rounded-lg bg-card/80 p-1.5 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
                  aria-label="Entfernen"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleGenerate}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
              >
                <Sparkles className="h-4.5 w-4.5" />
                {photoType === "biometric" ? "Passfoto generieren" : "Bewerbungsfoto generieren"}
              </button>
            </div>
          )}

          {/* Loading - Interactive Timer */}
          {status === "loading" && (
            <GenerationTimer steps={photoType === "biometric" ? biometricSteps : lebenslaufSteps} />
          )}

          {/* Done */}
          {status === "done" && resultUrl && (
            <div className="p-6 md:p-8">
              <div className="mb-2 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {photoType === "biometric" ? (
                    <><FileCheck className="h-3 w-3" /> Biometrisches Passfoto</>
                  ) : (
                    <><Briefcase className="h-3 w-3" /> Bewerbungsfoto</>
                  )}
                </span>
              </div>
              <div className="mb-5 flex items-center justify-center gap-2 text-sm font-semibold text-accent">
                <CheckCircle2 className="h-4.5 w-4.5" />
                {photoType === "biometric" ? "Dein Passfoto ist fertig!" : "Dein Bewerbungsfoto ist fertig!"}
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                {originalUrl && (
                  <div>
                    <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Vorher
                    </p>
                    <div className="aspect-[3/4] overflow-hidden rounded-xl border border-border bg-secondary">
                      <img
                        src={originalUrl}
                        alt="Originalbild"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Nachher
                  </p>
                  <div className="aspect-[3/4] overflow-hidden rounded-xl border border-accent/30 bg-accent/5">
                    <img
                      src={resultUrl}
                      alt="Generiertes Passfoto"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  Herunterladen
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Neu
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center px-6 py-16 md:px-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="h-7 w-7" />
              </div>
              <p className="mb-1.5 text-base font-semibold text-foreground">
                Fehler aufgetreten
              </p>
              <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
                {error}
              </p>
              <button
                onClick={handleReset}
                className="rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
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
