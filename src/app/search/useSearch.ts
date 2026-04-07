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

import { useState, useEffect, useCallback, useRef } from "react";
import type { SearchResult, ProductCondition, ApiErrorCode } from "@/types";

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition | "ALL";
}

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
}

const DEBOUNCE_MS = 400;
const DEFAULT_LIMIT = 20;

export function useSearch(): UseSearchState & UseSearchActions {
  const [query, setQueryRaw] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UseSearchState["error"]>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Debounce query
  useEffect(() => {
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
      setResult(null);
      setError(null);
      return;
    }

    // Cancel previous in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const params = new URLSearchParams({ q: debouncedQuery, page: String(page), limit: String(DEFAULT_LIMIT) });
    if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
    if (filters.condition && filters.condition !== "ALL") params.set("condition", filters.condition);

    setIsLoading(true);
    setError(null);

    fetch(`/api/search?${params}`, { signal: abortRef.current.signal })
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
          setError({ code: "INTERNAL_ERROR", message: "Network error. Please try again." });
        }
      })
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filters, page]);

  const setQuery = useCallback((q: string) => setQueryRaw(q), []);

  const reset = useCallback(() => {
    setQueryRaw("");
    setDebouncedQuery("");
    setFilters({});
    setPage(1);
    setResult(null);
    setError(null);
  }, []);

  return { query, filters, result, isLoading, error, page, setQuery, setFilters, setPage, reset };
}
