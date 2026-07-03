"use client";



import { useState } from "react";

import { format } from "date-fns";

import { de } from "date-fns/locale";

import { ListMusic } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GigWithSetlist } from "@/lib/types/database";

type GigSetlistButtonProps = {
  gig: GigWithSetlist;
  className?: string;
  wrapperClassName?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
};

export function GigSetlistButton({
  gig,
  className,
  wrapperClassName,
  variant = "outline",
  size = "sm",
}: GigSetlistButtonProps) {
  const [open, setOpen] = useState(false);

  if (!gig.setlist || gig.setlist.entries.length === 0) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={
          className ??
          "border-red-500/50 bg-transparent text-red-500 hover:bg-red-500/10 hover:text-red-400"
        }
        onClick={() => setOpen(true)}
      >

        <ListMusic className="size-4" />

        Setlist anzeigen

      </Button>



      <Dialog

        open={open}

        onOpenChange={(nextOpen) => {

          if (!nextOpen) {

            setOpen(false);

          }

        }}

      >

        <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100 sm:max-w-md">

          <DialogHeader>

            <DialogTitle className="font-display text-2xl tracking-wide text-white">

              {gig.setlist.title || "Setlist"} – {gig.venue}

            </DialogTitle>

            <DialogDescription className="text-zinc-400">

              {format(new Date(`${gig.gig_date}T12:00:00`), "dd. MMMM yyyy", {

                locale: de,

              })}

            </DialogDescription>

          </DialogHeader>

          <ol className="list-decimal space-y-3 pl-5 text-zinc-200">

            {gig.setlist.entries.map((entry, index) => (

              <li key={`${entry.title}-${index}`} className="leading-relaxed">

                <span>{entry.title}</span>

                {entry.interpret ? (

                  <span className="mt-0.5 block text-sm text-zinc-400">

                    {entry.interpret}

                  </span>

                ) : null}

              </li>

            ))}

          </ol>

          {gig.setlist.notes ? (

            <p className="border-t border-zinc-800 pt-4 text-sm italic text-zinc-400">

              {gig.setlist.notes}

            </p>

          ) : null}

        </DialogContent>

      </Dialog>

    </div>

  );

}

