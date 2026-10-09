"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function VerificationCompanySection({ isVerified }: { isVerified: boolean }) {
  return (
    <div className="radius-predefined bg-white shadow-sm ring-1 ring-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          Estado de Verificación
          {isVerified && <ShieldCheck className="h-5 w-5 text-primary" />}
        </h3>
        <p className="mt-1 text-sm text-foreground-muted">
          {isVerified 
            ? "Tu empresa ya está verificada y tiene la insignia oficial." 
            : "La insignia de verificación transmite confianza a los candidatos."}
        </p>
      </div>
      {!isVerified && (
        <Link 
          href="/panel-empresa/verificacion"
          className="inline-block radius-button bg-secondary/10 text-secondary hover:bg-secondary/20 px-6 py-2.5 text-sm font-bold transition-colors whitespace-nowrap"
        >
          Solicitar Verificación
        </Link>
      )}
    </div>
  );
}
