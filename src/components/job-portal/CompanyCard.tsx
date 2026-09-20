import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Building } from "lucide-react";

interface CompanyCardProps {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category_id?: string;
  is_verified?: boolean;
  cover_url?: string;
  categories?: { name: string } | null;
}

export function CompanyCard({
  id,
  name,
  description,
  image_url,
  is_verified,
  cover_url,
  categories,
}: CompanyCardProps) {
  return (
    <Link
      href={`/empresas/${id}`}
      className="group relative flex flex-col overflow-hidden radius-predefined bg-white shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"
    >
      {/* Portada */}
      <div className="relative h-24 w-full bg-gradient-to-br from-primary/20 via-surface-muted to-primary/10 radius-t-predefined overflow-hidden">
        {cover_url && (
          <Image
            src={cover_url}
            alt={`Portada de ${name}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {cover_url && <div className="absolute inset-0 bg-black/20" />}

        {/* Etiqueta de categoría (Rubro) */}
        {categories && (
          <div className="absolute top-3 right-3 radius-predefined bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
            {categories.name}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        {/* Logo de la empresa */}
        <div className="relative -mt-10 mb-3 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-sm transition-transform duration-500 group-hover:scale-105">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <Building className="h-10 w-10 text-foreground-muted" />
          )}
        </div>

        <div className="mb-1 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {name}
            {is_verified && (
              <BadgeCheck className="h-4 w-4 text-primary fill-primary/10" />
            )}
          </h3>
        </div>

        <p className="mb-4 mt-2 line-clamp-2 text-sm text-foreground-muted flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center text-sm font-bold text-primary transition-colors">
            Ver Perfil y Empleos
          </span>
        </div>
      </div>
    </Link>
  );
}
