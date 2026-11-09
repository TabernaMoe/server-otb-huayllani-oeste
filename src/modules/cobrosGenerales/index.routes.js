import { Router } from 'express';
import ReciboRoutes from './recibo/routes.js';

const routes = new Router();

routes.use('/recibos', ReciboRoutes);

export default routes;
