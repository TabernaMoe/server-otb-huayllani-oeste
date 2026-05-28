import { Router } from 'express';
import rolRoutes from './rol.routes.js';
import usuarioRoutes from './usuario.routes.js';

const routes = new Router();

routes.use('/roles', rolRoutes);
routes.use('/usuarios', usuarioRoutes);

export default routes;
