import { Router } from 'express';
import { TipoAccionController as controller } from '../controllers/tipoAccion.controller.js';
import { tipoAccionSchema } from '../schema/tipoAccion.schema.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .post('/', validateSchema(tipoAccionSchema), controller.create)
  .patch('/:id', validateSchema(tipoAccionSchema), controller.update);

export default routes;
