/**
 * Loader personalizado de Supabase para Next.js Image.
 * Delega la optimización y redimensionado de imágenes al CDN de Supabase Storage
 * (/storage/v1/render/image/public/...) liberando de carga de CPU y memoria al Cloudflare Worker.
 */
export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src) return "";

  // Si no es una imagen almacenada en Supabase Storage, devolvemos la URL intacta
  if (!src.includes("/storage/v1/object/public/")) {
    return src;
  }

  try {
    // Si la instancia de Supabase tiene habilitada la transformación de imágenes (Supabase Pro)
    // podemos apuntar a /render/image/public/
    const url = new URL(src);
    url.pathname = url.pathname.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    );
    url.searchParams.set("width", width.toString());
    url.searchParams.set("quality", (quality || 75).toString());
    url.searchParams.set("resize", "contain");
    return url.toString();
  } catch {
    return src;
  }
}
