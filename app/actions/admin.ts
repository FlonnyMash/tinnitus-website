"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { requireAdmin } from "@/lib/auth";
import {
  APPWRITE_DATABASE_ID,
  BUCKET_BAND_PHOTOS,
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
import type { BandPhotosSettings, HeroSettings } from "@/lib/types/database";

function parseSongs(raw: string) {
  return raw
    .split("\n")
    .map((song) => song.trim())
    .filter(Boolean);
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
  const description = String(formData.get("description") ?? "").trim() || null;

  try {
    await databases.createDocument({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_GIGS,
      documentId: ID.unique(),
      data: { gig_date, venue, description },
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
  const description = String(formData.get("description") ?? "").trim() || null;

  try {
    await databases.updateDocument({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_GIGS,
      documentId: id,
      data: { gig_date, venue, description },
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
  const title = String(formData.get("title") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const songs = parseSongs(String(formData.get("songs") ?? ""));

  try {
    const existing = await databases.listDocuments({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_SETLISTS,
      queries: [Query.equal("gig_id", gig_id), Query.limit(1)],
    });

    const data = { gig_id, title, notes, songs };

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

  const bucket = String(formData.get("bucket") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Keine Datei ausgewählt" };
  }

  const extension = file.name.split(".").pop() ?? "bin";
  const fileId = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const inputFile = InputFile.fromBuffer(buffer, file.name);

    await storage.createFile({
      bucketId: bucket,
      fileId,
      file: inputFile,
    });

    const publicUrl = getFileViewUrl(bucket, fileId);

    if (bucket === BUCKET_LOGOS) {
      const currentHero = await getSiteSettingValue<HeroSettings>("hero", {
        logo_url: "",
        hero_image_url: "",
      });

      await upsertSiteSetting("hero", { ...currentHero, logo_url: publicUrl });
    }

    if (bucket === BUCKET_BAND_PHOTOS) {
      const currentPhotos = await getSiteSettingValue<BandPhotosSettings>(
        "band_photos",
        { urls: [] },
      );

      await upsertSiteSetting("band_photos", {
        urls: [...currentPhotos.urls, publicUrl],
      });
    }

    if (bucket === BUCKET_BAND_PHOTOS && formData.get("use_as_hero") === "on") {
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
