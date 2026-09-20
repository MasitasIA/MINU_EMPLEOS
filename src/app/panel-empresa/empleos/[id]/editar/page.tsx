import { getUser } from "@/lib/session";
import { getCompanyByOwner } from "@/app/actions/companies";
import { getJobById } from "@/app/actions/jobs";
import { getAllCategories } from "@/app/actions/categories";
import { getAllLocalities } from "@/app/actions/localities";
import { redirect, notFound } from "next/navigation";
import { CreateJobForm } from "@/components/job-portal/CreateJobForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Editar Empleo | Minú Empleos",
};

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const user = await getUser();
  
  if (!user) {
    redirect("/iniciar");
  }

  const company = await getCompanyByOwner(user.id);
  
  if (!company) {
    redirect("/panel-empresa");
  }

  const job = await getJobById(resolvedParams.id);

  if (!job || job.company_id !== company.id) {
    notFound();
  }

  const categories = await getAllCategories();
  const localities = await getAllLocalities();

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <Link
            href="/panel-empresa"
            className="inline-flex items-center text-sm font-medium text-foreground-muted hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Editar Oferta de Empleo
          </h1>
          <p className="mt-2 text-lg text-foreground-muted">
            Modifica los detalles de "{job.name}".
          </p>
        </div>

        <CreateJobForm 
          companyId={company.id} 
          categories={categories}
          localities={localities}
          initialData={job}
        />
      </div>
    </div>
  );
}
