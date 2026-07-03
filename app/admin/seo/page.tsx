import { getHomepageSeo } from "@/lib/queries/site";
import { SeoManager } from "@/components/admin/seo-manager";

export default async function AdminSeoPage() {
  const seo = await getHomepageSeo();

  return <SeoManager seo={seo} />;
}
