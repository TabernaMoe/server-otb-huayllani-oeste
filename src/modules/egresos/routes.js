import { Router } from 'express';
import CategoriaGastoRoutes from './categoriaGastos/routes.js';
import EgresosRoutes from './egresos/routes.js';

const routes = new Router();

routes.use('/categoria-gastos', CategoriaGastoRoutes).use('/', EgresosRoutes);

export default routes;
