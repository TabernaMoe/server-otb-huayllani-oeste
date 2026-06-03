import { Router } from 'express';
import { TaricaController as controller } from './tarifa.controller.js';
import { TarifaSchema, TarifaUpdateSchema } from './tarifa.schema.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';

const routes = new Router();
routes
  .get('/', controller.getAll)
  .get('/select', controller.getAllSelect)
  .get('/:id', controller.getId)
  .post('/', validateSchema(TarifaSchema), controller.create)
  .patch('/:id', validateSchema(TarifaUpdateSchema), controller.update)
  .patch('/toggle-status/:id', controller.toggleStatus)
  .delete('/:id', controller.delete);

export default routes;
