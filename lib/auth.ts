import { redirect } from "next/navigation";
import {
  getLoggedInUser,
  isAdminUser,
} from "@/lib/appwrite/server";
import type { AppwriteUser } from "@/lib/appwrite/server";

export async function getSessionUser(): Promise<AppwriteUser | null> {
  return getLoggedInUser();
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user ? isAdminUser(user) : false;
}

export async function requireAdmin() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  if (!isAdminUser(user)) {
    redirect("/?error=unauthorized");
  }

  return { user };
}
