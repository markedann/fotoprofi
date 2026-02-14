import { Upload, Cpu, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Selfie hochladen",
    description:
      "Mache ein Selfie oder lade ein vorhandenes Foto hoch. Achte auf gute Beleuchtung und schaue direkt in die Kamera.",
    bg: "bg-pink-500",
  },
  {
    icon: Cpu,
    step: "2",
    title: "KI verarbeitet",
    description:
      "Unsere KI transformiert dein Foto in ein biometrisches Passfoto: professioneller Hintergrund, Beleuchtung und Kleidung.",
    bg: "bg-sky-500",
  },
  {
    icon: Download,
    step: "3",
    title: "Herunterladen",
    description:
      "Lade dein fertiges Passfoto in hoher Aufloesung herunter. Bereit fuer Reisepass, Ausweis oder Bewerbung.",
    bg: "bg-emerald-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="animate-blob absolute right-0 top-1/4 h-64 w-64 bg-sky-100/40 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-pink-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-pink-500">
            Anleitung
          </div>
          <h2 className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            So funktioniert{"'"}s
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-gray-500">
            In nur drei einfachen Schritten zum perfekten Passfoto.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <div key={item.step} className="relative text-center">
              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute right-0 top-10 z-10 hidden translate-x-1/2 md:block">
                  <ArrowRight className="h-6 w-6 text-pink-300" />
                </div>
              )}

              <div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${item.bg} text-white shadow-lg`}
              >
                <item.icon className="h-8 w-8" />
              </div>
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-sm font-bold text-white shadow-lg shadow-pink-200/50">
                {item.step}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                {item.title}
              </h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
