import { CompanyCard } from "./CompanyCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface FeaturedCompaniesProps {
  companies: any[];
}

export function FeaturedCompanies({ companies }: FeaturedCompaniesProps) {
  if (!companies || companies.length === 0) return null;

  return (
    <section className="bg-surface-muted py-16 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Empresas Destacadas
            </h2>
            <p className="mt-2 text-foreground-muted">
              Descubre empresas contratando ahora.
            </p>
          </div>
          <Link
            href="/empresas"
            className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline sm:flex"
          >
            Ver todas las empresas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

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

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/empresas"
            className="inline-flex items-center justify-center gap-2 radius-button border border-border bg-white px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-muted"
          >
            Ver todas las empresas
          </Link>
        </div>
      </div>
    </section>
  );
}
