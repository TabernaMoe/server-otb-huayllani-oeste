import { BancoEconomicoQr } from '../integrations/bancoEconomico/bancoEconomico.qr.js';

const main = async () => {
  try {
    const fecha = '20260820';

    console.log(`Consultando QR pagados del ${fecha}...`);

    const result = await BancoEconomicoQr.paidQR(fecha);

    console.log('✅ Consulta realizada');

    console.log('Cantidad de pagos:', result.paymentList.length);

    for (const payment of result.paymentList) {
      console.log({
        qrId: payment.qrId,
        amount: payment.amount,
        currency: payment.currency,
        paymentDate: payment.paymentDate,
        paymentTime: payment.paymentTime,
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

main();
