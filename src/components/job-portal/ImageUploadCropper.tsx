"use client";

import { useState, useRef } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { Upload, X, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadCropperProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  aspectRatio?: number;
  bucketName?: string;
  folderPath?: string;
}

export function ImageUploadCropper({
  currentImageUrl,
  onImageUploaded,
  aspectRatio = 16 / 9,
  bucketName = "PROFILES",
  folderPath = "PPF",
}: ImageUploadCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setIsCropping(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const croppedImageFile = await getCroppedImg(
        imageSrc as string,
        croppedAreaPixels as any,
      );

      if (!croppedImageFile) {
        throw new Error("No se pudo procesar la imagen");
      }

      const fileName = `${folderPath}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, croppedImageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Obtener URL pblica
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      onImageUploaded(publicUrlData.publicUrl);
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      alert(
        "Error al subir la imagen. Verifica que el Bucket exista y sea público.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImageUrl) return;

    if (!confirm("¿Seguro que quieres eliminar esta imagen?")) return;

    try {
      setIsUploading(true);
      
      // Extract file path from public URL
      // Example: https://xxx.supabase.co/storage/v1/object/public/PROFILES/stores/1234.jpg
      const urlParts = currentImageUrl.split(`/public/${bucketName}/`);
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        const { error } = await supabase.storage.from(bucketName).remove([filePath]);
        if (error) {
          console.error("Error eliminando del bucket:", error);
        }
      }
      
      // Notificar al componente padre que se borró (le pasamos string vacío)
      onImageUploaded("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Vista Previa o Botón de Subida */}
      {!isCropping && (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border radius-predefined bg-surface-muted/50 transition-colors hover:bg-surface-muted">
          {currentImageUrl ? (
            <div
              className={`relative overflow-hidden mb-4 shadow-sm border-4 border-white ${
                aspectRatio === 1
                  ? "w-32 h-32 rounded-full"
                  : "w-full aspect-[21/9] radius-predefined"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="radius-button bg-white border border-border shadow-sm px-4 py-2 text-sm font-bold text-foreground flex items-center gap-2 hover:bg-surface-muted transition-colors disabled:opacity-50"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
              {currentImageUrl ? "Cambiar Imagen" : "Subir Imagen"}
            </button>
            {currentImageUrl && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isUploading}
                className="radius-button bg-white border border-border shadow-sm px-4 py-2 text-sm font-bold text-red-600 flex items-center gap-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Eliminar imagen"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Eliminar
              </button>
            )}
          </div>
          <p className="text-xs text-foreground-muted mt-2">
            Recomendado: {aspectRatio === 1 ? "1:1 (ej. 500x500px)" : "1200x800px"}. Máximo 5MB.
          </p>
        </div>
      )}

      {/* Modal de Recorte */}
      {isCropping && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl radius-predefined shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">
                Ajustar Imagen
              </h3>
              <button
                onClick={() => setIsCropping(false)}
                className="text-foreground-muted hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative w-full h-[400px] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                cropShape={aspectRatio === 1 ? "round" : "rect"}
                showGrid={aspectRatio !== 1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-4 bg-surface-muted flex items-center gap-4 border-b border-border">
              <span className="text-sm font-bold text-foreground-muted">
                Zoom
              </span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="p-4 flex justify-end gap-3 bg-white">
              <button
                type="button"
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 text-sm font-bold text-foreground-muted hover:bg-surface-muted radius-button transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 text-sm font-bold text-white bg-primary hover:brightness-110 disabled:opacity-50 radius-button transition-colors flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Procesando...
                  </>
                ) : (
                  "Aplicar y Guardar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }