import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://minuempleos.com.ar';
  
  // Utilizamos el cliente anonimo para no depender de las cookies (SSR) en la generación de sitemaps
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Obtener todas las ofertas activas
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at')
    .eq('is_active', true);

  const jobsUrls: MetadataRoute.Sitemap = (jobs || []).map((job) => ({
    url: `${baseUrl}/empleos/${job.id}`,
    lastModified: new Date(job.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. Obtener todas las empresas
  const { data: companies } = await supabase
    .from('companies')
    .select('id, updated_at');

  const companiesUrls: MetadataRoute.Sitemap = (companies || []).map((company) => ({
    url: `${baseUrl}/empresas/${company.id}`,
    lastModified: new Date(company.updated_at || new Date()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 3. Obtener talentos públicos
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .eq('is_public', true)
    .not('username', 'is', null);

  const profilesUrls: MetadataRoute.Sitemap = (profiles || []).map((profile) => ({
    url: `${baseUrl}/candidatos/${profile.username}`,
    lastModified: new Date(profile.updated_at || new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // 4. Rutas estáticas principales
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

  return [...staticRoutes, ...jobsUrls, ...companiesUrls, ...profilesUrls];
}
