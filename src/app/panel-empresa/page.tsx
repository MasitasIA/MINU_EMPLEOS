import { getUser } from "@/lib/session";
import { getCompanyByOwner } from "@/app/actions/companies";
import { getJobsByCompany } from "@/app/actions/jobs";
import { getApplicationsForCompany } from "@/app/actions/applications";
import { getAllLocalities } from "@/app/actions/localities";
import { redirect } from "next/navigation";
import { CreateCompanyForm } from "@/components/job-portal/CreateCompanyForm";
import { JobActions } from "@/components/job-portal/JobActions";
import Link from "next/link";
import { PlusCircle, Briefcase, Settings, Users, Star } from "lucide-react";

export const metadata = {
  title: "Panel de Empresa | Minú Empleos",
};

export default async function CompanyPanelPage() {
  const user = await getUser();
  if (!user) {
    redirect("/iniciar");
  }

  const company = await getCompanyByOwner(user.id);
  const localities = await getAllLocalities();
  
  let jobs: any[] = [];
  let applications: any[] = [];
  
  if (company) {
    jobs = await getJobsByCompany(company.id);
    applications = await getApplicationsForCompany(company.id);
  }

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!company ? (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                Registra tu Empresa
              </h1>
              <p className="mt-2 text-lg text-foreground-muted">
                Crea tu perfil de empresa para publicar ofertas de empleo.
              </p>
            </div>
            <CreateCompanyForm localities={localities} />
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl flex items-center gap-3">
                  {company.name}
                  {company.is_verified && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      Verificada
                    </span>
                  )}
                </h1>
                <p className="mt-2 text-foreground-muted">
                  ID de empresa (Slug):{" "}
                  <span className="font-mono text-sm">{company.id}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/panel-empresa/ajustes"
                  className="inline-flex items-center justify-center radius-button border border-border bg-white px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-surface-muted"
                >
                  <Settings className="mr-2 h-4 w-4" /> Ajustes
                </Link>
                <Link
                  href="/panel-empresa/empleos/nuevo"
                  className="inline-flex items-center justify-center radius-button bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Publicar Empleo
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-10">
              <div className="radius-predefined bg-white p-6 shadow-sm border border-border">
                <div className="flex items-center text-foreground-muted mb-2">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold text-sm">Empleos Activos</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{jobs.length}</p>
              </div>

              <div className="radius-predefined bg-white p-6 shadow-sm border border-border">
                <div className="flex items-center text-foreground-muted mb-2">
                  <Users className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold text-sm">Postulaciones Recibidas</h3>
                </div>
                <p className="text-3xl font-bold text-foreground">{applications.length}</p>
              </div>
            </div>

            <div className="radius-predefined bg-white shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-5 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">
                  Tus Ofertas de Empleo
                </h3>
              </div>
              
              {jobs.length === 0 ? (
                <div className="p-12 text-center text-foreground-muted">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Aún no has publicado ninguna oferta de empleo.</p>
                  <Link
                    href="/panel-empresa/empleos/nuevo"
                    className="text-primary hover:underline font-semibold mt-2 inline-block"
                  >
                    Publica tu primer empleo
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {jobs.map((job) => (
                    <li key={job.id} className="p-6 hover:bg-surface-muted transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <Link href={`/empleos/${job.slug}`} className="text-lg font-bold text-primary hover:underline">
                            {job.name}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4" /> {job.categories?.name || 'Categoría no definida'}
                            </span>
                            <span className="flex items-center gap-1">
                              {job.is_active ? (
                                <span className="text-green-600 font-semibold">• Activo</span>
                              ) : (
                                <span className="text-amber-500 font-semibold">• Pausado</span>
                              )}
                            </span>
                            <div className="text-sm font-bold text-foreground bg-surface px-3 py-0.5 rounded-full ring-1 ring-border shadow-sm">
                              {applications.filter(a => a.job_id === job.id).length} postulaciones
                            </div>
                          </div>
                        </div>
                        
                        <JobActions 
                          jobId={job.id} 
                          jobSlug={job.slug} 
                          isActive={job.is_active} 
                          jobName={job.name}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
