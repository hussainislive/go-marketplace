export function AdCardSkeleton() {
  return (
    <div className="bg-background-card rounded-card shadow-card overflow-hidden">
      <div className="aspect-[16/9] bg-border-divider animate-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="h-5 w-24 bg-border-divider rounded animate-pulse" />
        <div className="h-4 w-full bg-border-divider rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-border-divider rounded animate-pulse" />
      </div>
    </div>
  )
}

export function AdGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <AdCardSkeleton key={i} />
      ))}
    </div>
  )
}
