import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/supabase/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/iniciar/',
        '/registro/',
        '/recuperar/',
        '/actualizar-password/',
        '/mi-cuenta/',
        '/mis-postulaciones/',
        '/panel-empresa/',
        '/mantenimiento/',
        '/api/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
