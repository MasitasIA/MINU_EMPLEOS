"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { JobCard } from "./JobCard";
import { Search, MapPin, Briefcase, FilterX } from "lucide-react";

interface JobSearchCatalogProps {
  initialJobs: any[];
  categories: { id: string; name: string }[];
  localities: { id: string; ciudad: string }[];
}

export function JobSearchCatalog({
  initialJobs,
  categories,
  localities,
}: JobSearchCatalogProps) {
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [jobTypeFilter, setJobTypeFilter] = useState(
    searchParams.get("job_type") || "",
  );
  const [modalityFilter, setModalityFilter] = useState(
    searchParams.get("modality") || "",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    searchParams.get("category") || "",
  );
  const [localityFilter, setLocalityFilter] = useState(
    searchParams.get("locality") || "",
  );

  useEffect(() => {
    const q = searchParams.get("q") || "";
    const type = searchParams.get("job_type") || "";
    const mod = searchParams.get("modality") || "";
    const cat = searchParams.get("category") || "";
    const loc = searchParams.get("locality") || "";

    setSearchTerm(q);
    setJobTypeFilter(type);
    setModalityFilter(mod);
    setCategoryFilter(cat);
    setLocalityFilter(loc);

    applyFilters(q, type, mod, cat, loc);
  }, [searchParams, initialJobs]);

  const applyFilters = (
    q: string,
    type: string,
    mod: string,
    cat: string,
    loc: string,
  ) => {
    let filtered = [...initialJobs];

    if (q) {
      filtered = filtered.filter(
        (j) =>
          j.name.toLowerCase().includes(q.toLowerCase()) ||
          j.companies?.name?.toLowerCase().includes(q.toLowerCase()),
      );
    }

    if (type) {
      filtered = filtered.filter((j) => j.job_type === type);
    }

    if (mod) {
      filtered = filtered.filter((j) => j.modality === mod);
    }

    if (cat) {
      filtered = filtered.filter((j) => j.category_id === cat);
    }

    if (loc) {
      filtered = filtered.filter((j) => j.locality_id === loc);
    }

    setJobs(filtered);
  };

  const handleSearch = () => {
    applyFilters(
      searchTerm,
      jobTypeFilter,
      modalityFilter,
      categoryFilter,
      localityFilter,
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setJobTypeFilter("");
    setModalityFilter("");
    setCategoryFilter("");
    setLocalityFilter("");
    setJobs(initialJobs);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="sticky top-24 radius-predefined bg-white p-6 shadow-sm ring-1 ring-border">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <FilterX className="h-5 w-5" /> Filtros
            </h2>

            <div className="flex flex-col gap-5">
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Palabra clave
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ej. Desarrollador Frontend"
                    className="w-full radius-predefined border border-border bg-surface-muted py-2 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
                  />
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
                </div>
              </div>

              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Categoría
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full radius-predefined border border-border bg-surface-muted py-2 px-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Ubicación
                </label>
                <select
                  value={localityFilter}
                  onChange={(e) => setLocalityFilter(e.target.value)}
                  className="w-full radius-predefined border border-border bg-surface-muted py-2 px-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
                >
                  <option value="">Cualquier ubicación</option>
                  {localities.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.ciudad}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Jornada
                </label>
                <select
                  value={jobTypeFilter}
                  onChange={(e) => setJobTypeFilter(e.target.value)}
                  className="w-full radius-predefined border border-border bg-surface-muted py-2 px-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
                >
                  <option value="">Todas</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Modalidad
                </label>
                <select
                  value={modalityFilter}
                  onChange={(e) => setModalityFilter(e.target.value)}
                  className="w-full radius-predefined border border-border bg-surface-muted py-2 px-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
                >
                  <option value="">Todas</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Remoto">Remoto</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col gap-3 border-t border-border mt-2">
                <button
                  onClick={handleSearch}
                  className="w-full radius-button bg-primary px-4 py-2.5 font-bold text-white transition-colors hover:brightness-110"
                >
                  Aplicar Filtros
                </button>
                {(searchTerm ||
                  jobTypeFilter ||
                  modalityFilter ||
                  categoryFilter ||
                  localityFilter) && (
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center radius-button border border-border bg-white p-2.5 text-foreground-muted hover:bg-surface-muted hover:text-red-500 transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Resultados de Empleos */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-4 mt-2 lg:mt-0">
            <h2 className="text-xl font-bold text-foreground">
              {jobs.length}{" "}
              {jobs.length === 1 ? "empleo encontrado" : "empleos encontrados"}
            </h2>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  slug={job.slug}
                  companyId={job.company_id}
                  companyName={job.companies?.name || "Empresa Anónima"}
                  companyImage={job.companies?.image_url}
                  name={job.name}
                  jobType={job.job_type}
                  modality={job.modality}
                  salaryMin={job.salary_min}
                  salaryMax={job.salary_max}
                  locality={job.localities?.ciudad}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center radius-predefined bg-white ring-1 ring-border shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-foreground-muted">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                No hay empleos que coincidan
              </h3>
              <p className="mt-1 text-sm text-foreground-muted">
                Intenta cambiar los filtros o los términos de búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
