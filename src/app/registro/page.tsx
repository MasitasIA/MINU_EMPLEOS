"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, UserPlus, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { validatePhone, validatePassword, validateUsername } from "@/lib/validators";
import { registerUser, checkUsernameAvailability } from "@/app/actions/auth";

export default function RegistroPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    apellido: "",
    mail: "",
    phone: "",
    contrasena: "",
    contrasenaConfirmacion: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameMsg, setUsernameMsg] = useState("");

  // Efecto para verificar disponibilidad del usuario en tiempo real
  useEffect(() => {
    const username = formData.usuario;
    
    if (username.length === 0) {
      setUsernameStatus("idle");
      setUsernameMsg("");
      return;
    }

    const validation = validateUsername(username);
    if (!validation.isValid) {
      setUsernameStatus("invalid");
      setUsernameMsg(validation.message);
      return;
    }

    setUsernameStatus("checking");
    setUsernameMsg("Comprobando disponibilidad...");

    const timeoutId = setTimeout(async () => {
      const response = await checkUsernameAvailability(username);
      if (response.available) {
        setUsernameStatus("available");
        setUsernameMsg("Nombre de usuario disponible");
      } else {
        setUsernameStatus("taken");
        setUsernameMsg("Este usuario ya está en uso");
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [formData.usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      setErrorMsg("El nombre de usuario no es válido o ya está en uso.");
      return;
    }

        // Validación Teléfono
    if (!validatePhone(formData.phone)) {
      setErrorMsg("El teléfono debe contener entre 7 y 15 caracteres válidos.");
      return;
    }

    // Validación de seguridad de la contraseña
    const passwordValidation = validatePassword(formData.contrasena);
    if (!passwordValidation.isValid) {
      setErrorMsg(passwordValidation.message);
      return;
    }

    // Validación de contraseñas coinciden
    if (formData.contrasena !== formData.contrasenaConfirmacion) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);

    try {
      // Llamada al Server Action para guardar en archivo temporal
      const response = await registerUser(formData);

      if (!response.success) {
        setErrorMsg(response.error || "Ocurrió un error al registrarse.");
        setIsLoading(false);
        return;
      }

      alert("¡Cuenta creada con éxito! Por favor inicia sesión.");
      router.push("/");
    } catch (err) {
      setErrorMsg("Error de conexión con el servidor.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4 py-12 sm:px-6 lg:px-8">
      {/* Tarjeta central */}
      <div className="w-full max-w-md space-y-8 radius-predefined bg-white p-8 shadow-xl ring-1 ring-border">
        {/* Cabecera */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center radius-predefined bg-primary/10 text-primary">
            <Store className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Únete a Minú Empleos y encuentra las mejores oportunidades laborales en la región.
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
            {/* Usuario */}
            <div>
              <label
                htmlFor="usuario"
                className="mb-1 block text-sm font-bold text-foreground"
              >
                Nombre de Usuario
              </label>
              <div className="relative">
                <input
                  id="usuario"
                  name="usuario"
                  type="text"
                  required
                  value={formData.usuario}
                  onChange={handleChange}
                  placeholder="ej: juanperez123"
                  className={`w-full radius-predefined border bg-surface-muted px-3 py-2 pr-10 text-sm outline-none transition-all focus:bg-white focus:ring-2 ${
                    usernameStatus === "taken" || usernameStatus === "invalid"
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : usernameStatus === "available"
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-foreground-muted" />}
                  {usernameStatus === "available" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {(usernameStatus === "taken" || usernameStatus === "invalid") && <XCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
              {usernameStatus !== "idle" && (
                <p className={`mt-1 text-xs font-medium ${
                  usernameStatus === "available" ? "text-green-600" :
                  usernameStatus === "taken" || usernameStatus === "invalid" ? "text-red-600" :
                  "text-foreground-muted"
                }`}>
                  {usernameMsg}
                </p>
              )}
            </div>

            {/* Nombre y Apellido (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-1 block text-sm font-bold text-foreground"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                  className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label
                  htmlFor="apellido"
                  className="mb-1 block text-sm font-bold text-foreground"
                >
                  Apellido
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

                        {/* Teléfono */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-bold text-foreground"
              >
                Teléfono de Contacto
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+54 9 11 1234-5678"
                className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                maxLength={20}
              />
            </div>

            {/* Mail */}
            <div>
              <label
                htmlFor="mail"
                className="mb-1 block text-sm font-bold text-foreground"
              >
                Correo Electrónico
              </label>
              <input
                id="mail"
                name="mail"
                type="email"
                required
                value={formData.mail}
                onChange={handleChange}
                placeholder="juan@ejemplo.com"
                className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="contrasena" className="mb-1 block text-sm font-bold text-foreground">
                Contraseña
              </label>
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
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="contrasenaConfirmacion" className="mb-1 block text-sm font-bold text-foreground">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="contrasenaConfirmacion"
                  name="contrasenaConfirmacion"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.contrasenaConfirmacion}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Términos y Condiciones (Consentimiento explícito - Ley 25.326) */}
          <div className="flex items-start gap-2">
            <input
              id="terminos"
              name="terminos"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="terminos" className="text-sm text-foreground-muted">
              He leído y acepto los{" "}
              <Link href="/terminos" className="font-semibold text-primary hover:underline" target="_blank">
                Términos y Condiciones
              </Link>{" "}
              y las{" "}
              <Link href="/privacidad" className="font-semibold text-primary hover:underline" target="_blank">
                Políticas de Privacidad
              </Link>
              . Autorizo el tratamiento de mis datos personales para fines de intermediación laboral.
            </label>
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
                <UserPlus className="h-5 w-5" />
                Crear mi cuenta
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer del form */}
        <div className="mt-6 text-center text-sm text-foreground-muted">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/iniciar"
            className="font-bold text-primary hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
