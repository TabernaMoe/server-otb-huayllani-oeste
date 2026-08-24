import { BancoEconomicoEncrypt } from '../integrations/bancoEconomico/bancoEconomico.encrypt.js';

const main = async () => {
  try {
    console.log('Probando cifrado Banco Económico...');

    const encrypted = await BancoEconomicoEncrypt.encrypt('1234');

    console.log('Texto cifrado:');
    console.log(encrypted);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

main();
