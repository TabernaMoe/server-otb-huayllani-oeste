import { Router } from 'express';
import { AccionController as controller } from '../controllers/calleRamal.controller.js';

const routes = new Router();

routes.get('/', controller.getAll);
routes.get('/:id', controller.getId);
routes.post('/', controller.create);
routes.put('/:id', controller.update);
routes.delete('/:id', controller.delete);

export default routes;
