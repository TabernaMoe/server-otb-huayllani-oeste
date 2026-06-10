import { Router } from 'express';
import gestionRoutes from './gestion.routes.js';
import periodoRoutes from './periodo.routes.js';
import { checkPermiss } from '../../../middlewares/auth.middlewares.js';

const routes = new Router();
routes.use('/periodo', periodoRoutes);
routes.use(gestionRoutes);

export default routes;
