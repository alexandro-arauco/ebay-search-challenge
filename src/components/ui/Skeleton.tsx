export function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-ink-100 bg-surface-card animate-pulse">
      <div className="aspect-square bg-ink-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-ink-100 rounded-full w-full" />
        <div className="h-3 bg-ink-100 rounded-full w-3/4" />
        <div className="h-5 bg-ink-100 rounded-full w-1/3 mt-4" />
      </div>
      <div className="h-9 bg-ink-50 border-t border-ink-50" />
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 10 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
