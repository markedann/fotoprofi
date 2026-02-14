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
    bg: "bg-pink-50",
    iconColor: "text-pink-500",
    border: "hover:border-pink-300",
  },
  {
    icon: Camera,
    title: "Biometrisch korrekt",
    description:
      "Erfuellt alle deutschen Anforderungen fuer Reisepass, Personalausweis und Fuehrerschein.",
    bg: "bg-sky-50",
    iconColor: "text-sky-500",
    border: "hover:border-sky-300",
  },
  {
    icon: Zap,
    title: "Blitzschnell",
    description:
      "Ergebnis in weniger als 30 Sekunden. Kein Termin beim Fotografen noetig.",
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
    border: "hover:border-amber-300",
  },
  {
    icon: Download,
    title: "Sofort herunterladen",
    description:
      "Laden Sie Ihr fertiges Foto in hoher Aufloesung direkt auf Ihr Geraet herunter.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    border: "hover:border-emerald-300",
  },
  {
    icon: Lock,
    title: "Datenschutz garantiert",
    description:
      "Ihre Fotos werden nicht gespeichert und sofort nach der Verarbeitung geloescht.",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    border: "hover:border-indigo-300",
  },
  {
    icon: ImageIcon,
    title: "Vielseitig einsetzbar",
    description:
      "Perfekt fuer Reisepass, Personalausweis, Fuehrerschein, Visa und Bewerbungsfotos.",
    bg: "bg-rose-50",
    iconColor: "text-rose-500",
    border: "hover:border-rose-300",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="animate-blob absolute left-1/4 top-0 h-64 w-64 bg-pink-100/30 blur-3xl"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-pink-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-pink-500">
            Vorteile
          </div>
          <h2 className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Warum <span className="text-pink-500">FotoProfi</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-gray-500">
            Alles was du fuer das perfekte Dokumentenfoto brauchst &mdash; kostenlos und sofort.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-3xl border-2 border-transparent bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${feature.border}`}
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} transition-transform group-hover:scale-110`}
              >
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
