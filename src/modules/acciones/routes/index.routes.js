import { Router } from 'express';
import detallePagoAccionRoutes from './detallePagoAccion.routes.js';

const routes = new Router();

routes.use('/detalle', detallePagoAccionRoutes);

export default routes;
