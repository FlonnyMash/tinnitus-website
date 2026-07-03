import Link from "next/link";
import { getAllGigs } from "@/lib/queries/site";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const gigs = await getAllGigs();
  const today = new Date().toISOString().slice(0, 10);
  const upcomingCount = gigs.filter((gig) => gig.gig_date >= today).length;
  const pastCount = gigs.filter((gig) => gig.gig_date < today).length;
  const setlistCount = gigs.filter((gig) => gig.setlist).length;

  const cards = [
    {
      title: "Upcoming Gigs",
      value: upcomingCount,
      description: "Scheduled shows on the public site",
      href: "/admin/gigs",
    },
    {
      title: "Past Gigs",
      value: pastCount,
      description: "Archived performances",
      href: "/admin/gigs",
    },
    {
      title: "Setlists",
      value: setlistCount,
      description: "Published setlists linked to gigs",
      href: "/admin/setlists",
    },
    {
      title: "Media & SEO",
      value: "Manage",
      description: "Upload photos, logo, and homepage metadata",
      href: "/admin/media",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-2 text-zinc-400">
          Manage gigs, setlists, media assets, and homepage SEO for Tinnitus.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="border-zinc-800 bg-zinc-900 transition-colors hover:border-red-600">
              <CardHeader>
                <CardDescription className="text-zinc-400">
                  {card.title}
                </CardDescription>
                <CardTitle className="text-3xl text-white">
                  {card.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
