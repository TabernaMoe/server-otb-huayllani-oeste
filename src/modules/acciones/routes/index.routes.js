import { Router } from 'express';
import accionRoutes from './accion.routes.js';
import detallePagoAccionRoutes from './detallePagoAccion.routes.js';

const routes = new Router();

routes.use('/detalle', detallePagoAccionRoutes);
routes.use(accionRoutes);

export default routes;
