import { Router } from 'express';
import { DetalleAlcantarilladoController as controller } from './detalleAlcantarillado.controller.js';
import {
  validateRequest,
  idParamSchema,
  paginationQuerySchema,
} from '../../../middlewares/validateRequest.middlewares.js';
import {
  detallePagoAccionSchema,
  detallePagoAccionUpdateSchema,
} from './detalleAlcantarilado.schema.js';

const routes = new Router();

routes
  .get(
    '/',
    validateRequest({ querySchema: paginationQuerySchema }),
    controller.getAll,
  )
  .post(
    '/',
    validateRequest({ bodySchema: detallePagoAccionSchema }),
    controller.create,
  )
  .patch(
    '/:id',
    validateRequest({
      paramsSchema: idParamSchema,
      bodySchema: detallePagoAccionUpdateSchema,
    }),
    controller.update,
  )
  .patch(
    '/cambiar-estado/:id',
    validateRequest({
      paramsSchema: idParamSchema,
    }),
    controller.cambiarEstado,
  );

export default routes;
