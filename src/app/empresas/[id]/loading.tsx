export default function CompanyDetailLoading() {
  return (
    <div className="bg-surface-muted min-h-screen pb-12 animate-pulse">
      {/* Cover Skeleton */}
      <div className="h-64 w-full bg-surface-muted border-b border-border"></div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-24 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Logo Skeleton */}
            <div className="h-32 w-32 shrink-0 rounded-full border-4 border-white bg-surface-muted"></div>
            
            <div className="mb-2">
              <div className="h-8 w-64 bg-surface-muted rounded mb-2"></div>
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-surface-muted radius-predefined"></div>
                <div className="h-6 w-24 bg-surface-muted radius-predefined"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* About Skeleton */}
            <div className="radius-predefined bg-white shadow-sm ring-1 ring-border p-6 sm:p-8">
              <div className="h-6 w-40 bg-surface-muted rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-surface-muted rounded"></div>
                <div className="h-4 w-full bg-surface-muted rounded"></div>
                <div className="h-4 w-3/4 bg-surface-muted rounded"></div>
              </div>
            </div>

            {/* Jobs Skeleton */}
            <div className="space-y-4">
              <div className="h-8 w-48 bg-surface-muted rounded mb-4"></div>
              {[1, 2].map(i => (
                <div key={i} className="h-32 w-full radius-predefined bg-white shadow-sm ring-1 ring-border"></div>
              ))}
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div className="space-y-6">
            <div className="radius-predefined bg-white shadow-sm ring-1 ring-border p-6">
              <div className="h-6 w-32 bg-surface-muted rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-10 w-full radius-button bg-surface-muted"></div>
                <div className="h-10 w-full radius-button bg-surface-muted"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
