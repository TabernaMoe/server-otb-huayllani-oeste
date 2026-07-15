import { Router } from 'express';
import { CobroAguaController as controller } from './cobrosAgua.controller.js';

const routes = new Router();

routes
  .get('/', controller.getAll)
  .get('/:id', controller.getId)
  .get('/historial/:id', controller.historial)
  .patch('/pagar/:id', controller.pagarAdmin);

export default routes;
