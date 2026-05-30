import z from 'zod';
import {
  reqString,
  reqInteger,
  reqDecimal,
} from '../../validators/funcionesZod.js';

const RangoTarifaSchema = z.object({
  consumo_minimo: reqInteger('consumo_minimo'),

  consumo_maximo: reqInteger('consumo_maximo'),

  precio: reqDecimal('precio'),
});
export const TarifaSchema = z.object({
  nombre_tarifa: reqString({
    label: 'Nombre de variable',
    min: 2,
    max: 50,
    regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    regexMessage:
      'El nombre de variable debe iniciar con una letra o guion bajo y solo puede contener letras, números y guiones bajos',
  }),

  rangosTarifa: z
    .array(RangoTarifaSchema)
    .min(1, 'Debe registrar al menos un rango'),
});

export const TarifaUpdateSchema = TarifaSchema.partial();
