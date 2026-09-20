import { getAllCompanies } from "@/app/actions/companies";
import { CompanyCard } from "@/components/job-portal/CompanyCard";
import { Building } from "lucide-react";

export const metadata = {
  title: "Directorio de Empresas | Minú Empleos",
  description: "Encuentra empresas locales que están contratando.",
};

export default async function EmpresasPage() {
  const companies = await getAllCompanies();

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Building className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Directorio de Empresas
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground-muted">
            Descubre todas las empresas locales registradas en nuestra plataforma.
            Explora sus perfiles para conocer su cultura y vacantes disponibles.
          </p>
        </div>

        {companies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {companies.map((company) => (
              <CompanyCard
                key={company.id}
                id={company.id}
                name={company.name}
                description={company.description}
                image_url={company.image_url}
                category_id={company.category_id}
                is_verified={company.is_verified}
                cover_url={company.cover_url}
                categories={company.categories}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center radius-predefined bg-white ring-1 ring-border border-dashed">
            <Building className="h-12 w-12 text-border mb-4" />
            <h3 className="text-lg font-bold text-foreground">Sin empresas</h3>
            <p className="text-foreground-muted mt-2">
              Aún no hay empresas registradas en la plataforma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
