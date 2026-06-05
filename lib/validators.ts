// lib/validators.ts
import { z } from 'zod';

// Blog validation schema
export const blogSchema = z.object({
  title: z
    .string()
    .min(5, 'Judul minimal 5 karakter')
    .max(255, 'Judul maksimal 255 karakter')
    .trim(),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(255, 'Slug maksimal 255 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung')
    .trim(),
  content: z
    .string()
    .min(50, 'Konten minimal 50 karakter')
    .max(50000, 'Konten maksimal 50.000 karakter'),
  excerpt: z
    .string()
    .max(500, 'Excerpt maksimal 500 karakter')
    .optional()
    .default(''),
  cover_image: z
    .string()
    .url('URL gambar tidak valid')
    .optional()
    .default(''),
  published: z.boolean().default(false),
});

// Project validation schema
export const projectSchema = z.object({
  title: z
    .string()
    .min(3, 'Judul minimal 3 karakter')
    .max(255, 'Judul maksimal 255 karakter')
    .trim(),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(255, 'Slug maksimal 255 karakter')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung')
    .trim(),
  description: z
    .string()
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(1000, 'Deskripsi maksimal 1000 karakter')
    .trim(),
  long_description: z
    .string()
    .max(10000, 'Deskripsi panjang maksimal 10.000 karakter')
    .optional()
    .default(''),
  tech_stack: z
    .array(z.string().max(50))
    .max(20, 'Maksimal 20 teknologi')
    .optional()
    .default([]),
  image_url: z
    .string()
    .url('URL gambar tidak valid')
    .optional()
    .default(''),
  live_url: z
    .string()
    .url('URL live demo tidak valid')
    .optional()
    .default(''),
  github_url: z
    .string()
    .url('URL GitHub tidak valid')
    .optional()
    .default(''),
  featured: z.boolean().default(false),
});

// Login validation schema
export const loginSchema = z.object({
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
});

// Type exports
export type BlogInput = z.infer<typeof blogSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type LoginInput = z.infer<typeof loginSchema>;