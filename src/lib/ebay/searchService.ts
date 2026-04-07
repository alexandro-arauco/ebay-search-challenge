/**
 * @module SearchService
 * @description Application-level service that orchestrates the search flow:
 * validates → calls eBay → normalizes → returns domain result.
 *
 * SOLID:
 * - SRP: orchestrates the search use case — nothing more
 * - OCP: open to extension (add filters, sorting) without modifying this module
 * - DIP: depends on abstractions (searchEbayItems, normalizeProducts)
 */

import type { SearchParams, SearchResult, ApiErrorCode } from "@/types";
import { searchEbayItems } from "@/lib/ebay/client";
import { normalizeProducts } from "@/lib/ebay/normalizer";

export interface SearchServiceError {
  readonly code: ApiErrorCode;
  readonly message: string;
}

export type SearchServiceResult =
  | { ok: true; result: SearchResult }
  | { ok: false; error: SearchServiceError };

/**
 * Executes a product search against eBay Browse API.
 * Returns a normalized SearchResult or a typed error.
 */
export async function searchProducts(params: SearchParams): Promise<SearchServiceResult> {
  try {
    const raw = await searchEbayItems(params);
    const items = normalizeProducts(raw.itemSummaries ?? []);

    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const total = raw.total ?? 0;

    return {
      ok: true,
      result: {
        items,
        total,
        page,
        limit,
        hasMore: page * limit < total,
        query: params.q,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.toLowerCase().includes("auth") || message.toLowerCase().includes("401")) {
      return { ok: false, error: { code: "EBAY_AUTH_FAILED", message: "eBay authentication failed" } };
    }

    return { ok: false, error: { code: "EBAY_API_ERROR", message } };
  }
}
