import { z } from 'zod';

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  full_name: z.string().min(1).optional(),
  role_key: z.string().min(1).optional(),
  department: z.string().optional(),
});

export const authForgotPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
