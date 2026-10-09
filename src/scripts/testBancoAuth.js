import { BancoEconomicoAuth } from '../integrations/bancoEconomico/bancoEconomico.auth.js';

// const main = async () => {
//   try {
//     console.log('==============================');
//     console.log('BANCO ECONÓMICO');
//     console.log('PRUEBA DE AUTENTICACIÓN');
//     console.log('==============================');

//     const data = await BancoEconomicoAuth.authenticate();

//     console.log('✅ Autenticación correcta');
//     console.log('responseCode:', data.responseCode);
//     console.log('message:', data.message);

//     console.log('Token recibido:', Boolean(data.token));
//   } catch (error) {
//     console.error('❌ Error de autenticación:');
//     console.error(error.message);
//   }
// };

const main = async () => {
  try {
    const token = await BancoEconomicoAuth.getToken();

    console.log('✅ Autenticación correcta');

    console.log('Token recibido:', `${token.substring(0, 20)}...`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

main();
