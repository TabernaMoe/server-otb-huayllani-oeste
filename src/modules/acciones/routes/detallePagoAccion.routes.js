import { Router } from 'express';
import { CalleRamalController as controller } from '../controllers/detallePagoAccion.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import {
  detallePagoAccionSchema,
  detallePagoAccionUpdateSchema,
} from '../schema/detallePagoAccion.schema.js';
import { checkPermiss } from '../../../middlewares/auth.middlewares.js';
const routes = new Router();

routes
  .get('/', checkPermiss('acciones.detalle.ver'), controller.getAll)
  .get('/select', checkPermiss('acciones.detalle.ver'), controller.getAllSelect)
  .get('/:id', checkPermiss('acciones.detalle.ver'), controller.getId)
  .post(
    '/',
    checkPermiss('acciones.detalle.crear'),
    validateSchema(detallePagoAccionSchema),  
    controller.create,
  )
  .patch(
    '/:id',
    checkPermiss('acciones.detalle.editar'),
    validateSchema(detallePagoAccionUpdateSchema),
    controller.update,
  )
  .patch(
    '/toggle-status/:id',
    checkPermiss('acciones.detalle.estado'),
    controller.toggleStatus,
  )
  .delete('/:id', checkPermiss('acciones.detalle.eliminar'), controller.delete);

export default routes;
