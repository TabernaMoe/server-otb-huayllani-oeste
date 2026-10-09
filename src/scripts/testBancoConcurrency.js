import { BancoEconomicoAuth } from '../integrations/bancoEconomico/bancoEconomico.auth.js';

const main = async () => {
  try {
    BancoEconomicoAuth.clearToken();

    console.log('Solicitando 5 tokens simultáneamente...');

    const tokens = await Promise.all([
      BancoEconomicoAuth.getToken(),
      BancoEconomicoAuth.getToken(),
      BancoEconomicoAuth.getToken(),
      BancoEconomicoAuth.getToken(),
      BancoEconomicoAuth.getToken(),
    ]);

    console.log('✅ Todas las solicitudes terminaron');

    console.log(
      'Todos recibieron el mismo token:',
      tokens.every((token) => token === tokens[0]),
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

main();
