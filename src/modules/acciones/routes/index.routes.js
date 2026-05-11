import { Router } from 'express';
import accionRoutes from './accion.routes.js';
import calleRamalRoutes from './calleRamal.routes.js';
import tipoAccionRoutes from './tipoAccion.routes.js';

const routes = new Router();

routes.use('/acciones', accionRoutes);
routes.use('/calle-ramal', calleRamalRoutes);
routes.use('/tipo-accion', tipoAccionRoutes);

export default routes;
