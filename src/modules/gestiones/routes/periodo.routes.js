import { Router } from 'express';
import { peridoController as controller } from '../controllers/periodo.controller.js';

import { checkPermiss } from '../../../middlewares/auth.middlewares.js';

const routes = new Router();

routes.get('/', checkPermiss('admin.admin'), controller.getAll);
routes.get('/select', checkPermiss('admin.admin'), controller.getAllSelect);

routes.patch(
  '/cerrar/:id',
  checkPermiss('admin.admin'),
  controller.closePeriodo,
);

export default routes;
