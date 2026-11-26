import { Router } from 'express';
import personaAdminRoutes from '../modules/personaAdmin/PersonaAdmin.routes.js';
import loginRoutes from '../modules/login/login.routes.js';
import authRoutes from '../modules/auth/routes/index.routes.js';
import calleRoutes from '../modules/calleRamal/calleRamal.routes.js';
import tarifaRoutes from '../modules/tarifa/tarifa.routes.js';
import socioRoutes from '../modules/socios/socio.routes.js';
import gestionRoutes from '../modules/gestiones/routes/index.routes.js';
import cobroRoutes from '../modules/cobros/cobro.routes.js';
//
//import lecturaRoutes from '../modules/lecturas/lectura.routes.js';
//
import InventarioRoutes from '../modules/inventario/inventario.routes.js';
import AsambleaRotues from '../modules/asambleas/asamblea.routes.js';
//
import MultaRoutes from '../modules/multas/multa.routes.js';
//
import EgresosRoutes from '../modules/egresos/routes.js';
//Migracion
import AccionesRoutes from '../modules/acciones/index.routes.js';
import CobrosGeneralesGenerales from '../modules/cobrosGenerales/index.routes.js';
//reportes
import ReportesRoutes from '../modules/reportes/index.routes.js';
import LecturaRoutes from '../modules/lecturas/index.routes.js';

const routes = new Router();

routes
  .use('/auth', authRoutes)
  .use('/persona-admin', personaAdminRoutes)
  .use('/calle', calleRoutes)
  .use('/tarifa', tarifaRoutes)
  .use('/socio', socioRoutes)
  .use('/acciones', AccionesRoutes)
  .use('/gestion', gestionRoutes)
  .use('/cobro', cobroRoutes)
  .use('/inventario', InventarioRoutes)
  .use('/asamblea', AsambleaRotues)
  .use('/multa', MultaRoutes)
  .use('/egresos', EgresosRoutes)
  .use('/cobros-generales', CobrosGeneralesGenerales)
  .use('/reportes', ReportesRoutes)
  .use('/lectura', LecturaRoutes);

export default routes;
