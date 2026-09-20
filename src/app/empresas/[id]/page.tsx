import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
  BadgeCheck,
  ShieldAlert,
  Building,
  Phone,
  Globe,
  Users,
  Link,
} from "lucide-react";
import Image from "next/image";
import { getCompanyById } from "@/app/actions/companies";
import { getUser } from "@/lib/session";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  // Obtenemos la empresa de la base de datos real
  const company = await getCompanyById(resolvedParams.id);

  if (!company) {
    notFound();
  }

  const user = await getUser();
  const isOwner = user?.id === company.owner_id;

  if (!company.is_active && !isOwner) {
    notFound();
  }

  // Cuando tengamos empleos en base de datos:
  const companyJobs: any[] = [];

  return (
    <div className="bg-surface-muted min-h-screen pb-16">
      {/* Banner Panorámico de Cabecera */}
      <div className="relative min-h-[22rem] sm:min-h-[24rem] w-full overflow-hidden bg-slate-800 flex flex-col justify-end">
        {company.cover_url && (
          <Image
            src={company.cover_url}
            alt={`Portada de ${company.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Contenido sobre el banner */}
        <div className="relative z-10 w-full p-6 pt-20 sm:p-10 sm:pt-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              {/* Avatar Flotante */}
              <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-xl bg-white flex items-center justify-center">
                {company.image_url ? (
                  <Image
                    src={company.image_url}
                    alt={company.name}
                    fill
                    sizes="(max-width: 640px) 96px, 128px"
                    className="object-cover"
                  />
                ) : (
                  <Building className="h-12 w-12 text-foreground-muted" />
                )}
              </div>

              {/* Título e info */}
              <div className="flex flex-col gap-2 text-white pb-2">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight flex items-center gap-2">
                  {company.name}
                  {company.is_verified && (
                    <BadgeCheck className="h-8 w-8 text-primary fill-white" />
                  )}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm font-medium">
                  {company.phone && (
                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Phone className="h-4 w-4 text-white" />
                      {company.phone}
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Globe className="h-4 w-4 text-white" />
                      <a
                        href={
                          company.website.startsWith("http")
                            ? company.website
                            : `https://${company.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Sitio Web
                      </a>
                    </div>
                  )}
                  {company.linkedin_url && (
                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Link className="h-4 w-4 text-white" />
                      <a
                        href={
                          company.linkedin_url.startsWith("http")
                            ? company.linkedin_url
                            : `https://${company.linkedin_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Users className="h-4 w-4 text-white" />
                      {company.size}
                    </div>
                  )}
                  {company.localities?.ciudad && (
                    <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <MapPin className="h-4 w-4 text-white" />
                      {company.localities.ciudad}{" "}
                      {company.address ? `- ${company.address}` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Columna Izquierda: Info de Empresa */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Advertencia si está inactiva */}
          {!company.is_active && isOwner && (
            <div className="flex items-start gap-3 rounded-md bg-zinc-800 p-4 text-zinc-100 shadow-sm">
              <ShieldAlert className="h-6 w-6 shrink-0 text-zinc-400" />
              <div>
                <h3 className="font-bold text-white">Empresa Oculta</h3>
                <p className="text-sm mt-1 text-zinc-300">
                  Solo tú puedes ver esta página. Los candidatos no pueden ver
                  tu empresa ni tus ofertas.
                </p>
              </div>
            </div>
          )}

          {/* Advertencia si no está verificado */}
          {!company.is_verified && (
            <div className="flex items-start gap-3 rounded-md bg-amber-50 p-4 text-amber-800 ring-1 ring-amber-500/30 shadow-sm">
              <ShieldAlert className="h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-amber-900">
                  Empresa no verificada
                </h3>
                <p className="text-sm mt-1">
                  Recomendamos precaución antes de compartir información
                  confidencial.
                </p>
              </div>
            </div>
          )}

          {/* Tarjeta "Sobre Nosotros" */}
          <div className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              Sobre Nosotros
            </h3>
            <p className="text-foreground-muted leading-relaxed text-sm whitespace-pre-line">
              {company.detailed_description ||
                company.description ||
                "Esta empresa no ha agregado una descripción detallada todavía."}
            </p>
          </div>
        </div>

        {/* Columna Derecha: Empleos */}
        <div className="lg:col-span-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground mb-6">
            Ofertas de Empleo
          </h2>

          <div className="flex flex-col items-center justify-center p-12 text-center radius-predefined bg-white ring-1 ring-border border-dashed">
            <Building className="h-12 w-12 text-border mb-4" />
            <h3 className="text-lg font-bold text-foreground">Sin empleos</h3>
            <p className="text-foreground-muted mt-2">
              Esta empresa aún no ha publicado ofertas de empleo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
