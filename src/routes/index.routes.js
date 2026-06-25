import { Router } from 'express';
import loginRoutes from '../modules/login/login.routes.js';
import adminRoutes from './admin.routes.js';
import usuarioNormalRoutes from './usuarioNormal.routes.js';
import { checkAuth } from '../middlewares/auth.middlewares.js';
import PruebaRoutes from '../modules/pruebapdf/prueba.routes.js';

const routes = new Router();

routes
  .use('/prueba', PruebaRoutes)
  .use('/login', loginRoutes)
  .use('/admin', checkAuth, adminRoutes)
  .use('/cliente', checkAuth, usuarioNormalRoutes);

export default routes;
