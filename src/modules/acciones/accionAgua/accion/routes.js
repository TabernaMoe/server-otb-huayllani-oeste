import { Router } from 'express';
import { asyncHandler } from '../../../../utils/asyncHandler.js';
import {
  idParamSchema,
  validateRequest,
} from '../../../../middlewares/validateRequest.middlewares.js';
import { AccionAguaController } from './controller.js';
import {
  accionSchema,
  accionUpdateSchema,
  cambioNombreSchema,
} from './schema.js';
import { SocioController } from '../../../socios/socios.controller.js';
import { TaricaController } from '../../../tarifa/tarifa.controller.js';
import { CalleRamalController } from '../../../calleRamal/calleRamal.controller.js';
import { ControllerTipoAccion } from '../tipoAccion/controller.js';
import { DetalleAccionController } from '../detalleAccion/controller.js';

const routes = new Router();

routes
  .get('/', asyncHandler(AccionAguaController.getAll))
  .get('/socios', SocioController.getSelect)
  .get('/tarifa', TaricaController.getSelect)
  .get('/calle', CalleRamalController.getSelect)
  .get('/tipos-accion', asyncHandler(ControllerTipoAccion.getSelect))
  .get(
    '/detalle-accion/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(DetalleAccionController.getSelectBytipo),
  )
  .get(
    '/:id',
    validateRequest({ paramsSchema: idParamSchema }),
    asyncHandler(AccionAguaController.getById),
  )
  .post(
    '/',
    validateRequest({ bodySchema: accionSchema }),
    asyncHandler(AccionAguaController.create),
  )
  .post(
    '/cambiar-nombre',
    validateRequest({ bodySchema: cambioNombreSchema }),
    asyncHandler(AccionAguaController.changeName),
  )
  .patch(
    '/:id',
    validateRequest({
      bodySchema: accionUpdateSchema,
      paramsSchema: idParamSchema,
    }),
    asyncHandler(AccionAguaController.update),
  );

export default routes;
