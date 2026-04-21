import { z } from 'zod';

export const verifyWinnerSchema = z.object({
  action: z.enum(['approve', 'reject']),
  adminNotes: z.string().optional(),
});