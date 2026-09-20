import { getUser } from "@/lib/session";
import { getCompanyByOwner } from "@/app/actions/companies";
import { getAllCategories } from "@/app/actions/categories";
import { getAllLocalities } from "@/app/actions/localities";
import { redirect } from "next/navigation";
import { CompanySettingsForm } from "@/components/job-portal/CompanySettingsForm";

export const metadata = {
  title: "Ajustes de Empresa | Minú Empleos",
};

export default async function CompanySettingsPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Ajustes de la Empresa
          </h1>
          <p className="mt-2 text-foreground-muted">
            Modifica la información pública de tu empresa, categorías y más.
          </p>
        </div>

        <CompanySettingsForm company={company} categories={categories} localities={localities} />
      </div>
    </div>
  );
}
