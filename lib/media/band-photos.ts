import type { BandPhoto, BandPhotosSettings } from "@/lib/types/database";

export function normalizeBandPhotos(raw: unknown): BandPhotosSettings {
  if (!raw || typeof raw !== "object") {
    return { photos: [] };
  }

  const value = raw as { photos?: BandPhoto[]; urls?: string[] };

  if (Array.isArray(value.photos)) {
    return {
      photos: value.photos.map((photo) => ({
        url: photo.url,
        alt: photo.alt ?? "",
        caption: photo.caption ?? "",
      })),
    };
  }

  if (Array.isArray(value.urls)) {
    return {
      photos: value.urls.map((url) => ({
        url,
        alt: "",
        caption: "",
      })),
    };
  }

  return { photos: [] };
}

export function createBandPhoto(url: string): BandPhoto {
  return { url, alt: "", caption: "" };
}
