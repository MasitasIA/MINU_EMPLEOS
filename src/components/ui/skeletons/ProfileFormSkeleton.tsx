export function ProfileFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name & Phone */}
        <div>
          <div className="mb-1 h-4 w-32 bg-surface-muted rounded"></div>
          <div className="h-10 w-full radius-predefined bg-surface-muted border border-border"></div>
        </div>
        <div>
          <div className="mb-1 h-4 w-20 bg-surface-muted rounded"></div>
          <div className="h-10 w-full radius-predefined bg-surface-muted border border-border"></div>
        </div>

        {/* Title */}
        <div className="sm:col-span-2">
          <div className="mb-1 h-4 w-48 bg-surface-muted rounded"></div>
          <div className="h-10 w-full radius-predefined bg-surface-muted border border-border"></div>
        </div>

        {/* Bio */}
        <div className="sm:col-span-2">
          <div className="mb-1 h-4 w-32 bg-surface-muted rounded"></div>
          <div className="h-24 w-full radius-predefined bg-surface-muted border border-border"></div>
        </div>

        {/* Resume */}
        <div className="sm:col-span-2 p-6 border border-border border-dashed radius-predefined bg-surface-muted flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="w-full">
            <div className="h-5 w-40 bg-surface-muted rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-surface-muted rounded"></div>
          </div>
          <div className="h-10 w-32 radius-button bg-surface-muted shrink-0"></div>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <div className="h-10 w-40 radius-button bg-surface-muted"></div>
      </div>
    </div>
  );
}
