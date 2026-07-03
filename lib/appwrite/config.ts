export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_GIGS = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_GIGS!;
export const COLLECTION_SETLISTS =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_SETLISTS!;
export const COLLECTION_SITE_SETTINGS =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_SITE_SETTINGS!;

/** Appwrite free tier allows one storage bucket — all media uses `logos`. */
export const BUCKET_LOGOS = "logos";
export const BUCKET_BAND_PHOTOS = BUCKET_LOGOS;

export const SESSION_COOKIE = `a_session_${APPWRITE_PROJECT_ID}`;
export const ADMIN_LABEL = "admin";
