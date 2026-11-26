import { Router } from 'express';
import LecturaRoutes from './lectura/routes.js';

const routes = new Router();

routes.use('/lectura', LecturaRoutes);

export default routes;
