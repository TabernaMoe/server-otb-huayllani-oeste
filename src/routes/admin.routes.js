import { Router } from 'express';
import loginRoutes from '../modules/login/login.routes.js';
import authRoutes from '../modules/auth/routes/index.routes.js';
import calleRoutes from '../modules/calleRamal/calleRamal.routes.js';
import tarifaRoutes from '../modules/tarifa/tarifa.routes.js';
import socioRoutes from '../modules/socios/socio.routes.js';
import accionRoutes from '../modules/acciones/routes/index.routes.js';
import gestionRoutes from '../modules/gestiones/routes/index.routes.js';
import cobroRoutes from '../modules/cobros/cobro.routes.js';
//
import lecturaRoutes from '../modules/lecturas/lectura.routes.js';
import cobroAguaRoutes from '../modules/cobrosAgua/cobrosAgua.routes.js';
import InventarioRoutes from '../modules/inventario/inventario.routes.js';
import AsambleaRotues from '../modules/asambleas/asamblea.routes.js';

const routes = new Router();

routes
  .use('/auth', authRoutes)
  .use('/calle', calleRoutes)
  .use('/tarifa', tarifaRoutes)
  .use('/socio', socioRoutes)
  .use('/accion', accionRoutes)
  .use('/gestion', gestionRoutes)
  .use('/cobro', cobroRoutes)
  .use('/lectura', lecturaRoutes)
  .use('/pago-agua', cobroAguaRoutes)
  .use('/inventario', InventarioRoutes)
  .use('/asamblea', AsambleaRotues);

export default routes;
