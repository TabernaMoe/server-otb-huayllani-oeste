import { Router } from 'express';
import { SocioController as controller } from '../controllers/socios.controller.js';
import { validateSchema } from '../../../middlewares/validateSchema.moddlewares.js';
import {
  createSocioSchema,
  updateSocioSchema,
} from '../../../schema/socios/socios.schema.js';

const routes = new Router();

routes.get('/', controller.getAll);
routes.get('/:id', controller.getId);
routes.post('/', validateSchema(createSocioSchema), controller.create);
routes.patch('/:id', validateSchema(updateSocioSchema), controller.update);
routes.delete('/:id', controller.delete);

export default routes;
