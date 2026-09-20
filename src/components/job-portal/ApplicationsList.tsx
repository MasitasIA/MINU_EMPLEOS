"use client";

import { useState } from "react";
import { updateApplicationStatus } from "@/app/actions/applications";
import { CheckCircle2, XCircle, Clock, Loader2, Download, User, Briefcase } from "lucide-react";

export function ApplicationsList({ applications }: { applications: any[] }) {
  const [apps, setApps] = useState(applications);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: 'accepted' | 'rejected') => {
    setLoadingId(id);
    const result = await updateApplicationStatus(id, newStatus);
    
    if (result.success) {
      setApps(apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
    } else {
      alert("Error al actualizar el estado");
    }
    setLoadingId(null);
  };

  if (apps.length === 0) {
    return (
      <div className="radius-predefined bg-white p-12 text-center ring-1 ring-border border-dashed shadow-sm">
        <User className="mx-auto h-12 w-12 text-border mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">No hay postulantes</h3>
        <p className="text-foreground-muted">
          Tus ofertas de empleo aún no han recibido postulaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {apps.map((app) => (
        <div key={app.id} className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {app.profiles?.full_name}
                </h3>
                <p className="text-foreground-muted text-sm mt-1">
                  {app.profiles?.title || "Sin título especificado"}
                </p>
              </div>
              <div className="flex flex-col items-end">
                {app.status === 'pending' && <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 radius-predefined text-xs font-bold ring-1 ring-amber-200"><Clock className="w-3 h-3"/> Pendiente</span>}
                {app.status === 'accepted' && <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 radius-predefined text-xs font-bold ring-1 ring-green-200"><CheckCircle2 className="w-3 h-3"/> Aceptado</span>}
                {app.status === 'rejected' && <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 radius-predefined text-xs font-bold ring-1 ring-red-200"><XCircle className="w-3 h-3"/> Rechazado</span>}
              </div>
            </div>

            <div className="bg-surface-muted radius-predefined p-4 text-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-foreground-muted" />
                <span className="font-bold">Vacante:</span> {app.jobs?.name}
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4 text-foreground-muted" />
                <span className="font-bold">Fecha:</span> {new Date(app.created_at).toLocaleDateString()}
              </div>
            </div>

            {app.cover_letter && (
              <div className="text-sm text-foreground-muted italic border-l-2 border-primary/30 pl-4 py-2">
                "{app.cover_letter}"
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 lg:w-48 lg:border-l lg:border-border lg:pl-6 justify-center">
            {app.resume_url ? (
              <a 
                href={app.resume_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 radius-button bg-surface text-foreground font-bold border border-border py-2 px-4 hover:bg-surface-muted transition-colors"
              >
                <Download className="h-4 w-4" /> Ver CV
              </a>
            ) : (
              <span className="text-xs text-foreground-muted text-center">Sin CV adjunto</span>
            )}
            
            {app.status === 'pending' && (
              <div className="flex flex-col gap-2 mt-2">
                <button 
                  onClick={() => handleStatusChange(app.id, 'accepted')}
                  disabled={loadingId === app.id}
                  className="w-full flex items-center justify-center gap-2 radius-button bg-green-600 text-white font-bold py-2 px-4 hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loadingId === app.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle2 className="h-4 w-4"/>}
                  Aceptar
                </button>
                <button 
                  onClick={() => handleStatusChange(app.id, 'rejected')}
                  disabled={loadingId === app.id}
                  className="w-full flex items-center justify-center gap-2 radius-button bg-red-100 text-red-700 font-bold py-2 px-4 hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {loadingId === app.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4"/>}
                  Rechazar
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
