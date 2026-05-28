import { Router } from 'express';
import authRoutes from '../modules/auth/routes/index.routes.js';
import calleRoutes from '../modules/calleRamal/calleRamal.routes.js';

const routes = new Router();

routes.use('/auth', authRoutes);
routes.use('/calle', calleRoutes);

export default routes;
