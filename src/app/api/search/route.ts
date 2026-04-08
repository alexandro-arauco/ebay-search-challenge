/**
 * @route GET /api/search
 * @description Backend search endpoint. Validates params, delegates to
 * SearchService, and returns a normalized ApiResponse.
 *
 * Client IDs and Secrets NEVER reach the frontend — this route is the
 * only entry point and all eBay credentials live in process.env (server-only).
 */

import { NextRequest, NextResponse } from "next/server";
import type { SearchApiResponse } from "@/types";
import { validateSearchParams } from "@/specs/searchParams.spec";
import { searchProducts } from "@/lib/ebay/searchService";
import { getRawSearchParamInput } from "@/lib/search/searchParams";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SearchApiResponse>> {
  const { searchParams } = request.nextUrl;

  // Validate & normalize params per spec contract
  const validation = validateSearchParams(getRawSearchParamInput(searchParams));

  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 },
    );
  }

  const serviceResult = await searchProducts(validation.params);

  if (!serviceResult.ok) {
    const status = serviceResult.error.code === "EBAY_AUTH_FAILED" ? 502 : 500;
    return NextResponse.json(
      { success: false, error: serviceResult.error },
      { status },
    );
  }

  return NextResponse.json({ success: true, data: serviceResult.result });
}
