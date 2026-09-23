import { notFound } from "next/navigation";
import { getProfileByUsername, getResumeSignedUrl } from "@/app/actions/auth";
import { getUser } from "@/lib/session";
import Image from "next/image";
import { UserCircle, ShieldAlert, Phone, FileText, MapPin, Briefcase, Car } from "lucide-react";
import Link from "next/link";

export default async function CandidateProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const profile = await getProfileByUsername(username);

  if (!profile) {
    notFound();
  }

  const currentUser = await getUser();
  const isOwner = currentUser?.id === profile.id;

  if (!profile.is_public && !isOwner) {
    notFound();
  }

  let resumeSignedUrl = null;
  if (profile.resume_url) {
    if (profile.resume_url.startsWith("http")) {
      resumeSignedUrl = profile.resume_url;
    } else {
      const response = await getResumeSignedUrl(profile.resume_url);
      if (response.success && response.url) {
        resumeSignedUrl = response.url;
      }
    }
  }

  return (
    <div className="bg-surface-muted min-h-screen pb-16">
      {/* Banner de Cabecera (Sencillo) */}
      <div className="w-full h-32 sm:h-48 bg-slate-800 bg-gradient-to-r from-slate-900 to-slate-800"></div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10">
        {/* Advertencia si está oculto */}
        {!profile.is_public && isOwner && (
          <div className="mb-6 flex items-start gap-3 rounded-md bg-zinc-800 p-4 text-zinc-100 shadow-sm">
            <ShieldAlert className="h-6 w-6 shrink-0 text-zinc-400" />
            <div>
              <h3 className="font-bold text-white">Perfil Oculto</h3>
              <p className="text-sm mt-1 text-zinc-300">
                Solo tú puedes ver esta página porque marcaste tu perfil como
                privado. Las empresas no pueden verte a menos que te postules a
                sus ofertas.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white radius-predefined shadow-sm ring-1 ring-border p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start text-center sm:text-left">
            {/* Avatar */}
            <div className="relative h-32 w-32 shrink-0 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-surface-muted flex items-center justify-center">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.username}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <UserCircle className="h-16 w-16 text-foreground-muted" />
              )}
            </div>

            {/* Info Principal */}
            <div className="flex-1 mt-2">
              <h1 className="text-3xl font-extrabold text-foreground">
                {profile.full_name || profile.username}
              </h1>
              {profile.title && (
                <p className="text-lg font-medium text-primary mt-1">
                  {profile.title}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm font-medium text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <UserCircle className="h-4 w-4" /> @{profile.username}
                </span>

                {profile.phone && (
                  <a
                    href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-full hover:underline font-bold"
                  >
                    <Phone className="h-4 w-4" />{" "}
                    {profile.phone}
                  </a>
                )}

                {profile.linkedin_url && (
                  <a
                    href={
                      profile.linkedin_url.startsWith("http")
                        ? profile.linkedin_url
                        : `https://${profile.linkedin_url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 hover:underline bg-blue-50 px-2.5 py-1 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Detalles Adicionales */}
          {(profile.localities || profile.availability || profile.mobility) && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8">
              {profile.localities && (
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center radius-predefined bg-surface-muted text-foreground-muted">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-foreground-muted">Localidad</p>
                    <p className="text-sm font-medium text-foreground">{profile.localities.ciudad}</p>
                  </div>
                </div>
              )}
              {profile.availability && (
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center radius-predefined bg-surface-muted text-foreground-muted">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-foreground-muted">Disponibilidad</p>
                    <p className="text-sm font-medium text-foreground">{profile.availability}</p>
                  </div>
                </div>
              )}
              {profile.mobility && (
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center radius-predefined bg-surface-muted text-foreground-muted">
                    <Car className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-foreground-muted">Movilidad</p>
                    <p className="text-sm font-medium text-foreground">{profile.mobility}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Habilidades */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">Habilidades</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center radius-predefined bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Biografía */}
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Sobre Mí</h2>
            {profile.bio ? (
              <p className="text-foreground-muted leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            ) : (
              <p className="text-foreground-muted italic">
                Este usuario aún no ha escrito una biografía.
              </p>
            )}
          </div>

          {/* Currículum */}
          {resumeSignedUrl && (
            <div className="mt-8 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Currículum Vitae
              </h2>
              <a
                href={resumeSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center radius-button bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:brightness-110"
              >
                <FileText className="mr-2 h-5 w-5" />
                Ver Currículum (PDF)
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
