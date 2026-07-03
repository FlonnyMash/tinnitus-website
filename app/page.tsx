import type { Metadata } from "next";
import { AboutSection } from "@/components/public/about-section";
import { FeaturesSection } from "@/components/public/features-section";
import { HeroSection } from "@/components/public/hero-section";
import { PastGigs } from "@/components/public/past-gigs";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { UpcomingGigs } from "@/components/public/upcoming-gigs";
import { getLogoUrl } from "@/lib/brand";
import {
  getAllGigs,
  getBandPhotos,
  getHeroSettings,
  getHomepageSeo,
  splitGigsByDate,
} from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSeo();

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [gigs, hero, bandPhotos] = await Promise.all([
    getAllGigs(),
    getHeroSettings(),
    getBandPhotos(),
  ]);
  const { upcoming, past } = splitGigsByDate(gigs);
  const bandPhoto = bandPhotos.photos[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader logoUrl={getLogoUrl(hero.logo_url)} />
      <main>
        <HeroSection hero={hero} />
        <FeaturesSection />
        <AboutSection bandPhoto={bandPhoto} />
        <UpcomingGigs gigs={upcoming} />
        <PastGigs gigs={past} />
      </main>
      <SiteFooter />
    </div>
  );
}
