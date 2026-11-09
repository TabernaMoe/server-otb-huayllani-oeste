import { Router } from 'express';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ReciboController } from './controller.js';
import { SocioController } from '../../socios/socios.controller.js';
import { AccionController } from '../../acciones/accion/controller.js';
import { SelectAccionSchema } from './schemas.js';

const routes = new Router();

routes.get('/', asyncHandler(ReciboController.getAll));
routes.get('/seleccion-socios', asyncHandler(SocioController.getSelect));
routes.get(
  '/socio/:id',
  validateRequest({
    paramsSchema: idParamSchema,
  }),
  asyncHandler(ReciboController.getAllBySocio),
);
routes.get(
  '/accion/:id',
  validateRequest({
    paramsSchema: idParamSchema,
  }),
  asyncHandler(ReciboController.getAllByAccion),
);
routes.post(
  '/seleccion-accion',
  validateRequest({
    bodySchema: SelectAccionSchema,
  }),
  asyncHandler(AccionController.getSelectByServicio),
);

export default routes;
