import type { AppwriteDocument } from "@/lib/appwrite/rest";
import type { Gig, Setlist, SetlistEntry } from "@/lib/types/database";

type AppwriteDocumentRecord = AppwriteDocument & Record<string, unknown>;

function parseSetlistEntries(document: AppwriteDocumentRecord): SetlistEntry[] {
  const rawEntries = document.entries;
  if (typeof rawEntries === "string" && rawEntries.trim()) {
    try {
      const parsed = JSON.parse(rawEntries) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry) => {
            if (!entry || typeof entry !== "object") {
              return null;
            }

            const title = String((entry as SetlistEntry).title ?? "").trim();
            if (!title) {
              return null;
            }

            const interpretValue = (entry as SetlistEntry).interpret;
            const interpret =
              typeof interpretValue === "string" && interpretValue.trim()
                ? interpretValue.trim()
                : null;

            return { title, interpret };
          })
          .filter((entry): entry is SetlistEntry => entry !== null);
      }
    } catch {
      // fall through to legacy songs
    }
  }

  const legacySongs = document.songs;
  if (Array.isArray(legacySongs)) {
    return legacySongs
      .map((song) => String(song).trim())
      .filter(Boolean)
      .map((title) => ({ title, interpret: null }));
  }

  return [];
}

export function mapGig(document: AppwriteDocumentRecord): Gig {
  return {
    id: document.$id,
    gig_date: document.gig_date as string,
    venue: document.venue as string,
    location: (document.location as string | undefined)?.trim() || null,
    is_free: Boolean(document.is_free),
    price: (document.price as string | undefined)?.trim() || null,
    description: (document.description as string | undefined) ?? null,
    created_at: document.$createdAt,
    updated_at: document.$updatedAt,
  };
}

export function mapSetlist(document: AppwriteDocumentRecord): Setlist {
  return {
    id: document.$id,
    gig_id: document.gig_id as string,
    title: (document.title as string | undefined) ?? null,
    entries: parseSetlistEntries(document),
    notes: (document.notes as string | undefined) ?? null,
    created_at: document.$createdAt,
    updated_at: document.$updatedAt,
  };
}
