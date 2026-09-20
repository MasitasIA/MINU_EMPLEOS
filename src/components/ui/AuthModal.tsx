"use client";

// Importaciones
import { useEffect } from "react";
import { X, UserPlus, LogIn, Store } from "lucide-react";
import Link from "next/link";
import { Modal } from "./Modal";

// Tipos
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Componente Principal
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="text-center">
      {/* Ícono de bienvenida */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center radius-predefined bg-primary/10 text-primary">
        <Store className="h-8 w-8" />
      </div>

      <h2 className="mb-2 text-2xl font-black text-foreground">
        ¡Hola! Qué bueno verte
      </h2>
      <p className="mb-8 text-sm text-foreground-muted">
        Para continuar y acceder a tus pedidos o administrar tu tienda,
        necesitamos que ingreses a tu cuenta.
      </p>

      <div className="flex flex-col gap-4">
        {/* Opción 1: Iniciar Sesión */}
        <Link
          href="/iniciar"
          onClick={onClose}
          className="group flex w-full items-center justify-center gap-3 radius-button bg-primary px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-md shadow-primary/20"
        >
          <LogIn className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Ya tengo cuenta, iniciar sesión
        </Link>

        {/* Divisor */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="mx-4 flex-shrink-0 text-xs font-bold uppercase tracking-wider text-foreground-subtle">
            o
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Opción 2: Registrarse */}
        <Link
          href="/registro"
          onClick={onClose}
          className="group flex w-full items-center justify-center gap-3 radius-button border-2 border-border bg-white px-6 py-3.5 text-sm font-bold text-foreground transition-all hover:border-primary hover:text-primary hover:bg-surface-muted"
        >
          <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
          Soy nuevo, quiero registrarme
        </Link>
      </div>

      {/* Legal */}
      <p className="mt-8 text-xs text-foreground-subtle">
        Al continuar, aceptas nuestros{" "}
        <Link href="#" className="underline hover:text-primary">
          Términos de servicio
        </Link>{" "}
        y{" "}
        <Link href="#" className="underline hover:text-primary">
          Políticas de privacidad
        </Link>
        .
      </p>
    </Modal>
  );
}
