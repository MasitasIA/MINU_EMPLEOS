"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCompany, deleteCompany } from "@/app/actions/companies";
import { Save, AlertTriangle, ShieldCheck, Trash2, X } from "lucide-react";
import { ImageUploadCropper } from "./ImageUploadCropper";

interface Category {
  id: string;
  name: string;
}

interface CompanyData {
  id: string;
  name: string;
  description: string;
  detailed_description?: string;
  category_id?: string;
  image_url?: string;
  cover_url?: string;
  is_verified?: boolean;
  locality_id?: string;
  address?: string;
  phone?: string;
  website?: string;
  size?: string;
  linkedin_url?: string;
  social_urls?: any;
  is_active?: boolean;
}

export function CompanySettingsForm({
  company,
  categories,
  localities,
}: {
  company: CompanyData;
  categories: Category[];
  localities: { id: string; ciudad: string }[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    id: company.id,
    name: company.name,
    description: company.description || "",
    detailed_description: company.detailed_description || "",
    category_id: company.category_id || "",
    image_url: company.image_url || "",
    cover_url: company.cover_url || "",
    locality_id: company.locality_id || "",
    address: company.address || "",
    phone: company.phone || "",
    website: company.website || "",
    size: company.size || "",
    linkedin_url: company.linkedin_url || "",
    is_active: company.is_active !== undefined ? company.is_active : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const response = await updateCompany(company.id, formData);

    if (response.success) {
      setMessage({ type: "success", text: "Ajustes guardados correctamente." });
      // Si el slug cambió, redirigimos limpiamente para evitar errores de estado obsoleto
      if (formData.id !== company.id) {
        window.location.reload(); 
      }
    } else {
      setMessage({ type: "error", text: response.error || "Ocurrió un error." });
    }
    
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (deleteInput !== company.id) return;
    
    setIsDeleting(true);
    const response = await deleteCompany(company.id);
    
    if (response.success) {
      router.push("/panel-empresa");
      router.refresh();
    } else {
      setMessage({ type: "error", text: response.error || "Error al eliminar la empresa." });
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Mensajes Globales */}
      {message && (
        <div className={`p-4 radius-predefined flex items-center gap-3 ${
          message.type === "success" ? "bg-green-50 text-green-800 ring-1 ring-green-200" : "bg-red-50 text-red-800 ring-1 ring-red-200"
        }`}>
          {message.type === "error" && <AlertTriangle className="h-5 w-5" />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      {/* Formulario Principal */}
      <form onSubmit={handleSubmit} className="radius-predefined bg-white shadow-sm ring-1 ring-border p-6 sm:p-8 space-y-6">
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Nombre de la empresa */}
          <div className="sm:col-span-1">
            <label htmlFor="name" className="mb-1 block text-sm font-bold text-foreground">
              Nombre de la Empresa
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={50}
              value={formData.name}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Slug (ID de la empresa) */}
          <div className="sm:col-span-1">
            <label htmlFor="id" className="mb-1 block text-sm font-bold text-foreground">
              Identificador (URL de la Empresa)
            </label>
            <input
              id="id"
              name="id"
              type="text"
              required
              maxLength={50}
              value={formData.id}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 font-mono"
            />
            <p className="mt-1 text-xs text-foreground-muted">
              Solo minúsculas, números y guiones. Ej: mi-empresa-genial
            </p>
          </div>
        </div>

        {/* Descripción Corta */}
        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-bold text-foreground">
            Descripción Corta
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            maxLength={120}
            value={formData.description}
            onChange={handleChange}
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Descripción Detallada */}
        <div>
          <label htmlFor="detailed_description" className="mb-1 block text-sm font-bold text-foreground">
            Descripción Detallada
          </label>
          <textarea
            id="detailed_description"
            name="detailed_description"
            rows={5}
            value={formData.detailed_description}
            onChange={handleChange}
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Categoría */}
          <div className="sm:col-span-2">
            <label htmlFor="category_id" className="mb-1 block text-sm font-bold text-foreground">
              Categoría / Rubro Principal
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecciona un rubro</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="sm:col-span-1">
            <label htmlFor="locality_id" className="mb-1 block text-sm font-bold text-foreground">
              Localidad / Ciudad <span className="text-red-500">*</span>
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

          <div className="sm:col-span-1">
            <label htmlFor="address" className="mb-1 block text-sm font-bold text-foreground">
              Dirección de la Empresa (Opcional)
            </label>
            <input
              id="address"
              name="address"
              type="text"
              maxLength={150}
              value={formData.address}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="size" className="mb-1 block text-sm font-bold text-foreground">
              Tamaño de la Empresa
            </label>
            <select
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Selecciona el tamaño</option>
              <option value="1-10">1-10 empleados (Micro)</option>
              <option value="11-50">11-50 empleados (Pequeña)</option>
              <option value="51-200">51-200 empleados (Mediana)</option>
              <option value="201-500">201-500 empleados (Grande)</option>
              <option value="500+">500+ empleados (Corporación)</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="phone" className="mb-1 block text-sm font-bold text-foreground">
              Teléfono de Contacto
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              maxLength={50}
              value={formData.phone}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="sm:col-span-1">
            <label htmlFor="website" className="mb-1 block text-sm font-bold text-foreground">
              Sitio Web
            </label>
            <input
              id="website"
              name="website"
              type="url"
              maxLength={150}
              value={formData.website}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="sm:col-span-1">
            <label htmlFor="linkedin_url" className="mb-1 block text-sm font-bold text-foreground">
              Perfil de LinkedIn
            </label>
            <input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              maxLength={150}
              value={formData.linkedin_url}
              onChange={handleChange}
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Imagen de Portada */}
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-bold text-foreground">
              Imagen de Portada (Banner)
            </label>
            <ImageUploadCropper 
              currentImageUrl={formData.cover_url}
              onImageUploaded={(url) => setFormData({ ...formData, cover_url: url })}
              aspectRatio={21/9}
              bucketName="PROFILES"
              folderPath="companies"
            />
          </div>

          {/* Imagen de Logo */}
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-bold text-foreground">
              Imagen de Perfil (Logo)
            </label>
            <ImageUploadCropper 
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
              aspectRatio={1}
              bucketName="PROFILES"
              folderPath="companies"
            />
          </div>

          {/* Visibilidad de la Empresa */}
          <div className="sm:col-span-2 pt-4 border-t border-border mt-2">
            <div className="flex items-start gap-3">
              <div className="flex h-6 items-center">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
              <div>
                <label htmlFor="is_active" className="text-sm font-bold text-foreground cursor-pointer">
                  Empresa Visible al Público
                </label>
                <p className="text-sm text-foreground-muted mt-1">
                  Si desactivas esta opción, tu empresa y sus ofertas de empleo dejarán de ser visibles para los candidatos, pero podrás reactivarla en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center radius-button bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</>}
          </button>
        </div>
      </form>

      {/* Sección de Verificación */}
      <div className="radius-predefined bg-white shadow-sm ring-1 ring-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            Estado de Verificación
            {company.is_verified && <ShieldCheck className="h-5 w-5 text-primary" />}
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">
            {company.is_verified 
              ? "Tu empresa ya está verificada y tiene la insignia oficial." 
              : "La insignia de verificación transmite confianza a los candidatos."}
          </p>
        </div>
        {!company.is_verified && (
          <button 
            type="button"
            onClick={() => alert("Tu solicitud ha sido enviada al equipo de administración. Recibirás un correo cuando sea revisada.")}
            className="radius-button bg-secondary/10 text-secondary hover:bg-secondary/20 px-6 py-2.5 text-sm font-bold transition-colors whitespace-nowrap"
          >
            Solicitar Verificación
          </button>
        )}
      </div>

      {/* Danger Zone */}
      <div className="radius-predefined bg-red-50 ring-1 ring-red-200 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-red-800">Zona de Peligro</h3>
        <p className="mt-1 text-sm text-red-600 mb-4">
          Una vez que elimines tu perfil de empresa, no hay vuelta atrás y perderás todas tus ofertas de empleo.
        </p>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="radius-button bg-red-600 text-white hover:bg-red-700 px-6 py-2.5 text-sm font-bold transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <Trash2 className="h-4 w-4" /> Eliminar Empresa
        </button>
      </div>

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white radius-predefined shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-bold">¿Eliminar empresa?</h2>
            </div>
            
            <p className="text-sm text-foreground-muted mb-4">
              Esta acción <strong>eliminará permanentemente</strong> tu perfil de empresa y todas las ofertas asociadas.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-foreground mb-2">
                Para confirmar, escribe <span className="font-mono bg-surface-muted px-1 py-0.5 radius-predefined text-red-600">{company.id}</span> a continuación:
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                placeholder={company.id}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-bold text-foreground-muted hover:bg-surface-muted radius-button transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteInput !== company.id || isDeleting}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 radius-button transition-colors flex items-center gap-2"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar empresa"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
