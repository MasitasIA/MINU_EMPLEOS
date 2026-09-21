# Minú Empleos

Plataforma moderna de portal de empleos que conecta el talento local con las mejores empresas. Desarrollado con el fin de proporcionar un diseño premium, fluido y fácil de usar tanto para candidatos como para reclutadores.

## 🚀 Tecnologías Principales

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos y Autenticación**: [Supabase](https://supabase.com/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Lucide React](https://lucide.dev/)

## 📂 Características

- **Para Candidatos**: 
  - Registro seguro.
  - Perfiles personalizables (Biografía, título, datos de contacto).
  - Subida y gestión de Currículum Vitae (CV) en formato PDF almacenado de forma segura.
  - Catálogo interactivo de empleos con filtros de búsqueda avanzada.
  - Gestión y seguimiento de "Mis Postulaciones".

- **Para Empresas**:
  - Panel de control exclusivo (`/panel-empresa`).
  - Creación de perfil de reclutador con logo y portada.
  - Publicación y gestión de Ofertas Laborales.
  - Revisión de candidatos por oferta, con vista integrada del CV y estados de postulación ("Pendiente", "Visto", "Aceptado", "Rechazado").

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

## ☁️ Instrucciones de Despliegue (Cloudflare Pages / Vercel)

Para desplegar este proyecto en plataformas como **Cloudflare Pages** o **Vercel**, debes asegurarte de lo siguiente:

1. Conecta tu repositorio de GitHub a la plataforma de despliegue elegida.
2. Configura el **Framework preset** como `Next.js`.
3. El **Build command** debe ser: `npm run build`
4. El **Output directory** suele detectarse automáticamente (para Cloudflare Pages con Next.js edge/static puede requerir configurar el adaptador de `@cloudflare/next-on-pages`, pero por defecto para Node/Next suele ser `.next` en Vercel).
5. **¡Importante! Variables de Entorno**:
   Asegúrate de configurar las siguientes variables de entorno en el panel de control de tu plataforma de hosting (Cloudflare/Vercel) antes de hacer el primer despliegue:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. Guarda e inicia el despliegue.

## 🛡️ Estructura de Seguridad (Supabase RLS)

El proyecto utiliza **Row Level Security (RLS)** estricto en la base de datos de Supabase. Esto asegura que:
- Los **CVs (`resume_url`)** son privados y solo accesibles a través de URLs firmadas temporales para el propietario o la empresa reclutadora.
- Los **Perfiles de Empresa** pueden ser editados solo por el `owner_id`.
- Las **Postulaciones** (`applications`) solo son visibles por el candidato que aplicó y la empresa dueña del empleo.

## 📄 Licencia y Aspectos Legales

Este proyecto respeta los lineamientos de las Leyes de Argentina N° 25.326 y N° 23.592. Se requiere y solicita el consentimiento expreso de los usuarios al registrarse.
