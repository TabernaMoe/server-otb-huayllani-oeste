import { Router } from 'express';
import authRoutes from '../modules/auth/routes/index.routes.js';
import calleRoutes from '../modules/calleRamal/calleRamal.routes.js';
import tarifaRoutes from '../modules/tarifa/tarifa.routes.js';
import socioRoutes from '../modules/socios/socio.routes.js';
import accionRoutes from '../modules/acciones/routes/index.routes.js';

const routes = new Router();

routes
  .use('/auth', authRoutes)
  .use('/calle', calleRoutes)
  .use('/tarifa', tarifaRoutes)
  .use('/socio', socioRoutes)
  .use('/accion', accionRoutes);

export default routes;
