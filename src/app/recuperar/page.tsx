"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setErrorMsg("Ocurrió un error inesperado al solicitar el restablecimiento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-surface-muted px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 radius-predefined bg-white p-8 shadow-xl ring-1 ring-border">
        {isSuccess ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center radius-predefined bg-green-100 text-green-600 mb-6">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground mb-2">
              Correo Enviado
            </h2>
            <p className="text-sm text-foreground-muted mb-8">
              Hemos enviado un enlace para restablecer tu contraseña a <strong>{email}</strong>. Por favor, revisa tu bandeja de entrada (y tu carpeta de spam).
            </p>
            <Link
              href="/iniciar"
              className="flex w-full items-center justify-center gap-2 radius-button bg-primary px-4 py-3 font-bold text-white transition-all hover:bg-primary/90"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground">
                Recuperar Contraseña
              </h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {errorMsg && (
                <div className="radius-predefined bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-bold text-foreground"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@ejemplo.com"
                    className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 pl-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
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
                  "Enviar Enlace"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/iniciar"
                className="inline-flex items-center gap-2 text-sm font-bold text-foreground-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Iniciar Sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
