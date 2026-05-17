import { sequelize } from './database.js';
import { accionModel } from '../models/acciones/accion.model.js';

export async function ConnectDB() {
  try {
    console.log('🌐 Conectando a la base de datos PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Conexión OK');
    await accionModel.sync({ alter: true });
    console.log('✅ Tablas cargadas correctamente');
  } catch (e) {
    console.error('❌ Error DB:', e.message);
    process.exit(1);
  }
}

export async function CloseBD() {
  await sequelize.close();
}
