import 'dotenv/config';

const TEST_DEFAULTS = {
  NODE_ENV: 'test',
  JWT_SECRET: 'test-jwt-secret-key',
  BANCO_ECONOMICO_BASE_URL: 'https://sandbox.banco-economico.test',
  BANCO_ECONOMICO_USER: 'test-user',
  BANCO_ECONOMICO_PASSWORD: 'test-password',
  BANCO_ECONOMICO_AES_KEY: '0123456789abcdef0123456789abcdef',
  BANCO_ECONOMICO_ACCOUNT: '1000000001',
};

for (const [key, value] of Object.entries(TEST_DEFAULTS)) {
  if (!process.env[key]) {
    process.env[key] = value;
  }
}
