import { GigInfo } from "@/components/public/gig-info";
import type { GigWithSetlist } from "@/lib/types/database";

type UpcomingGigsProps = {
  gigs: GigWithSetlist[];
};

export function UpcomingGigs({ gigs }: UpcomingGigsProps) {
  return (
    <section
      id="auftritte"
      className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 md:py-28"
    >
      <div className="mb-12">
        <p className="section-label">Live</p>
        <h2 className="section-title mt-3">Kommende Auftritte</h2>
      </div>

      {gigs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 px-6 py-12 text-center">
          <p className="text-zinc-400">
            Aktuell keine kommenden Termine. Schau bald wieder vorbei!
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {gigs.map((gig) => (
            <article
              key={gig.id}
              className="group w-full max-w-2xl rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/25 hover:shadow-[0_8px_40px_rgba(220,38,38,0.1)]"
            >
              <GigInfo gig={gig} dateFormat="upcoming" />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
