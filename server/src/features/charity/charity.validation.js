import { z } from 'zod';

export const listCharitySchema = z.object({
  search: z.string().optional(),
  featured: z.enum(['true', 'false']).optional(),
});

export const createCharitySchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  image_url: z.string().url().optional().nullable(),
  website_url: z.string().url().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const updateCharitySchema = createCharitySchema.partial();