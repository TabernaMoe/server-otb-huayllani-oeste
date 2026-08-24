import axios from 'axios';

import { bancoEconomicoConfig } from '../../config/bancoEconomico.config.js';
import { BancoEconomicoEncrypt } from './bancoEconomico.encrypt.js';

export class BancoEconomicoAuth {
  static token = null;

  static authPromise = null;

  static async authenticate() {
    try {
      const encryptedPassword = await BancoEconomicoEncrypt.encrypt(
        bancoEconomicoConfig.password,
      );

      const response = await axios.post(
        `${bancoEconomicoConfig.baseURL}/api/authentication/authenticate`,
        {
          userName: bancoEconomicoConfig.userName,
          password: encryptedPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );
      const data = response.data;

      if (data.responseCode !== 0) {
        throw new Error(
          data.message || 'Banco Económico rechazó las credenciales',
        );
      }

      if (!data.token) {
        throw new Error('Banco Económico no devolvió un token');
      }

      this.token = data.token;

      return data;
    } catch (error) {
      if (error.response) {
        console.error(
          'Error HTTP Banco Económico authenticate:',
          error.response.status,
          error.response.data,
        );

        throw new Error(
          error.response.data?.message ||
            'Error de autenticación con Banco Económico',
        );
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error(
          'Tiempo de espera agotado al autenticar con Banco Económico',
        );
      }

      throw error;
    }
  }

  static async getToken() {
    // 1. Si ya tenemos token, simplemente devolverlo.
    if (this.token) {
      return this.token;
    }

    // 2. Si todavía NO existe una autenticación en curso,
    // iniciamos una.
    if (!this.authPromise) {
      this.authPromise = this.authenticate()
        .then((data) => data.token)
        .finally(() => {
          this.authPromise = null;
        });
    }

    // 3. Si ya había una autenticación en curso,
    // todas las peticiones esperan la misma Promise.
    return this.authPromise;
  }

  static clearToken() {
    this.token = null;
  }
}
