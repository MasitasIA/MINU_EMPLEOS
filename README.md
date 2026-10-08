# Minú Empleos

Minú Empleos es un portal local de empleos diseñado para conectar el talento de Guaminí y alrededores con pequeñas y medianas empresas. La plataforma cuenta con un diseño premium y responsive, y está orientada a la seguridad y usabilidad.

## 🚀 Tecnologías Principales

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos y Autenticación**: [Supabase](https://supabase.com/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)

## 📂 Estructura del Proyecto

```text
src/
├── app/
│   ├── actions/       # Server Actions de Next.js (Interacción segura con DB)
│   ├── candidatos/    # Páginas de perfiles públicos de candidatos
│   ├── empleos/       # Catálogo y detalles de ofertas de trabajo
│   ├── empresas/      # Perfiles públicos de empresas
│   ├── mi-cuenta/     # Panel privado del candidato (CV, postulaciones)
│   ├── panel-empresa/ # Panel privado de la empresa (Crear ofertas, ver candidatos)
│   └── ...            # Páginas estáticas (home, login, registro, términos)
├── components/
│   ├── dashboard/     # UI para paneles privados
│   ├── job-portal/    # Componentes pesados del portal (Búsqueda, Formularios)
│   ├── layout/        # Navbar, Footer y alertas
│   ├── shared/        # Componentes compartidos (Reportes)
│   └── ui/            # Botones, Inputs, Modales genéricos
├── lib/
│   ├── supabase/      # Clientes y Middleware de Supabase SSR
│   ├── session.ts     # Utilidad de recuperación de sesión (Server-side)
│   ├── validations.ts # Esquemas de Zod para validación segura
│   └── utils.ts       # Utilidades de Tailwind y formateo
└── types/             # Definiciones TypeScript
```

## 🗄️ Esquema de Base de Datos

La aplicación utiliza PostgreSQL a través de Supabase. A continuación se presenta el esquema simplificado de las tablas principales:

```sql
-- Perfiles de Usuarios (Candidatos y Dueños de Empresas)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text NOT NULL UNIQUE,
  full_name text,
  bio text,
  title text,
  resume_url text,
  is_public boolean DEFAULT false,
  phone text,
  avatar_url text,
  linkedin_url text,
  availability text,
  skills ARRAY,
  locality_id uuid REFERENCES public.localities(id),
  mobility text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Empresas
CREATE TABLE public.companies (
  id text PRIMARY KEY,
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES public.profiles(id),
  description text,
  detailed_description text,
  category_id uuid REFERENCES public.categories(id),
  image_url text,
  cover_url text,
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean DEFAULT true,
  locality_id uuid REFERENCES public.localities(id),
  address text,
  phone text,
  website text,
  size text,
  linkedin_url text,
  social_urls jsonb DEFAULT '{}'::jsonb,
  rating numeric NOT NULL DEFAULT 0.00,
  reviews_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ofertas de Empleo
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL REFERENCES public.companies(id),
  category_id uuid REFERENCES public.categories(id),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  salary_min numeric NOT NULL,
  salary_max numeric,
  vacancies integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  views integer NOT NULL DEFAULT 0,
  job_type text DEFAULT 'Full-time'::text,
  modality text DEFAULT 'Presencial'::text,
  requirements text,
  address text,
  locality_id uuid REFERENCES public.localities(id),
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Postulaciones a Empleos
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id),
  candidate_id uuid NOT NULL REFERENCES public.profiles(id),
  status text NOT NULL DEFAULT 'pending'::text,
  resume_url text,
  cover_letter text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Otras tablas de soporte:
-- - categories: Categorías de empleos y empresas.
-- - localities: Localidades y ciudades soportadas.
-- - application_events: Historial de cambios de estado en las postulaciones.
-- - company_verifications: Solicitudes de verificación de empresas.
-- - site_settings: Configuración global del portal (Mantenimiento, Anuncios).
-- - notifications: Alertas en la aplicación para usuarios.
-- - reports: Denuncias de spam o contenido inapropiado.
```

## ⚙️ Configuración para Desarrollo Local

Sigue estos pasos para correr el proyecto en tu entorno local:

1. **Clona el repositorio** e instala las dependencias:
   ```bash
   npm install
   ```

2. **Configura las variables de entorno**:
   Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la plataforma en funcionamiento.

## 🛡️ Estructura de Seguridad (Supabase RLS)

El proyecto utiliza **Row Level Security (RLS)** estricto en la base de datos de Supabase. Esto asegura que:
- Los **CVs (`resume_url`)** son privados y solo accesibles a través de URLs firmadas temporales para el propietario o la empresa reclutadora.
- Los **Perfiles de Empresa** pueden ser editados solo por el `owner_id`.
- Las **Postulaciones** (`applications`) solo son visibles por el candidato que aplicó y la empresa dueña del empleo.
- Operaciones sensibles (como creación de empleos) son protegidas vía Server Actions comprobando siempre que `company.owner_id === auth.uid()`.

## 📄 Licencia y Aspectos Legales

Este proyecto respeta los lineamientos de las Leyes de Argentina N° 25.326 y N° 23.592. Se requiere y solicita el consentimiento expreso de los usuarios al registrarse.
