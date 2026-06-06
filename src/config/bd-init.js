import { sequelize } from './database.js';

//auth
import { permisoModel } from '../models/auth/permiso.model.js';
import { permisoRolModel, rolModel } from '../models/auth/rol.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';

//Primera
import { calleRamalModel } from '../models/calleRamal.model.js';
//
import { tarifaModel } from '../models/tarifa/tarifa.model.js';
import { rangoTarifaModel } from '../models/tarifa/rango.model.js';
//
import { socioModel } from '../models/socio.model.js';
//
import { detallePagoAccion } from '../models/accion/detallePagoAccion.model.js';
//
import { accionModel } from '../models/accion/accion.model.js';
import { accionDetalleModel } from '../models/accion/accionDetalle.model.js';
//
import { gestionModel } from '../models/gestiones/gestion.model.js';
import { periodoModel } from '../models/gestiones/periodo.model.js';
//
import { cobroModel } from '../models/cobros/cobro.model.js';
import { cobroAccionModel } from '../models/cobros/tipoCobros/cobroAccion.model.js';
import { pagoDetalleModel, pagoModel } from '../models/cobros/pago.model.js';
import { reciboModel } from '../models/cobros/recibo.model.js';

export async function ConnectDB() {
  try {
    console.log('🌐 Conectando a la base de datos PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión OK');

    //Primera migracion
    await permisoModel.sync({ alter: true });
    await rolModel.sync({ alter: true });
    await permisoRolModel.sync({ alter: true });
    await usuarioModel.sync({ alter: true });
    //Segunda Migracion
    await calleRamalModel.sync({ alter: true });
    //Tercera migracion
    await tarifaModel.sync({ alter: true });
    await rangoTarifaModel.sync({ alter: true });
    //Cuartea migracion
    await socioModel.sync({ alter: true });
    //Quinta Migracion
    await detallePagoAccion.sync({ alter: true });
    //
    await accionModel.sync({ alter: true });
    await accionDetalleModel.sync({ alter: true });
    // Gestiones
    await gestionModel.sync({ alter: true });
    await periodoModel.sync({ alter: true });
    //
    await cobroModel.sync({ alter: true });
    await cobroAccionModel.sync({ alter: true });
    await pagoModel.sync({ alter: true });
    await pagoDetalleModel.sync({ alter: true });
    await reciboModel.sync({ alter: true });

    console.log('✅ Tablas cargadas correctamente');
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}
