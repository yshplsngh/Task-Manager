import {z} from 'zod'

export interface UserData {
  id: number | null;
  email: string | null;
  iat: number | null;
  exp: number | null;
}

export const AuthSchema = z.object({
  email:z.string().email().toLowerCase().trim().max(100),
  password: z.string().trim().min(3).max(20),
})

export type AuthSchemaType = z.infer<typeof AuthSchema>