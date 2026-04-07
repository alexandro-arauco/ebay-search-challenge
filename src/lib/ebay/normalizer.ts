/**
 * @module ProductNormalizer
 * @description Pure transformation functions from raw eBay API shape to
 * the domain Product type. No side effects, no I/O — fully testable.
 *
 * SOLID:
 * - SRP: only responsible for data normalization
 * - No dependencies on external services
 */

import type { Product, ProductCondition, EbayItemSummary } from "@/types";

function normalizeCondition(rawCondition?: string): ProductCondition {
  if (!rawCondition) return "ALL";
  const upper = rawCondition.toUpperCase();

  if (upper.includes("NEW")) return "NEW";
  if (upper.includes("USED") || upper.includes("PRE-OWNED")) return "USED";
  return "ALL";
}

function normalizePrice(price?: EbayItemSummary["price"]): Product["price"] {
  if (!price) return { value: 0, currency: "USD" };
  return {
    value: Math.max(0, parseFloat(price.value) || 0),
    currency: price.currency || "USD",
  };
}

/**
 * Normalizes a single raw eBay item into a domain Product.
 * Returns null if required fields (id, title) are missing.
 */
export function normalizeProduct(raw: EbayItemSummary): Product | null {
  if (!raw.itemId || !raw.title) return null;

  return {
    id: raw.itemId,
    title: raw.title,
    price: normalizePrice(raw.price),
    condition: normalizeCondition(raw.condition),
    image: raw.image?.imageUrl
      ? { url: raw.image.imageUrl, altText: raw.title }
      : null,
    listingUrl: raw.itemWebUrl,
    seller: raw.seller?.username ?? null,
    location:
      raw.itemLocation?.city && raw.itemLocation?.country
        ? `${raw.itemLocation.city}, ${raw.itemLocation.country}`
        : (raw.itemLocation?.country ?? null),
  };
}

/**
 * Normalizes an array of raw eBay items, filtering out invalid entries.
 */
export function normalizeProducts(rawItems: EbayItemSummary[]): Product[] {
  return rawItems.map(normalizeProduct).filter((p): p is Product => p !== null);
}
