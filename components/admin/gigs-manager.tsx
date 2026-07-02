"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGig, deleteGig, updateGig } from "@/app/actions/admin";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Gig } from "@/lib/types/database";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type GigsManagerProps = {
  gigs: Gig[];
};

export function GigsManager({ gigs }: GigsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingGig, setEditingGig] = useState<Gig | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function resetForm() {
    setEditingGig(null);
    setMessage(null);
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = editingGig
        ? await updateGig(formData)
        : await createGig(formData);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage(editingGig ? "Gig updated." : "Gig created.");
      resetForm();
      router.refresh();
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this gig and any linked setlist?")) {
      return;
    }

    const formData = new FormData();
    formData.set("id", id);

    startTransition(async () => {
      const result = await deleteGig(formData);
      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage("Gig deleted.");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Gigs</h2>
        <p className="mt-2 text-zinc-400">
          Create, edit, and delete upcoming and past gigs.
        </p>
      </div>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>{editingGig ? "Edit Gig" : "Add Gig"}</CardTitle>
          <CardDescription className="text-zinc-400">
            Date, venue, and optional description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
            {editingGig ? (
              <input type="hidden" name="id" value={editingGig.id} />
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="gig_date">Date</Label>
              <Input
                id="gig_date"
                name="gig_date"
                type="date"
                required
                defaultValue={editingGig?.gig_date ?? ""}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                required
                defaultValue={editingGig?.venue ?? ""}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={editingGig?.description ?? ""}
                className="border-zinc-700 bg-zinc-950"
              />
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-red-600 hover:bg-red-500"
              >
                {editingGig ? "Update Gig" : "Create Gig"}
              </Button>
              {editingGig ? (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
          {message ? <p className="mt-4 text-sm text-zinc-300">{message}</p> : null}
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle>All Gigs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gigs.map((gig) => (
                <TableRow key={gig.id} className="border-zinc-800">
                  <TableCell>
                    {format(new Date(`${gig.gig_date}T12:00:00`), "dd.MM.yyyy", {
                      locale: de,
                    })}
                  </TableCell>
                  <TableCell>{gig.venue}</TableCell>
                  <TableCell className="max-w-sm truncate text-zinc-400">
                    {gig.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingGig(gig)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(gig.id)}
                        disabled={isPending}
                      >
                        Delete
                      </Button>
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
