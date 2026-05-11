import { Router } from 'express';
import SociosRoutes from '../modules/socios/socio.routes.js';
import AccionesRoutes from '../modules/acciones/routes/index.routes.js';

const routes = new Router();

routes.use('/socios', SociosRoutes);
routes.use('/acciones', AccionesRoutes);

export default routes;
