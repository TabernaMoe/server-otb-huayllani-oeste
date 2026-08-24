const requiredEnv = [
  'BANCO_ECONOMICO_BASE_URL',
  'BANCO_ECONOMICO_USER',
  'BANCO_ECONOMICO_PASSWORD',
  'BANCO_ECONOMICO_AES_KEY',
  'BANCO_ECONOMICO_ACCOUNT',
];

for (const envName of requiredEnv) {
  if (!process.env[envName]) {
    throw new Error(
      `La variable de entorno ${envName} es requerida para Banco Económico`,
    );
  }
}

export const bancoEconomicoConfig = Object.freeze({
  baseURL: process.env.BANCO_ECONOMICO_BASE_URL.replace(/\/+$/, ''),

  userName: process.env.BANCO_ECONOMICO_USER,

  password: process.env.BANCO_ECONOMICO_PASSWORD,

  aesKey: process.env.BANCO_ECONOMICO_AES_KEY,

  accountCredit: process.env.BANCO_ECONOMICO_ACCOUNT,
});
