"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCompany } from "@/app/actions/companies";
import { Trash2, AlertTriangle, X } from "lucide-react";

export function DeleteCompanySection({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteInput !== companyId) return;
    
    setIsDeleting(true);
    const response = await deleteCompany(companyId);
    
    if (response.success) {
      router.push("/panel-empresa");
      router.refresh();
    } else {
      setError(response.error || "Error al eliminar la empresa.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="radius-predefined bg-red-50 ring-1 ring-red-200 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-red-800">Zona de Peligro</h3>
        <p className="mt-1 text-sm text-red-600 mb-4">
          Una vez que elimines tu perfil de empresa, no hay vuelta atrás y perderás todas tus ofertas de empleo.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="radius-button bg-red-600 text-white hover:bg-red-700 px-6 py-2.5 text-sm font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <Trash2 className="h-4 w-4" /> Eliminar Empresa
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white radius-predefined shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => {
                setShowDeleteModal(false);
                setError(null);
                setDeleteInput("");
              }}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">¿Eliminar empresa?</h2>
            </div>
            
            <p className="text-sm text-foreground-muted mb-4">
              Esta acción <strong>eliminará permanentemente</strong> tu perfil de empresa y todas las ofertas asociadas.
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 text-sm radius-predefined ring-1 ring-red-200">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-foreground mb-2">
                Para confirmar, escribe <span className="font-mono bg-surface-muted px-1 py-0.5 radius-predefined text-red-600">{companyId}</span> a continuación:
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                placeholder={companyId}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setError(null);
                  setDeleteInput("");
                }}
                className="px-4 py-2 text-sm font-bold text-foreground-muted hover:bg-surface-muted radius-button transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteInput !== companyId || isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 radius-button transition-colors flex items-center gap-2"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar empresa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
