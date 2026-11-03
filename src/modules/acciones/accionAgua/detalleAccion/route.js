import { Router } from 'express';
import {
  idParamSchema,
  validateRequest,
} from '../../../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../../../utils/asyncHandler.js';
import { detalleAccionSchema, detalleAccionUpdateSchema } from './schema.js';
import { DetalleAccionController } from './controller.js';
import { ControllerTipoAccion } from '../tipoAccion/controller.js';

const routes = new Router();

routes
  .get('/', asyncHandler(DetalleAccionController.getAll))
  .get('/tipos-accion', asyncHandler(ControllerTipoAccion.getSelect))
  .get(
    '/:id',
    validateRequest({
      paramsSchema: idParamSchema,
    }),
    asyncHandler(DetalleAccionController.getById),
  )
  .post(
    '/',
    validateRequest({
      bodySchema: detalleAccionSchema,
    }),
    asyncHandler(DetalleAccionController.create),
  )
  .patch(
    '/:id',
    validateRequest({
      bodySchema: detalleAccionUpdateSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(DetalleAccionController.update),
  )
  .patch(
    '/change-status/:id',
    validateRequest({
      paramsSchema: idParamSchema,
    }),
    asyncHandler(DetalleAccionController.changeStatus),
  );
export default routes;
