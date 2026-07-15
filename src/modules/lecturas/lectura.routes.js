import { Router } from 'express';
import { LecturaController as controller } from './lectura.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { lecturaSchema } from './lectura.schema.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';

const routes = new Router();

routes
  .get('/', checkPermiss('lectura.ver'), controller.getAll)
  .get('/historial/:id', checkPermiss('lectura.ver'), controller.hitoryId)
  .get('/:id', checkPermiss('lectura.ver'), controller.getId)
  .post(
    '/:id',
    checkPermiss('lectura.crear'),
    validateSchema(lecturaSchema),
    controller.create,
  )
  .patch(
    '/:id',
    checkPermiss('lectura.editar'),
    validateSchema(lecturaSchema),
    controller.update,
  )
  .patch(
    '/cambio/:id',
    checkPermiss('lectura.cambio'),
    validateSchema(lecturaSchema),
    controller.ChangeMedidor,
  );

export default routes;
