import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cfwhoovpxhzjojstxrgx.supabase.co',
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmd2hvb3ZweGh6am9qc3R4cmd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDYyMDQsImV4cCI6MjEwNDEyMjIwNH0.MLdDSwQJY6pFQCcYpehot9bSNFc8uj7Oswyiguz2Lv0',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  await supabase.auth.getUser()

  // Opcional: Proteger rutas
  // if (!user && request.nextUrl.pathname.startsWith('/mi-cuenta')) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/iniciar'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}
