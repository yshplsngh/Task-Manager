import {z} from 'zod';

export const AuthSchema = z.object({
  email:z.string().email().toLowerCase().trim(),
  password: z.string().trim().min(3).max(20),
})