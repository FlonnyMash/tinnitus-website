import { createClient } from "@/lib/supabase/server";
import type {
  BandPhotosSettings,
  Gig,
  GigWithSetlist,
  HeroSettings,
  HomepageSeo,
  Setlist,
} from "@/lib/types/database";

export async function getAllGigs(): Promise<GigWithSetlist[]> {
  const supabase = await createClient();

  const { data: gigs, error } = await supabase
    .from("gigs")
    .select("*")
    .order("gig_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch gigs:", error.message);
    return [];
  }

  const { data: setlists, error: setlistError } = await supabase
    .from("setlists")
    .select("*");

  if (setlistError) {
    console.error("Failed to fetch setlists:", setlistError.message);
    return (gigs ?? []).map((gig) => ({ ...gig, setlist: null }));
  }

  const setlistByGigId = new Map(
    (setlists ?? []).map((setlist) => [setlist.gig_id, setlist as Setlist]),
  );

  return (gigs ?? []).map((gig) => ({
    ...(gig as Gig),
    setlist: setlistByGigId.get(gig.id) ?? null,
  }));
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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error || !data?.value) {
    return fallback;
  }

  return data.value as T;
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
