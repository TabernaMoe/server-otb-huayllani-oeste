import { Router } from 'express';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { getRecibosPorFechaSchema, getRecibosSchema } from './schema.js';
import { ReciboReporteController } from './controller.js';

import { AccionController } from '../../acciones/accion/controller.js';
import { accionQuery } from '../../acciones/accion/schema.js';
import { SocioController } from '../../socios/socios.controller.js';

const routes = new Router();

routes
  .get(
    '/',
    validateRequest({ querySchema: getRecibosSchema }),
    asyncHandler(ReciboReporteController.getRecibos),
  )
  .get(
    '/acciones',
    validateRequest({ querySchema: accionQuery }),
    asyncHandler(AccionController.getSelectByServicio),
  )
  .get('/socios', SocioController.getSelect)
  .post(
    '/fechas',
    validateRequest({ bodySchema: getRecibosPorFechaSchema }),
    asyncHandler(ReciboReporteController.getRecibosPorFecha),
  )
  .get(
    '/accion/:id',
    validateRequest({
      querySchema: getRecibosSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(ReciboReporteController.getRecibosPorAccion),
  )
  .post(
    '/accion/fechas/:id',
    validateRequest({
      bodySchema: getRecibosPorFechaSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(ReciboReporteController.GetRecibosPorFechaPorAccion),
  )
  .get(
    '/socio/:id',
    validateRequest({
      querySchema: getRecibosSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(ReciboReporteController.getRecibosPorSocio),
  )
  .post(
    '/socio/fechas/:id',
    validateRequest({
      bodySchema: getRecibosPorFechaSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(ReciboReporteController.GetRecibosPorFechaPorSocio),
  );

export default routes;
