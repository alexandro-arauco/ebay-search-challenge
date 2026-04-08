"use client";

import { useEffect, useState } from "react";
import type { ProductCondition, SearchFilters } from "@/types";

const CONDITIONS: { label: string; value: ProductCondition | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Used", value: "USED" },
];

interface FilterBarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [minInput, setMinInput] = useState(filters.minPrice?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(filters.maxPrice?.toString() ?? "");

  useEffect(() => {
    setMinInput(filters.minPrice?.toString() ?? "");
    setMaxInput(filters.maxPrice?.toString() ?? "");
  }, [filters.minPrice, filters.maxPrice]);

  const applyPrice = () => {
    const min = minInput ? parseFloat(minInput) : undefined;
    const max = maxInput ? parseFloat(maxInput) : undefined;
    onChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const selectedCondition = filters.condition ?? "ALL";

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm font-body">
      {/* Condition pills */}
      <div className="flex items-center gap-1.5 bg-surface-card border border-ink-100 rounded-xl p-1">
        {CONDITIONS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onChange({ ...filters, condition: value })}
            className={`
              px-3 py-1.5 rounded-lg font-medium transition-all duration-150
              ${
                selectedCondition === value
                  ? "bg-ink text-surface shadow-sm"
                  : "text-ink-400 hover:text-ink hover:bg-ink-50"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Price range */}
      <div className="flex items-center gap-2 bg-surface-card border border-ink-100 rounded-xl px-3 py-1.5">
        <span className="text-ink-300 text-xs font-medium uppercase tracking-wide">
          $
        </span>
        <input
          type="number"
          placeholder="Min"
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          onBlur={applyPrice}
          onKeyDown={(e) => e.key === "Enter" && applyPrice()}
          className="w-16 bg-transparent text-ink placeholder:text-ink-200 focus:outline-none text-sm"
          min={0}
        />
        <span className="text-ink-200">—</span>
        <input
          type="number"
          placeholder="Max"
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          onBlur={applyPrice}
          onKeyDown={(e) => e.key === "Enter" && applyPrice()}
          className="w-16 bg-transparent text-ink placeholder:text-ink-200 focus:outline-none text-sm"
          min={0}
        />
      </div>

      {/* Active filter badges */}
      {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
        <button
          onClick={() => {
            setMinInput("");
            setMaxInput("");
            onChange({ ...filters, minPrice: undefined, maxPrice: undefined });
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-amber/10 text-amber-dark rounded-lg text-xs font-medium hover:bg-amber/20 transition-colors"
        >
          <span>
            {filters.minPrice !== undefined && filters.maxPrice !== undefined
              ? `$${filters.minPrice} – $${filters.maxPrice}`
              : filters.minPrice !== undefined
                ? `≥ $${filters.minPrice}`
                : `≤ $${filters.maxPrice}`}
          </span>
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
