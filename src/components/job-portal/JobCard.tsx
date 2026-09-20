import Link from "next/link";
import Image from "next/image";
import { Briefcase, MapPin, DollarSign, Building } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface JobCardProps {
  id: string;
  slug: string;
  companyId: string;
  companyName: string;
  companyImage?: string;
  name: string;
  jobType: string;
  modality: string;
  salaryMin?: number;
  salaryMax?: number;
  locality?: string;
}

export function JobCard({
  id,
  slug,
  companyId,
  companyName,
  companyImage,
  name,
  jobType,
  modality,
  salaryMin,
  salaryMax,
  locality,
}: JobCardProps) {
  return (
    <div className="group relative flex flex-col radius-predefined bg-white p-5 shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <Link href={`/empresas/${companyId}`} className="shrink-0">
          <div className="relative h-12 w-12 overflow-hidden radius-predefined bg-surface-muted border border-border">
            {companyImage ? (
              <Image
                src={companyImage}
                alt={companyName}
                fill
                className="object-cover"
              />
            ) : (
              <Building className="absolute inset-0 m-auto h-6 w-6 text-foreground-muted" />
            )}
          </div>
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link
            href={`/empresas/${companyId}`}
            className="text-xs font-medium text-foreground-subtle hover:text-primary transition-colors"
          >
            {companyName}
          </Link>
          <Link href={`/empleos/${slug}`}>
            <h3 className="mb-1 text-base font-bold text-foreground transition-colors group-hover:text-primary truncate">
              {name}
            </h3>
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 radius-predefined bg-surface-muted px-2 py-1 text-xs font-medium text-foreground-muted">
              <Briefcase className="h-3 w-3" />
              {jobType}
            </span>
            <span className="inline-flex items-center gap-1 radius-predefined bg-surface-muted px-2 py-1 text-xs font-medium text-foreground-muted">
              <MapPin className="h-3 w-3" />
              {modality} {locality ? `- ${locality}` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
          <DollarSign className="h-4 w-4 text-primary" />
          {salaryMin ? (
            <>
              {formatCurrency(salaryMin)}
              {salaryMax ? ` - ${formatCurrency(salaryMax)}` : '+'}
            </>
          ) : (
            <span className="text-foreground-muted font-normal text-xs">Salario a convenir</span>
          )}
        </div>
        <Link
          href={`/empleos/${slug}`}
          className="text-sm font-bold text-primary hover:underline"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
