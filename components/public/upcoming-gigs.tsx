import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Gig } from "@/lib/types/database";

type UpcomingGigsProps = {
  gigs: Gig[];
};

export function UpcomingGigs({ gigs }: UpcomingGigsProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-red-500">
          Live
        </p>
        <h2 className="mt-2 text-4xl font-bold text-white">Upcoming Gigs</h2>
      </div>

      {gigs.length === 0 ? (
        <p className="text-zinc-400">Aktuell keine kommenden Termine.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {gigs.map((gig) => (
            <Card
              key={gig.id}
              className="border-zinc-800 bg-zinc-900/80 backdrop-blur"
            >
              <CardHeader>
                <CardDescription className="text-red-400">
                  {format(new Date(`${gig.gig_date}T12:00:00`), "EEEE, dd. MMMM yyyy", {
                    locale: de,
                  })}
                </CardDescription>
                <CardTitle className="text-2xl text-white">{gig.venue}</CardTitle>
              </CardHeader>
              {gig.description ? (
                <CardContent>
                  <p className="text-zinc-300">{gig.description}</p>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
