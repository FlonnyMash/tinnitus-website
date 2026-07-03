import { Disc3, Mic2, Sparkles } from "lucide-react";

const features = [
  {
    icon: Mic2,
    title: "Live Auftritte",
    description:
      "Erlebe unsere packenden Live-Shows in verschiedenen Locations.",
  },
  {
    icon: Disc3,
    title: "Vielfältiges Repertoire",
    description:
      "Von Rock-Klassikern bis Punk-Hits – wir haben für jeden etwas dabei.",
  },
  {
    icon: Sparkles,
    title: "Kreative Neuinterpretationen",
    description:
      "Wir geben jedem Song unseren eigenen einzigartigen Twist.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative border-y border-zinc-800/60 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-24">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-[0_8px_40px_rgba(220,38,38,0.12)]"
            >
              <div className="mb-5 inline-flex rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400 transition-colors group-hover:border-red-500/40 group-hover:bg-red-500/15">
                <feature.icon className="size-6" />
              </div>
              <h3 className="font-display text-2xl tracking-wide text-white">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
