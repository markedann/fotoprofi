import {
  Camera,
  Download,
  Image as ImageIcon,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "KI-Optimierung",
    description:
      "Professionelle Beleuchtung, Hintergrund und Koerperposition werden automatisch angepasst.",
  },
  {
    icon: Camera,
    title: "Biometrisch korrekt",
    description:
      "Erfuellt alle deutschen Anforderungen fuer Reisepass, Personalausweis und Fuehrerschein.",
  },
  {
    icon: Zap,
    title: "Blitzschnell",
    description:
      "Ergebnis in weniger als 30 Sekunden. Kein Termin beim Fotografen noetig.",
  },
  {
    icon: Download,
    title: "Sofort herunterladen",
    description:
      "Laden Sie Ihr fertiges Foto in hoher Aufloesung direkt auf Ihr Geraet herunter.",
  },
  {
    icon: Lock,
    title: "Datenschutz garantiert",
    description:
      "Ihre Fotos werden nicht gespeichert und sofort nach der Verarbeitung geloescht.",
  },
  {
    icon: ImageIcon,
    title: "Vielseitig einsetzbar",
    description:
      "Perfekt fuer Reisepass, Personalausweis, Fuehrerschein, Visa und Bewerbungsfotos.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-accent/[0.04] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Vorteile
          </span>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Warum <span className="text-primary">FotoProfi</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
            Alles was du fuer das perfekte Dokumentenfoto brauchst &mdash; kostenlos und sofort.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/20 hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
