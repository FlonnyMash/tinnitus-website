"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  MapPin,
  Ticket,
} from "lucide-react";
import { GigSetlistButton } from "@/components/public/gig-setlist-button";
import { MapLink } from "@/components/public/map-link";
import { formatGigEntrance } from "@/lib/gig-format";
import type { GigWithSetlist } from "@/lib/types/database";

type GigInfoProps = {
  gig: GigWithSetlist;
  dateFormat?: "upcoming" | "past";
  venueClassName?: string;
};

export function GigInfo({
  gig,
  dateFormat = "upcoming",
  venueClassName,
}: GigInfoProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const entrance = formatGigEntrance(gig);
  const hasEntranceInfo = gig.is_free || Boolean(entrance);

  const formattedDate =
    dateFormat === "upcoming"
      ? format(new Date(`${gig.gig_date}T12:00:00`), "EEEE, dd. MMMM yyyy", {
          locale: de,
        })
      : format(new Date(`${gig.gig_date}T12:00:00`), "dd. MMMM yyyy", {
          locale: de,
        });

  return (
    <div className="ml-0 flex flex-col gap-2">
      <div className="mt-0 flex w-full flex-row flex-wrap items-center justify-start gap-3 pt-0">
        {dateFormat === "upcoming" ? (
          <div className="ml-0 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-red-400">
            <CalendarDays className="size-3.5" />
            {formattedDate}
          </div>
        ) : (
          <span className="ml-0 text-sm font-medium uppercase tracking-wider text-zinc-500">
            {formattedDate}
          </span>
        )}

        {hasEntranceInfo ? (
          gig.is_free ? (
            <span className="ml-0 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-300">
              Eintritt frei
            </span>
          ) : entrance ? (
            <span className="ml-0 inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800/40 px-3 py-1 text-sm font-medium text-zinc-300">
              <Ticket className="size-4 shrink-0 text-red-500/70" />
              {entrance}
            </span>
          ) : null
        ) : null}

        <GigSetlistButton gig={gig} wrapperClassName="ml-0 shrink-0" />
      </div>

      <h3
        className={
          venueClassName ??
          "ml-0 font-display text-3xl tracking-wide text-red-500 sm:text-4xl"
        }
      >
        {gig.venue}
      </h3>

      {gig.location ? (
        <MapLink address={gig.location}>
          <MapPin className="size-4 shrink-0 text-red-500/70 transition-colors group-hover:text-red-400" />
          <span className="min-w-0 leading-snug">{gig.location}</span>
          <ArrowUpRight className="size-3.5 shrink-0 opacity-70 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
        </MapLink>
      ) : null}

      {detailsOpen && gig.description ? (
        <p className="ml-0 whitespace-pre-wrap text-zinc-400">{gig.description}</p>
      ) : null}

      {gig.description ? (
        <div className="ml-0 mt-3">
          <button
            type="button"
            onClick={() => setDetailsOpen((prev) => !prev)}
            aria-expanded={detailsOpen}
            className="inline-flex h-8 w-fit shrink-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-white hover:no-underline"
          >
            Details
            <ChevronDown
              className={`size-4 transition-transform duration-200 ${
                detailsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
