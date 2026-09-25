"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Action local o llamada directa al API route/Server Action para eliminar
import { deleteUserAccount } from "@/app/actions/auth";

export default function EliminarCuentaPage() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isConfirmed = confirmText === "ELIMINAR";

  const handleDelete = async () => {
    if (!isConfirmed) return;
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const result = await deleteUserAccount();
      
      if (result.success) {
        // Redirige al inicio, como es un server action probablemente limpie cookies de sesión
        router.push("/");
        router.refresh();
      } else {
        setErrorMsg(result.error || "No se pudo eliminar la cuenta.");
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMsg("Ocurrió un error inesperado al intentar eliminar la cuenta.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/mi-cuenta"
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Mi Cuenta
        </Link>
      </div>

      <div className="radius-predefined border border-red-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center radius-predefined bg-red-100 text-red-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-foreground">
            Eliminar Cuenta Permanentemente
          </h1>
          <p className="mt-2 text-foreground-muted">
            Esta acción es irreversible y borrará todos tus datos.
          </p>
        </div>

        <div className="mb-8 rounded-md bg-red-50 p-4 text-red-800">
          <h3 className="mb-2 font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> ¿Qué sucederá si eliminas tu cuenta?
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Tu perfil y currículum serán borrados permanentemente.</li>
            <li>Si eres empresa, tus ofertas laborales serán eliminadas.</li>
            <li>Todas tus postulaciones desaparecerán de la vista de las empresas.</li>
            <li>No podrás reactivar esta cuenta posteriormente.</li>
          </ul>
        </div>

        {errorMsg && (
          <div className="mb-6 radius-predefined bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-red-200">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-foreground">
              Escribe "ELIMINAR" para confirmar
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="w-full radius-predefined border border-red-300 bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={!isConfirmed || isLoading}
            className="w-full flex justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-5 w-5 mr-2" />
            )}
            {isLoading ? "Eliminando..." : "Eliminar mi cuenta definitivamente"}
          </Button>
        </div>
      </div>
    </div>
  );
}
