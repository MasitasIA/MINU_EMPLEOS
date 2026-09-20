"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

interface HeroSearchProps {
  localities: { id: string; ciudad: string; slug: string }[];
}

export function HeroSearch({ localities }: HeroSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [locality, setLocality] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (locality) params.set("locality", locality);
    
    router.push(`/empleos?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-3xl radius-predefined bg-white p-3 shadow-xl shadow-primary/10 ring-1 ring-border">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-foreground-subtle" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full radius-predefined bg-surface-muted pl-12 pr-4 text-foreground placeholder:text-foreground-muted outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
            placeholder="Puesto o palabra clave"
          />
        </div>

        <div className="h-px w-full bg-surface-muted sm:h-12 sm:w-px"></div>

        <div className="relative sm:w-56">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <MapPin className="h-5 w-5 text-foreground-subtle" />
          </div>
          <select 
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="h-12 w-full appearance-none radius-predefined bg-surface-muted pl-12 pr-8 text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Todas las zonas</option>
            {localities.map((loc) => (
              <option key={loc.id} value={loc.slug}>
                {loc.ciudad}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="h-12 radius-button bg-primary px-8 font-bold text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 active:scale-95">
          Buscar
        </button>
      </div>
    </form>
  );
}
