# Reglas y Contexto del Proyecto: Minú Empleos

Este archivo proporciona contexto y reglas específicas para los agentes de IA que trabajen en este proyecto.

## 1. Stack Tecnológico
- **Framework**: Next.js 14+ (App Router).
- **Lenguaje**: TypeScript estricto.
- **Estilos**: Tailwind CSS con variables personalizadas (no usar colores quemados, usar `bg-surface-muted`, `text-foreground`, `radius-predefined`, etc.).
- **Base de Datos y Auth**: Supabase.
- **Iconos**: Lucide React.

## 2. Arquitectura de Supabase (Portal de Empleos)
- `profiles`: Maneja perfiles de candidatos (`full_name`, `phone`, `bio`, `title`, `is_public`, `resume_url`).
- `companies`: Perfiles de empresas reclutadoras (`phone`, `website`, logo, cover).
- `jobs`: Ofertas laborales (`address`, etc).
- `applications`: Relación entre `profiles` y `jobs` (Estado de postulaciones, CV adjunto).
- **Storage**: Uso del bucket `RESUMES` para almacenar los CVs en formato PDF y el bucket `PROFILES` para los logos de las empresas.

## 3. Reglas de Desarrollo Frontend
- Usar **Server Actions** (`src/app/actions`) para todas las mutaciones de base de datos y Storage (ej. subida de archivos, actualizaciones de perfil).
- **Diseño UI/UX**: Mantener un diseño premium, limpio y responsivo. Usar clases globales definidas en `index.css` como `radius-button` para los botones, en lugar de clases utilitarias ad-hoc de Tailwind repetidas.
- **Validaciones**: Realizar validación de inputs en el cliente y doble validación en los Server Actions (tamaño de archivo, extensiones, etc).
- Mantener los componentes cliente (`"use client"`) lo más reducidos posible, prefiriendo Server Components para la carga de datos (`getUser`, `getProfile`).

## 4. Lineamientos Generales
- **Idioma**: Toda la interfaz y comentarios deben estar en Español.
- **Legalidad**: El sitio opera bajo las Leyes de Argentina N° 25.326 y N° 23.592. Siempre pedir consentimiento en el registro y permitir a los usuarios borrar o hacer privado su CV.
