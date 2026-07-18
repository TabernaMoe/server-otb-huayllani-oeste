import { Router } from 'express';
import { CobroAguaController as controller } from './cobrosAgua.controller.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { cobroAguaSchema } from './cobrosAgua.schema.js';

const routes = new Router();

routes
  .get('/', checkPermiss('cobros.ver'), controller.getAll)
  .get('/:id', checkPermiss('cobros.ver'), controller.getId)
  .get('/historial/:id', checkPermiss('cobros.ver'), controller.historial)
  .patch(
    '/pagar/:id',
    checkPermiss('cobros.pagar'),
    validateSchema(cobroAguaSchema),
    controller.pagarAdmin,
  );

export default routes;
