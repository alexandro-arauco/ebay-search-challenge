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

import { response as mockResponse } from "@/__mocks__/search/search-response.mock";
import { searchEbayItems } from "@/lib/ebay/client";
import { normalizeProducts } from "@/lib/ebay/normalizer";
import { EbayAuthError } from "@/lib/ebay/errors";
import type { ApiErrorCode, SearchParams, SearchResult } from "@/types";
import { mockSearchFilters } from "@/__mocks__/search/search-filters.mock";

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
export async function searchProducts(
  params: SearchParams,
): Promise<SearchServiceResult> {
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

    if (err instanceof EbayAuthError) {
      return {
        ok: false,
        error: {
          code: "EBAY_AUTH_FAILED",
          message: "eBay authentication failed",
        },
      };
    }

    return { ok: false, error: { code: "EBAY_API_ERROR", message } };
  }
}

export async function mockSearchProducts(
  delayMs: number = 500,
): Promise<SearchServiceResult> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          ok: true,
          result: {
            items: normalizeProducts(mockResponse.itemSummaries ?? []),
            total: 5,
            page: 1,
            limit: 20,
            hasMore: false,
            query: mockSearchFilters.query,
          },
        }),
      delayMs,
    );
  });
}
