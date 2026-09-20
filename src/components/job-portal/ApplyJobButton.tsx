"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { applyToJob } from "@/app/actions/applications";

export function ApplyJobButton({ jobId, isAuthenticated }: { jobId: string, isAuthenticated: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push("/iniciar");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const response = await applyToJob(jobId);

    if (response.success) {
      setMessage({ type: "success", text: "¡Postulación enviada exitosamente!" });
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
      <button
        onClick={handleApply}
        disabled={isLoading || message?.type === 'success'}
        className="w-full flex items-center justify-center gap-2 radius-button bg-primary text-white py-3 font-bold px-4 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-primary/20"
      >
        {isLoading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Procesando...</>
        ) : (
          <><Send className="h-5 w-5" /> Postularme Ahora</>
        )}
      </button>
    </div>
  );
}
