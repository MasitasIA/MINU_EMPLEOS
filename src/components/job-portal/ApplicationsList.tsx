"use client";

import { useState } from "react";
import {
  User,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { updateApplicationStatus } from "@/app/actions/applications";
import { ResumeViewerModal } from "./ResumeViewerModal";

interface Application {
  id: string;
  created_at: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  cover_letter: string | null;
  profiles: {
    full_name: string;
    title: string | null;
    resume_url: string | null;
    phone?: string | null;
    bio?: string | null;
  };
}

interface ApplicationsListProps {
  jobId: string;
  jobName: string;
  initialApplications: Application[];
}

export function ApplicationsList({
  jobId,
  jobName,
  initialApplications,
}: ApplicationsListProps) {
  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [selectedResume, setSelectedResume] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [loadingAppId, setLoadingAppId] = useState<string | null>(null);

  const handleStatusChange = async (
    appId: string,
    newStatus: "accepted" | "rejected" | "pending" | "reviewed",
  ) => {
    setLoadingAppId(appId);
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      if (res.success) {
        setApplications((apps) =>
          apps.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
        );
      } else {
        alert("Ocurrió un error al actualizar el estado");
      }
    } catch (e) {
      alert("Error inesperado al cambiar el estado");
    } finally {
      setLoadingAppId(null);
    }
  };

  const handleViewResume = async (
    filePath: string,
    candidateName: string,
    appId: string,
    currentStatus: string,
  ) => {
    setLoadingAppId(`resume-${filePath}`);
    try {
      const { getResumeSignedUrl } = await import("@/app/actions/auth");
      const res = await getResumeSignedUrl(filePath);

      if (res.success && res.url) {
        setSelectedResume({ url: res.url, name: candidateName });

        if (currentStatus === "pending") {
          const updateRes = await updateApplicationStatus(appId, "reviewed");
          if (updateRes.success) {
            setApplications((apps) =>
              apps.map((a) =>
                a.id === appId ? { ...a, status: "reviewed" } : a,
              ),
            );
          }
        }
      } else {
        alert(res.error || "No se pudo cargar el CV");
      }
    } catch (e) {
      alert("Error al cargar el CV");
    } finally {
      setLoadingAppId(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/panel-empresa"
          className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Volver al panel
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-foreground">
          Postulaciones: {jobName}
        </h1>
        <p className="text-foreground-muted">
          Revisa y gestiona los candidatos que se han postulado a esta oferta.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="radius-predefined bg-white p-12 text-center ring-1 ring-border shadow-sm">
          <User className="mx-auto h-12 w-12 text-border mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Aún no hay postulantes
          </h3>
          <p className="text-foreground-muted">
            Las personas que se postulen a tu oferta aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="radius-predefined bg-white shadow-sm ring-1 ring-border p-6 flex flex-col gap-6"
            >
              {/* Header: Información y Acciones */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-border pb-6">
                {/* Información del candidato */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-muted text-foreground-muted ring-1 ring-border">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate">
                      {app.profiles?.full_name || "Candidato sin nombre"}
                    </h3>
                    <p className="text-sm font-medium text-primary truncate">
                      {app.profiles?.title || "Sin título especificado"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-xs text-foreground-muted">
                        Postulado el{" "}
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                      {app.status === "reviewed" && (
                        <span className="inline-flex items-center gap-1 radius-predefined bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-blue-600/20">
                          <CheckCircle className="h-3 w-3" /> CV Visto
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  {app.profiles?.resume_url ? (
                    <button
                      onClick={() =>
                        handleViewResume(
                          app.profiles!.resume_url!,
                          app.profiles!.full_name || "Candidato",
                          app.id,
                          app.status,
                        )
                      }
                      disabled={
                        loadingAppId === `resume-${app.profiles.resume_url}`
                      }
                      className="flex w-full sm:w-auto items-center justify-center gap-2 radius-button bg-surface px-4 py-2 text-sm font-bold text-foreground ring-1 ring-border hover:bg-surface-muted transition-colors disabled:opacity-50"
                    >
                      <FileText className="h-4 w-4" />
                      {loadingAppId === `resume-${app.profiles.resume_url}`
                        ? "Cargando..."
                        : "Ver CV"}
                    </button>
                  ) : (
                    <span className="text-xs text-foreground-muted">
                      Sin CV adjunto
                    </span>
                  )}

                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleStatusChange(app.id, "accepted")}
                      disabled={
                        loadingAppId === app.id || app.status === "accepted"
                      }
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1 radius-button px-4 py-2 text-sm font-bold transition-all ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-700 ring-1 ring-green-600/20 cursor-not-allowed"
                          : "bg-white text-green-600 ring-1 ring-green-600/30 hover:bg-green-50"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" /> Aceptar
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, "rejected")}
                      disabled={
                        loadingAppId === app.id || app.status === "rejected"
                      }
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1 radius-button px-4 py-2 text-sm font-bold transition-all ${
                        app.status === "rejected"
                          ? "bg-red-100 text-red-700 ring-1 ring-red-600/20 cursor-not-allowed"
                          : "bg-white text-red-600 ring-1 ring-red-600/30 hover:bg-red-50"
                      }`}
                    >
                      <XCircle className="h-4 w-4" /> Rechazar
                    </button>
                  </div>
                </div>
              </div>

              {/* Body: Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                    Sobre el candidato
                  </h4>
                  <p className="text-sm text-foreground-muted whitespace-pre-wrap leading-relaxed">
                    {app.profiles?.bio ||
                      "El candidato no ha proporcionado una biografía."}
                  </p>
                  {app.profiles?.phone && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-bold text-foreground mb-1">
                        Teléfono de contacto
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {app.profiles.phone}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                    Carta de presentación
                  </h4>
                  {app.cover_letter ? (
                    <div className="text-sm text-foreground-muted bg-surface-muted p-4 radius-predefined italic leading-relaxed">
                      "{app.cover_letter}"
                    </div>
                  ) : (
                    <p className="text-sm text-foreground-muted">
                      El candidato no adjuntó una carta de presentación
                      específica para esta oferta.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visor de CV */}
      <ResumeViewerModal
        isOpen={!!selectedResume}
        onClose={() => setSelectedResume(null)}
        resumeUrl={selectedResume?.url || null}
        candidateName={selectedResume?.name || ""}
      />
    </div>
  );
}
