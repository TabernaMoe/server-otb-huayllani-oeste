import { Router } from 'express';
import { CalleRamalController as controller } from './calleRamal.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { calleRamalSchema } from './calleRamal.schema.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';
const routes = new Router();

routes
  .get('/', checkPermiss('calle.ver'), controller.getAll)
  .get('/select', checkPermiss('calle.ver'), controller.getAllSelect)
  .get('/:id', checkPermiss('calle.ver'), controller.getId)
  .post(
    '/',
    checkPermiss('calle.crear'),
    validateSchema(calleRamalSchema),
    controller.create,
  )
  .patch(
    '/:id',
    checkPermiss('calle.editar'),
    validateSchema(calleRamalSchema),
    controller.update,
  )
  .patch(
    '/toggle-status/:id',
    checkPermiss('calle.estado'),
    controller.toggleStatus,
  )
  .delete('/:id', checkPermiss('calle.eliminar'), controller.delete);

export default routes;
