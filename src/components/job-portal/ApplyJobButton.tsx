"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { applyToJob } from "@/app/actions/applications";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export function ApplyJobButton({ jobId, isAuthenticated }: { jobId: string, isAuthenticated: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push("/iniciar");
      return;
    }
    setIsModalOpen(true);
  };

  const handleApply = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setMessage(null);

    const response = await applyToJob(jobId, coverLetter);

    if (response.success) {
      setMessage({ type: "success", text: "¡Postulación enviada exitosamente!" });
      setIsModalOpen(false);
      router.refresh(); // Refresh para que el server componente cambie el botón
    } else {
      setMessage({ type: "error", text: response.error || "Ocurrió un error al postularse." });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {message && (
        <div className={`mb-4 p-3 text-sm font-medium radius-predefined ring-1 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 ring-green-200' 
            : 'bg-red-50 text-red-700 ring-red-200'
        }`}>
          {message.text}
          {message.text.includes("currículum") && (
            <div className="mt-2">
              <a href="/mi-cuenta/ajustes" className="underline font-bold hover:text-red-900">
                Ir a mi cuenta para subir mi CV
              </a>
            </div>
          )}
        </div>
      )}
      
      {!message || message.type === 'error' ? (
        <button
          onClick={handleApplyClick}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 radius-button bg-primary text-white py-3 font-bold px-4 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20"
        >
          <Send className="h-5 w-5" /> Postularme Ahora
        </button>
      ) : null}

      <Modal isOpen={isModalOpen} onClose={() => !isLoading && setIsModalOpen(false)}>
        <h3 className="text-xl font-bold text-foreground mb-2">Enviar Postulación</h3>
        <p className="text-sm text-foreground-muted mb-6">
          Puedes incluir una carta de presentación para destacar tu perfil.
        </p>

        {message?.type === 'error' && (
          <div className="mb-4 p-3 text-sm font-medium radius-predefined bg-red-50 text-red-700 ring-1 ring-red-200">
            {message.text}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="coverLetter" className="mb-1 block text-sm font-bold text-foreground">
            Carta de Presentación (Opcional)
          </label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder="Escribe por qué eres el candidato ideal..."
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            isLoading={isLoading}
          >
            {!isLoading && <Send className="h-4 w-4 mr-2" />}
            {isLoading ? "Enviando..." : "Confirmar Postulación"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
