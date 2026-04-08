"use client";

import type { SearchFilters } from "@/types";
import { FilterBar } from "@/components/search/FilterBar";

interface SearchFiltersSectionProps {
  isMock: boolean;
  hasQuery: boolean;
  filters: SearchFilters;
  toggleMock: () => void;
  setFilters: (filters: SearchFilters) => void;
}

export function SearchFiltersSection({
  isMock,
  hasQuery,
  filters,
  toggleMock,
  setFilters,
}: SearchFiltersSectionProps) {
  return (
    <div className="border-b border-ink-100/50 bg-surface/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex space-x-5">
          <button
            className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 ${isMock ? "bg-ink text-surface" : "bg-red-200 text-ink"}`}
            onClick={toggleMock}
          >
            {`Mock Request: ${isMock ? "ON" : "OFF"}`}
          </button>
          {hasQuery && <FilterBar filters={filters} onChange={setFilters} />}
        </div>
      </div>
    </div>
  );
}
