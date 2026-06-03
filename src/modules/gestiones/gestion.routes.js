import { Router } from 'express';
import { GestionController as controller } from './gestion.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { gestionSchema } from './gestion.schema.js';
const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/:id', controller.getId)
  .post('/', validateSchema(gestionSchema), controller.create)
  .delete('/:id', controller.delete);

export default routes;
