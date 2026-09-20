"use client";

import { useState } from "react";
import { Building, Loader2 } from "lucide-react";
import { createCompany } from "@/app/actions/companies";
import { useRouter } from "next/navigation";

interface CreateCompanyFormProps {
  localities: { id: string; ciudad: string; slug: string }[];
}

export function CreateCompanyForm({ localities = [] }: CreateCompanyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    detailed_description: "",
    locality_id: "",
    address: "",
    phone: "",
    website: "",
    size: "",
    linkedin_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const response = await createCompany(formData);

    if (response.success) {
      router.refresh();
    } else {
      setErrorMsg(response.error || "Ocurrió un error.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl radius-predefined bg-surface shadow-sm border border-border p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Building className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Registra tu Empresa</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Estás a un paso de empezar a publicar ofertas de empleo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="radius-predefined bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-red-200">
            {errorMsg}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-bold text-foreground">
            Nombre de la Empresa <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={50}
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej. TechCorp"
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-xs text-foreground-muted">
            Este nombre será público y se usará para tu perfil de empresa.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-bold text-foreground">
            Descripción Corta <span className="text-red-500">*</span>
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            maxLength={120}
            value={formData.description}
            onChange={handleChange}
            placeholder="Ej. Empresa líder en desarrollo de software"
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label htmlFor="detailed_description" className="mb-1 block text-sm font-bold text-foreground">
            Descripción Detallada (Opcional)
          </label>
          <textarea
            id="detailed_description"
            name="detailed_description"
            rows={4}
            value={formData.detailed_description}
            onChange={handleChange}
            placeholder="Cuéntale a los candidatos sobre la cultura, beneficios y misión de la empresa..."
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <div>
          <label htmlFor="locality_id" className="mb-1 block text-sm font-bold text-foreground">
            Localidad / Ciudad <span className="text-red-500">*</span>
          </label>
          <select
            id="locality_id"
            name="locality_id"
            required
            value={formData.locality_id}
            onChange={handleChange}
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Selecciona tu localidad</option>
            {localities.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.ciudad}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-bold text-foreground">
            Dirección (Opcional)
          </label>
          <input
            id="address"
            name="address"
            type="text"
            maxLength={150}
            value={formData.address}
            onChange={handleChange}
            placeholder="Ej. Av. Siempreviva 742"
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-bold text-foreground">
              Teléfono (Opcional)
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              maxLength={50}
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej. +54 9 11 1234-5678"
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="size" className="mb-1 block text-sm font-bold text-foreground">
              Tamaño de la Empresa (Opcional)
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecciona el tamaño</option>
              <option value="1-10">1-10 empleados (Micro)</option>
              <option value="11-50">11-50 empleados (Pequeña)</option>
              <option value="51-200">51-200 empleados (Mediana)</option>
              <option value="201-500">201-500 empleados (Grande)</option>
              <option value="500+">500+ empleados (Corporación)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="website" className="mb-1 block text-sm font-bold text-foreground">
              Sitio Web (Opcional)
            </label>
            <input
              id="website"
              name="website"
              type="url"
              maxLength={150}
              value={formData.website}
              onChange={handleChange}
              placeholder="Ej. https://tuempresa.com"
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label htmlFor="linkedin_url" className="mb-1 block text-sm font-bold text-foreground">
              LinkedIn (Opcional)
            </label>
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              maxLength={150}
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="Ej. https://linkedin.com/company/tuempresa"
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 flex w-full items-center justify-center radius-button bg-primary px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando empresa...
            </>
          ) : (
            "Registrar Empresa"
          )}
        </button>
      </form>
    </div>
  );
}
