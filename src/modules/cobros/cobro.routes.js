import { Router } from 'express';
import { CobroController as controller } from './cobro.controller.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { CobroSchema } from './cobros.schema.js';
import { AccionController } from '../acciones/controllers/accion.controller.js';

// import all controllers
// import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes
  .get('/', checkPermiss('cobro.ver'), controller.getAll)
  .get(
    '/historial',
    checkPermiss('cobros.historial'),
    controller.getHistorialCobros,
  )
  .get(
    '/acciones',
    checkPermiss('cobros.acciones'),
    AccionController.getAcciones,
  )
  .get('/:id', checkPermiss('cobro.ver'), controller.getId)
  .get(
    '/accion-historial/:id',
    checkPermiss('cobros.acciones'),
    controller.getHistorialAccion,
  )
  .post(
    '/',
    checkPermiss('cobro.pagar'),
    validateSchema(CobroSchema),
    controller.pagarAdmin,
  );

export default routes;
