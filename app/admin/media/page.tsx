import { getBandPhotos, getHeroSettings } from "@/lib/queries/site";
import { MediaManager } from "@/components/admin/media-manager";

export default async function AdminMediaPage() {
  const [hero, bandPhotos] = await Promise.all([
    getHeroSettings(),
    getBandPhotos(),
  ]);

  return <MediaManager hero={hero} bandPhotos={bandPhotos} />;
}
