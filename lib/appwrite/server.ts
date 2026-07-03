import { cookies } from "next/headers";
import {
  ADMIN_LABEL,
  getAppwriteEndpoint,
  getAppwriteProjectId,
  getSessionCookieName,
} from "./config";
import {
  deleteCurrentSession,
  getAccount,
  type AppwriteSession,
  type AppwriteUser,
} from "./rest";

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(getSessionCookieName())?.value;
}

export async function setSessionCookie(session: AppwriteSession) {
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

export async function getLoggedInUser(): Promise<AppwriteUser | null> {
  const sessionSecret = await getSessionCookie();
  if (!sessionSecret) {
    return null;
  }

  try {
    return await getAccount(sessionSecret);
  } catch {
    return null;
  }
}

export function isAdminUser(user: AppwriteUser): boolean {
  return user.labels?.includes(ADMIN_LABEL) ?? false;
}

export async function deleteUserSession(sessionSecret: string) {
  await deleteCurrentSession(sessionSecret);
}

export function getFileViewUrl(bucketId: string, fileId: string): string {
  return `${getAppwriteEndpoint()}/storage/buckets/${bucketId}/files/${fileId}/view?project=${getAppwriteProjectId()}`;
}

export type { AppwriteSession, AppwriteUser };
