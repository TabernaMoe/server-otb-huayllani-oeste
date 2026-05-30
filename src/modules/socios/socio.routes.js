import { Router } from 'express';
import { SocioController as controller } from './socios.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { socioSchema, updateSocioSchema } from './socios.schema.js';

const routes = new Router();

routes.get('/', controller.getAll);
routes.get('/select', controller.getAllSelect);
routes.get('/:id', controller.getId);
routes.post('/', validateSchema(socioSchema), controller.create);
routes.patch('/:id', validateSchema(updateSocioSchema), controller.update);
routes.patch('/toggle-status/:id', controller.toggleStatus);

export default routes;
