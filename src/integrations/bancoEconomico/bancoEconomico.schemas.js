import { z } from 'zod';

export const generateQrSchema = z.object({
  transactionId: z.string().trim().min(1, 'transactionId es requerido'),

  currency: z.enum(['BOB', 'USD']),

  amount: z
    .number()
    .positive('El monto debe ser mayor a cero')
    .refine(
      (value) => Math.round(value * 100) === value * 100,
      'El monto solo puede tener hasta 2 decimales',
    ),

  description: z.string().trim().optional(),

  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dueDate debe tener formato yyyy-MM-dd'),

  singleUse: z.boolean().default(true),

  modifyAmount: z.boolean().default(false),

  branchCode: z
    .string()
    .trim()
    .max(5, 'branchCode no puede superar 5 caracteres')
    .optional(),
});
