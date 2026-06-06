import { Router } from 'express';
import { peridoController as controller } from '../controllers/periodo.controller.js';
const routes = new Router();

routes.get('/', controller.getAll);
routes.patch('/cerrar/:id', controller.closePeriodo);

export default routes;
