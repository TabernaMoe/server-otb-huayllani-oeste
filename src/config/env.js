//Descomentar esta parte si no va a usar docker

// import dotenv from 'dotenv';
// if (process.env.NODE_ENV === 'development') {
//   dotenv.config();
// }

export const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'postgres',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'bd_otb',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  //partes del banco
  BANCO_ECONOMICO_BASE_URL: process.env.BANCO_ECONOMICO_BASE_URL,
  BANCO_ECONOMICO_USER: process.env.BANCO_ECONOMICO_USER,
  BANCO_ECONOMICO_PASSWORD: process.env.BANCO_ECONOMICO_PASSWORD,
  BANCO_ECONOMICO_AES_KEY: process.env.BANCO_ECONOMICO_AES_KEY,
  BANCO_ECONOMICO_ACCOUNT: process.env.BANCO_ECONOMICO_ACCOUNT,
};
