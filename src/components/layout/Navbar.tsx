"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Search, Briefcase, Building, FileText } from "lucide-react";
import Image from "next/image";
import { AuthModal } from "@/components/ui/AuthModal";
import { UserSession } from "@/lib/session";

export function Navbar({ user }: { user: UserSession | null }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/empleos?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/Logo.svg"
              alt="Minú Empleos Logo"
              width={120}
              height={120}
              priority
              className="w-20 h-20 md:w-24 md:h-24"
            />
          </Link>

          {/* Buscador - Desktop */}
          <div className="hidden flex-1 items-center justify-center px-8 md:flex">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar empleos o empresas..."
                className="w-full radius-predefined border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                aria-label="Buscar empleos o empresas"
              />
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            </form>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/empleos"
              className="flex items-center gap-1.5 radius-button p-2 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-primary"
            >
              <Briefcase className="h-5 w-5 sm:hidden" />
              <span className="hidden text-sm font-medium sm:block">
                Empleos
              </span>
            </Link>

            <Link
              href="/panel-empresa"
              className="flex items-center gap-1.5 radius-button p-2 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-primary"
            >
              <Building className="h-5 w-5 sm:hidden" />
              <span className="hidden text-sm font-medium sm:block">
                Para Empresas
              </span>
            </Link>

            {user && (
              <Link
                href="/mis-postulaciones"
                className="flex items-center gap-1.5 radius-button p-2 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-primary"
              >
                <FileText className="h-5 w-5 sm:hidden" />
                <span className="hidden text-sm font-medium sm:block">
                  Mis Postulaciones
                </span>
              </Link>
            )}

            <div className="h-6 w-px bg-border hidden sm:block"></div>

            {user ? (
              <Link
                href="/mi-cuenta"
                className="flex items-center gap-1.5 radius-button p-2 text-primary font-bold transition-colors hover:bg-primary/10"
              >
                <User className="h-5 w-5" />
                <span className="hidden text-sm sm:block">Mi Cuenta</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                aria-label="Ingresar a mi cuenta"
                className="flex items-center gap-1.5 radius-button p-2 text-foreground-muted transition-colors hover:bg-surface-muted hover:text-primary"
              >
                <User className="h-5 w-5" />
                <span className="hidden text-sm font-medium sm:block">
                  Ingresar
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Buscador - Móvil */}
        <div className="border-t border-border p-3 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar empleos..."
              className="w-full radius-predefined border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              aria-label="Buscar en móvil"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          </form>
        </div>
      </header>

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
