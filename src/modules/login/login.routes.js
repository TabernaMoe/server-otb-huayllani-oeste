import { Router } from 'express';
import { LoginController as controller } from './login.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { loginSchema } from './login.schema.js';
import { checkAuth } from '../../middlewares/auth.middlewares.js';

const routes = new Router();

routes.post('/', validateSchema(loginSchema), controller.InicarSesion);
routes.get('/me', checkAuth, controller.getMe);
routes.patch('/', checkAuth, controller.updateMe);

export default routes;
