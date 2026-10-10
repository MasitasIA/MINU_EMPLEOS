"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

interface HeroSearchProps {
  categories: { id: string; name: string; slug: string }[];
  localities: { id: string; ciudad: string; slug: string }[];
  facetsData: any[];
}

export function HeroSearch({ categories, localities, facetsData }: HeroSearchProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [locality, setLocality] = useState("");

  const categoryFilterId = React.useMemo(
    () => categories.find((c) => c.slug === category)?.id,
    [categories, category]
  );
  const localityFilterId = React.useMemo(
    () => localities.find((l) => l.slug === locality)?.id,
    [localities, locality]
  );

  const counts = React.useMemo(() => {
    const newCounts = {
      categories: {} as Record<string, number>,
      localities: {} as Record<string, number>,
    };

    facetsData.forEach((job) => {
      const matchQ = !search || job.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = !categoryFilterId || job.category_id === categoryFilterId;
      const matchLoc = !localityFilterId || job.locality_id === localityFilterId;

      if (matchQ && matchLoc) {
        if (job.category_id) newCounts.categories[job.category_id] = (newCounts.categories[job.category_id] || 0) + 1;
      }
      if (matchQ && matchCat) {
        if (job.locality_id) newCounts.localities[job.locality_id] = (newCounts.localities[job.locality_id] || 0) + 1;
      }
    });

    return newCounts;
  }, [facetsData, search, categoryFilterId, localityFilterId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (locality) params.set("locality", locality);
    
    router.push(`/empleos?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-3xl radius-predefined bg-white p-3 shadow-xl shadow-primary/10 ring-1 ring-border">
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
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

        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-4 w-4 text-foreground-subtle" />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full appearance-none radius-predefined bg-surface-muted pl-10 pr-8 text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm"
          >
            <option value="">Todas las categorías</option>
            {categories
              .filter((cat) => counts.categories[cat.id] > 0)
              .map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <MapPin className="h-4 w-4 text-foreground-subtle" />
          </div>
          <select 
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="h-12 w-full appearance-none radius-predefined bg-surface-muted pl-10 pr-8 text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 text-sm"
          >
            <option value="">Todas las zonas</option>
            {localities
              .filter((loc) => counts.localities[loc.id] > 0)
              .map((loc) => (
              <option key={loc.id} value={loc.slug}>
                {loc.ciudad}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="h-12 w-full radius-button bg-primary px-8 font-bold text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 active:scale-95">
          Buscar
        </button>
      </div>
    </form>
  );
}
