import axios from 'axios';

import { bancoEconomicoConfig } from '../../config/bancoEconomico.config.js';
import { BancoEconomicoAuth } from './bancoEconomico.auth.js';

export const bancoEconomicoClient = axios.create({
  baseURL: bancoEconomicoConfig.baseURL,

  timeout: 15000,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

bancoEconomicoClient.interceptors.request.use(
  async (config) => {
    const token = await BancoEconomicoAuth.getToken();

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
