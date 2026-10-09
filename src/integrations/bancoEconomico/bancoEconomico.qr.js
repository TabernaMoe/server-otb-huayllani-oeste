import { bancoEconomicoConfig } from '../../config/bancoEconomico.config.js';

import { BancoEconomicoEncrypt } from './bancoEconomico.encrypt.js';

import { bancoEconomicoClient } from './bancoEconomico.client.js';

import { generateQrSchema } from './bancoEconomico.schemas.js';

export class BancoEconomicoQr {
  static async generateQR(payload) {
    try {
      const validated = generateQrSchema.parse(payload);

      const accountCreditEncrypted = await BancoEconomicoEncrypt.encrypt(
        bancoEconomicoConfig.accountCredit,
      );

      const requestBody = {
        transactionId: validated.transactionId,

        accountCredit: accountCreditEncrypted,

        currency: validated.currency,

        amount: validated.amount,

        dueDate: validated.dueDate,

        singleUse: validated.singleUse,

        modifyAmount: validated.modifyAmount,
      };

      if (validated.description) {
        requestBody.description = validated.description;
      }

      if (validated.branchCode) {
        requestBody.branchCode = validated.branchCode;
      }

      const response = await bancoEconomicoClient.post(
        '/api/qrsimple/generateQR',
        requestBody,
      );

      const data = response.data;

      if (data.responseCode !== 0) {
        throw new Error(
          data.message || 'Banco Económico rechazó la generación del QR',
        );
      }

      if (!data.qrId || !data.qrImage) {
        throw new Error('Respuesta incompleta de Banco Económico');
      }

      return data;
    } catch (error) {
      if (error.response) {
        console.error(
          'Error generateQR Banco Económico:',
          error.response.status,
          error.response.data,
        );

        throw new Error(error.response.data?.message || 'Error generando QR');
      }

      throw error;
    }
  }
  static async cancelQR(qrId) {
    try {
      if (!qrId) {
        throw new Error('qrId es requerido para anular el QR');
      }

      const response = await bancoEconomicoClient.delete(
        '/api/qrsimple/cancelQR',
        {
          data: {
            qrId: String(qrId),
          },
        },
      );

      const data = response.data;

      if (data.responseCode !== 0) {
        throw new Error(
          data.message || 'Banco Económico rechazó la anulación del QR',
        );
      }

      return data;
    } catch (error) {
      if (error.response) {
        console.error(
          'Error HTTP Banco Económico cancelQR:',
          error.response.status,
          error.response.data,
        );

        throw new Error(
          error.response.data?.message ||
            'Error anulando QR en Banco Económico',
        );
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Tiempo de espera agotado al anular el QR');
      }

      throw error;
    }
  }
  static async cancelarQrCompensatorio({ qrId, transactionId, dbError }) {
    try {
      await BancoEconomicoQr.cancelQR(qrId);

      console.error(`[QR COMPENSADO] ${qrId}`);
    } catch (cancelError) {
      console.error('[QR COMPENSACIÓN FALLIDA]', {
        qrId,
        transactionId,
        databaseError: dbError.message,
        cancelError: cancelError.message,
      });

      const error = new Error('Error crítico procesando QR');

      error.statusCode = 500;

      throw error;
    }
  }
  static async statusQR(qrId) {
    try {
      if (!qrId) {
        throw new Error('qrId es requerido para consultar el estado del QR');
      }

      const response = await bancoEconomicoClient.get(
        `/api/qrsimple/v2/statusQR/${encodeURIComponent(qrId)}`,
      );

      const data = response.data;

      if (Number(data.responseCode) !== 0) {
        throw new Error(
          data.message || 'Banco Económico rechazó la consulta del QR',
        );
      }

      return data;
    } catch (error) {
      if (error.response) {
        console.error(
          'Error HTTP Banco Económico statusQR:',
          error.response.status,
          error.response.data,
        );

        throw new Error(
          error.response.data?.message || 'Error consultando el estado del QR',
        );
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Tiempo de espera agotado al consultar el QR');
      }

      throw error;
    }
  }
  static async paidQR(fecha) {
    try {
      if (!fecha) {
        throw new Error('La fecha es requerida para consultar los QR pagados');
      }

      if (!/^\d{8}$/.test(fecha)) {
        throw new Error('La fecha debe tener formato yyyyMMdd');
      }

      const response = await bancoEconomicoClient.get(
        `/api/qrsimple/v2/paidQR/${fecha}`,
      );

      const data = response.data;

      if (Number(data.responseCode) !== 0) {
        throw new Error(
          data.message || 'Banco Económico rechazó la consulta de QR pagados',
        );
      }

      return {
        paymentList: Array.isArray(data.paymentList) ? data.paymentList : [],

        responseCode: data.responseCode,

        message: data.message || '',
      };
    } catch (error) {
      if (error.response) {
        console.error(
          'Error HTTP Banco Económico paidQR:',
          error.response.status,
          error.response.data,
        );

        throw new Error(
          error.response.data?.message || 'Error consultando los QR pagados',
        );
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('Tiempo de espera agotado consultando los QR pagados');
      }

      throw error;
    }
  }
}
