import { Router } from 'express';
import { GestionController as controller } from '../controllers/gestion.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import { gestionSchema } from '../schemas/gestion.schema.js';

import { checkPermiss } from '../../../middlewares/auth.middlewares.js';

const routes = new Router();

routes
  .get('/', checkPermiss('admin.admin'), controller.getAll)
  .get('/:id', checkPermiss('admin.admin'), controller.getId)
  .post(
    '/',
    checkPermiss('admin.admin'),
    validateSchema(gestionSchema),
    controller.create,
  );

export default routes;
