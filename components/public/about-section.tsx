import Image from "next/image";
import type { BandPhoto } from "@/lib/types/database";

type AboutSectionProps = {
  bandPhoto?: BandPhoto;
};

export function AboutSection({ bandPhoto }: AboutSectionProps) {
  const alt = bandPhoto?.alt || "Tinnitus Band";

  return (
    <section
      id="ueber-uns"
      className="scroll-mt-20 bg-zinc-900/30 py-20 md:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <div>
          <p className="section-label">Über Tinnitus</p>
          <h2 className="section-title mt-3">
            Die Band, die Rock neu interpretiert
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">
            Wir sind eine junge energiegeladene Rock- und Punk-Rock-Coverband,
            die mit Leidenschaft und Hingabe jede Bühne zum Beben bringt.
          </p>
          <p className="mt-4 leading-relaxed text-zinc-400">
            Mit talentierten jungen Musikern bringen wir die Klassiker zurück und
            verleihen ihnen frischen Wind, um das Publikum in Bewegung zu
            halten.
          </p>
        </div>

        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            {bandPhoto?.url ? (
              <Image
                src={bandPhoto.url}
                alt={alt}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-red-950/30">
                <div className="text-center">
                  <p className="font-display text-6xl tracking-wider text-red-500/40">
                    TINNITUS
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.3em] text-zinc-600">
                    Rock Coverband
                  </p>
                </div>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent" />
          </div>
          {bandPhoto?.caption ? (
            <p className="mt-3 text-sm text-zinc-400">{bandPhoto.caption}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
