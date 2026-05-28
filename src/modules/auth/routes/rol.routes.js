import { Router } from 'express';
import { RolController as controller } from '../controller/rol.controller.js';
import { validateSchema } from './../../../middlewares/validateSchema.middlewares.js';
import {
  rolSchema,
  rolUpdateSchema,
} from '../../../modules/auth/schemas/rol.schema.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/pagination', controller.getAllPagination)
  .get('/permisos', controller.getPermisos)
  .get('/:id', controller.getId)
  .post('/', validateSchema(rolSchema), controller.create)
  .patch('/:id', validateSchema(rolSchema), controller.update)
  .delete('/:id', controller.delete);

export default routes;
