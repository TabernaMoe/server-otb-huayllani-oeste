import { Router } from 'express';
import rolRoutes from './rol.routes.js';
import usuarioRoutes from './usuario.routes.js';
import { checkPermiss } from '../../../middlewares/auth.middlewares.js';

const routes = new Router();

routes.use('/roles', checkPermiss('admin.admin'), rolRoutes);
routes.use('/usuarios', checkPermiss('admin.admin'), usuarioRoutes);

export default routes;
