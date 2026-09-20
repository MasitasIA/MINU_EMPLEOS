// Iconos
import { Building } from "lucide-react";

// Importaciones
import Link from "next/link";

// Componente para mostrar la ausencia de empresas
export function EmptyCompanyState() {
  return (
    <div className="mx-auto max-w-3xl flex w-full flex-col items-center justify-center radius-predefined bg-surface-muted/50 p-12 text-center border-2 border-dashed border-border">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Building className="h-10 w-10" />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-foreground">
        Aún no hay empresas registradas
      </h3>
      <p className="mb-8 max-w-sm text-foreground-muted">
        ¿Tienes una empresa local? Sé el primero en formar parte de nuestra
        comunidad y empieza a publicar ofertas de empleo hoy mismo.
      </p>
      <Link
        href="/panel-empresa"
        className="radius-button bg-primary px-8 py-3.5 font-bold text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
      >
        Registrar mi empresa
      </Link>
    </div>
  );
}
