"use client";

import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format/price";

const CONDITION_LABELS: Record<string, { label: string; classes: string }> = {
  NEW: {
    label: "New",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  USED: { label: "Used", classes: "bg-ink-50 text-ink-500 border-ink-100" },
  ALL: { label: "All", classes: "bg-ink-50 text-ink-300 border-ink-100" },
};

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const condition = CONDITION_LABELS[product.condition];

  const formattedPrice = formatPrice(product.price.value, product.price.currency);

  return (
    <a
      href={product.listingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block animate-fade-up"
      style={{
        animationDelay: `${Math.min(index * 40, 400)}ms`,
        animationFillMode: "both",
        opacity: 0,
      }}
    >
      <article
        className="
        h-full flex flex-col
        bg-surface-card border border-ink-100
        rounded-2xl overflow-hidden
        shadow-sm
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-250 ease-out
        hover:border-amber/40
      "
      >
        {/* Image */}
        <div className="relative aspect-square bg-ink-50 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.altText}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-ink-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Condition badge */}
          <span
            className={`
            absolute top-2.5 left-2.5
            px-2 py-0.5 rounded-md text-xs font-medium border
            ${condition.classes}
          `}
          >
            {condition.label}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <h3 className="font-body text-sm text-ink leading-snug line-clamp-2 group-hover:text-amber-dark transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <span className="font-display text-lg font-bold text-ink leading-none">
              {formattedPrice}
            </span>

            {product.location && (
              <span
                className="text-xs text-ink-300 truncate max-w-[100px]"
                title={product.location}
              >
                {product.location}
              </span>
            )}
          </div>

          {product.seller && (
            <p className="text-xs text-ink-300 truncate">
              by <span className="text-ink-400">{product.seller}</span>
            </p>
          )}
        </div>

        {/* Bottom CTA strip */}
        <div className="px-4 py-2.5 border-t border-ink-50 bg-ink-50/50 flex items-center justify-between">
          <span className="text-xs text-ink-300 font-medium">View on eBay</span>
          <svg
            className="w-3.5 h-3.5 text-amber group-hover:translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </article>
    </a>
  );
}
