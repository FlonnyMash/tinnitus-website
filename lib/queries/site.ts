import {
  AppwriteQuery,
  listDocuments,
} from "@/lib/appwrite/rest";
import {
  getAppwriteDatabaseId,
  getCollectionGigs,
  getCollectionSetlists,
  getCollectionSiteSettings,
} from "@/lib/appwrite/config";
import { mapGig, mapSetlist } from "@/lib/appwrite/mappers";
import type {
  BandPhotosSettings,
  Gig,
  GigWithSetlist,
  HeroSettings,
  HomepageSeo,
  Setlist,
} from "@/lib/types/database";
import { normalizeBandPhotos } from "@/lib/media/band-photos";

export async function getAllGigs(): Promise<GigWithSetlist[]> {
  try {
    const gigsResult = await listDocuments({
      databaseId: getAppwriteDatabaseId(),
      collectionId: getCollectionGigs(),
      queries: [AppwriteQuery.orderDesc("gig_date")],
    });

    const setlistsResult = await listDocuments({
      databaseId: getAppwriteDatabaseId(),
      collectionId: getCollectionSetlists(),
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
  try {
    const result = await listDocuments({
      databaseId: getAppwriteDatabaseId(),
      collectionId: getCollectionSiteSettings(),
      queries: [AppwriteQuery.equal("key", key), AppwriteQuery.limit(1)],
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
  const hero = await getSiteSetting<Partial<HeroSettings>>("hero", {
    logo_url: "",
    hero_image_url: "",
  });

  return {
    logo_url: hero.logo_url ?? "",
    hero_image_url: hero.hero_image_url ?? "",
    logo_alt: hero.logo_alt ?? "",
    hero_alt: hero.hero_alt ?? "",
  };
}

export async function getBandPhotos(): Promise<BandPhotosSettings> {
  const raw = await getSiteSetting<unknown>("band_photos", { photos: [] });
  return normalizeBandPhotos(raw);
}

export type { Gig, GigWithSetlist, Setlist };
