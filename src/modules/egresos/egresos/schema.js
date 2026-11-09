import z from 'zod';
import {
  reqString,
  reqDecimal,
  reqInteger,
  reqFecha,
} from '../../../validators/funcionesZod.js';

export const EgresoSchema = z.object({
  categoria_egreso_id: reqInteger('Categoria'),
  fecha: reqFecha(),
  concepto: reqString({ label: 'Concepto' }),
  monto: reqDecimal({ label: 'Monto' }),
  beneficiario: reqString({ label: 'Beneficiario' }),
  observaciones: reqString({ label: 'Observacion' }),
});

export const EgresoUpdateSchema = z.object({
  categoria_egreso_id: reqInteger('Categoria', false),
  fecha: reqFecha('fecha', false),
  concepto: reqString({ label: 'Concepto', required: false }),
  monto: reqDecimal({ label: 'Monto', required: false }),
  beneficiario: reqString({ label: 'Beneficiario', required: false }),
  observaciones: reqString({ label: 'Observacion' }),
});
