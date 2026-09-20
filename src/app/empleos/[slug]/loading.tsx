export default function JobDetailLoading() {
  return (
    <div className="bg-surface-muted min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Breadcrumbs */}
        <div className="mb-6 h-4 w-48 bg-surface-muted rounded"></div>

        <div className="radius-predefined bg-white shadow-sm ring-1 ring-border overflow-hidden">
          {/* Header */}
          <div className="border-b border-border p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 radius-predefined bg-surface-muted"></div>
                <div>
                  <div className="h-4 w-32 bg-surface-muted rounded mb-2"></div>
                  <div className="h-8 w-64 bg-surface-muted rounded"></div>
                </div>
              </div>
              <div className="h-12 w-32 radius-button bg-surface-muted shrink-0"></div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="h-8 w-24 radius-predefined bg-surface-muted"></div>
              <div className="h-8 w-32 radius-predefined bg-surface-muted"></div>
              <div className="h-8 w-28 radius-predefined bg-surface-muted"></div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="md:col-span-2 p-6 sm:p-10 space-y-8">
              <div>
                <div className="h-6 w-48 bg-surface-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-surface-muted rounded"></div>
                  <div className="h-4 w-full bg-surface-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-surface-muted rounded"></div>
                </div>
              </div>
              
              <div>
                <div className="h-6 w-40 bg-surface-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-surface-muted rounded"></div>
                  <div className="h-4 w-full bg-surface-muted rounded"></div>
                  <div className="h-4 w-5/6 bg-surface-muted rounded"></div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 bg-surface-muted/30">
              <div className="h-6 w-32 bg-surface-muted rounded mb-6"></div>
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="h-5 w-5 bg-surface-muted rounded"></div>
                    <div>
                      <div className="h-3 w-20 bg-surface-muted rounded mb-2"></div>
                      <div className="h-4 w-32 bg-surface-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
