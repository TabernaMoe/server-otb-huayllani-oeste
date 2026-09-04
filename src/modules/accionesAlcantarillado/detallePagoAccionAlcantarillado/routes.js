import { Router } from 'express';
import { Controller } from './controlller.js';
import {
  detallePagoAccionSchema,
  detallePagoAccionUpdateSchema,
} from './schema.js';

const routes = new Router();

routes
  .get('/', Controller.getAll)
  .post('/', Controller.create)
  .patch('/:id', Controller.update)
  .patch('/cambiar-estado/:id', Controller.cambiarEstado);

export default routes;
