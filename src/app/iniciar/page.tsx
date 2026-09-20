"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight, Eye, EyeOff, Loader2, Store } from "lucide-react";
import { loginUser } from "@/app/actions/auth";

export default function IniciarSesionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identificador: "", // email o usuario
    contrasena: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await loginUser(
        formData.identificador,
        formData.contrasena,
      );

      if (!response.success) {
        setErrorMsg(response.error || "Credenciales incorrectas.");
        setIsLoading(false);
        return;
      }

      // Redirigir al panel personal
      router.push("/mi-cuenta");
      // Forzar refresco para que el layout lea la cookie actualizada
      router.refresh();
    } catch (err) {
      setErrorMsg("Error de conexión con el servidor.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-surface-muted px-4 py-12 sm:px-6 lg:px-8">
      {/* Tarjeta central */}
      <div className="w-full max-w-md space-y-8 radius-predefined bg-white p-8 shadow-xl ring-1 ring-border">
        {/* Cabecera */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center radius-predefined bg-primary/10 text-primary">
            <Store className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Bienvenido de vuelta a Minú Empleos.
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="radius-predefined bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-red-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            {/* Identificador (Mail) */}
            <div>
              <label
                htmlFor="identificador"
                className="mb-1 block text-sm font-bold text-foreground"
              >
                Correo Electrónico
              </label>
              <input
                id="identificador"
                name="identificador"
                type="text"
                required
                value={formData.identificador}
                onChange={handleChange}
                placeholder="juan@ejemplo.com"
                className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Contraseña */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="contrasena"
                  className="block text-sm font-bold text-foreground"
                >
                  Contraseña
                </label>
                <Link
                  href="/recuperar"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="contrasena"
                  name="contrasena"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 radius-button bg-primary px-4 py-3 font-bold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-md shadow-primary/20 disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Ingresar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer del form */}
        <div className="mt-6 text-center text-sm text-foreground-muted">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/registro"
            className="font-bold text-primary hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
