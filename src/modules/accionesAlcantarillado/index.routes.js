import { Router } from 'express';
import DetalleAlcantarilladoRoutes from './detalleAlcantarillado/detalleAlcantarillado.routes.js';
import AccionAlcantarilladoRoutes from './accionAlcantarillado/accionAlcantarillado.routes.js';
import CobrosRoutes from './cobrosAlcantarillado/cobrosAlcantarillado.routes.js';

const routes = new Router();
routes.use('/accion', AccionAlcantarilladoRoutes);
routes.use('/detalle', DetalleAlcantarilladoRoutes);
routes.use('/cobros', CobrosRoutes);

export default routes;
