import { GigInfo } from "@/components/public/gig-info";
import type { GigWithSetlist } from "@/lib/types/database";

type PastGigsProps = {
  gigs: GigWithSetlist[];
};

export function PastGigs({ gigs }: PastGigsProps) {
  return (
    <section className="border-t border-zinc-800/60 bg-zinc-900/20">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-12">
          <p className="section-label">Archiv</p>
          <h2 className="section-title mt-3">Vergangene Auftritte</h2>
        </div>

        {gigs.length === 0 ? (
          <p className="text-zinc-400">Noch keine vergangenen Gigs.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {gigs.map((gig) => (
              <article
                key={gig.id}
                className="w-full max-w-2xl rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-5 backdrop-blur-sm transition-all hover:border-zinc-700"
              >
                <GigInfo gig={gig} dateFormat="past" />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
