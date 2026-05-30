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

    console.log('✅ Tablas cargadas correctamente');
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}
