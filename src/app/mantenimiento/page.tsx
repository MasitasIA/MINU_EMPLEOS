import { Wrench } from "lucide-react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/app/actions/settings";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mantenimiento | Minú Empleos",
  description: "Volveremos pronto. El sitio se encuentra en mantenimiento.",
};

export default async function MaintenancePage() {
  // Verificamos si realmente estamos en mantenimiento
  const settings = await getSiteSettings();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-surface-muted radius-predefined p-8 sm:p-12 max-w-2xl w-full ring-1 ring-border shadow-sm flex flex-col items-center">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <Wrench className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
          Estamos mejorando la plataforma
        </h1>
        
        <p className="text-lg text-foreground-muted mb-8 max-w-lg mx-auto">
          Minú Empleos se encuentra en mantenimiento programado. 
          Estamos implementando nuevas funcionalidades para mejorar tu experiencia.
        </p>
        
        <div className="text-sm font-medium text-foreground-subtle bg-white radius-predefined px-4 py-3 ring-1 ring-border inline-block mb-6">
          Volveremos en breve. ¡Gracias por tu paciencia!
        </div>

        <Link 
          href="/" 
          className="radius-button bg-primary text-white px-6 py-2.5 font-bold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Probar de nuevo (Ir al Inicio)
        </Link>
      </div>
    </div>
  );
}
