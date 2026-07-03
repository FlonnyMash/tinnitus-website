export const DEFAULT_LOGO = "/logo.png";

export function getLogoUrl(cmsUrl?: string | null) {
  const trimmed = cmsUrl?.trim();
  return trimmed || DEFAULT_LOGO;
}
