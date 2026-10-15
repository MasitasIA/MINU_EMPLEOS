/**
 * Utilidad de caché en memoria de alta velocidad compatible con Cloudflare Workers.
 * Reemplaza a Next.js `unstable_cache` que genera incompatibilidad ("Composable cache
 * is not supported in static assets incremental cache") y Error 1101 en el worker de Cloudflare.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryStore = new Map<string, CacheEntry<any>>();

export function createCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyParts: string[] = [],
  options?: { revalidate?: number; tags?: string[] }
): T {
  const ttlMs = (options?.revalidate ?? 300) * 1000;
  const baseKey = keyParts.join(":");

  return (async (...args: any[]) => {
    let argKey = "";
    try {
      argKey = args.length > 0 ? JSON.stringify(args) : "";
    } catch {
      argKey = String(args);
    }
    const fullKey = `${baseKey}#${argKey}`;
    const now = Date.now();

    const entry = memoryStore.get(fullKey);
    if (entry && entry.expiresAt > now) {
      return entry.data;
    }

    try {
      const result = await fn(...args);
      if (result !== undefined && result !== null) {
        memoryStore.set(fullKey, {
          data: result,
          expiresAt: now + ttlMs,
        });
      }
      return result;
    } catch (error) {
      console.error(`[Cache Error] Error en función cacheada (${baseKey}):`, error);
      // Si la función falla pero teníamos un valor anterior expirado, lo devolvemos como fallback
      if (entry) {
        return entry.data;
      }
      throw error;
    }
  }) as T;
}
