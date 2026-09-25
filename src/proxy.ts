import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    !pathname.startsWith('/mantenimiento') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next')
  ) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const res = await fetch(`${supabaseUrl}/rest/v1/site_settings?select=maintenance_mode&limit=1`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          next: { revalidate: 60 }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0 && data[0].maintenance_mode) {
            return NextResponse.redirect(new URL('/mantenimiento', request.url));
          }
        }
      }
    } catch (error) {
      console.error("Error checking maintenance mode in proxy:", error);
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
