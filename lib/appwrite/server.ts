import { cookies } from "next/headers";
import { Account, Client, Databases, Storage } from "node-appwrite";
import type { Models } from "node-appwrite";
import {
  ADMIN_LABEL,
  getAppwriteApiKey,
  getAppwriteEndpoint,
  getAppwriteProjectId,
  getSessionCookieName,
} from "./config";

function createBaseClient() {
  return new Client()
    .setEndpoint(getAppwriteEndpoint())
    .setProject(getAppwriteProjectId());
}

export function createAdminClient() {
  return createBaseClient().setKey(getAppwriteApiKey());
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
  return cookieStore.get(getSessionCookieName())?.value;
}

export async function setSessionCookie(session: Models.Session) {
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), session.secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(session.expire),
    path: "/",
  });
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
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
  return `${getAppwriteEndpoint()}/storage/buckets/${bucketId}/files/${fileId}/view?project=${getAppwriteProjectId()}`;
}
