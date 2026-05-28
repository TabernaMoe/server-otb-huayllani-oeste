import { Router } from 'express';
import { CalleRamalController as controller } from './calleRamal.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { calleRamalSchema } from './calleRamal.schema.js';
const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/:id', controller.getId)
  .post('/', validateSchema(calleRamalSchema), controller.create)
  .patch('/:id', validateSchema(calleRamalSchema), controller.update)
  .patch('/toggle-status/:id', controller.toggleStatus)
  .delete('/:id', controller.delete);

export default routes;
