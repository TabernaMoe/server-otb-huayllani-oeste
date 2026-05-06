import { Sequelize } from 'sequelize';
import { env } from './env.js';

const isProduction = env.nodeEnv === 'production';

export const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: Number(env.db.port),
    dialect: 'postgres',

    logging: isProduction ? false : console.log,

    pool: {
      max: isProduction ? 20 : 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);
