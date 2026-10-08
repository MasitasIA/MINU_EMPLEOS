# PROYECTO: Minú Empleos - Memoria Técnica

*Fecha de última auditoría: Octubre 2026*

## PROJECT OVERVIEW
- **Propósito:** Portal de empleos enfocado en la localidad de Guaminí y alrededores, permitiendo a empresas publicar ofertas y a candidatos postularse.
- **Stack Tecnológico:** Next.js 14+ (App Router), React 19, TypeScript estricto, Tailwind CSS v4, Supabase (Auth, Database, Storage), Lucide React.
- **Arquitectura:** Arquitectura Server-Side Rendering (SSR) con Next.js App Router. Uso de Server Actions para mutaciones (crear empleos, postularse, actualizar perfil). Las consultas de datos se realizan mayormente en Server Components (`page.tsx`) antes del renderizado.
- **Servicios Externos:** Supabase y Cloudflare Pages (Deployment).

## ARCHITECTURE
- **Frontend:** Componentes funcionales en React. Tailwind para estilos globales (`index.css` / `globals.css`) con variables custom (ej. `bg-surface-muted`, `radius-button`).
- **Backend (Server Actions):** Toda la lógica de negocio y mutaciones reside en `src/app/actions/*.ts`.
- **Supabase:** Base de datos relacional PostgreSQL expuesta vía PostgREST. Manejo de sesiones por cookies (`@supabase/ssr`).
- **Autenticación:** Supabase Auth (Email/Password). El registro dispara un Trigger en DB (`on_auth_user_created`) que inserta el perfil público en `profiles`.
- **Flujo de Datos:** 
  1. `Page` (Server Component) llama a Server Actions o DB queries.
  2. Pasa datos al Client Component.
  3. Client Component usa Server Actions para enviar formularios.

## IMPORTANT CONSTRAINTS
- **Deployment en Cloudflare:** No se pueden utilizar APIs de Node.js nativas o archivos físicos complejos (como `wrangler.jsonc` automático) sin causar conflictos en el build. Se prefiere configuración mediante dashboard.
- **Supabase Keys:** La `NEXT_PUBLIC_SUPABASE_ANON_KEY` está hardcodeada como fallback en los clientes debido a inestabilidad de variables de entorno de Cloudflare durante algunos builds. Esto **exige** que las políticas RLS de Supabase sean perfectas.
- **Service Role:** No se utiliza `service_role` en el cliente ni en Server Actions (por seguridad), obligando a depender de RPCs (ej. `delete_user`) o RLS estricto para operaciones complejas de admin.

## KNOWN ISSUES (Resultados de Auditoría)
1. **Performance (Búsqueda Cliente):** `JobSearchCatalog.tsx` recibe **todos** los empleos activos al cliente y realiza el filtro en el browser. Esto escalará muy mal. Además, no actualiza la URL con los `searchParams`, rompiendo el SEO y la capacidad de compartir links de búsqueda.
2. **Dependencia Fuerte del Frontend para SEO:** Faltan metadatos OpenGraph en el `layout.tsx` base.
3. **Manejo de Roles:** No hay diferenciación real entre "Candidato" y "Empresa" a nivel Supabase Auth, todos son usuarios. Un usuario puede postularse a empleos y crear empresas al mismo tiempo.
4. **Rate Limiting Ausente:** Los endpoints (Server Actions) como `createJob` o `applyToJob` pueden ser abusados por bots. Existe una validación manual anti-spam (5 empleos al día por empresa), pero no protección real de red.

## SECURITY NOTES
- **Protección de Rutas:** Se realiza en los Server Components (ej. `if (!user) redirect()`). El `middleware.ts` no protege rutas actualmente.
- **IDOR Protegido:** Las acciones como `updateJob`, `deleteJob` y `toggleJobStatus` validan correctamente en el backend que `company.owner_id === user.id`.
- **Storage Seguro:** Los CVs (`RESUMES`) se manejan mediante Signed URLs, lo cual es correcto.
- **Alerta RLS:** Dado que la ANON KEY está hardcodeada como fallback, **todas las tablas deben tener RLS estricto**. Si falta una política de SELECT o UPDATE, cualquier usuario malicioso puede modificar la DB desde su consola.

## SEO NOTES
- Bien estructurado con `sitemap.ts` y `robots.ts`.
- Las URLs de empleos (`/empleos/[slug]`) y empresas (`/empresas/[slug]`) están optimizadas.
- **Problema:** Los filtros de búsqueda no cambian la URL. Deberían usar `router.push("?q=termino")` para permitir navegación y compartir búsquedas.

## PERFORMANCE NOTES
- **Imágenes:** Se utiliza `next/image` correctamente.
- **Bundle Size:** Se envía mucha lógica al cliente en componentes gigantes como `EditProfileForm` y `JobSearchCatalog`.

## TECHNICAL DEBT
- El estado de filtros en `JobSearchCatalog` usa `useState` + `useEffect` (implícito al derivar de `searchParams`) en lugar de leer/escribir directamente a la URL.
- Existen funciones `TODO` como `stats.ts` (Analytics) que no hacen nada.
- Componentes masivos que necesitan dividirse (ej. `CompanySettingsForm.tsx` con 19KB).

## DECISIONS
- **Hardcode de Anon Key:** Aceptado temporalmente por conflictos con Cloudflare Pages.
- **Sin Eliminar Cuentas Auth Directamente:** Supabase no permite borrar `auth.users` desde el cliente sin admin privileges. Se creó una RPC `delete_user` en la DB como solución (o borrado lógico).
- **Reportes:** Se implementó `reports` con Server Actions, RLS, e interfaz para Job, Company, Profile.

## DO NOT CHANGE WITHOUT REVIEW
- Archivos de configuración de Supabase SSR (`src/lib/supabase/*`).
- Lógica de autenticación que dependa del trigger `on_auth_user_created`.
- `index.css` (Tailwind custom variables).

## AUDIT STATUS
**Auditoría Integral Completada (Octubre 2026).**
Ver `TODO.txt` para el plan de acción ejecutable.
