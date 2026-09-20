import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Términos y Condiciones | Minú Empleos",
};

export default function TerminosPage() {
  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Volver al inicio
          </Link>
        </div>

        <div className="radius-predefined bg-white p-8 sm:p-12 shadow-sm border border-border">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-8">
            Términos y Condiciones de Uso
          </h1>

          <div className="prose prose-blue max-w-none text-foreground-muted">
            <p>
              Bienvenido a <strong>Minú Empleos</strong>. Al acceder y utilizar
              nuestra Plataforma, aceptas los siguientes Términos y Condiciones.
              Si no estás de acuerdo con ellos, te rogamos que no utilices
              nuestros servicios.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              1. Naturaleza del Servicio
            </h2>
            <p>
              Minú Empleos opera como un intermediario tecnológico gratuito que
              conecta a personas en búsqueda de empleo (Candidatos) con
              empleadores (Empresas). Actualmente, la Plataforma es gestionada
              por particulares y no se encuentra constituida bajo una razón
              social o entidad corporativa.
            </p>
            <p>
              El uso de la Plataforma es completamente gratuito para ambas
              partes. Nos financiamos a través de la visualización de anuncios
              publicitarios en el sitio web.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              2. Edad Mínima Requerida
            </h2>
            <p>
              Para registrarte y utilizar la Plataforma como Candidato, debes
              cumplir con la edad mínima laboral establecida por la legislación
              argentina (16 años cumplidos, con la debida autorización de tus
              padres o tutores legales, o 18 años para uso pleno y
              emancipado).
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              3. Publicación de Ofertas y Moderación
            </h2>
            <p>
              Las Empresas registradas pueden publicar ofertas laborales de
              manera gratuita. Estas ofertas se publican automáticamente y{" "}
              <strong>no son revisadas previamente</strong> por nuestro equipo.
            </p>
            <p>
              Sin embargo, nos reservamos el derecho de eliminar cualquier oferta
              o suspender cuentas si recibimos reportes o denuncias de que el
              contenido viola nuestras normativas o la legislación vigente.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              4. Política de No Discriminación
            </h2>
            <p>
              En cumplimiento con la{" "}
              <strong>Ley Antidiscriminación (Ley N° 23.592)</strong>, está
              estrictamente prohibido publicar ofertas de empleo que contengan
              requisitos excluyentes basados en motivos de raza, religión,
              nacionalidad, ideología, opinión política o gremial, sexo, género,
              posición económica, condición social o caracteres físicos.
              Cualquier aviso reportado por prácticas discriminatorias será
              removido inmediatamente.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              5. Deslinde de Responsabilidad
            </h2>
            <p>
              Minú Empleos <strong>no es un empleador</strong> ni una agencia de
              recursos humanos. No garantizamos la veracidad, exactitud o
              legalidad de las ofertas publicadas por las Empresas, ni la
              identidad o aptitudes de los Candidatos.
            </p>
            <p>
              La Plataforma no se responsabiliza por conflictos, daños o
              perjuicios que puedan surgir durante el proceso de selección, la
              entrevista o la eventual contratación entre la Empresa y el
              Candidato. Cualquier reclamo laboral o civil debe dirigirse
              directamente a la parte correspondiente.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              6. Suspensión y Cancelación de Cuentas
            </h2>
            <p>
              Minú Empleos se reserva el derecho de suspender o eliminar el
              acceso a la Plataforma a cualquier usuario o empresa que infrinja
              estos Términos y Condiciones, proporcione información falsa, o
              haga un uso malintencionado de los servicios.
            </p>

            <p className="mt-8 text-sm">
              <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-AR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
