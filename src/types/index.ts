/**
 * @spec Domain Types & Contracts
 * @description Spec-Driven Development — all domain types and API contracts
 * are defined here BEFORE any implementation. These act as the single source
 * of truth for both frontend and backend.
 *
 * Invariants:
 * - Product prices are always non-negative numbers
 * - Product IDs are always non-empty strings
 * - Search queries are always non-empty, trimmed strings
 * - Page numbers are always >= 1
 * - Limit is always between 1 and 100
 */

// ─── Domain Entities ──────────────────────────────────────────────────────────

export type ProductCondition = "NEW" | "USED" | "ALL";

export interface ProductPrice {
  readonly value: number;
  readonly currency: string;
}

export interface ProductImage {
  readonly url: string;
  readonly altText: string;
}

/** Normalized product — never expose raw eBay shape to the frontend */
export interface Product {
  readonly id: string;
  readonly title: string;
  readonly price: ProductPrice;
  readonly condition: ProductCondition;
  readonly image: ProductImage | null;
  readonly listingUrl: string;
  readonly seller: string | null;
  readonly location: string | null;
}

// ─── Search Contract ───────────────────────────────────────────────────────────

export interface SearchParams {
  readonly q: string; // non-empty, trimmed
  readonly page?: number; // >= 1, default 1
  readonly limit?: number; // 1–50, default 20
  readonly minPrice?: number; // >= 0
  readonly maxPrice?: number; // > minPrice if both set
  readonly condition?: ProductCondition | "ALL";
}

export interface SearchFilters {
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly condition?: ProductCondition | "ALL";
}

export interface SearchResult {
  readonly items: Product[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly hasMore: boolean;
  readonly query: string;
}

// ─── API Response Contract ─────────────────────────────────────────────────────

export type ApiSuccessResponse<T> = {
  readonly success: true;
  readonly data: T;
};

export type ApiErrorResponse = {
  readonly success: false;
  readonly error: {
    readonly code: ApiErrorCode;
    readonly message: string;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type SearchApiResponse = ApiResponse<SearchResult>;

// ─── Error Codes ──────────────────────────────────────────────────────────────

export type ApiErrorCode =
  | "INVALID_QUERY"
  | "EBAY_AUTH_FAILED"
  | "EBAY_API_ERROR"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

// ─── eBay Raw Types (internal — never exposed to frontend) ────────────────────

/** @internal Raw eBay OAuth token response */
export interface EbayTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
  readonly token_type: string;
}

/** @internal Raw eBay item summary from Browse API */
export interface EbayItemSummary {
  readonly itemId: string;
  readonly title: string;
  readonly price?: {
    readonly value: string;
    readonly currency: string;
  };
  readonly condition?: string;
  readonly image?: {
    readonly imageUrl: string;
  };
  readonly itemWebUrl: string;
  readonly seller?: {
    readonly username: string;
  };
  readonly itemLocation?: {
    readonly city?: string;
    readonly country?: string;
  };
}

/** @internal Raw eBay search response */
export interface EbaySearchResponse {
  readonly total?: number;
  readonly itemSummaries?: EbayItemSummary[];
}

// ─── Cache Contract ────────────────────────────────────────────────────────────

export interface CachedToken {
  readonly accessToken: string;
  readonly expiresAt: number; // unix timestamp ms
}
