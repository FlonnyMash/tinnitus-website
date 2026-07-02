import type { Models } from "node-appwrite";
import type { Gig, Setlist } from "@/lib/types/database";

type AppwriteDocument = Models.Document & Record<string, unknown>;

export function mapGig(document: AppwriteDocument): Gig {
  return {
    id: document.$id,
    gig_date: document.gig_date as string,
    venue: document.venue as string,
    description: (document.description as string | undefined) ?? null,
    created_at: document.$createdAt,
    updated_at: document.$updatedAt,
  };
}

export function mapSetlist(document: AppwriteDocument): Setlist {
  return {
    id: document.$id,
    gig_id: document.gig_id as string,
    title: (document.title as string | undefined) ?? null,
    songs: (document.songs as string[] | undefined) ?? [],
    notes: (document.notes as string | undefined) ?? null,
    created_at: document.$createdAt,
    updated_at: document.$updatedAt,
  };
}
