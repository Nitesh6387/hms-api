import { z } from 'zod';

export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  departmentId: z.string().min(1, 'Department is required'),
  email: z.string().email('Invalid email format'),
  contact: z.string().regex(/^[0-9]{10}$/, 'Contact must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  specialist: z.string().optional(),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  fees: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
});

export const updateDoctorSchema = z.object({
  name: z.string().min(2).optional(),
  departmentId: z.string().optional(),
  email: z.string().email().optional(),
  contact: z.string().regex(/^[0-9]{10}$/).optional(),
  specialist: z.string().optional(),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  fees: z.string().optional(),
  address: z.string().optional(),
  gender: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;