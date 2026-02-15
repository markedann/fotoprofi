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
    <section id="how-it-works" className="relative px-5 py-20 md:py-28">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-[400px] w-[300px] -translate-y-1/2 rounded-full bg-accent/[0.03] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            Anleitung
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {"So funktioniert's"}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            In nur drei einfachen Schritten zum perfekten Passfoto.
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[3.5rem] z-0 hidden md:block">
            <div className="mx-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {steps.map((item) => (
            <div key={item.step} className="group relative z-10 text-center">
              <div className="relative mx-auto mb-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20">
                  <item.icon className="h-7 w-7" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {item.step}
                </span>
              </div>
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
