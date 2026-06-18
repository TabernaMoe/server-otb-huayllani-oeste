import { Router } from 'express';
import { CobroController as controller } from './cobro.controller.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { CobroSchema } from './cobros.schema.js';

// import all controllers
// import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes
  .get('/', checkPermiss('cobro.ver'), controller.getAll)
  .get('/:id', checkPermiss('cobro.ver'), controller.getId)
  .post(
    '/',
    checkPermiss('cobro.pagar'),
    validateSchema(CobroSchema),
    controller.pagarAdmin,
  );

export default routes;
