import type { Gig } from "@/lib/types/database";

export function formatGigPrice(price: string): string {
  const trimmed = price.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.endsWith("€")) {
    return trimmed.replace(/\s*€\s*$/, "").trim();
  }

  return trimmed;
}

export function formatGigEntrance(gig: Pick<Gig, "is_free" | "price">): string | null {
  if (gig.is_free) {
    return "Eintritt frei";
  }

  if (gig.price) {
    return `Eintritt: ${formatGigPrice(gig.price)} €`;
  }

  return null;
}
