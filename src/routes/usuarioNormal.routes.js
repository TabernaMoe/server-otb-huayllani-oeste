import { Router } from 'express';
import portalSocioRoutes from '../modules/portalSocio/portalSocio.routes.js';

const routes = new Router();

routes.use('/', portalSocioRoutes);

export default routes;
