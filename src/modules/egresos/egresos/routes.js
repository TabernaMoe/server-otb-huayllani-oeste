import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { EgresosController } from './controller.js';
import { CategoriaGastoController } from '../categoriaGastos/controller.js';
import { EgresoSchema, EgresoUpdateSchema } from './schema.js';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';

const routes = new Router();

routes
  .get('/', asyncHandler(EgresosController.getAll))
  .get('/categoria-gastos', asyncHandler(CategoriaGastoController))
  .post(
    '/',
    validateRequest({ bodySchema: EgresoSchema }),
    asyncHandler(EgresosController.create),
  )
  .patch(
    '/:id',
    validateRequest(
      {
        paramsSchema: idParamSchema,
        bodySchema: EgresoUpdateSchema,
      },
      asyncHandler(EgresosController.update),
    ),
  );

export default routes;
