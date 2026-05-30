import { Router } from 'express';
import { CalleRamalController as controller } from '../controllers/detallePagoAccion.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import {
  detallePagoAccionSchema,
  detallePagoAccionUpdateSchema,
} from '../schema/detallePagoAccion.schema.js';
const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/select', controller.getAllSelect)
  .get('/:id', controller.getId)
  .post('/', validateSchema(detallePagoAccionSchema), controller.create)
  .patch(
    '/:id',
    validateSchema(detallePagoAccionUpdateSchema),
    controller.update,
  )
  .patch('/toggle-status/:id', controller.toggleStatus)
  .delete('/:id', controller.delete);

export default routes;
