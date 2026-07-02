"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GigWithSetlist } from "@/lib/types/database";

type PastGigsProps = {
  gigs: GigWithSetlist[];
};

export function PastGigs({ gigs }: PastGigsProps) {
  const [activeGig, setActiveGig] = useState<GigWithSetlist | null>(null);

  return (
    <section className="border-t border-zinc-800 bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-red-500">
            Archive
          </p>
          <h2 className="mt-2 text-4xl font-bold text-white">Past Gigs</h2>
        </div>

        {gigs.length === 0 ? (
          <p className="text-zinc-400">Noch keine vergangenen Gigs.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {gigs.map((gig) => (
              <Card key={gig.id} className="border-zinc-800 bg-zinc-900/80">
                <CardHeader>
                  <CardDescription className="text-zinc-400">
                    {format(new Date(`${gig.gig_date}T12:00:00`), "dd.MM.yyyy", {
                      locale: de,
                    })}
                  </CardDescription>
                  <CardTitle className="text-2xl text-white">{gig.venue}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gig.description ? (
                    <p className="text-zinc-300">{gig.description}</p>
                  ) : null}
                  {gig.setlist ? (
                    <Button
                      type="button"
                      className="bg-red-600 hover:bg-red-500"
                      onClick={() => setActiveGig(gig)}
                    >
                      View Setlist
                    </Button>
                  ) : (
                    <p className="text-sm italic text-zinc-500">
                      Setlist noch nicht verfügbar
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(activeGig)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveGig(null);
          }
        }}
      >
        <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
          <DialogHeader>
            <DialogTitle>
              {activeGig?.setlist?.title || "Setlist"} – {activeGig?.venue}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {activeGig
                ? format(new Date(`${activeGig.gig_date}T12:00:00`), "dd.MM.yyyy", {
                    locale: de,
                  })
                : null}
            </DialogDescription>
          </DialogHeader>
          <ol className="list-decimal space-y-2 pl-5 text-zinc-200">
            {activeGig?.setlist?.songs.map((song) => (
              <li key={song}>{song}</li>
            ))}
          </ol>
          {activeGig?.setlist?.notes ? (
            <p className="border-t border-zinc-800 pt-4 text-sm text-zinc-400">
              {activeGig.setlist.notes}
            </p>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
