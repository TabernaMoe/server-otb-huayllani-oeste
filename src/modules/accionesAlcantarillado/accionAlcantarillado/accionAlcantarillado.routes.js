import { Router } from 'express';
import { AcccionAlcantarilladoController as controller } from './accionAlcantarillado.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import { SocioController } from '../../socios/socios.controller.js';
import { DetalleAlcantarilladoController } from '../detalleAlcantarillado/detalleAlcantarillado.controller.js';
import {
  accionUpdateSchema,
  accionAlcantarilladoSchema,
  paginationQuerySchema,
} from './Alcantarillado.schema.js';

import {
  idParamSchema,
  validateRequest,
  searchQuerySchema,
} from '../../../middlewares/validateRequest.middlewares.js';
import { CalleRamalController } from '../../calleRamal/calleRamal.controller.js';

const routes = new Router();

routes
  .get(
    '/',
    validateRequest({
      querySchema: paginationQuerySchema,
    }),
    controller.getAll,
  )
  .get('/socio', SocioController.getSelect)
  .get('/calle', CalleRamalController.getSelect)
  .get(
    '/detalle',
    validateRequest({
      paramsSchema: searchQuerySchema,
    }),
    DetalleAlcantarilladoController.getSelect,
  )
  .get(
    '/:id',
    validateRequest({
      paramsSchema: idParamSchema,
    }),
    controller.getId,
  )
  .post(
    '/',
    validateRequest({
      bodySchema: accionAlcantarilladoSchema,
    }),
    controller.create,
  )
  .patch(
    '/:id',
    validateRequest({
      paramsSchema: idParamSchema,
      bodySchema: accionUpdateSchema,
    }),
    controller.update,
  )
  .patch(
    '/cambiar-estado/:id',
    validateRequest({
      paramsSchema: idParamSchema,
    }),
    controller.changeStatus,
  );

export default routes;
