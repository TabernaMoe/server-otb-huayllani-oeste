import { Router } from 'express';
import { UsuarioController as controller } from '../controller/usuario.controller.js';
import { validateSchema } from './../../../middlewares/validateSchema.middlewares.js';
import {
  userSchema,
  userUpdateSchema,
} from '../../../modules/auth/schemas/usuario.schema.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/:id', controller.getId)
  .post('/', validateSchema(userSchema), controller.create)
  .patch('/:id', validateSchema(userUpdateSchema), controller.update)
  .patch('/toggle-status/:id', controller.toggleStatus);

export default routes;
