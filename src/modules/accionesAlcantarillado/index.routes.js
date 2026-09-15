import { Router } from 'express';
import DetalleAlcantarilladoRoutes from './detalleAlcantarillado/detalleAlcantarillado.routes.js';
import AccionAlcantarilladoRoutes from './accionAlcantarillado/accionAlcantarillado.routes.js';

const routes = new Router();
routes.use('/accion', AccionAlcantarilladoRoutes);
routes.use('/detalle', DetalleAlcantarilladoRoutes);

export default routes;
