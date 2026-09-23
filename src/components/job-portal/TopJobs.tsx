import { JobCard } from "./JobCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TopJobsProps {
  jobs: any[];
}

export function TopJobs({ jobs }: TopJobsProps) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Nuevas Ofertas
            </h2>
            <p className="mt-2 text-foreground-muted">
              Descubre las vacantes más recientes.
            </p>
          </div>
          <Link
            href="/empleos"
            className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline sm:flex"
          >
            Ver todos los empleos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              slug={job.slug}
              companyId={job.company_id}
              companyName={job.companies?.name || 'Empresa'}
              companyImage={job.companies?.image_url}
              name={job.name}
              jobType={job.job_type}
              modality={job.modality}
              salaryMin={job.salary_min}
              salaryMax={job.salary_max}
              locality={job.localities?.ciudad}
              category={job.categories?.name}
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/empleos"
            className="inline-flex items-center justify-center gap-2 radius-button border border-border bg-white px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-muted"
          >
            Ver todos los empleos
          </Link>
        </div>
      </div>
    </section>
  );
}
