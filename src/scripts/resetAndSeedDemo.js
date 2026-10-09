process.env.RESET_DB_ON_START = 'true';
const { ConnectDB, CloseBD } = await import('../config/bd-init.js');
const { seedDemoData } = await import('../seeders/demo.seed.js');
try {
  await ConnectDB();
  await seedDemoData();
} catch (error) {
  console.error('❌ Error reiniciando/cargando seed demo:', error);
  process.exitCode = 1;
} finally {
  await CloseBD();
}
