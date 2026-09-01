import { Router } from 'express';
import { AccionController as controller } from '../controllers/accion.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import {
  accionSchema,
  accionUpdateSchema,
  estadoAccionSchema,
  cambiarNombreSchema,
} from '../schema/acciones.schema.js';
import { checkPermiss } from '../../../middlewares/auth.middlewares.js';
import { TipoAccionController } from '../controllers/tipoAccion.controller.js';
import { DetallePagoAccionController } from '../controllers/detallePagoAccion.controller.js';
import { TaricaController } from '../../tarifa/tarifa.controller.js';
import { SocioController } from '../../socios/socios.controller.js';

const routes = new Router();

routes
  .get('/', checkPermiss('acciones.accion.ver'), controller.getAll)
  .get(
    '/socios',
    checkPermiss('acciones.accion.ver'),
    SocioController.getSelect,
  )
  .get(
    '/tarifa-agua',
    checkPermiss('acciones.accion.ver'),
    TaricaController.getSelect,
  )
  .get(
    '/tipos-accion',
    checkPermiss('acciones.accion.ver'),
    TipoAccionController.getSelect,
  )
  .get(
    '/detalle-accion/:id',
    checkPermiss('acciones.accion.ver'),
    DetallePagoAccionController.getSelect,
  )
  .get('/:id', checkPermiss('acciones.accion.ver'), controller.getId)
  .post(
    '/',
    checkPermiss('acciones.accion.crear'),
    validateSchema(accionSchema),
    controller.create,
  )
  .patch(
    '/:id',
    checkPermiss('acciones.accion.editar'),
    validateSchema(accionUpdateSchema),
    controller.update,
  )
  .patch(
    '/camibiar-estado/:id',
    checkPermiss('acciones.accion.cambiarEstado'),
    validateSchema(estadoAccionSchema),
    controller.cambiarEstado,
  )
  .patch(
    '/cambiar-nombre/:id',
    validateSchema(cambiarNombreSchema),
    checkPermiss('acciones.accion.cambiarNombre'),
    controller.cambiarNombreAccion,
  );

export default routes;
