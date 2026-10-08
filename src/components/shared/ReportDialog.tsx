"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Flag, Loader2 } from "lucide-react";
import { submitReport, ReportEntityType } from "@/app/actions/reports";

interface ReportDialogProps {
  entityType: ReportEntityType;
  entityId: string;
  triggerClassName?: string;
  triggerText?: string;
}

const REPORT_REASONS = {
  job: [
    { id: "spam", label: "Es spam o estafa" },
    { id: "offensive", label: "Contenido ofensivo o inapropiado" },
    { id: "fake", label: "Oferta falsa o engañosa" },
    { id: "expired", label: "La oferta ya expiró o no está disponible" },
    { id: "other", label: "Otro motivo" },
  ],
  company: [
    { id: "spam", label: "Empresa falsa o estafa" },
    { id: "offensive", label: "Contenido ofensivo o inapropiado" },
    { id: "other", label: "Otro motivo" },
  ],
  profile: [
    { id: "spam", label: "Perfil falso o spam" },
    { id: "offensive", label: "Contenido ofensivo o inapropiado" },
    { id: "other", label: "Otro motivo" },
  ],
};

export function ReportDialog({
  entityType,
  entityId,
  triggerClassName,
  triggerText = "Reportar",
}: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reasons = REPORT_REASONS[entityType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError("Por favor selecciona un motivo.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await submitReport(
      entityType,
      entityId,
      reason,
      description,
    );

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Ocurrió un error");
    }
    setIsSubmitting(false);
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setReason("");
      setDescription("");
      setError(null);
      setSuccess(false);
    }, 300);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          triggerClassName ||
          "text-foreground-subtle hover:text-red-600 transition-colors flex items-center gap-1.5 text-sm font-medium"
        }
      >
        <Flag className="w-4 h-4" />
        <span>{triggerText}</span>
      </button>

      <Modal isOpen={isOpen} onClose={resetAndClose} className="max-w-md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Reportar contenido
              </h2>
              <p className="text-sm text-foreground-subtle">
                Ayúdanos a mantener la comunidad segura
              </p>
            </div>
          </div>

          {success ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 mt-2">
              <p className="font-medium text-center">
                ¡Gracias por tu reporte!
              </p>
              <p className="text-sm text-center mt-1">
                Nuestro equipo lo revisará lo antes posible.
              </p>
              <div className="mt-4 flex justify-center">
                <Button onClick={resetAndClose} variant="outline" size="sm">
                  Cerrar
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  ¿Por qué reportas esto? *
                </label>
                <div className="flex flex-col gap-2">
                  {reasons.map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface-muted transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.id}
                        checked={reason === r.id}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary border-border"
                      />
                      <span className="text-sm text-foreground">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-foreground"
                >
                  Detalles adicionales (opcional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
                  placeholder="Proporciona más información que nos ayude a entender el problema..."
                  maxLength={500}
                />
                <span className="text-xs text-foreground-muted text-right">
                  {description.length}/500
                </span>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetAndClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar reporte"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}
