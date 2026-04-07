"use client";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, total, limit, hasMore, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const windowStart = Math.max(1, page - 2);
  const windowEnd = Math.min(totalPages, page + 2);

  const pages = Array.from(
    { length: windowEnd - windowStart + 1 },
    (_, i) => windowStart + i
  );

  return (
    <nav className="flex items-center justify-center gap-1.5 animate-fade-in" aria-label="Pagination">
      <PaginationButton
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </PaginationButton>

      {windowStart > 1 && (
        <>
          <PaginationButton onClick={() => onPageChange(1)}>1</PaginationButton>
          {windowStart > 2 && <span className="px-1 text-ink-300 text-sm">…</span>}
        </>
      )}

      {pages.map((p) => (
        <PaginationButton
          key={p}
          onClick={() => onPageChange(p)}
          isActive={p === page}
        >
          {p}
        </PaginationButton>
      ))}

      {windowEnd < totalPages && (
        <>
          {windowEnd < totalPages - 1 && <span className="px-1 text-ink-300 text-sm">…</span>}
          <PaginationButton onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationButton>
        </>
      )}

      <PaginationButton
        onClick={() => onPageChange(page + 1)}
        disabled={!hasMore}
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </PaginationButton>
    </nav>
  );
}

interface PaginationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}

function PaginationButton({ onClick, disabled, isActive, children, "aria-label": ariaLabel }: PaginationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={isActive ? "page" : undefined}
      className={`
        min-w-[36px] h-9 px-2.5 rounded-xl text-sm font-medium
        flex items-center justify-center
        transition-all duration-150 border
        ${isActive
          ? "bg-ink text-surface border-ink shadow-sm"
          : disabled
          ? "text-ink-200 border-transparent cursor-not-allowed"
          : "text-ink-400 border-ink-100 hover:border-ink-300 hover:text-ink hover:bg-surface-card"
        }
      `}
    >
      {children}
    </button>
  );
}
