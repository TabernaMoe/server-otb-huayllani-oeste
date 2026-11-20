import { Router } from 'express';
import CobroRoutes from './cobros/routes.js';
import ReciboRoutes from './recibos/routes.js';

const routes = new Router();

routes.use('/cobro', CobroRoutes).use('/recibo', ReciboRoutes);

export default routes;
