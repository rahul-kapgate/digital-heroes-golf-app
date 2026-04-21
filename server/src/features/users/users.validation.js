import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  selectedCharityId: z.string().uuid().optional(),
  charityPercentage: z.number().min(10).max(100).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/[0-9]/, 'Must contain number'),
});