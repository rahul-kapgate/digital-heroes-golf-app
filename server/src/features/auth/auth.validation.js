import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  selectedCharityId: z.string().uuid('Invalid charity ID'),
  charityPercentage: z.number().min(10).max(100).default(10),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});