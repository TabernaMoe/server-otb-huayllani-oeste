import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler.middlewares.js';
import IndexRoutes from './routes/index.routes.js';
import { openApiSpec } from './docs/openapi.js';
import { BancoEconomicoEncrypt } from './integrations/bancoEconomico/bancoEconomico.encrypt.js';

const app = express();
// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando',
  });
});

app.get('/api/docs.json', (req, res) => {
  res.json(openApiSpec);
});

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'API OTB Huayllani Oeste — Swagger',
  }),
);

app.use('/api', IndexRoutes);

app.use(errorHandler);

export default app;
