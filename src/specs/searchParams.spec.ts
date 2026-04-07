/**
 * @spec Search Parameter Validation
 * @description Pure validation functions for SearchParams invariants.
 * These define the CONTRACT for valid inputs — tested independently.
 */

import type { SearchParams, ApiErrorCode, ProductCondition } from "@/types";

export interface ValidationError {
  readonly code: ApiErrorCode;
  readonly message: string;
}

export type ValidationResult =
  | {
      valid: true;
      params: Required<Pick<SearchParams, "q" | "page" | "limit">> &
        SearchParams;
    }
  | { valid: false; error: ValidationError };

/**
 * Validates and normalizes search params.
 * Returns normalized params with defaults applied, or a structured error.
 */
export function validateSearchParams(raw: unknown): ValidationResult {
  if (typeof raw !== "object" || raw === null) {
    return {
      valid: false,
      error: { code: "INVALID_QUERY", message: "Invalid request" },
    };
  }

  const params = raw as Record<string, unknown>;

  // q is required, non-empty string
  const q = typeof params.q === "string" ? params.q.trim() : "";
  if (!q) {
    return {
      valid: false,
      error: {
        code: "INVALID_QUERY",
        message: "Search query (q) is required and must be non-empty",
      },
    };
  }

  // page defaults to 1, must be >= 1
  const rawPage = params.page !== undefined ? Number(params.page) : 1;
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  // limit defaults to 20, clamped to [1, 50]
  const rawLimit = params.limit !== undefined ? Number(params.limit) : 20;
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(50, Math.floor(rawLimit)))
    : 20;

  // optional price range
  const minPrice =
    params.minPrice !== undefined ? Number(params.minPrice) : undefined;
  const maxPrice =
    params.maxPrice !== undefined ? Number(params.maxPrice) : undefined;

  if (minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) {
    return {
      valid: false,
      error: {
        code: "INVALID_QUERY",
        message: "minPrice must be a non-negative number",
      },
    };
  }

  if (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) {
    return {
      valid: false,
      error: {
        code: "INVALID_QUERY",
        message: "maxPrice must be a non-negative number",
      },
    };
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    maxPrice <= minPrice
  ) {
    return {
      valid: false,
      error: {
        code: "INVALID_QUERY",
        message: "maxPrice must be greater than minPrice",
      },
    };
  }

  const validConditions = new Set(["ALL", "NEW", "USED"]);
  const rawCondition =
    typeof params.condition === "string"
      ? params.condition.toUpperCase()
      : undefined;

  const condition =
    rawCondition && validConditions.has(rawCondition)
      ? (rawCondition as "ALL" | ProductCondition)
      : undefined;

  return {
    valid: true,
    params: {
      q,
      page,
      limit,
      ...(minPrice !== undefined && { minPrice }),
      ...(maxPrice !== undefined && { maxPrice }),
      ...(condition !== undefined && { condition }),
    },
  };
}
