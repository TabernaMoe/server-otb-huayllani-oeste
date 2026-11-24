import { reqEnum } from '../../../validators/funcionesZod.js';
import z from 'zod';

export const CobroQuery = z.object({
  tipo_cobro: reqEnum({
    label: 'Tipo cobro',
    required: false,
    values: ['TODOS'],
  }),
});
