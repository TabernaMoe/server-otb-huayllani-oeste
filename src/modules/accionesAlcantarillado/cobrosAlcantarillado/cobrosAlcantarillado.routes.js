import { Router } from 'express';
import { CobrosAlcantarilladoController } from './cobrosAlcantarillado.controller.js';
import { SocioController } from '../../socios/socios.controller.js';
import { AcccionAlcantarilladoController } from './../accionAlcantarillado/accionAlcantarillado.controller.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import {
  paginationQuerySchema,
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';

import { CobroSchema } from './cobrosAlcantarillado.schema.js';

const routes = new Router();

routes
  .get('/socios', asyncHandler(SocioController.getSelect))
  .get('/acciones', asyncHandler(AcccionAlcantarilladoController.getSelect))
  .get(
    '/pendientes-socio/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(CobrosAlcantarilladoController.getPendientesBySocio),
  )
  .get(
    '/pendientes-accion/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(CobrosAlcantarilladoController.getPendientesByAccion),
  )
  .get(
    '/historial-accion/:id',
    validateRequest({
      paramsSchema: idParamSchema,
      querySchema: paginationQuerySchema,
    }),
    asyncHandler(CobrosAlcantarilladoController.getHistorialByAccion),
  )
  .get(
    '/historial-socio/:id',
    validateRequest({
      paramsSchema: idParamSchema,
      querySchema: paginationQuerySchema,
    }),
    asyncHandler(CobrosAlcantarilladoController.getHistorialBySocio),
  )
  .post(
    '/pagar',
    validateRequest({ bodySchema: CobroSchema }),
    asyncHandler(CobrosAlcantarilladoController.pagar),
  );
export default routes;
