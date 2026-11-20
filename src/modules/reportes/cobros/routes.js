import { Router } from 'express';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { getCobrosSchema, getCobrosPorFechaSchema } from './schema.js';
import { CobroReportesController } from './controller.js';

const routes = new Router();

routes
  .get(
    '/',
    validateRequest({ querySchema: getCobrosSchema }),
    asyncHandler(CobroReportesController.getCobros),
  )
  .post(
    '/fechas',
    validateRequest({ bodySchema: getCobrosPorFechaSchema }),
    asyncHandler(CobroReportesController.getcobrosPorFecha),
  )
  .get(
    '/accion/:id',
    validateRequest({ querySchema: getCobrosSchema }),
    asyncHandler(CobroReportesController.getCobrosAccion),
  )
  .post(
    '/accion/fechas/:id',
    validateRequest({ bodySchema: getCobrosPorFechaSchema }),
    asyncHandler(CobroReportesController.getCobrosPorFechaPorAccion),
  );

export default routes;
