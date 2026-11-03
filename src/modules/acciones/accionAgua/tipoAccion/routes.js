import { Router } from 'express';
import { ControllerTipoAccion } from './controller.js';
import {
  idParamSchema,
  validateRequest,
} from '../../../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../../../utils/asyncHandler.js';
import { tipoAccionSchema } from './schema.js';

const routes = new Router();

routes
  .get('/', asyncHandler(ControllerTipoAccion.getAll))
  .post(
    '/',
    validateRequest({ bodySchema: tipoAccionSchema }),
    asyncHandler(ControllerTipoAccion.create),
  )
  .put(
    '/:id',
    validateRequest({
      paramsSchema: idParamSchema,
      bodySchema: tipoAccionSchema,
    }),
    asyncHandler(ControllerTipoAccion.update),
  );

export default routes;
