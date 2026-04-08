"use client";

import { SearchBar } from "@/components/search/SearchBar";

interface SearchHeaderSectionProps {
  query: string;
  isLoading: boolean;
  isMock: boolean;
  setQuery: (query: string) => void;
  reset: () => void;
}

export function SearchHeaderSection({
  query,
  isLoading,
  isMock,
  setQuery,
  reset,
}: SearchHeaderSectionProps) {
  return (
    <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md border-b border-ink-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <a href="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center shadow-sm group-hover:bg-amber transition-colors duration-200">
              <svg
                className="w-4 h-4 text-amber group-hover:text-ink transition-colors duration-200"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="font-display font-bold text-ink text-lg hidden sm:block">
              Searchly
            </span>
          </a>

          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              onClear={() => {
                reset();
                setQuery("");
              }}
              isLoading={isLoading}
              disabled={isMock}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
