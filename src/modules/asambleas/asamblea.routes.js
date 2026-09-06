import { Router } from 'express';
import { AsambleaController as controller } from './asamblea.controller.js';
import {
  asambleaSchema,
  asambleaUpdateSchema,
  asambleaUpdateAccion,
} from './asamblea.schema.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/acciones/:id', controller.getAcciones)
  .get('/:id', controller.getId)
  .post('/', validateSchema(asambleaSchema), controller.create)
  .patch('/:id', validateSchema(asambleaUpdateSchema), controller.update)
  .patch(
    '/accion/:id',
    validateSchema(asambleaUpdateAccion),
    controller.updateAccion,
  );
export default routes;
