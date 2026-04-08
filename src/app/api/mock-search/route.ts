import { SearchApiResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { mockSearchProducts } from "@/lib/ebay/searchService";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SearchApiResponse>> {
  const serviceResult = await mockSearchProducts();

  if (!serviceResult.ok) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Mocking request failed.",
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: serviceResult.result });
}
