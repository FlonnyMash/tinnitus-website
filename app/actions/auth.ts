"use server";

import { redirect } from "next/navigation";
import { Account, AppwriteException } from "node-appwrite";
import { requireAdmin } from "@/lib/auth";
import {
  createAdminClient,
  createSessionClient,
  deleteSessionCookie,
  getSessionCookie,
  isAdminUser,
  setSessionCookie,
} from "@/lib/appwrite/server";

function authErrorMessage(error: unknown): string {
  if (error instanceof AppwriteException) {
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
    const adminAccount = new Account(createAdminClient());
    session = await adminAccount.createEmailPasswordSession({
      email,
      password,
    });
  } catch (error) {
    redirect(
      `/login?error=${encodeURIComponent(authErrorMessage(error))}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }

  const sessionAccount = new Account(createSessionClient(session.secret));
  const user = await sessionAccount.get();

  if (!isAdminUser(user)) {
    await sessionAccount.deleteSession({ sessionId: "current" });
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
      const account = new Account(createSessionClient(sessionSecret));
      await account.deleteSession({ sessionId: "current" });
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
