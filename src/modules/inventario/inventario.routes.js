import { Router } from 'express';
import { InventarioController as controller } from './inventario.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import {
  inventaioSchema,
  inventarioUpdateSchema,
} from './inventario.schema.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/restar/:id', controller.restar)
  .get('/sumar/:id', controller.sumar)
  .post('/', validateSchema(inventaioSchema), controller.create)
  .patch('/:id', validateSchema(inventarioUpdateSchema), controller.update);

export default routes;
