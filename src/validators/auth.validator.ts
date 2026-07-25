import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['patient', 'doctor', 'admin'], {
    errorMap: () => ({ message: 'Invalid user type' })
  }),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contact: z.string().regex(/^[0-9]{10}$/, 'Contact must be 10 digits'),
  userType: z.enum(['patient', 'doctor', 'admin']),
  profile: z.string().optional(),
  // Patient fields
  gender: z.string().optional(),
  age: z.number().optional(),
  bloodGroup: z.string().optional(),
  aadhaarNo: z.string().optional(),
  // Doctor fields
  departmentId: z.string().optional(),
  specialist: z.string().optional(),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  fees: z.string().optional(),
  address: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  userType: z.enum(['patient', 'doctor', 'admin']),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['patient', 'doctor', 'admin']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;