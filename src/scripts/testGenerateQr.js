import { BancoEconomicoQr } from '../integrations/bancoEconomico/bancoEconomico.qr.js';

const main = async () => {
  try {
    console.log('Generando QR de prueba...');

    const qr = await BancoEconomicoQr.generateQR({
      transactionId: `TEST-${Date.now()}`,

      currency: 'BOB',

      amount: 1.2,

      description: 'Prueba integración QR',

      dueDate: '2026-08-25',

      singleUse: true,

      modifyAmount: false,
    });

    console.log('✅ QR generado correctamente');

    console.log('qrId:', qr.qrId);

    console.log('Imagen recibida:', Boolean(qr.qrImage));

    console.log('responseCode:', qr.responseCode);

    console.log('message:', qr.message);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

main();
