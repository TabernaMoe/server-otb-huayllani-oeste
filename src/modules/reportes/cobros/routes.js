import { Router } from 'express';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { getCobrosSchema, getCobrosPorFechaSchema } from './schema.js';
import { CobroReportesController } from './controller.js';
import { AccionController } from '../../acciones/accion/controller.js';
import { accionQuery } from '../../acciones/accion/schema.js';
import { SocioController } from '../../socios/socios.controller.js';

const routes = new Router();

routes
  .get(
    '/',
    validateRequest({ querySchema: getCobrosSchema }),
    asyncHandler(CobroReportesController.getCobros),
  )
  .get(
    '/acciones',
    validateRequest({ querySchema: accionQuery }),
    asyncHandler(AccionController.getSelectByServicio),
  )
  .get('/socios', SocioController.getSelect)
  .post(
    '/fechas',
    validateRequest({ bodySchema: getCobrosPorFechaSchema }),
    asyncHandler(CobroReportesController.getcobrosPorFecha),
  )
  .get(
    '/accion/:id',
    validateRequest({
      querySchema: getCobrosSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(CobroReportesController.getCobrosAccion),
  )
  .post(
    '/accion/fechas/:id',
    validateRequest({
      bodySchema: getCobrosPorFechaSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(CobroReportesController.getCobrosPorFechaPorAccion),
  )
  .get(
    '/socio/:id',
    validateRequest({
      querySchema: getCobrosSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(CobroReportesController.getCobrosSocio),
  )
  .post(
    '/socio/fechas/:id',
    validateRequest({
      bodySchema: getCobrosPorFechaSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(CobroReportesController.getCobrosPorFechaPorSocio),
  );

export default routes;
