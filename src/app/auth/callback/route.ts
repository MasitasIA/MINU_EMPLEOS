import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/mi-cuenta";

  // En local usamos el origin de la petición, en producción usamos SITE_URL
  const baseUrl = origin.includes("localhost") ? origin : SITE_URL;

  const supabase = await createClient();

  // Flujo PKCE (intercambio de authorization code)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(`${next}?verified=true`, baseUrl));
    }
    console.error("Error al intercambiar código de autenticación:", error);
  }

  // Flujo OTP / token_hash directo (email verification)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(`${next}?verified=true`, baseUrl));
    }
    console.error("Error al verificar token_hash:", error);
  }

  // Si no hay parámetros o hubo error, redirigir a inicio de sesión
  return NextResponse.redirect(new URL("/iniciar?verified=true", baseUrl));
}
