import { getCloudflareContext } from "@opennextjs/cloudflare";

type EnvKey =
  | "NEXT_PUBLIC_APPWRITE_ENDPOINT"
  | "NEXT_PUBLIC_APPWRITE_PROJECT_ID"
  | "NEXT_PUBLIC_APPWRITE_DATABASE_ID"
  | "NEXT_PUBLIC_APPWRITE_COLLECTION_GIGS"
  | "NEXT_PUBLIC_APPWRITE_COLLECTION_SETLISTS"
  | "NEXT_PUBLIC_APPWRITE_COLLECTION_SITE_SETTINGS"
  | "APPWRITE_API_KEY";

/**
 * Resolve an environment variable at runtime.
 *
 * On Cloudflare Workers, dashboard vars and secrets are exposed through the
 * Cloudflare context rather than the build-time `process.env`. We check the
 * Cloudflare context first (production) and fall back to `process.env`
 * (local dev, and build-time inlined `NEXT_PUBLIC_*` values).
 */
function readEnv(key: EnvKey): string | undefined {
  try {
    const cfEnv = getCloudflareContext().env as Record<string, string | undefined>;
    if (cfEnv?.[key]) {
      return cfEnv[key];
    }
  } catch {
    // Not running inside the Cloudflare context (e.g. local dev / build).
  }

  return process.env[key];
}

function requireEnv(key: EnvKey): string {
  const value = readEnv(key);
  if (!value) {
    throw new Error(
      `Missing environment variable "${key}". Set it in Cloudflare (Worker → Settings → Variables and Secrets) and in Workers Builds → Build variables.`,
    );
  }
  return value;
}

export function getAppwriteEndpoint() {
  return requireEnv("NEXT_PUBLIC_APPWRITE_ENDPOINT");
}

export function getAppwriteProjectId() {
  return requireEnv("NEXT_PUBLIC_APPWRITE_PROJECT_ID");
}

export function getAppwriteDatabaseId() {
  return requireEnv("NEXT_PUBLIC_APPWRITE_DATABASE_ID");
}

export function getCollectionGigs() {
  return requireEnv("NEXT_PUBLIC_APPWRITE_COLLECTION_GIGS");
}

export function getCollectionSetlists() {
  return requireEnv("NEXT_PUBLIC_APPWRITE_COLLECTION_SETLISTS");
}

export function getCollectionSiteSettings() {
  return requireEnv("NEXT_PUBLIC_APPWRITE_COLLECTION_SITE_SETTINGS");
}

export function getAppwriteApiKey() {
  return requireEnv("APPWRITE_API_KEY");
}

export function getSessionCookieName() {
  return `a_session_${getAppwriteProjectId()}`;
}

/** Appwrite free tier allows one storage bucket — all media uses `logos`. */
export const BUCKET_LOGOS = "logos";
export const BUCKET_BAND_PHOTOS = BUCKET_LOGOS;

export const ADMIN_LABEL = "admin";
