"use client";

import { useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function SearchBar({ value, onChange, onClear, isLoading }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search icon */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
        {isLoading ? (
          <svg
            className="w-5 h-5 text-amber animate-spin-slow"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search eBay listings…"
        className="
          w-full h-14 pl-14 pr-14
          bg-surface-card border-2 border-ink-100
          rounded-2xl text-ink font-body text-base
          placeholder:text-ink-300
          focus:outline-none focus:border-amber
          transition-all duration-200
          shadow-sm hover:shadow-md focus:shadow-lg
        "
        autoComplete="off"
        spellCheck={false}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-ink-100 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
