import { cookies } from "next/headers";
import { Account, Client, Databases, Storage } from "node-appwrite";
import type { Models } from "node-appwrite";
import {
  ADMIN_LABEL,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  SESSION_COOKIE,
} from "./config";

function createBaseClient() {
  return new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
}

export function createAdminClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "APPWRITE_API_KEY is not set. Add it as a Worker secret in Cloudflare (Settings → Variables and Secrets), not only as a build variable.",
    );
  }

  return createBaseClient().setKey(apiKey);
}

export function createSessionClient(sessionSecret?: string) {
  const client = createBaseClient();
  if (sessionSecret) {
    client.setSession(sessionSecret);
  }
  return client;
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function setSessionCookie(session: Models.Session) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(session.expire),
    path: "/",
  });
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getLoggedInUser(): Promise<Models.User | null> {
  const sessionSecret = await getSessionCookie();
  if (!sessionSecret) {
    return null;
  }

  try {
    const account = new Account(createSessionClient(sessionSecret));
    return await account.get();
  } catch {
    return null;
  }
}

export function isAdminUser(user: Models.User): boolean {
  return user.labels?.includes(ADMIN_LABEL) ?? false;
}

export function getAdminDatabases() {
  return new Databases(createAdminClient());
}

export function getAdminStorage() {
  return new Storage(createAdminClient());
}

export function getFileViewUrl(bucketId: string, fileId: string): string {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
}
