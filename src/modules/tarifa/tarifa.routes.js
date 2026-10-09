import { Router } from 'express';
import { TaricaController as controller } from './tarifa.controller.js';
import { tarifaCreateSchema, tarifaUpdateSchema } from './tarifa.schema.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';

const routes = new Router();
routes
  .get('/', checkPermiss('tarifa.ver'), controller.getAll)
  .get('/:id', checkPermiss('tarifa.ver'), controller.getId)
  .post(
    '/',
    checkPermiss('tarifa.crear'),
    validateSchema(tarifaCreateSchema),
    controller.create,
  )
  .patch(
    '/:id',
    checkPermiss('tarifa.editar'),
    validateSchema(tarifaUpdateSchema),
    controller.update,
  )
  .patch(
    '/cambiar-estado/:id',
    checkPermiss('tarifa.estado'),
    controller.cambiarEstado,
  );

export default routes;
