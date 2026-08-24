import axios from 'axios';

import { bancoEconomicoConfig } from '../../config/bancoEconomico.config.js';

export class BancoEconomicoEncrypt {
  static async encrypt(text) {
    try {
      if (text === undefined || text === null || String(text).trim() === '') {
        throw new Error('El texto a cifrar es requerido');
      }

      const response = await axios.get(
        `${bancoEconomicoConfig.baseURL}/api/authentication/encrypt`,
        {
          params: {
            text: String(text),
            aesKey: bancoEconomicoConfig.aesKey,
          },

          timeout: 15000,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error(
          'Error Banco Económico encrypt:',
          error.response.status,
          error.response.data,
        );

        throw new Error('Banco Económico rechazó la solicitud de cifrado');
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error(
          'Tiempo de espera agotado al conectar con Banco Económico',
        );
      }

      throw error;
    }
  }
}
