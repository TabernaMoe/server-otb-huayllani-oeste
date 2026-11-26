import { Router } from 'express';
import ReciboRoutes from './recibo/routes.js';
import CobroRoutes from './cobro/routes.js';

const routes = new Router();

routes.use('/recibos', ReciboRoutes).use('/cobros', CobroRoutes);

export default routes;
