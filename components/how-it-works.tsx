import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Selfie hochladen",
    description:
      "Mache ein Selfie oder lade ein vorhandenes Foto hoch. Achte auf gute Beleuchtung und schaue direkt in die Kamera.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "KI verarbeitet",
    description:
      "Unsere KI transformiert dein Foto in ein biometrisches Passfoto: professioneller Hintergrund, Beleuchtung und Kleidung.",
  },
  {
    icon: Download,
    step: "03",
    title: "Herunterladen",
    description:
      "Lade dein fertiges Passfoto in hoher Aufloesung herunter. Bereit fuer Reisepass, Ausweis oder Bewerbung.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-md bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Anleitung
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"So funktioniert's"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
            In nur drei einfachen Schritten zum perfekten Passfoto.
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-12 z-0 hidden md:block">
            <div className="mx-16 h-px border-t-2 border-dashed border-border" />
          </div>

          {steps.map((item) => (
            <div key={item.step} className="relative z-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <item.icon className="h-7 w-7" />
              </div>
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Schritt {item.step}
              </span>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
