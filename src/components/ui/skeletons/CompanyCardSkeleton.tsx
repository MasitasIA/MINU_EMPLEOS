export function CompanyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden radius-predefined bg-white shadow-sm ring-1 ring-border animate-pulse">
      {/* Cover Skeleton */}
      <div className="h-24 w-full bg-surface-muted radius-t-predefined"></div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        {/* Logo Skeleton */}
        <div className="relative -mt-10 mb-3 h-20 w-20 shrink-0 rounded-full border-4 border-white bg-surface-muted"></div>

        {/* Title Skeleton */}
        <div className="mb-2 h-6 w-3/4 bg-surface-muted rounded"></div>

        {/* Description Skeleton */}
        <div className="mb-4 mt-2 flex-1 space-y-2">
          <div className="h-4 w-full bg-surface-muted rounded"></div>
          <div className="h-4 w-5/6 bg-surface-muted rounded"></div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          {/* Link Skeleton */}
          <div className="h-4 w-32 bg-surface-muted rounded"></div>
        </div>
      </div>
    </div>
  );
}
