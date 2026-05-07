import { Router } from 'express';
import SociosRoutes from '../modules/socios/routes/socio.routes.js';

const routes = new Router();

routes.use('/socios', SociosRoutes);

export default routes;
