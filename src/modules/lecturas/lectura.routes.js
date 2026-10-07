import { Router } from 'express';
import { LecturaController as controller } from './lectura.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import {
  lecturaSchema,
  cambiarM3Schema,
  modificarMoraSchema,
} from './lectura.schema.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';
import {
  idParamSchema,
  validateRequest,
} from '../../middlewares/validateRequest.middlewares.js';
import { AccionController } from '../acciones/controllers/accion.controller.js';

const routes = new Router();

routes
  .get('/', checkPermiss('lectura.ver'), controller.getAll)
  .get('/acciones', checkPermiss('lectura.ver'), AccionController.getSelect)
  .get(
    '/acciones-con-mora',
    checkPermiss('lectura.ver'),
    AccionController.getAccionesWithMora,
  )
  .get(
    '/historial/:id',
    checkPermiss('lectura.ver'),
    controller.GetLecturasByAccion,
  )
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
  )
  .patch(
    '/modificar-m3/:id',
    checkPermiss('lectura.editar'),
    validateRequest({
      paramsSchema: idParamSchema,
      bodySchema: cambiarM3Schema,
    }),
    controller.updateM3,
  )
  .patch(
    '/modificar-mora/:id',
    checkPermiss('lectura.editar'),
    validateRequest({
      paramsSchema: idParamSchema,
      bodySchema: modificarMoraSchema,
    }),
    controller.updateMora,
  );

export default routes;
