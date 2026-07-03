import { Query } from "node-appwrite";
import {
  APPWRITE_DATABASE_ID,
  COLLECTION_GIGS,
  COLLECTION_SETLISTS,
  COLLECTION_SITE_SETTINGS,
} from "@/lib/appwrite/config";
import { mapGig, mapSetlist } from "@/lib/appwrite/mappers";
import { getAdminDatabases } from "@/lib/appwrite/server";
import type {
  BandPhotosSettings,
  Gig,
  GigWithSetlist,
  HeroSettings,
  HomepageSeo,
  Setlist,
} from "@/lib/types/database";

export async function getAllGigs(): Promise<GigWithSetlist[]> {
  const databases = getAdminDatabases();

  try {
    const gigsResult = await databases.listDocuments({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_GIGS,
      queries: [Query.orderDesc("gig_date")],
    });

    const setlistsResult = await databases.listDocuments({
      databaseId: APPWRITE_DATABASE_ID,
      collectionId: COLLECTION_SETLISTS,
    });

    const setlistByGigId = new Map(
      setlistsResult.documents.map((document) => [
        document.gig_id as string,
        mapSetlist(document),
      ]),
    );

    return gigsResult.documents.map((document) => ({
      ...mapGig(document),
      setlist: setlistByGigId.get(document.$id) ?? null,
    }));
  } catch (error) {
    console.error("Failed to fetch gigs:", error);
    return [];
  }
}

export function splitGigsByDate(gigs: GigWithSetlist[]) {
  const today = new Date().toISOString().slice(0, 10);

  const upcoming = gigs
    .filter((gig) => gig.gig_date >= today)
    .sort((a, b) => a.gig_date.localeCompare(b.gig_date));

  const past = gigs
    .filter((gig) => gig.gig_date < today)
    .sort((a, b) => b.gig_date.localeCompare(a.gig_date));

  return { upcoming, past };
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  const databases = getAdminDatabases();

  try {
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
  } catch (error) {
    console.error(`Failed to fetch site setting "${key}":`, error);
    return fallback;
  }
}

export async function getHomepageSeo(): Promise<HomepageSeo> {
  return getSiteSetting<HomepageSeo>("homepage_seo", {
    title: "Tinnitus – Rock Band",
    description:
      "Offizielle Website der Rockband Tinnitus. Termine, Setlists und News.",
  });
}

export async function getHeroSettings(): Promise<HeroSettings> {
  return getSiteSetting<HeroSettings>("hero", {
    logo_url: "",
    hero_image_url: "",
  });
}

export async function getBandPhotos(): Promise<BandPhotosSettings> {
  return getSiteSetting<BandPhotosSettings>("band_photos", { urls: [] });
}

export type { Gig, GigWithSetlist, Setlist };
