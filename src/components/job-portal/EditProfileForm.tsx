"use client";

import { useState } from "react";
import { updateProfile, uploadResume, getResumeSignedUrl, deleteResume } from "@/app/actions/auth";
import { Loader2, Save, FileText, UploadCloud, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function EditProfileForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
    title: initialData?.title || "",
    bio: initialData?.bio || "",
    is_public: initialData?.is_public || false,
    resume_url: initialData?.resume_url || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isOpeningCV, setIsOpeningCV] = useState(false);
  const [isDeletingCV, setIsDeletingCV] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleViewCV = async () => {
    if (!formData.resume_url) return;
    
    // Si la URL guardada parece ser una URL completa antigua, la abrimos directo
    if (formData.resume_url.startsWith("http")) {
      window.open(formData.resume_url, "_blank");
      return;
    }

    setIsOpeningCV(true);
    try {
      const response = await getResumeSignedUrl(formData.resume_url);
      if (response.success && response.url) {
        window.open(response.url, "_blank");
      } else {
        setErrorMsg(response.error || "No se pudo abrir el CV.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al obtener el CV.");
    } finally {
      setIsOpeningCV(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!formData.resume_url) return;
    
    if (!window.confirm("¿Estás seguro de que quieres eliminar tu currículum? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsDeletingCV(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await deleteResume(formData.resume_url, initialData.id);
      if (response.success) {
        setFormData({ ...formData, resume_url: "" });
        setSuccessMsg("Currículum eliminado correctamente.");
        router.refresh();
      } else {
        setErrorMsg(response.error || "No se pudo eliminar el CV.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al eliminar el CV.");
    } finally {
      setIsDeletingCV(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("El archivo no puede pesar más de 5MB.");
      return;
    }
    
    if (file.type !== "application/pdf") {
      setErrorMsg("Solo se permiten archivos en formato PDF.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const data = new FormData();
    data.append("file", file);
    data.append("userId", initialData.id);

    try {
      const response = await uploadResume(data);
      if (response.success && response.url) {
        setFormData({ ...formData, resume_url: response.url });
        setSuccessMsg("Currículum subido y guardado correctamente.");
        router.refresh();
      } else {
        setErrorMsg(response.error || "Error al subir el archivo.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al subir archivo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await updateProfile(initialData.id, formData);
      if (response.success) {
        setSuccessMsg("Perfil actualizado correctamente.");
        router.refresh();
      } else {
        setErrorMsg(response.error || "Error al guardar el perfil.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMsg && (
        <div className="radius-predefined bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-200">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="radius-predefined bg-green-50 p-4 text-sm font-medium text-green-600 ring-1 ring-green-200">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Nombre Completo */}
        <Input
          label="Nombre Completo"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Juan Pérez"
        />

        {/* Teléfono */}
        <Input
          label="Teléfono"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+54 9 11 1234-5678"
        />

        {/* Título Profesional */}
        <div className="sm:col-span-2">
          <Input
            label="Título Profesional / Profesión"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Desarrollador Frontend Semi-Senior"
          />
        </div>

        {/* Biografía */}
        <div className="sm:col-span-2">
          <label htmlFor="bio" className="mb-1 block text-sm font-bold text-foreground">
            Sobre Mi (Biografía)
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Cuéntanos sobre tu experiencia, habilidades y qué tipo de empleo buscas..."
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Currículum */}
        <div className="sm:col-span-2 p-6 border border-border border-dashed radius-predefined bg-surface-muted flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h3 className="font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Currículum Vitae
            </h3>
            <p className="text-sm text-foreground-muted mt-1">
              Sube tu CV en formato PDF (máx 5MB). Este documento será enviado a las empresas cuando te postules.
            </p>
            {formData.resume_url && (
              <div className="flex items-center gap-4 mt-3">
                <button 
                  type="button"
                  onClick={handleViewCV}
                  disabled={isOpeningCV || isDeletingCV}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline disabled:opacity-50"
                >
                  {isOpeningCV ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />} 
                  {isOpeningCV ? "Abriendo..." : "Ver mi CV actual"}
                </button>
                <button 
                  type="button"
                  onClick={handleDeleteCV}
                  disabled={isOpeningCV || isDeletingCV}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  {isDeletingCV ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} 
                  {isDeletingCV ? "Eliminando..." : "Eliminar CV"}
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isUploading || isDeletingCV}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading || isDeletingCV}
              className="pointer-events-none"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {isUploading ? "Subiendo..." : "Subir nuevo CV"}
            </Button>
          </div>
        </div>

        {/* Switch Público */}
        <div className="sm:col-span-2 flex items-start gap-3 p-4 border border-border radius-predefined">
          <input
            id="is_public"
            name="is_public"
            type="checkbox"
            checked={formData.is_public}
            onChange={handleChange}
            className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary"
          />
          <div>
            <label htmlFor="is_public" className="font-bold text-foreground block cursor-pointer">
              Hacer mi perfil público
            </label>
            <p className="text-sm text-foreground-muted">
              Si activas esto, las empresas podrán encontrar tu perfil en nuestra base de datos incluso si no te has postulado a sus ofertas.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {!isLoading && <Save className="h-5 w-5" />}
          Guardar Cambios
        </Button>
      </div>

      <div className="pt-8 mt-8 border-t border-red-100">
        <h3 className="text-lg font-bold text-red-600 mb-2">Zona de Peligro</h3>
        <p className="text-sm text-foreground-muted mb-4">
          Una vez que elimines tu cuenta, todos tus datos, postulaciones y tu currículum serán borrados permanentemente. Esta acción no se puede deshacer.
        </p>
        <Button
          type="button"
          variant="danger"
          onClick={() => router.push('/mi-cuenta/eliminar-cuenta')}
        >
          <Trash2 className="h-5 w-5" />
          Eliminar mi cuenta
        </Button>
      </div>
    </form>
  );
}
