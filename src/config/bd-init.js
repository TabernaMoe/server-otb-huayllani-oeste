import { sequelize } from './database.js';

//auth
import { permisoModel } from '../models/auth/permiso.model.js';
import { permisoRolModel, rolModel } from '../models/auth/rol.model.js';
import { usuarioModel } from '../models/auth/usuario.model.js';
//
import { socioModel } from '../models/socio.model.js';
//
import { calleRamalModel } from '../models/calleRamal.model.js';

export async function ConnectDB() {
  try {
    console.log('🌐 Conectando a la base de datos PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión OK');

    //Primera migracion
    await permisoModel.sync({ force: true });
    await rolModel.sync({ force: true });
    await permisoRolModel.sync({ force: true });
    await usuarioModel.sync({ force: true });
    //Segunda Migracion
    await calleRamalModel.sync({ force: true });

    console.log('✅ Tablas cargadas correctamente');
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}
