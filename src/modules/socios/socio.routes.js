import { Router } from 'express';
import { SocioController as controller } from './socios.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { socioSchema, updateSocioSchema } from './socios.schema.js';
import { checkPermiss } from '../../middlewares/auth.middlewares.js';

const routes = new Router();

routes.get('/', checkPermiss('socio.ver'), controller.getAll);
routes.get('/select', checkPermiss('socio.ver'), controller.getAllSelect);
routes.get('/:id', checkPermiss('socio.ver'), controller.getId);
routes.post(
  '/',
  checkPermiss('socio.crear'),
  validateSchema(socioSchema),
  controller.create,
);
routes.patch(
  '/:id',
  checkPermiss('socio.actualizar'),
  validateSchema(updateSocioSchema),
  controller.update,
);
routes.patch(
  '/toggle-status/:id',
  checkPermiss('socio.estado'),
  controller.toggleStatus,
);

export default routes;
