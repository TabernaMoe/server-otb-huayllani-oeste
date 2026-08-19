import { Router } from 'express';
import accionRoutes from './accion.routes.js';
import detallePagoAccionRoutes from './detallePagoAccion.routes.js';
import tipoAccionRoutes from './tipoAccion.routes.js';

const routes = new Router();

routes
  .use('/tipo-accion', tipoAccionRoutes)
  .use('/detalle', detallePagoAccionRoutes)
  .use(accionRoutes);

export default routes;
