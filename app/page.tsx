import type { Metadata } from "next";
import { HeroSection } from "@/components/public/hero-section";
import { PastGigs } from "@/components/public/past-gigs";
import { UpcomingGigs } from "@/components/public/upcoming-gigs";
import {
  getAllGigs,
  getHeroSettings,
  getHomepageSeo,
  splitGigsByDate,
} from "@/lib/queries/site";

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
  const [gigs, hero] = await Promise.all([getAllGigs(), getHeroSettings()]);
  const { upcoming, past } = splitGigsByDate(gigs);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <HeroSection hero={hero} />
      <UpcomingGigs gigs={upcoming} />
      <PastGigs gigs={past} />
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Tinnitus. All rights reserved.
      </footer>
    </div>
  );
}
