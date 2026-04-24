import app from './app';

import { DEFAULTS } from './config/env.js';

const PORT = process.env.PORT || DEFAULTS.PORT;

let server;

async function startServer() {
  try {
    // await connectDB();
    // console.log('✅ Base de datos conectada correctamente');
    server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`📊 Health check: http://localhost:${PORT}/`);
    });
    // opcional: manejar errores del server http
    server.on('error', (err) => {
      console.error('❌ Error del servidor HTTP:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1); // Salir con error
  }
}

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT recibido. Cerrando...');
  try {
    if (server) await new Promise((res) => server.close(res));
    // await CloseBD(); // cierra pool SQL
    // console.log('✅ Conexión a PostgreSQL cerrada');
    process.exit(0);
  } catch (e) {
    console.error('❌ Error al cerrar:', e);
    process.exit(1);
  }
});

startServer();
