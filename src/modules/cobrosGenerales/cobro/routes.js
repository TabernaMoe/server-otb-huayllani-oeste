import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';
import { CobroController } from './controller.js';
import { CobroQuery, PagarSchema } from './schemas.js';

const routes = new Router();

routes
  .get(
    '/socios/:id',
    validateRequest({ paramsSchema: idParamSchema, querySchema: CobroQuery }),
    asyncHandler(CobroController.getCobrosBySocio),
  )
  .get(
    '/accion/:id',
    validateRequest({ paramsSchema: idParamSchema, querySchema: CobroQuery }),
    asyncHandler(CobroController.getCobrosByAccion),
  )
  .post(
    '/pagar',
    validateRequest({ bodySchema: PagarSchema }),
    asyncHandler(CobroController.pagar),
  );

export default routes;
