import { Router } from 'express';
import { SocioController as controller } from './socios.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.moddlewares.js';
import { socioSchema, updateSocioSchema } from '../../schema/socios.schema.js';

const routes = new Router();

routes.get('/', controller.getAll);
routes.get('/:id', controller.getId);
routes.post('/', validateSchema(socioSchema), controller.create);
routes.patch('/:id', validateSchema(updateSocioSchema), controller.update);
routes.delete('/:id', controller.disable);

export default routes;
