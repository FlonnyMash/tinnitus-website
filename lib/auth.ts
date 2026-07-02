import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.role === "admin";
}

export async function requireAdmin() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  const profile = await getProfile();

  if (profile?.role !== "admin") {
    redirect("/?error=unauthorized");
  }

  return { user, profile };
}
