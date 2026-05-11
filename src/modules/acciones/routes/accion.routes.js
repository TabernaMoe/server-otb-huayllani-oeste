import { Router } from 'express';
import { AccionController as controller } from '../controllers/accion.controller.js';

const routes = new Router();

routes.get('/', controller.getAll);
routes.get('/:id', controller.getId);
routes.post('/', controller.create);
routes.patch('/:id', controller.update);
routes.patch('/disable/:id', controller.disable);

export default routes;
