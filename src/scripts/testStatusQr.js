import { BancoEconomicoQr } from '../integrations/bancoEconomico/bancoEconomico.qr.js';

const main = async () => {
  try {
    const qrId = '26082201016003000018';

    const result = await BancoEconomicoQr.statusQR(qrId);

    console.log('Estado Banco:', result.statusQrCode);

    console.log('responseCode:', result.responseCode);

    console.log('message:', result.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

main();
