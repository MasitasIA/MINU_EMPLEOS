import { getUser } from "@/lib/session";
import { getCompanyByOwner } from "@/app/actions/companies";
import { getAllCategories } from "@/app/actions/categories";
import { getAllLocalities } from "@/app/actions/localities";
import { redirect } from "next/navigation";
import { CreateJobForm } from "@/components/job-portal/CreateJobForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Publicar Empleo | Minú Empleos",
};

export default async function NewJobPage() {
  const user = await getUser();
  if (!user) {
    redirect("/iniciar");
  }

  const company = await getCompanyByOwner(user.id);
  if (!company) {
    redirect("/panel-empresa");
  }

  const categories = await getAllCategories();
  const localities = await getAllLocalities();

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/panel-empresa"
            className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-primary"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Volver al panel
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Publicar Nuevo Empleo
          </h1>
          <p className="mt-2 text-foreground-muted">
            Completa los detalles de la oferta para encontrar a los mejores candidatos.
          </p>
        </div>

        <CreateJobForm
          companyId={company.id}
          categories={categories}
          localities={localities}
        />
      </div>
    </div>
  );
}
