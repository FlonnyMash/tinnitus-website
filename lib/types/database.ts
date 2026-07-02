export type AppRole = "admin";

export type Profile = {
  id: string;
  email: string | null;
  role: AppRole | null;
  created_at: string;
  updated_at: string;
};

export type Gig = {
  id: string;
  gig_date: string;
  venue: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Setlist = {
  id: string;
  gig_id: string;
  title: string | null;
  songs: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GigWithSetlist = Gig & {
  setlist: Setlist | null;
};

export type HomepageSeo = {
  title: string;
  description: string;
};

export type HeroSettings = {
  logo_url: string;
  hero_image_url: string;
};

export type BandPhotosSettings = {
  urls: string[];
};

export type SiteSettingKey = "homepage_seo" | "hero" | "band_photos";
