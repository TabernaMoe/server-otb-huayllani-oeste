import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { CategoriaGastoController } from './controller.js';
import { CategoriaGastoSchema, CategoriaGastoUpdateSchema } from './schema.js';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';

const routes = new Router();

routes
  .get('/', asyncHandler(CategoriaGastoController.getAll))
  .post(
    '/',
    validateRequest({ bodySchema: CategoriaGastoSchema }),
    asyncHandler(CategoriaGastoController.create),
  )
  .patch(
    '/:id',
    validateRequest(
      {
        paramsSchema: idParamSchema,
        bodySchema: CategoriaGastoSchema,
      },
      asyncHandler(CategoriaGastoController.update),
    ),
  );

export default routes;
