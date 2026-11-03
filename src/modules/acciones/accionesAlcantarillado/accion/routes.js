import { Router } from 'express';
import { asyncHandler } from '../../../../utils/asyncHandler.js';
import {
  idParamSchema,
  validateRequest,
} from '../../../../middlewares/validateRequest.middlewares.js';
import { AccionAlcantarilladoController } from './controller.js';
import {
  accionSchema,
  accionUpdateSchema,
  cambioNombreSchema,
} from './schema.js';
import { SocioController } from '../../../socios/socios.controller.js';
import { CalleRamalController } from '../../../calleRamal/calleRamal.controller.js';
import { DetalleAccionController } from '../detalleAccion/controller.js';

const routes = new Router();

routes
  .get('/', asyncHandler(AccionAlcantarilladoController.getAll))
  .get('/socio', SocioController.getSelect)
  .get('/calle', CalleRamalController.getSelect)
  .get('/detalles-accion', asyncHandler(DetalleAccionController.getSelect))
  .get(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(AccionAlcantarilladoController.getById),
  )
  .post(
    '/',
    validateRequest({ bodySchema: accionSchema }),
    asyncHandler(AccionAlcantarilladoController.create),
  )
  .post(
    '/cambiar-nombre',
    validateRequest({ bodySchema: cambioNombreSchema }),
    asyncHandler(AccionAlcantarilladoController.changeName),
  )
  .patch(
    '/:id',
    validateRequest({
      bodySchema: accionUpdateSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(AccionAlcantarilladoController.update),
  );

export default routes;
