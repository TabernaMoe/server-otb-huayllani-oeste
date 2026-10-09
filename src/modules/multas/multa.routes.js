import { Router } from 'express';
import { MultasController as controller } from './multa.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { multaSchema, multaUpdateSchema } from './multa.schema.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .post('/', validateSchema(multaSchema), controller.create)
  .patch('/:id', validateSchema(multaUpdateSchema), controller.update)
  .patch('/cambiar-estado/:id', controller.changeStatus);

export default routes;
