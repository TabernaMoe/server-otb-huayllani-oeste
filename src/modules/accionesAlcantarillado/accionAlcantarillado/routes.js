import { Router } from 'express';
import { AcccionAlcantarilladoController as controller } from './controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.middlewares.js';
import { SocioController } from '../../socios/socios.controller.js';
import { Controller as detalleAlcantarillladoController } from '../detallePagoAccionAlcantarillado/controlller.js';
import { accionSchema } from './schema.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/socios', SocioController.getSelect)
  .get('/detalle-alcantarillado', detalleAlcantarillladoController.getSelect)
  .get('/:id', controller.getId)
  .post('/', validateSchema(accionSchema), controller.create)
  .patch('/camibiar-estado/:id', controller.cambiarEstado);

export default routes;
