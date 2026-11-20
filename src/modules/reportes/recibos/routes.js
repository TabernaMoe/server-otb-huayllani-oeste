import { Router } from 'express';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { getRecibosPorFechaSchema, getRecibosSchema } from './schema.js';
import { ReciboReporteController } from './controller.js';

const routes = new Router();

routes
  .get(
    '/',
    validateRequest({ querySchema: getRecibosSchema }),
    asyncHandler(ReciboReporteController.getRecibos),
  )
  .post(
    '/fechas',
    validateRequest({ bodySchema: getRecibosPorFechaSchema }),
    asyncHandler(ReciboReporteController.getRecibosPorFecha),
  )
  .get(
    '/accion/:id',
    validateRequest({ querySchema: getRecibosSchema }),
    asyncHandler(ReciboReporteController.getRecibosPorAccion),
  )
  .post(
    '/accion/fechas/:id',
    validateRequest({ bodySchema: getRecibosPorFechaSchema }),
    asyncHandler(ReciboReporteController.GetRecibosPorFechaPorAccion),
  );

export default routes;
