import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Políticas de Privacidad | Minú Empleos",
};

export default function PrivacidadPage() {
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
            Políticas de Privacidad
          </h1>

          <div className="prose prose-blue max-w-none text-foreground-muted">
            <p>
              En <strong>Minú Empleos</strong> (en adelante, "la Plataforma"),
              nos tomamos muy en serio la privacidad y seguridad de tus datos.
              Esta Política de Privacidad describe cómo recopilamos, utilizamos
              y protegemos tu información personal en cumplimiento con la{" "}
              <strong>
                Ley de Protección de Datos Personales (Ley N° 25.326)
              </strong>{" "}
              de la República Argentina.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              1. Información que Recopilamos
            </h2>
            <p>
              Para brindarte nuestros servicios de intermediación laboral,
              recopilamos la siguiente información cuando te registras y utilizas
              la Plataforma:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>
                <strong>Datos de Perfil:</strong> Nombre completo, correo
                electrónico y número de teléfono.
              </li>
              <li>
                <strong>Datos Laborales:</strong> Currículum Vitae (CV) en
                formato digital, cartas de presentación y cualquier otra
                información que incluyas en tu perfil.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              2. Uso de la Información
            </h2>
            <p>La información recopilada será utilizada exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>
                Conectar a candidatos con ofertas laborales publicadas por
                empresas en la Plataforma.
              </li>
              <li>
                Permitir a las empresas visualizar tu CV y carta de presentación
                cuando te postules a una de sus ofertas.
              </li>
              <li>
                Mejorar nuestros servicios y la experiencia de usuario.
              </li>
            </ul>
            <p>
              Minú Empleos es un servicio gratuito sostenido por publicidad.
              Podemos utilizar información no identificable para mostrar
              anuncios relevantes, pero <strong>nunca venderemos</strong> tu
              información personal ni tu CV a terceros con fines comerciales o de
              marketing sin tu consentimiento explícito.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              3. Almacenamiento y Servicios de Terceros
            </h2>
            <p>
              Los datos personales, incluyendo los archivos de Currículum Vitae y
              cartas de presentación, son almacenados en los servidores seguros
              de <strong>Supabase</strong>, nuestro proveedor de bases de datos y
              almacenamiento en la nube. Al aceptar estas políticas, consientes
              el almacenamiento de tu información en sus servidores.
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              4. Conservación de los Datos
            </h2>
            <p>
              Tus datos personales y postulaciones se conservarán en nuestra
              base de datos de manera indefinida mientras tu cuenta permanezca
              activa. Únicamente se eliminarán en los siguientes casos:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Si solicitas explícitamente la eliminación de tu cuenta.</li>
              <li>Si se detecta una infracción a los Términos y Condiciones de uso.</li>
            </ul>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              5. Tus Derechos (Derechos ARCO)
            </h2>
            <p>
              En conformidad con la Ley N° 25.326, tienes el derecho de{" "}
              <strong>
                Acceder, Rectificar, Actualizar, Cancelar u Oponerte
              </strong>{" "}
              al tratamiento de tus datos personales. Si deseas eliminar
              definitivamente tu cuenta y tu CV de nuestra base de datos, puedes
              hacerlo desde los ajustes de tu perfil o contactándonos a{" "}
              <a
                href="mailto:contacto@minuempleos.com"
                className="text-primary hover:underline"
              >
                contacto@minuempleos.com
              </a>
              .
            </p>
            <p className="mt-4 italic text-sm border-l-4 border-primary/30 pl-4 py-2 bg-surface-muted">
              "El titular de los datos personales tiene la facultad de ejercer el
              derecho de acceso a los mismos en forma gratuita a intervalos no
              inferiores a seis meses, salvo que se acredite un interés legítimo
              al efecto conforme lo establecido en el artículo 14, inciso 3 de la
              Ley Nº 25.326. La Agencia de Acceso a la Información Pública tiene
              la atribución de atender las denuncias y reclamos que se
              interpongan con relación al incumplimiento de las normas sobre
              protección de datos personales."
            </p>

            <h2 className="text-xl font-bold text-foreground mt-8 mb-4">
              6. Cambios en esta Política
            </h2>
            <p>
              Podemos actualizar estas políticas en el futuro. Te notificaremos
              sobre cambios significativos mediante un aviso en la Plataforma o a
              través de correo electrónico.
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
