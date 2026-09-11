import { Router } from 'express';
import CambioNombreController from './cambioNombre.controller.js';
import { cambioNombreSchema } from './cambioNombre.schema.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { AccionController } from '../acciones/controllers/accion.controller.js';
import { SocioController } from '../socios/socios.controller.js';

const routes = new Router();

routes
  .get('/', CambioNombreController.getAll)
  .get('/acciones', AccionController.getSelect)
  .get('/socios', SocioController.getSelect)
  .get('/:id', CambioNombreController.getId)
  .post('/', validateSchema(cambioNombreSchema), CambioNombreController.create);

export default routes;
