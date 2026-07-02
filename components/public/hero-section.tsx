import Image from "next/image";
import type { HeroSettings } from "@/lib/types/database";

type HeroSectionProps = {
  hero: HeroSettings;
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.25),_transparent_55%)]" />
      {hero.hero_image_url ? (
        <div className="absolute inset-0">
          <Image
            src={hero.hero_image_url}
            alt="Tinnitus live"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
        </div>
      ) : null}
      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
        {hero.logo_url ? (
          <div className="relative mb-8 h-28 w-28 overflow-hidden rounded-full border border-red-500/40 bg-zinc-900 shadow-[0_0_40px_rgba(220,38,38,0.35)]">
            <Image
              src={hero.logo_url}
              alt="Tinnitus logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full border border-red-500/40 bg-zinc-900 text-4xl font-black text-red-500 shadow-[0_0_40px_rgba(220,38,38,0.35)]">
            T
          </div>
        )}
        <p className="text-sm uppercase tracking-[0.45em] text-red-400">
          Rock Band
        </p>
        <h1 className="mt-4 text-5xl font-black uppercase tracking-tight text-white md:text-7xl">
          Tinnitus
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-300">
          Laut. Direkt. Live. Die offizielle Website der Band mit Terminen,
          Setlists und aktuellen Shows.
        </p>
      </div>
    </section>
  );
}
