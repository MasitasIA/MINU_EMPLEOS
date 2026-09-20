"use client";

import { useState } from "react";
import { JobCard } from "./JobCard";
import { Search, MapPin, Briefcase, FilterX } from "lucide-react";

interface JobSearchCatalogProps {
  initialJobs: any[];
}

export function JobSearchCatalog({ initialJobs }: JobSearchCatalogProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [modalityFilter, setModalityFilter] = useState("");

  const handleSearch = () => {
    let filtered = [...initialJobs];
    
    if (searchTerm) {
      filtered = filtered.filter(j => 
        j.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        j.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (jobTypeFilter) {
      filtered = filtered.filter(j => j.job_type === jobTypeFilter);
    }

    if (modalityFilter) {
      filtered = filtered.filter(j => j.modality === modalityFilter);
    }

    setJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setJobTypeFilter("");
    setModalityFilter("");
    setJobs(initialJobs);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-foreground">Buscar Empleos</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej. Desarrollador Frontend"
              className="w-full radius-predefined border border-border bg-white py-2 pl-10 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
          </div>
        </div>
        
        <div className="w-full md:w-48">
          <label className="mb-1 block text-sm font-medium text-foreground">Jornada</label>
          <select 
            value={jobTypeFilter} 
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full radius-predefined border border-border bg-white py-2 px-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todas</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div className="w-full md:w-48">
          <label className="mb-1 block text-sm font-medium text-foreground">Modalidad</label>
          <select 
            value={modalityFilter} 
            onChange={(e) => setModalityFilter(e.target.value)}
            className="w-full radius-predefined border border-border bg-white py-2 px-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Todas</option>
            <option value="Presencial">Presencial</option>
            <option value="Híbrido">Híbrido</option>
            <option value="Remoto">Remoto</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleSearch}
            className="radius-button bg-primary px-6 py-2 font-bold text-white transition-colors hover:brightness-110"
          >
            Filtrar
          </button>
          {(searchTerm || jobTypeFilter || modalityFilter) && (
            <button 
              onClick={clearFilters}
              className="flex items-center justify-center radius-button border border-border bg-white p-2 text-foreground-muted hover:bg-surface-muted hover:text-red-500"
              title="Limpiar filtros"
            >
              <FilterX className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">
          {jobs.length} {jobs.length === 1 ? 'empleo encontrado' : 'empleos encontrados'}
        </h2>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              id={job.id}
              slug={job.slug}
              companyId={job.company_id}
              companyName={job.companies?.name || 'Empresa Anónima'}
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
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted text-foreground-muted">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No hay empleos que coincidan</h3>
          <p className="mt-1 text-sm text-foreground-muted">Intenta cambiar los filtros o los términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
}
