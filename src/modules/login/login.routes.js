import { Router } from 'express';
import { LoginController as controller } from './login.controller.js';
import { validateSchema } from '../../middlewares/validateSchema.middlewares.js';
import { loginSchema } from './login.schema.js';

const routes = new Router();

routes.post('/', validateSchema(loginSchema), controller.InicarSesion);

export default routes;
