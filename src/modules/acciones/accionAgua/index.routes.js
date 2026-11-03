import { Router } from 'express';
import AccionRoutes from './accion/routes.js';
import DetalleAccionRoutes from './detalleAccion/route.js';
import TipoAccionRoutes from './tipoAccion/routes.js';

const routes = new Router();

routes
  .use('/detalle', DetalleAccionRoutes)
  .use('/tipo-accion', TipoAccionRoutes)
  .use('/', AccionRoutes);

export default routes;
