"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { requireAdmin } from "@/lib/auth";
import {
  APPWRITE_DATABASE_ID,
  BUCKET_LOGOS,
  COLLECTION_GIGS,
  COLLECTION_SETLISTS,
  COLLECTION_SITE_SETTINGS,
} from "@/lib/appwrite/config";
import {
  getAdminDatabases,
  getAdminStorage,
  getFileViewUrl,
} from "@/lib/appwrite/server";
import type { BandPhotosSettings, HeroSettings, SetlistEntry } from "@/lib/types/database";

function parseSetlistEntries(raw: string): SetlistEntry[] | { error: string } {
  if (!raw.trim()) {
    return { error: "Mindestens ein Song mit Titel ist erforderlich." };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return { error: "Ungültige Setlist-Daten." };
    }

    const entries = parsed
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

    if (entries.length === 0) {
      return { error: "Mindestens ein Song mit Titel ist erforderlich." };
    }

    return entries;
  } catch {
    return { error: "Ungültige Setlist-Daten." };
  }
}

function parseGigEntrance(formData: FormData) {
  const is_free = formData.get("is_free") === "true";
  const price = String(formData.get("price") ?? "").trim() || null;

  return {
    is_free,
    price: is_free ? null : price,
  };
}

async function upsertSiteSetting(key: string, value: object) {
  const databases = getAdminDatabases();
  const jsonValue = JSON.stringify(value);

  const existing = await databases.listDocuments({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: COLLECTION_SITE_SETTINGS,
    queries: [Query.equal("key", key), Query.limit(1)],
  });

  if (existing.documents[0]) {
    await databases.updateDocument({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_SITE_SETTINGS,
      documentId: existing.documents[0].$id,
      data: { key, value: jsonValue },
    });
    return;
  }

  await databases.createDocument({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: COLLECTION_SITE_SETTINGS,
    documentId: ID.unique(),
    data: { key, value: jsonValue },
  });
}

async function getSiteSettingValue<T>(key: string, fallback: T): Promise<T> {
  const databases = getAdminDatabases();

  const result = await databases.listDocuments({
    databaseId: APPWRITE_DATABASE_ID,
    collectionId: COLLECTION_SITE_SETTINGS,
    queries: [Query.equal("key", key), Query.limit(1)],
  });

  const document = result.documents[0];
  if (!document?.value) {
    return fallback;
  }

  return JSON.parse(document.value as string) as T;
}

export async function createGig(formData: FormData) {
  await requireAdmin();
  const databases = getAdminDatabases();

  const gig_date = String(formData.get("gig_date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const { is_free, price } = parseGigEntrance(formData);

  try {
    await databases.createDocument({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_GIGS,
      documentId: ID.unique(),
      data: { gig_date, venue, location, is_free, price, description },
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Speichern fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gigs");
  return { success: true };
}

export async function updateGig(formData: FormData) {
  await requireAdmin();
  const databases = getAdminDatabases();

  const id = String(formData.get("id") ?? "");
  const gig_date = String(formData.get("gig_date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const { is_free, price } = parseGigEntrance(formData);

  try {
    await databases.updateDocument({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_GIGS,
      documentId: id,
      data: { gig_date, venue, location, is_free, price, description },
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Speichern fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gigs");
  return { success: true };
}

export async function deleteGig(formData: FormData) {
  await requireAdmin();
  const databases = getAdminDatabases();

  const id = String(formData.get("id") ?? "");

  try {
    const setlists = await databases.listDocuments({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_SETLISTS,
      queries: [Query.equal("gig_id", id)],
    });

    for (const setlist of setlists.documents) {
      await databases.deleteDocument({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTION_SETLISTS,
        documentId: setlist.$id,
      });
    }

    await databases.deleteDocument({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_GIGS,
      documentId: id,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Löschen fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gigs");
  revalidatePath("/admin/setlists");
  return { success: true };
}

export async function upsertSetlist(formData: FormData) {
  await requireAdmin();
  const databases = getAdminDatabases();

  const gig_id = String(formData.get("gig_id") ?? "");
  const title = String(formData.get("title") ?? "").trim() || "Setlist";
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const parsedEntries = parseSetlistEntries(String(formData.get("entries") ?? ""));

  if ("error" in parsedEntries) {
    return { error: parsedEntries.error };
  }

  const entries = JSON.stringify(parsedEntries);

  try {
    const existing = await databases.listDocuments({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_SETLISTS,
      queries: [Query.equal("gig_id", gig_id), Query.limit(1)],
    });

    const data = { gig_id, title, notes, entries, songs: [] };

    if (existing.documents[0]) {
      await databases.updateDocument({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTION_SETLISTS,
        documentId: existing.documents[0].$id,
        data,
      });
    } else {
      await databases.createDocument({
        databaseId: APPWRITE_DATABASE_ID,
        collectionId: COLLECTION_SETLISTS,
        documentId: ID.unique(),
        data,
      });
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Speichern fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/setlists");
  return { success: true };
}

export async function deleteSetlist(formData: FormData) {
  await requireAdmin();
  const databases = getAdminDatabases();

  const id = String(formData.get("id") ?? "");

  try {
    await databases.deleteDocument({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_SETLISTS,
      documentId: id,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Löschen fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/setlists");
  return { success: true };
}

export async function updateHomepageSeo(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  try {
    await upsertSiteSetting("homepage_seo", { title, description });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Speichern fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateHeroSettings(formData: FormData) {
  await requireAdmin();

  const logo_url = String(formData.get("logo_url") ?? "").trim();
  const hero_image_url = String(formData.get("hero_image_url") ?? "").trim();

  try {
    await upsertSiteSetting("hero", { logo_url, hero_image_url });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Speichern fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/media");
  return { success: true };
}

export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  const storage = getAdminStorage();

  const kind = String(formData.get("kind") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Keine Datei ausgewählt" };
  }

  const fileId = crypto.randomUUID();

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    await storage.createFile({
      bucketId: BUCKET_LOGOS,
      fileId,
      file: inputFile,
    });

    const publicUrl = getFileViewUrl(BUCKET_LOGOS, fileId);

    if (kind === "logo") {
      const currentHero = await getSiteSettingValue<HeroSettings>("hero", {
        logo_url: "",
        hero_image_url: "",
      });

      await upsertSiteSetting("hero", { ...currentHero, logo_url: publicUrl });
    }

    if (kind === "band-photo") {
      const currentPhotos = await getSiteSettingValue<BandPhotosSettings>(
        "band_photos",
        { urls: [] },
      );

      await upsertSiteSetting("band_photos", {
        urls: [...currentPhotos.urls, publicUrl],
      });
    }

    if (kind === "band-photo" && formData.get("use_as_hero") === "on") {
      const currentHero = await getSiteSettingValue<HeroSettings>("hero", {
        logo_url: "",
        hero_image_url: "",
      });

      await upsertSiteSetting("hero", {
        ...currentHero,
        hero_image_url: publicUrl,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/media");
    return { success: true, url: publicUrl };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload fehlgeschlagen",
    };
  }
}

export async function removeBandPhoto(formData: FormData) {
  await requireAdmin();

  const url = String(formData.get("url") ?? "");

  try {
    const currentPhotos = await getSiteSettingValue<BandPhotosSettings>(
      "band_photos",
      { urls: [] },
    );

    await upsertSiteSetting("band_photos", {
      urls: currentPhotos.urls.filter((item) => item !== url),
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Löschen fehlgeschlagen",
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/media");
  return { success: true };
}
