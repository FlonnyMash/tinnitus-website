"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { ListMusic, Mic2 } from "lucide-react";
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
        <DialogContent className="dark flex max-h-[85vh] flex-col overflow-hidden border-zinc-800 bg-zinc-900 p-0 text-zinc-100 sm:max-w-md">
          <DialogHeader className="shrink-0 border-b border-border/10 px-6 pt-6 pb-4">
            <DialogTitle className="font-display text-xl tracking-widest text-white uppercase">
              {(gig.setlist.title || "Setlist").toUpperCase()} –{" "}
              {gig.venue.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              {format(new Date(`${gig.gig_date}T12:00:00`), "dd. MMMM yyyy", {
                locale: de,
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="scrollbar-subtle min-h-0 flex-1 overflow-y-auto px-6 pb-6">
            <div
              role="list"
              aria-label="Setlist"
              className="flex flex-col divide-y divide-border/10 pr-4"
            >
              {gig.setlist.entries.map((entry, index) => (
                <div
                  role="listitem"
                  key={`${entry.title}-${index}`}
                  className="flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted/50"
                >
                  <span className="w-6 shrink-0 text-right font-mono text-base font-bold text-red-500">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-col">
                    <span className="text-base leading-tight font-semibold text-foreground">
                      {entry.title}
                    </span>
                    {entry.interpret ? (
                      <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mic2
                          className="size-3 shrink-0 opacity-70"
                          aria-hidden
                        />
                        {entry.interpret}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {gig.setlist.notes ? (
              <p className="mt-4 border-t border-border/10 pt-4 text-sm text-muted-foreground italic">
                {gig.setlist.notes}
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
