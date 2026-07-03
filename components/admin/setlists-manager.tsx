"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSetlist, upsertSetlist } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { GigWithSetlist, SetlistEntry } from "@/lib/types/database";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Plus, Trash2 } from "lucide-react";

const DEFAULT_SETLIST_TITLE = "Setlist";

type SetlistsManagerProps = {
  gigs: GigWithSetlist[];
};

function createEmptyEntry(): SetlistEntry {
  return { title: "", interpret: null };
}

function formatEntryPreview(entry: SetlistEntry) {
  if (entry.interpret) {
    return `${entry.title} – ${entry.interpret}`;
  }

  return entry.title;
}

function getEntriesForGig(gig: GigWithSetlist | undefined): SetlistEntry[] {
  if (gig?.setlist?.entries.length) {
    return gig.setlist.entries;
  }

  return [createEmptyEntry()];
}

function formatGigLabel(gig: GigWithSetlist) {
  const dateLabel = format(new Date(`${gig.gig_date}T12:00:00`), "dd.MM.yyyy", {
    locale: de,
  });

  return `${dateLabel} – ${gig.venue}${gig.setlist ? " (has setlist)" : ""}`;
}

export function SetlistsManager({ gigs }: SetlistsManagerProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedGigId, setSelectedGigId] = useState(
    gigs.find((gig) => !gig.setlist)?.id ?? gigs[0]?.id ?? "",
  );
  const [title, setTitle] = useState(DEFAULT_SETLIST_TITLE);
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<SetlistEntry[]>([createEmptyEntry()]);
  const [message, setMessage] = useState<string | null>(null);

  const selectedGig = gigs.find((gig) => gig.id === selectedGigId);

  useEffect(() => {
    setTitle(selectedGig?.setlist?.title ?? DEFAULT_SETLIST_TITLE);
    setNotes(selectedGig?.setlist?.notes ?? "");
    setEntries(getEntriesForGig(selectedGig));
  }, [selectedGigId, selectedGig?.setlist?.id, selectedGig?.setlist?.updated_at]);

  function selectGigForEditing(gigId: string, scrollToForm = false) {
    setSelectedGigId(gigId);
    setMessage(null);

    if (scrollToForm) {
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function updateEntry(index: number, field: keyof SetlistEntry, value: string) {
    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index
          ? {
              ...entry,
              [field]: field === "interpret" ? value.trim() || null : value,
            }
          : entry,
      ),
    );
  }

  function addEntry() {
    setEntries((current) => [...current, createEmptyEntry()]);
  }

  function removeEntry(index: number) {
    setEntries((current) => {
      if (current.length === 1) {
        return [createEmptyEntry()];
      }

      return current.filter((_, entryIndex) => entryIndex !== index);
    });
  }

  async function handleSubmit(formData: FormData) {
    const serializedEntries = entries
      .map((entry) => ({
        title: entry.title.trim(),
        interpret: entry.interpret?.trim() || null,
      }))
      .filter((entry) => entry.title);

    formData.set("title", title.trim() || DEFAULT_SETLIST_TITLE);
    formData.set("notes", notes.trim());
    formData.set("entries", JSON.stringify(serializedEntries));

    startTransition(async () => {
      const result = await upsertSetlist(formData);
      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage("Setlist saved.");
      router.refresh();
    });
  }

  async function handleDelete(id: string, gigId: string) {
    if (!confirm("Delete this setlist?")) {
      return;
    }

    const formData = new FormData();
    formData.set("id", id);

    startTransition(async () => {
      const result = await deleteSetlist(formData);
      if (result.error) {
        setMessage(result.error);
        return;
      }

      if (selectedGigId === gigId) {
        setTitle(DEFAULT_SETLIST_TITLE);
        setNotes("");
        setEntries([createEmptyEntry()]);
      }

      setMessage("Setlist deleted.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Setlists</h2>
        <p className="mt-2 text-zinc-400">
          Link one setlist to each gig. Each song needs a title and optional interpret.
        </p>
      </div>

      <div ref={formRef} className="scroll-mt-24">
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>
            {selectedGig?.setlist ? "Edit Setlist" : "Add Setlist"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {selectedGig
              ? `Editing setlist for ${format(new Date(`${selectedGig.gig_date}T12:00:00`), "dd.MM.yyyy", { locale: de })} – ${selectedGig.venue}`
              : "Choose a gig and add or update its setlist."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gigs.length === 0 ? (
            <p className="text-zinc-400">Create a gig first.</p>
          ) : (
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Gig</Label>
                <Select
                  value={selectedGigId}
                  onValueChange={(value) => selectGigForEditing(value ?? "")}
                >
                  <SelectTrigger className="w-full border-zinc-700 bg-zinc-950">
                    <SelectValue placeholder="Select a gig">
                      {(value) => {
                        const gig = gigs.find((item) => item.id === value);
                        return gig ? formatGigLabel(gig) : null;
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {gigs.map((gig) => (
                      <SelectItem
                        key={gig.id}
                        value={gig.id}
                        label={formatGigLabel(gig)}
                      >
                        {formatGigLabel(gig)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="gig_id" value={selectedGigId} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={DEFAULT_SETLIST_TITLE}
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Songs</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addEntry}
                    className="border-zinc-700 bg-zinc-950"
                  >
                    <Plus className="size-4" />
                    Add song
                  </Button>
                </div>
                <div className="space-y-2">
                  {entries.map((entry, index) => (
                    <div
                      key={`entry-${index}`}
                      className="grid gap-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 md:grid-cols-[2rem_1fr_1fr_auto]"
                    >
                      <span className="pt-2 text-sm font-medium text-zinc-500">
                        {index + 1}.
                      </span>
                      <div className="space-y-1">
                        <Label htmlFor={`entry-title-${index}`} className="text-xs text-zinc-500">
                          Title
                        </Label>
                        <Input
                          id={`entry-title-${index}`}
                          value={entry.title}
                          onChange={(event) =>
                            updateEntry(index, "title", event.target.value)
                          }
                          placeholder="Song title"
                          className="border-zinc-700 bg-zinc-950"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`entry-interpret-${index}`}
                          className="text-xs text-zinc-500"
                        >
                          Interpret
                        </Label>
                        <Input
                          id={`entry-interpret-${index}`}
                          value={entry.interpret ?? ""}
                          onChange={(event) =>
                            updateEntry(index, "interpret", event.target.value)
                          }
                          placeholder="Original artist"
                          className="border-zinc-700 bg-zinc-950"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          onClick={() => removeEntry(index)}
                          className="border-zinc-700 bg-zinc-950"
                          aria-label={`Remove song ${index + 1}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional notes for this setlist"
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending || !selectedGigId}
                className="bg-red-600 hover:bg-red-500"
              >
                {selectedGig?.setlist ? "Update Setlist" : "Save Setlist"}
              </Button>
            </form>
          )}
          {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
        </CardContent>
      </Card>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>All Gigs</CardTitle>
          <CardDescription className="text-zinc-400">
            Click a row or use Edit to load a gig into the form above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Gig</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Songs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gigs.map((gig) => (
                <TableRow
                  key={gig.id}
                  className={cn(
                    "cursor-pointer border-zinc-800",
                    selectedGigId === gig.id && "bg-red-500/10 hover:bg-red-500/10",
                  )}
                  onClick={() => selectGigForEditing(gig.id, true)}
                >
                  <TableCell>
                    {format(new Date(`${gig.gig_date}T12:00:00`), "dd.MM.yyyy", {
                      locale: de,
                    })}{" "}
                    – {gig.venue}
                  </TableCell>
                  <TableCell>{gig.setlist?.title || "—"}</TableCell>
                  <TableCell className="max-w-md text-zinc-400">
                    {gig.setlist?.entries.length ? (
                      <span className="line-clamp-2">
                        {gig.setlist.entries.map(formatEntryPreview).join(" · ")}
                      </span>
                    ) : (
                      "No setlist yet"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => selectGigForEditing(gig.id, true)}
                      >
                        Edit
                      </Button>
                      {gig.setlist ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={isPending}
                          onClick={() => handleDelete(gig.setlist!.id, gig.id)}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
