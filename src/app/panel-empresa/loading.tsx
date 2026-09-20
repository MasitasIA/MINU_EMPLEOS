import { Loader2 } from "lucide-react";

export default function CompanyPanelLoading() {
  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-10 w-64 bg-border rounded mb-2"></div>
            <div className="h-4 w-40 bg-border rounded"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-24 bg-border radius-button"></div>
            <div className="h-10 w-36 bg-border radius-button"></div>
          </div>
        </div>

        {/* Stats Skeletons */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
          <div className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border">
            <div className="h-5 w-32 bg-surface-muted rounded mb-4"></div>
            <div className="h-8 w-12 bg-surface-muted rounded"></div>
          </div>
          <div className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border">
            <div className="h-5 w-48 bg-surface-muted rounded mb-4"></div>
            <div className="h-8 w-12 bg-surface-muted rounded"></div>
          </div>
        </div>

        {/* List Skeleton */}
        <div className="radius-predefined bg-white shadow-sm ring-1 ring-border overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <div className="h-6 w-48 bg-surface-muted rounded"></div>
          </div>
          <div className="p-6 space-y-4">
            <div className="h-20 w-full bg-surface-muted radius-predefined"></div>
            <div className="h-20 w-full bg-surface-muted radius-predefined"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
