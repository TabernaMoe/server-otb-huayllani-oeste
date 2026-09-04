import { Router } from 'express';
import DetalleAlcantarilladoRoutes from './detallePagoAccionAlcantarillado/routes.js';

const routes = new Router();

routes.use('/detalle', DetalleAlcantarilladoRoutes);

export default routes;
