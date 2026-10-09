import { Router } from 'express';

import { validateSchema } from '../middlewares/validateSchema.middlewares.js';
import { requireSocio } from '../middlewares/auth.middlewares.js';
import { PortalSocioController as controller } from '../modules/portalSocio/portalSocio.controller.js';
import { changePasswordSchema } from '../modules/portalSocio/portalSocio.schema.js';

const routes = new Router();

routes.use(requireSocio);
routes.get('/me', controller.perfil);
routes.get('/me/resumen', controller.resumen);
routes.get('/me/acciones', controller.acciones);
routes.get('/me/lecturas', controller.lecturas);
routes.get('/me/cobros', controller.cobros);
routes.get('/me/recibos', controller.recibos);
routes.patch(
  '/me/password',
  validateSchema(changePasswordSchema),
  controller.cambiarPassword,
);

export default routes;
