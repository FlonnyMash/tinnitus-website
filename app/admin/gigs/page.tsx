import { getAllGigs } from "@/lib/queries/site";
import { GigsManager } from "@/components/admin/gigs-manager";

export default async function AdminGigsPage() {
  const gigs = await getAllGigs();

  return <GigsManager gigs={gigs} />;
}
