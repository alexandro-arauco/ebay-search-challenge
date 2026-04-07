interface ResultsHeaderProps {
  total: number;
  query: string;
  page: number;
  limit: number;
}

export function ResultsHeader({ total, query, page, limit }: ResultsHeaderProps) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-baseline gap-2 animate-fade-in">
      <span className="font-display text-sm font-semibold text-ink">
        {total.toLocaleString()} results
      </span>
      <span className="text-sm text-ink-300">
        for <span className="font-medium text-ink-500">&ldquo;{query}&rdquo;</span>
      </span>
      {total > limit && (
        <span className="ml-auto text-xs text-ink-300">
          {from}–{to} of {total.toLocaleString()}
        </span>
      )}
    </div>
  );
}
