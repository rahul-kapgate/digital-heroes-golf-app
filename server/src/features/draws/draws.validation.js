import { z } from 'zod';

export const runDrawSchema = z.object({
  drawMonth: z.string().regex(/^\d{4}-\d{2}$/, 'Format must be YYYY-MM'),
  drawType: z.enum(['random', 'algorithmic']).default('random'),
  simulateOnly: z.boolean().default(false),
});

export const publishDrawSchema = z.object({
  drawId: z.string().uuid(),
});