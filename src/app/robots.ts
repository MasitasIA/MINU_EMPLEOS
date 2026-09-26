import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://minuempleos.com.ar';

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
