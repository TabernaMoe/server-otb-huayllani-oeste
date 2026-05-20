import { sequelize } from './database.js';

//auth
import { permisoModel } from '../models/auth/permiso.model.js';
import { permisoRolModel, rolModel } from '../models/auth/rol.model.js';
import { usuarioModel, usuarioRolModel } from '../models/auth/usuario.model.js';
//
import { socioModel } from '../models/socio.model.js';
//
import { accionModel } from '../models/acciones/accion.model.js';
import { tipoAccionModel } from '../models/acciones/tipoAccion.model.js';
import { tipoAccionAccionModel } from '../models/acciones/tipoAccionAccion.model.js';

export async function ConnectDB() {
  try {
    console.log('🌐 Conectando a la base de datos PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión OK');

    await permisoModel.sync({ alter: true });
    await rolModel.sync({ alter: true });
    await permisoRolModel.sync({ alter: true });
    await usuarioModel.sync({ alter: true });
    await usuarioRolModel.sync({ alter: true });
    await socioModel.sync({ alter: true });
    await accionModel.sync({ force: true });
    await tipoAccionModel.sync({ force: true });
    await tipoAccionAccionModel.sync({ force: true });

    console.log('✅ Tablas cargadas correctamente');
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}
