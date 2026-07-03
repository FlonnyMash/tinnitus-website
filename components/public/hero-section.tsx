import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { getLogoUrl } from "@/lib/brand";
import type { HeroSettings } from "@/lib/types/database";

type HeroSectionProps = {
  hero: HeroSettings;
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden border-b border-zinc-800">
      <div
        className="absolute inset-0"
        style={{ background: "var(--hero-gradient)" }}
      />
      {hero.hero_image_url ? (
        <div className="absolute inset-0">
          <Image
            src={hero.hero_image_url}
            alt={hero.hero_alt || "Tinnitus live"}
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/50" />
        </div>
      ) : null}

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-32 text-center">
        <h1 className="sr-only">Tinnitus</h1>
        <BrandLogo
          src={getLogoUrl(hero.logo_url)}
          variant="hero"
          priority
          className="mb-8"
        />

        <p className="text-sm uppercase tracking-[0.45em] text-red-400">
          Rock &amp; Punk Coverband
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl">
          Wir sind eine junge energiegeladene Rock- und Punk-Rock-Coverband,
          die mit Leidenschaft und Hingabe jede Bühne zum Beben bringt.
        </p>
        <a
          href="#auftritte"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]"
        >
          Jetzt Auftritte entdecken
          <ChevronDown className="size-4" />
        </a>
      </div>
    </section>
  );
}
