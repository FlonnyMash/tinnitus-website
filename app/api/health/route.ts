import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAdminDatabases } from "@/lib/appwrite/server";
import {
  getAppwriteApiKey,
  getAppwriteDatabaseId,
  getAppwriteEndpoint,
  getAppwriteProjectId,
  getCollectionGigs,
} from "@/lib/appwrite/config";
import { Query } from "node-appwrite";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, unknown> = {
    endpoint: Boolean(getAppwriteEndpoint()),
    projectId: Boolean(getAppwriteProjectId()),
    databaseId: Boolean(getAppwriteDatabaseId()),
    apiKey: Boolean(getAppwriteApiKey()),
    processEnvApiKey: Boolean(process.env.APPWRITE_API_KEY),
  };

  try {
    const cf = getCloudflareContext();
    checks.cfEnvApiKey = Boolean(
      (cf.env as Record<string, string | undefined>).APPWRITE_API_KEY,
    );
  } catch (e) {
    checks.cfContextError = e instanceof Error ? e.message : "unknown";
  }

  try {
    const databases = getAdminDatabases();
    const result = await databases.listDocuments({
      databaseId: getAppwriteDatabaseId(),
      collectionId: getCollectionGigs(),
      queries: [Query.limit(3)],
    });
    checks.gigCount = result.total;
    checks.gigVenues = result.documents.map((d) => d.venue);
  } catch (e) {
    checks.appwriteError = e instanceof Error ? e.message : String(e);
  }

  return Response.json(checks);
}
