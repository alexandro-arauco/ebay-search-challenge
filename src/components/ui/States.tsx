import type { ApiErrorCode } from "@/types";

const ERROR_MESSAGES: Record<
  ApiErrorCode,
  { title: string; description: string }
> = {
  INVALID_QUERY: {
    title: "Invalid search",
    description: "Please enter a product name or keyword to continue.",
  },
  EBAY_AUTH_FAILED: {
    title: "Connection issue",
    description:
      "We could not connect right now. Please try again in a moment.",
  },
  EBAY_API_ERROR: {
    title: "Service unavailable",
    description:
      "The service is temporarily unavailable. Please try again shortly.",
  },
  RATE_LIMITED: {
    title: "Too many requests",
    description: "You have made several searches. Please wait a few seconds and try again.",
  },
  INTERNAL_ERROR: {
    title: "Something went wrong",
    description: "Something did not work as expected. Please try again.",
  },
};

interface ErrorStateProps {
  code: ApiErrorCode;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ code, onRetry }: ErrorStateProps) {
  const info = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.INTERNAL_ERROR;

  return (
    <div className="flex items-center justify-center py-20 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-red-100 bg-surface-card/95 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)] px-6 py-7">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div className="text-center max-w-sm">
            <h3 className="font-display text-lg font-semibold text-ink">
              We couldn't load your results
            </h3>
            <p className="mt-1 text-sm text-ink-400">
              {info.description}
            </p>
            <p className="mt-2 text-xs text-ink-300">
              You can try again now, or adjust your search and try once more.
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 px-5 py-2 bg-ink text-surface rounded-xl text-sm font-medium hover:bg-ink-700 transition-colors shadow-sm"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-ink-50 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-ink-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="font-display text-lg font-semibold text-ink">
          No results found
        </h3>
        <p className="mt-1 text-sm text-ink-400 max-w-xs">
          No listings matched{" "}
          <span className="font-medium text-ink">&ldquo;{query}&rdquo;</span>.
          Try different keywords or adjust your filters.
        </p>
      </div>
    </div>
  );
}

export function IdleState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 animate-fade-in">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-amber/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-amber"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-card border-2 border-ink/5 flex items-center justify-center">
          <span className="text-xs">✦</span>
        </div>
      </div>
      <div className="text-center mt-2">
        <h2 className="font-display text-xl font-semibold text-ink">
          Find anything on eBay
        </h2>
        <p className="mt-1.5 text-sm text-ink-300">
          Search millions of listings — type a keyword to begin.
        </p>
      </div>
    </div>
  );
}
