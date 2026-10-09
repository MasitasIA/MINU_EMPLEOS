import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '@/lib/supabase/config';

export const revalidate = 3600; // Revalidar el sitemap cada hora (ISR)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://minuempleos.com.ar';

  // 1. Rutas estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/empleos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/empresas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/talento`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Comprobar si las variables de entorno están disponibles en tiempo de build o ejecución
  const supabaseUrl = SUPABASE_URL;
  const supabaseKey = SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      'Aviso en Sitemap: NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no están definidos. Generando únicamente rutas estáticas.'
    );
    return staticRoutes;
  }

  try {
    // Utilizamos el cliente anónimo para no depender de cookies (SSR)
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Obtener todas las ofertas activas
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('slug, created_at')
      .eq('is_active', true);

    if (jobsError) {
      console.error('Error al obtener empleos para el sitemap:', jobsError.message);
    }

    const jobsUrls: MetadataRoute.Sitemap = (jobs || [])
      .filter((job) => Boolean(job.slug))
      .map((job) => ({
        url: `${baseUrl}/empleos/${job.slug}`,
        lastModified: new Date(job.created_at || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    // 3. Obtener todas las empresas
    const { data: companies, error: compError } = await supabase
      .from('companies')
      .select('id, created_at')
      .eq('is_active', true);

    if (compError) {
      console.error('Error al obtener empresas para el sitemap:', compError.message);
    }

    const companiesUrls: MetadataRoute.Sitemap = (companies || [])
      .filter((company) => Boolean(company.id))
      .map((company) => ({
        url: `${baseUrl}/empresas/${company.id}`,
        lastModified: new Date(company.created_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

    // 4. Obtener talentos públicos
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('username, created_at')
      .eq('is_public', true)
      .not('username', 'is', null);

    if (profError) {
      console.error('Error al obtener talentos para el sitemap:', profError.message);
    }

    const profilesUrls: MetadataRoute.Sitemap = (profiles || [])
      .filter((profile) => Boolean(profile.username))
      .map((profile) => ({
        url: `${baseUrl}/candidatos/${profile.username}`,
        lastModified: new Date(profile.created_at || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));

    return [...staticRoutes, ...jobsUrls, ...companiesUrls, ...profilesUrls];
  } catch (error) {
    console.error('Error generando URLs dinámicas en sitemap:', error);
    return staticRoutes;
  }
}
