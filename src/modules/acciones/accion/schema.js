import z from 'zod';
import { reqString, reqEnum } from '../../../validators/funcionesZod.js';

export const accionQuery = z.object({
  search: reqString({ label: 'search', required: false }),
  tipo_servicio: reqEnum({
    label: 'TipoServicio',
    required: false,
    values: ['AGUA', 'ALCANTARILLADO'],
  }),
});
