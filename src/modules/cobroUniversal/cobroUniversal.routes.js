import { Router } from 'express';
import { CobroUniversalController } from './cobroUniversal.controller.js';
import { AccionController } from '../acciones/controllers/accion.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  validateRequest,
  paginationQuerySchema,
  idParamSchema,
} from '../../middlewares/validateRequest.middlewares.js';
import {
  CobroUniversalSchema,
  CobroUniversalUpdateSchema,
} from './cobroUniversa.schema.js';

const routes = new Router();

routes
  .get(
    '/',
    validateRequest({ querySchema: paginationQuerySchema }),
    asyncHandler(CobroUniversalController.getAll),
  )
  .get('/accion', asyncHandler(AccionController.getSelect))
  .get(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(CobroUniversalController.getById),
  )
  .post(
    '/',
    validateRequest({ bodySchema: CobroUniversalSchema }),
    asyncHandler(CobroUniversalController.create),
  )
  .patch(
    '/:id',
    validateRequest({ bodySchema: CobroUniversalUpdateSchema }),
    asyncHandler(CobroUniversalController.update),
  );

export default routes;
