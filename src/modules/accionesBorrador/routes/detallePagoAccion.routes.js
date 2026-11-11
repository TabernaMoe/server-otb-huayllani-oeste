import { Router } from 'express';
import { DetallePagoAccionController as controller } from '../controllers/detallePagoAccion.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import {
  detallePagoAccionSchema,
  detallePagoAccionUpdateSchema,
} from '../schema/detallePagoAccion.schema.js';
import { checkPermiss } from '../../../middlewares/auth.middlewares.js';
import { TipoAccionController } from '../controllers/tipoAccion.controller.js';
const routes = new Router();

routes
  .get('/', checkPermiss('acciones.detalle.ver'), controller.getAll)
  .get(
    '/tipos-accion',
    checkPermiss('acciones.detalle.ver'),
    TipoAccionController.getSelect,
  )
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
    '/cambiar-estado/:id',
    checkPermiss('acciones.detalle.estado'),
    controller.cambiarEstado,
  );

export default routes;
