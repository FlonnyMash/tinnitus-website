"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  AppwriteRestError,
  createEmailPasswordSession,
  deleteCurrentSession,
  getUser,
} from "@/lib/appwrite/rest";
import {
  deleteSessionCookie,
  getSessionCookie,
  isAdminUser,
  setSessionCookie,
} from "@/lib/appwrite/server";

function authErrorMessage(error: unknown): string {
  if (error instanceof AppwriteRestError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Authentifizierung fehlgeschlagen";
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  let session;

  try {
    session = await createEmailPasswordSession({ email, password });
  } catch (error) {
    redirect(
      `/login?error=${encodeURIComponent(authErrorMessage(error))}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  if (!session.secret) {
    redirect(
      `/login?error=${encodeURIComponent("Server API key benötigt sessions.write Berechtigung")}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  let user;
  try {
    user = await getUser(session.userId);
  } catch (error) {
    try {
      await deleteCurrentSession(session.secret);
    } catch {
      // Session cleanup is best-effort.
    }
    redirect(
      `/login?error=${encodeURIComponent(authErrorMessage(error))}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  if (!isAdminUser(user)) {
    await deleteCurrentSession(session.secret);
    redirect(
      `/login?error=${encodeURIComponent("Kein Administratorzugriff")}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  await setSessionCookie(session);
  redirect(redirectTo);
}

export async function signOut() {
  const sessionSecret = await getSessionCookie();

  if (sessionSecret) {
    try {
      await deleteCurrentSession(sessionSecret);
    } catch {
      // Session may already be invalid; still clear the cookie.
    }
  }

  await deleteSessionCookie();
  redirect("/login");
}

export async function ensureAdmin() {
  await requireAdmin();
}
