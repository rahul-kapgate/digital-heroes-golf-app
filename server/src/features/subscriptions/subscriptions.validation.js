import { z } from 'zod';

export const createCheckoutSchema = z.object({
  planType: z.enum(['monthly', 'yearly']),
});