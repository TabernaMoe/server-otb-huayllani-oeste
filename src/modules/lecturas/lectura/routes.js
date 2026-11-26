import { Router } from 'express';
import {
  idParamSchema,
  validateRequest,
} from '../../../middlewares/validateRequest.middlewares.js';
import { LecturaController } from './controller.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { lecturaSchema } from './schemas.js';

const routes = new Router();

routes
  .get('/', asyncHandler(LecturaController.getAll))
  .post(
    '/:id',
    validateRequest({ bodySchema: lecturaSchema, paramsSchema: idParamSchema }),
    asyncHandler(LecturaController.create),
  );

export default routes;
