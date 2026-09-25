"use client";

import Link from "next/link";
import { SearchX, ArrowLeft, Home } from "lucide-react";

// Página 404 Global
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center radius-predefined bg-surface-muted text-foreground-muted ring-1 ring-border">
        <SearchX className="h-10 w-10" />
      </div>

      <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground sm:text-5xl">
        Página no encontrada
      </h1>
      <p className="mb-8 max-w-md text-foreground-muted text-lg">
        Lo sentimos, no pudimos encontrar la ruta que buscas. Puede que el
        empleo, perfil o empresa que buscas haya sido eliminado o no exista.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 radius-button bg-primary px-6 py-3 font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
        >
          <Home className="h-5 w-5" />
          Ir al Inicio
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 radius-button bg-surface-muted px-6 py-3 font-bold text-foreground transition-colors hover:bg-border ring-1 ring-border"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver atrás
        </button>
      </div>
    </div>
  );
}
