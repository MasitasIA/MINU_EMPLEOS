"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Upload, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getCompanyByOwner, requestCompanyVerification } from "@/app/actions/companies";
import { createClient } from "@/lib/supabase/client";

export default function VerificacionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [existingRequest, setExistingRequest] = useState<any>(null);

  const [legalName, setLegalName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [comments, setComments] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      // Llamada al Server Action para obtener la empresa
      const comp = await getCompanyByOwner(user.id);
      if (comp) {
        setCompany(comp);
        
        // Revisar si ya tiene una solicitud
        const supabase = createClient();
        const { data } = await supabase
          .from("company_verifications")
          .select("*")
          .eq("company_id", comp.id)
          .order("requested_at", { ascending: false })
          .limit(1)
          .single();
          
        if (data) {
          setExistingRequest(data);
        }
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setErrorMsg("El archivo no puede pesar más de 5MB.");
        return;
      }
      setFile(selected);
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    if (!file) {
      setErrorMsg("Debes adjuntar un documento probatorio.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("companyId", company.id);
    formData.append("taxId", taxId);
    formData.append("legalName", legalName);
    formData.append("comments", comments);
    formData.append("document", file);

    const result = await requestCompanyVerification(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setErrorMsg(result.error || "Ocurrió un error al enviar la solicitud.");
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 text-center text-foreground-muted">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="p-8 text-center bg-white radius-predefined ring-1 ring-border shadow-sm">
            <h2 className="text-xl font-bold mb-2">No tienes una empresa registrada</h2>
            <p className="text-foreground-muted">Crea tu empresa primero para poder solicitar la verificación.</p>
          </div>
        </div>
      </div>
    );
  }

  if (success || existingRequest?.status === 'pending') {
    return (
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 radius-predefined ring-1 ring-border shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Verificación en Proceso</h1>
            <p className="text-foreground-muted mb-6">
              Hemos recibido tu solicitud de verificación y tus documentos probatorios. 
              Nuestro equipo los revisará pronto. Te notificaremos vía correo electrónico cuando el proceso esté completo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (existingRequest?.status === 'verified') {
    return (
      <div className="bg-surface-muted min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 radius-predefined ring-1 ring-border shadow-sm text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Empresa Verificada</h1>
            <p className="text-foreground-muted mb-6">
              Tu empresa ya cuenta con el distintivo de verificación oficial en nuestra plataforma.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-muted min-h-screen py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 radius-predefined ring-1 ring-border shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" /> Solicitar Verificación
        </h1>
        <p className="mt-2 text-foreground-muted">
          Obtén la insignia de empresa verificada. Esto aumenta drásticamente la confianza de los candidatos al postularse a tus empleos.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 radius-predefined text-sm mb-8 flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p>
          Para verificar tu empresa necesitamos validar su existencia legal. Por favor, proporciona la Razón Social exacta, tu CUIT, y adjunta una Constancia de Inscripción AFIP (o un documento legal equivalente) en formato PDF o Imagen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 radius-predefined text-sm border border-red-200 font-medium">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold text-foreground">
              Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              placeholder="Ej. Mi Empresa S.R.L."
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-foreground">
              CUIT / RUT <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="Ej. 30-12345678-9"
              className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-foreground">
            Documento Probatorio <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-border px-6 py-8 hover:border-primary/50 transition-colors">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-foreground-subtle" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-foreground-muted justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none hover:text-primary/80"
                >
                  <span>Sube un archivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">o arrástralo y suéltalo</p>
              </div>
              <p className="text-xs leading-5 text-foreground-subtle mt-2">
                PDF, PNG, JPG (máx. 5MB)
              </p>
              {file && (
                <p className="text-sm font-bold text-primary mt-4 bg-primary/10 py-1 px-3 rounded-full inline-block">
                  {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-foreground">
            Comentarios Adicionales (Opcional)
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            className="w-full radius-predefined border border-border bg-surface-muted px-3 py-2 text-sm focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            placeholder="Alguna aclaración para el equipo de revisión..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!file || !taxId || !legalName}
          >
            {!isSubmitting && <Upload className="w-4 h-4 mr-2" />}
            {isSubmitting ? "Enviando..." : "Solicitar Verificación"}
          </Button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
}
