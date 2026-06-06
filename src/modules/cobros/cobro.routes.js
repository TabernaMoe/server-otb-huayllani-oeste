import { Router } from 'express';
import { CobroController as controller } from './cobro.controller.js';

// import all controllers
// import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', controller.getAll);
export default routes;
