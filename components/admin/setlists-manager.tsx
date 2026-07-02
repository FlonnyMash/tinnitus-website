"use client";

import { useState, useTransition } from "react";
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
import type { GigWithSetlist } from "@/lib/types/database";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type SetlistsManagerProps = {
  gigs: GigWithSetlist[];
};

export function SetlistsManager({ gigs }: SetlistsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedGigId, setSelectedGigId] = useState(
    gigs.find((gig) => !gig.setlist)?.id ?? gigs[0]?.id ?? "",
  );
  const [message, setMessage] = useState<string | null>(null);

  const selectedGig = gigs.find((gig) => gig.id === selectedGigId);

  async function handleSubmit(formData: FormData) {
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

  async function handleDelete(id: string) {
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

      setMessage("Setlist deleted.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Setlists</h2>
        <p className="mt-2 text-zinc-400">
          Link one setlist to each gig. Songs should be entered one per line.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Manage Setlist</CardTitle>
          <CardDescription className="text-zinc-400">
            Choose a gig and add or update its setlist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gigs.length === 0 ? (
            <p className="text-zinc-400">Create a gig first.</p>
          ) : (
            <form key={selectedGigId} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Gig</Label>
                <Select
                  value={selectedGigId}
                  onValueChange={(value) => setSelectedGigId(value ?? "")}
                >
                  <SelectTrigger className="border-zinc-700 bg-zinc-950">
                    <SelectValue placeholder="Select a gig" />
                  </SelectTrigger>
                  <SelectContent>
                    {gigs.map((gig) => (
                      <SelectItem key={gig.id} value={gig.id}>
                        {format(new Date(`${gig.gig_date}T12:00:00`), "dd.MM.yyyy", {
                          locale: de,
                        })}{" "}
                        – {gig.venue}
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
                  defaultValue={selectedGig?.setlist?.title ?? ""}
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="songs">Songs</Label>
                <Textarea
                  id="songs"
                  name="songs"
                  rows={10}
                  defaultValue={selectedGig?.setlist?.songs.join("\n") ?? ""}
                  placeholder={"Song 1\nSong 2\nSong 3"}
                  className="border-zinc-700 bg-zinc-950"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={selectedGig?.setlist?.notes ?? ""}
                  className="border-zinc-700 bg-zinc-950"
                />
              </div>
              <Button
                type="submit"
                disabled={isPending || !selectedGigId}
                className="bg-red-600 hover:bg-red-500"
              >
                Save Setlist
              </Button>
            </form>
          )}
          {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>Existing Setlists</CardTitle>
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
              {gigs
                .filter((gig) => gig.setlist)
                .map((gig) => (
                  <TableRow key={gig.id} className="border-zinc-800">
                    <TableCell>
                      {format(new Date(`${gig.gig_date}T12:00:00`), "dd.MM.yyyy", {
                        locale: de,
                      })}{" "}
                      – {gig.venue}
                    </TableCell>
                    <TableCell>{gig.setlist?.title || "Setlist"}</TableCell>
                    <TableCell>{gig.setlist?.songs.length ?? 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() => handleDelete(gig.setlist!.id)}
                      >
                        Delete
                      </Button>
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
