"use client";

import { useState } from "react";
import { Power, Trash2, Loader2, Edit, Users } from "lucide-react";
import { toggleJobStatus, deleteJob } from "@/app/actions/jobs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function JobActions({ 
  jobId, 
  jobSlug, 
  isActive, 
  jobName 
}: { 
  jobId: string, 
  jobSlug: string, 
  isActive: boolean, 
  jobName: string 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const res = await toggleJobStatus(jobId, isActive);
    setIsLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      alert("Error al cambiar estado");
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteJob(jobId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      router.refresh();
    } else {
      alert("Error al eliminar el empleo");
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <Link
          href={`/panel-empresa/empleos/${jobId}/postulaciones`}
          className="p-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center ring-1 ring-primary/20"
          title="Ver Postulaciones"
        >
          <Users className="h-5 w-5" />
        </Link>
        <Link
          href={`/panel-empresa/empleos/${jobSlug}/editar`}
          className="p-2 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center"
          title="Editar Oferta"
        >
          <Edit className="h-5 w-5" />
        </Link>
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`p-2 rounded-full transition-colors flex items-center justify-center ${
            isActive 
              ? 'text-foreground-muted hover:text-amber-600 hover:bg-amber-50' 
              : 'text-foreground-muted hover:text-green-600 hover:bg-green-50'
          }`}
          title={isActive ? "Pausar/Ocultar Oferta" : "Reactivar Oferta"}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Power className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isLoading}
          className="p-2 text-foreground-muted hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
          title="Eliminar Oferta"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => !isLoading && setIsDeleteModalOpen(false)}>
        <h3 className="text-xl font-bold text-red-600 mb-2">Eliminar Oferta</h3>
        <p className="text-sm text-foreground-muted mb-4">
          ¿Estás seguro de que deseas eliminar permanentemente la oferta de empleo <strong>"{jobName}"</strong>?
          Esto también eliminará todas las postulaciones asociadas y no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            isLoading={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white border-red-600"
          >
            {!isLoading && <Trash2 className="h-4 w-4 mr-2" />}
            {isLoading ? "Eliminando..." : "Sí, Eliminar"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
