"use client";

import { useSearch } from "./useSearch";
import { SearchBar } from "@/components/search/SearchBar";
import { FilterBar } from "@/components/search/FilterBar";
import { ProductGrid } from "@/components/search/ProductGrid";
import { ResultsHeader } from "@/components/search/ResultsHeader";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState, EmptyState, IdleState } from "@/components/ui/States";

export default function SearchPage() {
  const { query, filters, result, isLoading, error, page, setQuery, setFilters, setPage, reset, retry } =
    useSearch();

  const hasQuery = query.trim().length > 0;
  const hasResults = result && result.items.length > 0;
  const isEmpty = result && result.items.length === 0;

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-ink-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center shadow-sm group-hover:bg-amber transition-colors duration-200">
                <svg className="w-4 h-4 text-amber group-hover:text-ink transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-display font-bold text-ink text-lg hidden sm:block">Searchly</span>
            </a>

            {/* Search bar */}
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={setQuery}
                onClear={reset}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filters — only when there's a query */}
      {hasQuery && (
        <div className="border-b border-ink-100/50 bg-surface/70 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <FilterBar filters={filters} onChange={setFilters} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Idle state */}
        {!hasQuery && <IdleState />}

        {/* Loading state */}
        {hasQuery && isLoading && !result && (
          <SkeletonGrid count={10} />
        )}

        {/* Error state */}
        {!isLoading && error && (
          <ErrorState code={error.code} message={error.message} onRetry={retry} />
        )}

        {/* Empty state */}
        {!isLoading && isEmpty && !error && (
          <EmptyState query={result!.query} />
        )}

        {/* Results */}
        {hasResults && !error && (
          <div className="space-y-5">
            <ResultsHeader
              total={result!.total}
              query={result!.query}
              page={result!.page}
              limit={result!.limit}
            />

            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-surface/60 backdrop-blur-[1px] z-10 rounded-2xl" />
              )}
              <ProductGrid products={result!.items} />
            </div>

            <div className="pt-4">
              <Pagination
                page={result!.page}
                total={result!.total}
                limit={result!.limit}
                hasMore={result!.hasMore}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
