"use client";

import type { ApiErrorCode, SearchResult } from "@/types";
import { ProductGrid } from "@/components/search/ProductGrid";
import { ResultsHeader } from "@/components/search/ResultsHeader";
import { Pagination } from "@/components/ui/Pagination";
import { SkeletonGrid } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState, IdleState } from "@/components/ui/States";

interface SearchContentSectionProps {
  hasQuery: boolean;
  isLoading: boolean;
  error: { code: ApiErrorCode; message: string } | null;
  result: SearchResult | null;
  retry: () => void;
  setPage: (page: number) => void;
}

export function SearchContentSection({
  hasQuery,
  isLoading,
  error,
  result,
  retry,
  setPage,
}: SearchContentSectionProps) {
  const hasResults = Boolean(result && result.items.length > 0);
  const isEmpty = Boolean(result && result.items.length === 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!hasQuery && <IdleState />}
      {hasQuery && isLoading && !result && <SkeletonGrid count={10} />}

      {!isLoading && error && (
        <ErrorState code={error.code} message={error.message} onRetry={retry} />
      )}

      {!isLoading && isEmpty && !error && <EmptyState query={result!.query} />}

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
              onPageChange={(page) => {
                setPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
