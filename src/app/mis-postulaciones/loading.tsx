import { ArrowLeft } from "lucide-react";

export default function MisPostulacionesLoading() {
  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="mb-6">
          <div className="inline-flex items-center text-sm font-medium text-foreground-muted">
            <ArrowLeft className="mr-1 h-4 w-4" /> Volver a mi cuenta
          </div>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center radius-predefined bg-surface-muted border border-border"></div>
          <div>
            <div className="h-8 w-48 bg-surface-muted rounded mb-2"></div>
            <div className="h-4 w-64 bg-surface-muted rounded"></div>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="h-16 w-16 flex-shrink-0 radius-predefined bg-surface-muted"></div>
              
              <div className="flex-1">
                <div className="h-6 w-3/4 bg-surface-muted rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-surface-muted rounded"></div>
              </div>

              <div className="h-8 w-24 radius-predefined bg-surface-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
