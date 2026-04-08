"use client";

import { mockSearchFilters } from "@/__mocks__/search/search-filters.mock";
import { SearchContentSection } from "@/components/search/SearchContentSection";
import { SearchFiltersSection } from "@/components/search/SearchFiltersSection";
import { SearchHeaderSection } from "@/components/search/SearchHeaderSection";
import { useMockApi } from "@/context/mock-api-context";
import { useEffect } from "react";
import { useSearch } from "./useSearch";

export default function SearchPage() {
  const {
    query,
    filters,
    result,
    isLoading,
    error,
    setQuery,
    setFilters,
    setPage,
    reset,
    retry,
  } = useSearch();

  const { isMock, toggle } = useMockApi();

  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    setQuery("");
    reset();

    if (isMock) {
      setQuery(mockSearchFilters.query);
      setFilters({
        minPrice: mockSearchFilters.minPrice,
        maxPrice: mockSearchFilters.maxPrice,
        condition: mockSearchFilters.conditions,
      });
    }
  }, [isMock]);

  return (
    <main className="min-h-screen bg-surface">
      <SearchHeaderSection
        query={query}
        isLoading={isLoading}
        isMock={isMock}
        setQuery={setQuery}
        reset={reset}
      />

      <SearchFiltersSection
        isMock={isMock}
        hasQuery={hasQuery}
        filters={filters}
        toggleMock={toggle}
        setFilters={setFilters}
      />

      <SearchContentSection
        hasQuery={hasQuery}
        isLoading={isLoading}
        error={error}
        result={result}
        retry={retry}
        setPage={setPage}
      />
    </main>
  );
}
