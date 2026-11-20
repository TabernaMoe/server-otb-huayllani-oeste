import { Router } from 'express';

import { requireSocio } from '../../middlewares/auth.middlewares.js';
import { validateRequest } from '../../middlewares/validateRequest.middlewares.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { PortalSocioController as controller } from './portalSocio.controller.js';
import {
  accionFilterQuerySchema,
  changePasswordSchema,
  updatePerfilSchema,
} from './portalSocio.schema.js';

const router = new Router();

router.use(requireSocio);

router.get('/me', asyncHandler(controller.perfil));
router.patch(
  '/me',
  validateRequest({ bodySchema: updatePerfilSchema }),
  asyncHandler(controller.actualizarPerfil),
);
router.get('/me/resumen', asyncHandler(controller.resumen));
router.get('/me/acciones', asyncHandler(controller.acciones));
router.get(
  '/me/lecturas',
  validateRequest({ querySchema: accionFilterQuerySchema }),
  asyncHandler(controller.lecturas),
);
router.get(
  '/me/cobros',
  validateRequest({ querySchema: accionFilterQuerySchema }),
  asyncHandler(controller.cobros),
);
router.get(
  '/me/recibos',
  validateRequest({ querySchema: accionFilterQuerySchema }),
  asyncHandler(controller.recibos),
);
router.patch(
  '/me/password',
  validateRequest({ bodySchema: changePasswordSchema }),
  asyncHandler(controller.cambiarPassword),
);

export default router;
