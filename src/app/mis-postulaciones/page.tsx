import { getUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getMyApplications } from "@/app/actions/applications";
import Link from "next/link";
import { Briefcase, ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Mis Postulaciones | Minú Empleos",
};

export default async function MisPostulacionesPage() {
  const user = await getUser();
  if (!user) {
    redirect("/iniciar");
  }

  const applications = await getMyApplications();

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/mi-cuenta"
            className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Volver a mi cuenta
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center radius-predefined bg-primary/10 text-primary">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Mis Postulaciones
            </h1>
            <p className="mt-1 text-foreground-muted">
              Seguimiento de las ofertas de empleo a las que te has postulado.
            </p>
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app: any) => (
              <div key={app.id} className="radius-predefined bg-white p-6 shadow-sm ring-1 ring-border flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden radius-predefined ring-1 ring-border bg-surface-muted flex items-center justify-center">
                  {app.jobs?.companies?.image_url ? (
                    <Image
                      src={app.jobs.companies.image_url}
                      alt={app.jobs.companies.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Briefcase className="h-8 w-8 text-foreground-muted" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">
                    <Link href={`/empleos/${app.jobs?.slug}`} className="hover:text-primary hover:underline">
                      {app.jobs?.name}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-foreground-muted">
                    <Link href={`/empresas/${app.jobs?.companies?.id}`} className="hover:text-foreground">
                      {app.jobs?.companies?.name}
                    </Link>
                    <span>•</span>
                    <span>Postulado el {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  {app.status === 'pending' && (
                    <span className="inline-flex items-center gap-1.5 radius-predefined bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 ring-1 ring-amber-600/20">
                      <Clock className="h-4 w-4" />
                      En Revisión
                    </span>
                  )}
                  {app.status === 'reviewed' && (
                    <span className="inline-flex items-center gap-1.5 radius-predefined bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-600/20">
                      <CheckCircle2 className="h-4 w-4" />
                      Revisado
                    </span>
                  )}
                  {app.status === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 radius-predefined bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 ring-1 ring-red-600/20">
                      <XCircle className="h-4 w-4" />
                      Rechazado
                    </span>
                  )}
                  {app.status === 'accepted' && (
                    <span className="inline-flex items-center gap-1.5 radius-predefined bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 ring-1 ring-green-600/20">
                      <CheckCircle2 className="h-4 w-4" />
                      Aceptado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="radius-predefined bg-white p-12 text-center ring-1 ring-border border-dashed shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-border mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Aún no tienes postulaciones</h3>
            <p className="text-foreground-muted mb-6">
              Explora las ofertas de empleo disponibles y postúlate a las que más te interesen.
            </p>
            <Link
              href="/empleos"
              className="inline-flex items-center justify-center radius-button bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
            >
              Buscar Empleos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
