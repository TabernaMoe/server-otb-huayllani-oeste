import { Router } from 'express';
import AccionRoutes from './accion/routes.js';
import DetalleAccionRoutes from './detalleAccion/route.js';

const routes = new Router();

routes.use('/detalle', DetalleAccionRoutes).use('/', AccionRoutes);

export default routes;
