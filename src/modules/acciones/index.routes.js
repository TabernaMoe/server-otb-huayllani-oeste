import { Router } from 'express';
import AccionAguaRoutes from './accionAgua/index.routes.js';
import AccionAlcantarilladoRoutes from './accionesAlcantarillado/index.routes.js';

const routes = new Router();

routes
  .use('/agua', AccionAguaRoutes)
  .use('/alcantarillado', AccionAlcantarilladoRoutes);

export default routes;
