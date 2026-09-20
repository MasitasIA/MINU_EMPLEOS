// Importaciones
import Link from "next/link";
import { Mail, Briefcase, Users, MapPin } from "lucide-react";

// Componente de Footer
export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 xl:gap-12 mb-12">
          {/* Marca y Descripción */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-black tracking-tight text-primary mb-4">
              Minú Empleos
            </h3>
            <p className="text-sm text-foreground-muted mb-4">
              Conectando el talento local con las mejores oportunidades en
              Guaminí y sus alrededores.
            </p>
            <div className="flex items-center gap-2 text-sm text-foreground-muted">
              <MapPin className="h-4 w-4" />
              <span>Guaminí, Buenos Aires</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground-muted mt-2">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:contacto@minuempleos.com"
                className="hover:text-primary transition-colors"
              >
                contacto@minuempleos.com
              </a>
            </div>
          </div>

          {/* Para Candidatos */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-foreground uppercase mb-4 flex items-center gap-2">
              <Users className="h-4 w-4" /> Candidatos
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-foreground-muted">
              <li>
                <Link
                  href="/empleos"
                  className="hover:text-primary transition-colors"
                >
                  Buscar Empleos
                </Link>
              </li>
              <li>
                <Link
                  href="/registro"
                  className="hover:text-primary transition-colors"
                >
                  Crear Cuenta
                </Link>
              </li>
              <li>
                <Link
                  href="/iniciar"
                  className="hover:text-primary transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Empresas */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-foreground uppercase mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Empresas
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-foreground-muted">
              <li>
                <Link
                  href="/panel-empresa/empleos/nuevo"
                  className="hover:text-primary transition-colors"
                >
                  Publicar Oferta
                </Link>
              </li>
              <li>
                <Link
                  href="/panel-empresa"
                  className="hover:text-primary transition-colors"
                >
                  Panel de Empresa
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold tracking-wider text-foreground uppercase mb-4">
              Legal
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-foreground-muted mb-6">
              <li>
                <Link
                  href="/terminos"
                  className="hover:text-primary transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="hover:text-primary transition-colors"
                >
                  Políticas de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground-subtle">
            © {new Date().getFullYear()} Minú Empleos. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
