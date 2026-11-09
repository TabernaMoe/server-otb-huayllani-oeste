import z from 'zod';
import { reqEnum } from '../../../validators/funcionesZod.js';

export const SelectAccionSchema = z.object({
  tipo_servicio: reqEnum({
    label: 'Servicio',
    values: ['AGUA', 'ALCANTARILLADO'],
    required: false,
  }),
});
