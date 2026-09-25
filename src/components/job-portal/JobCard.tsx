import Link from "next/link";
import Image from "next/image";
import { Briefcase, MapPin, DollarSign, Building, Tag } from "lucide-react";
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
  salaryMin?: number | null;
  salaryMax?: number | null;
  locality?: string;
  category?: string;
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
  category,
}: JobCardProps) {
  return (
    <div className="group relative flex flex-col justify-between radius-predefined bg-white p-4 shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <div className="flex flex-col items-start gap-3">
        {/* Company Logo */}
        <Link 
          href={`/empresas/${companyId}`} 
          className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-predefined"
        >
          <div className="relative h-12 w-12 overflow-hidden radius-predefined bg-surface-muted border border-border">
            {companyImage ? (
               <Image
                 src={companyImage}
                 alt={companyName}
                 fill
                 sizes="48px"
                 className="object-cover"
               />
            ) : (
               <Building className="absolute inset-0 m-auto h-6 w-6 text-foreground-muted" />
            )}
          </div>
        </Link>
        
        <div className="flex-1 w-full min-w-0">
          <Link
            href={`/empresas/${companyId}`}
            className="text-xs font-medium text-foreground-subtle hover:text-primary transition-colors focus:outline-none focus-visible:underline"
          >
            {companyName}
          </Link>
          <Link 
            href={`/empleos/${slug}`}
            className="block mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary radius-predefined"
          >
            <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2 leading-tight">
              {name}
            </h3>
          </Link>
          
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {category && (
              <span className="inline-flex items-center gap-1 radius-predefined bg-surface-muted px-2 py-1 text-xs font-medium text-foreground-muted truncate max-w-full">
                <Tag className="h-3 w-3 shrink-0" />
                <span className="truncate">{category}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 radius-predefined bg-surface-muted px-2 py-1 text-xs font-medium text-foreground-muted whitespace-nowrap">
              <Briefcase className="h-3 w-3 shrink-0" />
              {jobType}
            </span>
            <span className="inline-flex items-center gap-1 radius-predefined bg-surface-muted px-2 py-1 text-xs font-medium text-foreground-muted whitespace-nowrap">
              <MapPin className="h-3 w-3 shrink-0" />
              {modality} {locality ? `- ${locality}` : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-start gap-1.5 text-sm font-semibold text-foreground">
          <DollarSign className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span className="leading-tight">
            {salaryMin ? (
              <>
                {formatCurrency(salaryMin)}
                {salaryMax ? ` - ${formatCurrency(salaryMax)}` : '+'}
              </>
            ) : (
              <span className="text-foreground-muted font-normal text-sm">Salario a convenir</span>
            )}
          </span>
        </div>
        <Link
          href={`/empleos/${slug}`}
          className="w-full text-center radius-button bg-primary/10 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
