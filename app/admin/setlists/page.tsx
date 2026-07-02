import { getAllGigs } from "@/lib/queries/site";
import { SetlistsManager } from "@/components/admin/setlists-manager";

export default async function AdminSetlistsPage() {
  const gigs = await getAllGigs();

  return <SetlistsManager gigs={gigs} />;
}
