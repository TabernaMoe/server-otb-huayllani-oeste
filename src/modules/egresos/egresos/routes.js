import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { EgresosController } from './controller.js';
import { CategoriaGastoController } from '../categoriaGastos/controller.js';
import { BeneficiarioController } from '../beneficiario/controller.js';
import { EgresoSchema, EgresoUpdateSchema } from './schema.js';
import {
  idParamSchema,
  validateRequest,
  searchQuerySchema,
} from '../../../middlewares/validateRequest.middlewares.js';

const routes = new Router();

routes
  .get('/', asyncHandler(EgresosController.getAll))
  .get('/categoria-gastos', asyncHandler(CategoriaGastoController))
  .get(
    '/beneficiarios',
    validateRequest({ querySchema: searchQuerySchema }),
    asyncHandler(BeneficiarioController.getAllByName),
  )
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
  )
  .patch(
    '/cambiar-estado/:id',
    validateRequest({
      paramsSchema: idParamSchema,
    }),
    asyncHandler(EgresosController.changeStatus),
  );

export default routes;
