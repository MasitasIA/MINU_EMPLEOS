import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, Briefcase, Building, Clock, ChevronRight, CheckCircle2, Tag } from "lucide-react";
import { getJobById } from "@/app/actions/jobs";
import Image from "next/image";
import { recordJobView } from "@/app/actions/stats";
import { ApplyJobButton } from "@/components/job-portal/ApplyJobButton";
import { getUser } from "@/lib/session";
import { hasUserAppliedToJob } from "@/app/actions/applications";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  
  // En Next.js app router, el parámetro de la URL se inyecta por el nombre de la carpeta
  // La carpeta se llama [id] pero contiene el slug del empleo.
  const slug = resolvedParams.id;
  
  const job = await getJobById(slug);

  if (!job) {
    notFound();
  }

  // Registrar visita
  await recordJobView(job.id);

  // Obtener usuario actual y verificar si ya postuló
  const user = await getUser();
  let hasApplied = false;
  if (user) {
    hasApplied = await hasUserAppliedToJob(job.id, user.id);
  }

  return (
    <div className="bg-surface-muted min-h-screen pb-16">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-foreground-muted">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <ChevronRight className="mx-2 h-4 w-4 shrink-0" />
            <Link href="/empleos" className="hover:text-primary">Empleos</Link>
            <ChevronRight className="mx-2 h-4 w-4 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">{job.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal: Info del Empleo */}
        <div className="lg:col-span-8 space-y-6">
          <div className="radius-predefined bg-white p-6 sm:p-8 shadow-sm ring-1 ring-border">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Logo Empresa */}
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden radius-predefined ring-1 ring-border bg-white flex items-center justify-center">
                {job.companies?.image_url ? (
                  <Image
                    src={job.companies.image_url}
                    alt={job.companies?.name || "Empresa"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Building className="h-10 w-10 text-foreground-muted" />
                )}
              </div>

              {/* Título e Info Básica */}
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
                  {job.name}
                </h1>
                <div className="flex items-center gap-2 text-lg text-foreground-muted mb-4">
                  <Building className="h-5 w-5" />
                  <Link href={`/empresas/${job.companies?.id}`} className="hover:text-primary hover:underline font-medium">
                    {job.companies?.name || "Empresa Confidencial"}
                  </Link>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 radius-predefined bg-surface-muted px-3 py-1.5 text-sm font-medium text-foreground-muted">
                    <MapPin className="h-4 w-4" />
                    {job.localities?.ciudad || job.modality} {job.address ? `- ${job.address}` : ""}
                  </div>
                  <div className="flex items-center gap-1.5 radius-predefined bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                    <Briefcase className="h-4 w-4" />
                    {job.job_type}
                  </div>
                  <div className="flex items-center gap-1.5 radius-predefined bg-surface-muted px-3 py-1.5 text-sm font-medium text-foreground-muted">
                    <Clock className="h-4 w-4" />
                    {new Date(job.created_at).toLocaleDateString()}
                  </div>
                  {job.categories?.name && (
                    <div className="flex items-center gap-1.5 radius-predefined bg-surface-muted px-3 py-1.5 text-sm font-medium text-foreground-muted">
                      <Tag className="h-4 w-4" />
                      {job.categories.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Descripción del Empleo</h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-foreground-muted whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div className="mt-8 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Requisitos</h2>
                <div className="prose prose-sm sm:prose-base max-w-none text-foreground-muted whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Resumen y Acción */}
        <div className="lg:col-span-4 space-y-6">
          <div className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border sticky top-24">
            <h3 className="text-lg font-bold text-foreground mb-4">Resumen</h3>
            
            <dl className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Salario</dt>
                <dd className="font-medium text-foreground">
                  {job.salary_min && job.salary_max 
                    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                    : "A convenir"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Vacantes</dt>
                <dd className="font-medium text-foreground">{job.vacancies || 1}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Modalidad</dt>
                <dd className="font-medium text-foreground">{job.modality}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground-muted">Jornada</dt>
                <dd className="font-medium text-foreground">{job.job_type}</dd>
              </div>
            </dl>

            <div className="pt-6 border-t border-border">
              {hasApplied ? (
                <div className="w-full flex items-center justify-center gap-2 radius-button bg-green-50 border border-green-200 text-green-700 py-3 font-bold px-4 text-center cursor-default">
                  <CheckCircle2 className="h-5 w-5" />
                  Ya te postulaste a este empleo
                </div>
              ) : (
                <ApplyJobButton jobId={job.id} isAuthenticated={!!user} />
              )}
            </div>
            
            {!user && (
              <p className="mt-3 text-xs text-center text-foreground-muted">
                Debes <Link href="/iniciar" className="text-primary hover:underline">iniciar sesión</Link> y completar tu perfil para postularte.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
