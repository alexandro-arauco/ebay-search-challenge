/**
 * @hook useSearch
 * @description Manages search state: query, filters, pagination, loading, error.
 * Includes debounce to avoid unnecessary API calls.
 *
 * SOLID:
 * - SRP: only manages search UI state and fetching
 * - ISP: exposes only what the SearchPage needs
 */

"use client";

import { useMockApi } from "@/context/mock-api-context";
import { buildSearchQueryParams } from "@/lib/search/searchParams";
import type { ApiErrorCode, SearchFilters, SearchResult } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSearchState {
  query: string;
  filters: SearchFilters;
  result: SearchResult | null;
  isLoading: boolean;
  error: { code: ApiErrorCode; message: string } | null;
  page: number;
}

export interface UseSearchActions {
  setQuery: (q: string) => void;
  setFilters: (f: SearchFilters) => void;
  setPage: (p: number) => void;
  reset: () => void;
  retry: () => void;
}

const DEBOUNCE_MS = 400;
const DEFAULT_LIMIT = 20;

function mapNetworkError(): { code: ApiErrorCode; message: string } {
  return {
    code: "INTERNAL_ERROR",
    message: "Network error. Please try again.",
  };
}

export function useSearch(): UseSearchState & UseSearchActions {
  const [query, setQueryRaw] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UseSearchState["error"]>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const { isMock } = useMockApi();

  // Debounce query
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }

    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset page when query or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, filters]);

  // Fetch when debouncedQuery, filters, or page changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      abortRef.current?.abort();
      setIsLoading(false);
      setResult(null);
      setError(null);
      return;
    }

    // Cancel previous in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const params = buildSearchQueryParams({
      q: debouncedQuery,
      page,
      limit: DEFAULT_LIMIT,
      ...filters,
    });

    setIsLoading(true);
    setError(null);

    const urlSearch = isMock
      ? `/api/mock-search?${params}`
      : `/api/search?${params}`;

    fetch(urlSearch, { signal: abortRef.current.signal })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setResult(json.data);
        } else {
          setError(json.error);
          setResult(null);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(mapNetworkError());
        }
      })
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, filters, page, retryCount, isMock]);

  const setQuery = useCallback((q: string) => setQueryRaw(q), []);

  const retry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);

  const reset = useCallback(() => {
    setQueryRaw("");
    setDebouncedQuery("");
    setFilters({});
    setPage(1);
    setResult(null);
    setError(null);
    setRetryCount(0);
  }, []);

  return {
    query,
    filters,
    result,
    isLoading,
    error,
    page,
    setQuery,
    setFilters,
    setPage,
    reset,
    retry,
  };
}
