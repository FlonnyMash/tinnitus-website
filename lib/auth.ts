import { redirect } from "next/navigation";
import {
  getLoggedInUser,
  isAdminUser,
} from "@/lib/appwrite/server";
import type { Models } from "node-appwrite";

export async function getSessionUser(): Promise<Models.User | null> {
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
