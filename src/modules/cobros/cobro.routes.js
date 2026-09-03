import { Router } from 'express';
import { CobroController as controller } from './cobro.controller.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { CobroSchema, AsignarMultaSchema } from './cobros.schema.js';
import { AccionController } from '../acciones/controllers/accion.controller.js';
//
import { MultasController } from '../multas/multa.controller.js';

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
  .get('/multas', MultasController.geSelect)
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
  )
  .post(
    '/multas/:id',
    validateSchema(AsignarMultaSchema),
    controller.AsignarMulta,
  );

export default routes;
