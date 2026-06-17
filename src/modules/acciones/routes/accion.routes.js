import { Router } from 'express';
import { AccionController as controller } from '../controllers/accion.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import { accionSchema, accionUpdateSchema } from '../schema/acciones.schema.js';
import { checkPermiss } from '../../../middlewares/auth.middlewares.js';

const routes = new Router();

routes.get('/', checkPermiss('acciones.accion.ver'), controller.getAll);
routes.get('/:id', checkPermiss('acciones.accion.ver'), controller.getId);
routes.post(
  '/',
  checkPermiss('acciones.accion.crear'),
  validateSchema(accionSchema),
  controller.create,
);
routes.patch(
  '/:id',
  checkPermiss('acciones.accion.editar'),
  validateSchema(accionUpdateSchema),
  controller.update,
);

export default routes;
