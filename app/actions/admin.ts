"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function parseSongs(raw: string) {
  return raw
    .split("\n")
    .map((song) => song.trim())
    .filter(Boolean);
}

export async function createGig(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const gig_date = String(formData.get("gig_date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  const { error } = await supabase.from("gigs").insert({
    gig_date,
    venue,
    description,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gigs");
  return { success: true };
}

export async function updateGig(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const gig_date = String(formData.get("gig_date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  const { error } = await supabase
    .from("gigs")
    .update({ gig_date, venue, description })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gigs");
  return { success: true };
}

export async function deleteGig(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("gigs").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/gigs");
  revalidatePath("/admin/setlists");
  return { success: true };
}

export async function upsertSetlist(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const gig_id = String(formData.get("gig_id") ?? "");
  const title = String(formData.get("title") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const songs = parseSongs(String(formData.get("songs") ?? ""));

  const { error } = await supabase.from("setlists").upsert(
    {
      gig_id,
      title,
      notes,
      songs,
    },
    { onConflict: "gig_id" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/setlists");
  return { success: true };
}

export async function deleteSetlist(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");

  const { error } = await supabase.from("setlists").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/setlists");
  return { success: true };
}

export async function updateHomepageSeo(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  const { error } = await supabase.from("site_settings").upsert({
    key: "homepage_seo",
    value: { title, description },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateHeroSettings(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const logo_url = String(formData.get("logo_url") ?? "").trim();
  const hero_image_url = String(formData.get("hero_image_url") ?? "").trim();

  const { error } = await supabase.from("site_settings").upsert({
    key: "hero",
    value: { logo_url, hero_image_url },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/media");
  return { success: true };
}

export async function uploadMedia(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const bucket = String(formData.get("bucket") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected" };
  }

  const extension = file.name.split(".").pop() ?? "bin";
  const filePath = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  if (bucket === "logos") {
  const { data: heroSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero")
    .maybeSingle();

    const currentHero = (heroSetting?.value ?? {
      logo_url: "",
      hero_image_url: "",
    }) as { logo_url: string; hero_image_url: string };

    await supabase.from("site_settings").upsert({
      key: "hero",
      value: { ...currentHero, logo_url: publicUrl },
    });
  }

  if (bucket === "band-photos") {
    const { data: photosSetting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "band_photos")
      .maybeSingle();

    const currentPhotos = (photosSetting?.value ?? { urls: [] }) as {
      urls: string[];
    };

    await supabase.from("site_settings").upsert({
      key: "band_photos",
      value: { urls: [...currentPhotos.urls, publicUrl] },
    });
  }

  if (bucket === "band-photos" && formData.get("use_as_hero") === "on") {
    const { data: heroSetting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero")
      .maybeSingle();

    const currentHero = (heroSetting?.value ?? {
      logo_url: "",
      hero_image_url: "",
    }) as { logo_url: string; hero_image_url: string };

    await supabase.from("site_settings").upsert({
      key: "hero",
      value: { ...currentHero, hero_image_url: publicUrl },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/media");
  return { success: true, url: publicUrl };
}

export async function removeBandPhoto(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const url = String(formData.get("url") ?? "");

  const { data: photosSetting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "band_photos")
    .maybeSingle();

  const currentPhotos = (photosSetting?.value ?? { urls: [] }) as {
    urls: string[];
  };

  await supabase.from("site_settings").upsert({
    key: "band_photos",
    value: { urls: currentPhotos.urls.filter((item) => item !== url) },
  });

  revalidatePath("/");
  revalidatePath("/admin/media");
  return { success: true };
}
