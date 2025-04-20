import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})
export type LoginFormData = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  // Add password complexity requirements if needed
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

export type SignupFormData = z.infer<typeof signupSchema>
