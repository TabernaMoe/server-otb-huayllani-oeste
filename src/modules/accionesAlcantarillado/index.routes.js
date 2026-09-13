import { Router } from 'express';
import DetalleAlcantarilladoRoutes from './detallePagoAccionAlcantarillado/routes.js';
import accionAlcantarilladoRoutes from './accionAlcantarillado/routes.js';

const routes = new Router();

routes
  .use('/detalle', DetalleAlcantarilladoRoutes)
  .use('/', accionAlcantarilladoRoutes);

export default routes;
