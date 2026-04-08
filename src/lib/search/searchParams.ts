import type { SearchParams } from "@/types";

type RawSearchParamInput = {
  q: string;
  page?: string;
  limit?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
};

export function getRawSearchParamInput(
  searchParams: URLSearchParams,
): RawSearchParamInput {
  return {
    q: searchParams.get("q") ?? "",
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    condition: searchParams.get("condition") ?? undefined,
  };
}

export function buildSearchQueryParams(params: SearchParams): URLSearchParams {
  const queryParams = new URLSearchParams({
    q: params.q,
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });

  if (params.minPrice !== undefined) {
    queryParams.set("minPrice", String(params.minPrice));
  }
  if (params.maxPrice !== undefined) {
    queryParams.set("maxPrice", String(params.maxPrice));
  }
  if (params.condition && params.condition !== "ALL") {
    queryParams.set("condition", params.condition);
  }

  return queryParams;
}
