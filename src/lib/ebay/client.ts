/**
 * @module EbayBrowseClient
 * @description HTTP client for the eBay Browse API item_summary/search endpoint.
 * Handles token injection, retries on 401, and raw response parsing.
 *
 * SOLID:
 * - SRP: only responsible for HTTP communication with eBay Browse API
 * - DIP: depends on auth abstraction (getEbayAccessToken), not concrete impl
 * - ISP: exposes only the searchItems method this app needs
 */

import type { EbaySearchResponse, SearchParams } from "@/types";
import { getEbayAccessToken, invalidateToken } from "./auth";

function getEbayBrowseBaseUrl(environment: string): string {
  return environment === "production"
    ? "https://api.ebay.com/buy/browse/v1"
    : "https://api.sandbox.ebay.com/buy/browse/v1";
}

function buildSearchUrl(params: SearchParams, environment: string): string {
  const base = getEbayBrowseBaseUrl(environment);
  const offset = ((params.page ?? 1) - 1) * (params.limit ?? 20);
  const limit = params.limit ?? 20;

  const url = new URL(`${base}/item_summary/search`);
  url.searchParams.set("q", params.q);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));

  const filters: string[] = [];

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    const min = params.minPrice;
    const max = params.maxPrice;

    if (min !== undefined && max !== undefined) {
      filters.push(`price:[${min}..${max}]`);
    } else if (min !== undefined) {
      filters.push(`price:[${min}]`);
    } else if (max !== undefined) {
      filters.push(`price:[..${max}]`);
    }

    filters.push("priceCurrency:USD");
  }

  if (params.condition && params.condition !== "ALL") {
    filters.push(`conditions:{${params.condition}}`);
  }

  if (filters.length > 0) {
    url.searchParams.set("filter", filters.join(","));
  }

  return url.toString();
}

/**
 * Calls the eBay Browse API search endpoint.
 * Automatically refreshes the token once on 401 before failing.
 *
 * @throws Error if eBay API returns non-2xx after token refresh
 */
export async function searchEbayItems(
  params: SearchParams,
): Promise<EbaySearchResponse> {
  const environment = process.env.EBAY_ENVIRONMENT ?? "sandbox";
  const url = buildSearchUrl(params, environment);

  const executeRequest = async (): Promise<Response> => {
    const token = await getEbayAccessToken();

    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      },
      next: { revalidate: 60 }, // Next.js fetch cache: 60s
    });
  };

  let response = await executeRequest();

  // Token expired mid-session — invalidate and retry once
  if (response.status === 401) {
    invalidateToken();
    response = await executeRequest();
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`eBay Browse API error (${response.status}): ${text}`);
  }

  return response.json() as Promise<EbaySearchResponse>;
}
