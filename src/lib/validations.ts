import { z } from "zod";

// Validaciones de Perfil
export const ProfileSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  phone: z.string().max(20).optional().nullable(),
  bio: z.string().max(500, "La biografía no puede exceder 500 caracteres").optional().nullable(),
  title: z.string().max(100).optional().nullable(),
  is_public: z.boolean().default(true),
  avatar_url: z.string().url("Debe ser una URL válida").optional().nullable().or(z.literal('')),
  linkedin_url: z.string().url("Debe ser una URL válida de LinkedIn").optional().nullable().or(z.literal('')),
  availability: z.string().max(100).optional().nullable(),
  mobility: z.string().max(100).optional().nullable(),
  locality_id: z.string().uuid("Localidad inválida").optional().nullable().or(z.literal('')),
  skills: z.string().optional().nullable(),
});

// Validaciones de Empresa
export const CompanyCreateSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  description: z.string().max(500, "La descripción corta no puede exceder 500 caracteres"),
  detailed_description: z.string().max(3000).optional().nullable(),
  locality_id: z.string().uuid("Localidad inválida"),
  address: z.string().max(200).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  website: z.string().url("Debe ser una URL válida").max(200).optional().nullable().or(z.literal('')),
  size: z.string().max(50).optional().nullable(),
  linkedin_url: z.string().url("Debe ser una URL válida de LinkedIn").max(200).optional().nullable().or(z.literal('')),
  social_urls: z.any().optional(),
});

export const CompanyUpdateSchema = CompanyCreateSchema.extend({
  id: z.string().min(2).max(100),
  category_id: z.string().uuid("Categoría inválida").optional().nullable().or(z.literal('')),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  cover_url: z.string().url().optional().nullable().or(z.literal('')),
  is_active: z.boolean().optional(),
}).partial({
  locality_id: true,
});

// Validaciones de Empleo
export const JobCreateSchema = z.object({
  company_id: z.string().min(1, "ID de empresa requerido"),
  category_id: z.string().uuid("Categoría inválida"),
  name: z.string().min(5, "El título debe tener al menos 5 caracteres").max(150),
  description: z.string().min(20, "La descripción es muy corta").max(5000),
  salary_min: z.preprocess((val) => val === '' ? null : Number(val), z.number().nonnegative().optional().nullable()),
  salary_max: z.preprocess((val) => val === '' ? null : Number(val), z.number().nonnegative().optional().nullable()),
  vacancies: z.preprocess((val) => val === '' ? 1 : Number(val), z.number().int().positive().default(1)),
  job_type: z.string(), // z.enum(...) removed to avoid breaking existing DB strings if they don't exactly match
  modality: z.string(),
  requirements: z.string().max(3000).optional().nullable(),
  locality_id: z.string().uuid("Localidad inválida"),
  address: z.string().max(200).optional().nullable(),
});

export const JobUpdateSchema = JobCreateSchema.omit({ company_id: true });
