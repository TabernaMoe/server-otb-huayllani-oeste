import { Router } from 'express';
import { SocioController as controller } from './socios.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { socioSchema, updateSocioSchema } from '../../schema/socios.schema.js';

const routes = new Router();

routes.get('/', controller.getAll);
routes.get('/select', controller.getAllSelect);
routes.get('/deleteds', controller.getAllDeleteds);
routes.patch('/toggle-status/:id', controller.toggleStatus);
routes.patch('/restore/:id', controller.restore);
routes.get('/:id', controller.getId);
routes.post('/', validateSchema(socioSchema), controller.create);
routes.patch('/:id', validateSchema(updateSocioSchema), controller.update);
routes.delete('/:id', controller.delete);

export default routes;
