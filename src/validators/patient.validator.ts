import { z } from 'zod';

export const updatePatientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  gender: z.string().optional(),
  contact: z.string().regex(/^[0-9]{10}$/, 'Contact must be 10 digits').optional(),
  age: z.number().min(0, 'Age must be positive').optional(),
  bloodGroup: z.string().optional(),
  aadhaarNo: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;