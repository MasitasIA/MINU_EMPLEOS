"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ActualizarPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // El createBrowserClient de @supabase/ssr maneja el intercambio de code por sesión automáticamente
  // si el usuario llega con un PKCE code en la URL.
  // Sin embargo, si queremos estar 100% seguros, podemos llamar a exchangeCodeForSession manualmente,
  // pero puede causar conflicto con el autohandler. Por lo que confiaremos en la sesión activa.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Actualizamos la contraseña del usuario actualmente autenticado
      // (el cual se autenticó automáticamente al cargar la página gracias al code en la URL)
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        let msg = error.message;

        // Traducir los errores comunes de Supabase Auth
        if (msg.includes("different from the old password")) {
          msg = "La nueva contraseña debe ser distinta a la anterior.";
        } else if (msg.toLowerCase().includes("should be at least")) {
          msg = "La contraseña debe tener al menos 6 caracteres.";
        } else if (msg.includes("Auth session missing!")) {
          msg =
            "Tu sesión ha expirado o el enlace no es válido. Por favor, solicita uno nuevo.";
        } else {
          msg = "No se pudo actualizar la contraseña. Inténtalo nuevamente.";
        }

        setErrorMsg(msg);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/mi-cuenta");
          router.refresh();
        }, 3000);
      }
    } catch (err) {
      setErrorMsg(
        "Ocurrió un error inesperado. Asegúrate de estar usando el enlace correcto.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!code && !success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-surface-muted px-4 py-12">
        <div className="w-full max-w-md p-8 text-center radius-predefined bg-white shadow-xl ring-1 ring-border">
          <p className="text-red-600 font-bold mb-4">
            Enlace inválido o expirado
          </p>
          <p className="text-foreground-muted mb-6">
            No se encontró un código de recuperación válido en la URL.
          </p>
          <button
            onClick={() => router.push("/recuperar")}
            className="radius-button bg-primary px-4 py-2 font-bold text-white hover:bg-primary/90 transition-colors"
          >
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-surface-muted px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 radius-predefined bg-white p-8 shadow-xl ring-1 ring-border">
        {success ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center radius-predefined bg-green-100 text-green-600 mb-6">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground mb-2">
              ¡Contraseña Actualizada!
            </h2>
            <p className="text-sm text-foreground-muted mb-8">
              Tu contraseña se ha cambiado correctamente. Serás redirigido a tu
              panel en unos segundos...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center radius-predefined bg-primary/10 text-primary mb-6">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                Nueva Contraseña
              </h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Por favor, ingresa tu nueva contraseña a continuación.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="radius-predefined bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-bold text-foreground">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-foreground">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 radius-button bg-primary px-4 py-3 font-bold text-white transition-all hover:bg-primary/90 active:scale-95 shadow-md disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Guardar Contraseña"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
