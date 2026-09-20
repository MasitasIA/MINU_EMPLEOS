import { ProfileFormSkeleton } from "@/components/ui/skeletons/ProfileFormSkeleton";

export default function MiCuentaLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-10 w-64 bg-surface-muted rounded animate-pulse"></div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Panel lateral */}
        <div className="space-y-4 animate-pulse">
          <div className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border">
            <div className="flex items-center gap-4 border-b border-border pb-4 mb-4">
              <div className="h-12 w-12 radius-predefined bg-surface-muted"></div>
              <div>
                <div className="h-5 w-32 bg-surface-muted rounded mb-2"></div>
                <div className="h-4 w-40 bg-surface-muted rounded"></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-4">
              <div className="h-10 w-full radius-button bg-surface-muted"></div>
              <div className="h-10 w-full radius-button bg-surface-muted"></div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="md:col-span-2 space-y-6">
          <div className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border">
            <div className="mb-6 h-6 w-48 bg-surface-muted rounded animate-pulse"></div>
            <ProfileFormSkeleton />
          </div>

          <div className="radius-predefined border border-border bg-white p-6 shadow-sm animate-pulse">
            <div className="mb-2 h-6 w-40 bg-surface-muted rounded"></div>
            <div className="mb-4 h-10 w-full bg-surface-muted rounded"></div>
            <div className="h-10 w-48 radius-button bg-surface-muted"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
