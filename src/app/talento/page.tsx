import { getAllPublicProfiles } from "@/app/actions/auth";
import Image from "next/image";
import Link from "next/link";
import { UserCircle, MapPin, Users, Phone } from "lucide-react";

export const metadata = {
  title: "Directorio de Talentos | Minú Empleos",
  description: "Encuentra a los mejores profesionales en nuestra plataforma.",
};

export default async function TalentDirectoryPage() {
  const profiles = await getAllPublicProfiles();

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
              Directorio de Talentos
            </h1>
            <p className="mt-2 text-lg text-foreground-muted max-w-3xl">
              Descubre profesionales destacados y conectá con el talento que tu empresa necesita.
            </p>
          </div>
          
          <div className="flex items-center gap-2 radius-predefined bg-white px-4 py-2 ring-1 ring-border shadow-sm">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">{profiles.length} Perfiles Públicos</span>
          </div>
        </div>

        {/* Grid de Talentos */}
        {profiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {profiles.map((profile) => (
              <div 
                key={profile.id} 
                className="group flex flex-col bg-white radius-predefined shadow-sm ring-1 ring-border hover:shadow-md hover:ring-primary/30 transition-all overflow-hidden"
              >
                {/* Cabecera de la tarjeta con gradiente sutil */}
                <div className="h-20 bg-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 relative"></div>
                
                <div className="px-3 sm:px-6 flex flex-col flex-1 relative">
                  {/* Avatar superpuesto */}
                  <div className="relative -mt-8 sm:-mt-10 mb-2 sm:mb-3 h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full overflow-hidden ring-2 sm:ring-4 ring-white shadow-sm bg-surface-muted self-center">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.full_name || profile.username}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <UserCircle className="h-full w-full text-foreground-muted p-1" />
                    )}
                  </div>
                  
                  {/* Información */}
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-1">
                      {profile.full_name || profile.username}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-primary mt-1 line-clamp-1">
                      {profile.title || "Profesional en Minú"}
                    </p>
                    
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-foreground-muted line-clamp-2 sm:line-clamp-3 text-left">
                      {profile.bio || "Este usuario aún no ha agregado una descripción a su perfil."}
                    </p>

                    {profile.localities && (
                      <div className="mt-3 flex items-center justify-center sm:justify-start text-xs text-foreground-muted">
                        <MapPin className="mr-1 h-3.5 w-3.5" />
                        <span className="truncate">{profile.localities.ciudad}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer / Acción */}
                  <div className="mt-4 sm:mt-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-border mt-auto flex gap-2">
                    <Link
                      href={`/candidatos/${profile.username}`}
                      className="flex-1 flex items-center justify-center radius-button bg-surface px-2 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm font-bold text-foreground ring-1 ring-border hover:bg-surface-muted hover:text-primary transition-colors text-center"
                    >
                      Ver Perfil
                    </Link>
                    {profile.phone && (
                      <a
                        href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-none flex items-center justify-center radius-button bg-green-500 hover:bg-green-600 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm font-bold text-white transition-colors"
                        title="Contactar por WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="radius-predefined bg-white p-12 text-center ring-1 ring-border shadow-sm">
            <UserCircle className="mx-auto h-12 w-12 text-border mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Aún no hay perfiles públicos
            </h3>
            <p className="text-foreground-muted">
              Los candidatos que decidan hacer público su perfil aparecerán en este directorio.
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
}
