import { ConnectDB, CloseBD } from '../config/bd-init.js';
import { seedDemoData } from '../seeders/demo.seed.js';
try {
  await ConnectDB();
  await seedDemoData();
} catch (error) {
  console.error('❌ Error cargando seed demo:', error);
  process.exitCode = 1;
} finally {
  await CloseBD();
}
