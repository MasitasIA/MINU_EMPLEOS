"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob, updateJob } from "@/app/actions/jobs";
import { Loader2, PlusCircle, AlertTriangle, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CreateJobFormProps {
  companyId: string;
  categories: { id: string; name: string }[];
  localities: { id: string; ciudad: string }[];
  initialData?: any;
}

export function CreateJobForm({ companyId, categories, localities, initialData }: CreateJobFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    company_id: companyId,
    category_id: initialData?.category_id || "",
    locality_id: initialData?.locality_id || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    salary_min: initialData?.salary_min?.toString() || "",
    salary_max: initialData?.salary_max?.toString() || "",
    vacancies: initialData?.vacancies?.toString() || "1",
    job_type: initialData?.job_type || "Full-time",
    modality: initialData?.modality || "Presencial",
    address: initialData?.address || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const submitData = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      vacancies: parseInt(formData.vacancies),
    };

    let response;
    if (initialData?.id) {
      response = await updateJob(initialData.id, submitData);
    } else {
      response = await createJob(submitData);
    }

    if (response.success) {
      router.push("/panel-empresa");
      router.refresh();
    } else {
      setErrorMsg(response.error || "Ocurrió un error al guardar la oferta.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="radius-predefined bg-white shadow-sm ring-1 ring-border p-6 sm:p-8 space-y-6">
      {errorMsg && (
        <div className="p-4 radius-predefined flex items-center gap-3 bg-red-50 text-red-800 ring-1 ring-red-200">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        <Input
          label={<>Título del Puesto <span className="text-red-500">*</span></>}
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej. Desarrollador Frontend Semi-Senior"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category_id" className="mb-1 block text-sm font-bold text-foreground">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="locality_id" className="mb-1 block text-sm font-bold text-foreground">
              Localidad <span className="text-red-500">*</span>
            </label>
            <select
              id="locality_id"
              name="locality_id"
              required
              value={formData.locality_id}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecciona la ubicación</option>
              {localities.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.ciudad}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="job_type" className="mb-1 block text-sm font-bold text-foreground">
              Jornada Laboral
            </label>
            <select
              id="job_type"
              name="job_type"
              value={formData.job_type}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
              <option value="Pasantía">Pasantía</option>
            </select>
          </div>

          <div>
            <label htmlFor="modality" className="mb-1 block text-sm font-bold text-foreground">
              Modalidad
            </label>
            <select
              id="modality"
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Remoto">Remoto</option>
            </select>
          </div>
          
          <div className="sm:col-span-2">
            <Input
              label="Dirección Específica (Opcional)"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej. Calle Falsa 123, Piso 4"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-bold text-foreground">
            Descripción de la Oferta <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe las responsabilidades y beneficios del puesto..."
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 resize-y"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="mb-1 block text-sm font-bold text-foreground">
            Requisitos <span className="text-red-500">*</span>
          </label>
          <textarea
            id="requirements"
            name="requirements"
            required
            rows={4}
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Enumera los conocimientos, experiencia y habilidades necesarias..."
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 resize-y"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-border pt-6">
          <Input
            label="Salario Mínimo (Opcional)"
            id="salary_min"
            name="salary_min"
            type="number"
            min="0"
            value={formData.salary_min}
            onChange={handleChange}
            placeholder="Ej. 500000"
          />

          <Input
            label="Salario Máximo (Opcional)"
            id="salary_max"
            name="salary_max"
            type="number"
            min="0"
            value={formData.salary_max}
            onChange={handleChange}
            placeholder="Ej. 800000"
          />

          <Input
            label="Vacantes"
            id="vacancies"
            name="vacancies"
            type="number"
            min="1"
            required
            value={formData.vacancies}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border mt-8">
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {!isLoading && (initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
          {isLoading ? (initialData ? "Guardando..." : "Publicando...") : (initialData ? "Guardar Cambios" : "Publicar Oferta")}
        </Button>
      </div>
    </form>
  );
}
