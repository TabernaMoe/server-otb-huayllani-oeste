import { Router } from 'express';
import { TaricaController as controller } from './tarifa.controller.js';
import { TarifaSchema, TarifaUpdateSchema } from './tarifa.schema.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';

const routes = new Router();
routes
  .get('/', checkPermiss('tarifa.ver'), controller.getAll)
  .get('/select', checkPermiss('tarifa.ver'), controller.getSelect)
  .get('/:id', checkPermiss('tarifa.ver'), controller.getId)
  .post(
    '/',
    checkPermiss('tarifa.crear'),
    validateSchema(TarifaSchema),
    controller.create,
  )
  .patch(
    '/:id',
    checkPermiss('tarifa.editar'),
    validateSchema(TarifaUpdateSchema),
    controller.update,
  )
  .patch(
    '/toggle-status/:id',
    checkPermiss('tarifa.estado'),
    controller.toggleStatus,
  )
  .delete('/:id', checkPermiss('tarifa.eliminar'), controller.delete);

export default routes;
