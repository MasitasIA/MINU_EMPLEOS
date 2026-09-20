export function JobCardSkeleton() {
  return (
    <div className="flex flex-col radius-predefined bg-white p-5 shadow-sm ring-1 ring-border animate-pulse">
      <div className="flex items-start gap-4">
        {/* Company Logo Skeleton */}
        <div className="shrink-0">
          <div className="h-12 w-12 radius-predefined bg-surface-muted border border-border"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Company Name Skeleton */}
          <div className="h-3 w-24 bg-surface-muted rounded mb-2"></div>
          {/* Job Title Skeleton */}
          <div className="h-5 w-3/4 bg-surface-muted rounded mb-3"></div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Tags Skeleton */}
            <div className="h-6 w-20 bg-surface-muted radius-predefined"></div>
            <div className="h-6 w-24 bg-surface-muted radius-predefined"></div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        {/* Salary Skeleton */}
        <div className="h-4 w-32 bg-surface-muted rounded"></div>
        {/* Link Skeleton */}
        <div className="h-4 w-20 bg-surface-muted rounded"></div>
      </div>
    </div>
  );
}
