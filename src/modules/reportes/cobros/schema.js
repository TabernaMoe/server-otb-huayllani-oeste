import { z } from 'zod';
import { reqEnum, reqFecha } from '../../../validators/funcionesZod.js';

export const getCobrosSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  tipo_cobro: reqEnum({
    label: 'tipo cobro',
    required: false,
    values: [
      'ACCION_AGUA',
      'ACCION_ALCANTARILLADO',
      'CAMBIO_NOMBRE_ACCION_AGUA',
      'CAMBIO_NOMBRE_ACCION_ALCANTARILLADO',
      'ASAMBLEA',
      'MULTA',
      'MANTENIMIENTO_ALCANTARILLADO',
      'MANTENIMIENTO_AGUA',
    ],
  }),
  estado: reqEnum({
    label: 'Estado',
    required: false,
    values: ['PENDIENTE', 'PAGADO', 'PARCIAL', 'ANULADO'],
  }),
});

export const getCobrosPorFechaSchema = z.object({
  fecha_inicio: reqFecha('Fecha incio'),
  fecha_final: reqFecha('Fecha final'),
  estado: reqEnum({
    label: 'Estado',
    values: ['PENDIENTE', 'PAGADO', 'PARCIAL', 'ANULADO', 'TODOS'],
  }),
  tipo_cobro: reqEnum({
    label: 'tipo cobro',
    values: [
      'ACCION_AGUA',
      'ACCION_ALCANTARILLADO',
      'CAMBIO_NOMBRE_ACCION_AGUA',
      'CAMBIO_NOMBRE_ACCION_ALCANTARILLADO',
      'ASAMBLEA',
      'MULTA',
      'MANTENIMIENTO_ALCANTARILLADO',
      'MANTENIMIENTO_AGUA',
      'TODOS',
    ],
  }),
});
