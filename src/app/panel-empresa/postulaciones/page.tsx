import { getUser } from "@/lib/session";
import { getCompanyByOwner } from "@/app/actions/companies";
import { getApplicationsForCompany } from "@/app/actions/applications";
import { redirect } from "next/navigation";
import { ApplicationsList } from "@/components/job-portal/ApplicationsList";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export const metadata = {
  title: "Postulantes | Panel de Empresa",
};

export default async function PostulacionesPage() {
  const user = await getUser();
  if (!user) {
    redirect("/iniciar");
  }

  const company = await getCompanyByOwner(user.id);
  if (!company) {
    redirect("/panel-empresa");
  }

  const applications = await getApplicationsForCompany(company.id);

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/panel-empresa"
            className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Volver al panel
          </Link>
        </div>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center radius-predefined bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">
              Candidatos y Postulaciones
            </h1>
            <p className="mt-1 text-foreground-muted">
              Revisa y gestiona las personas que aplicaron a tus ofertas de empleo.
            </p>
          </div>
        </div>

        <ApplicationsList applications={applications} />
      </div>
    </div>
  );
}
