import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middlewares.js';
import IndexRoutes from './routes/index.routes.js';
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

app.use('/api', IndexRoutes);

app.use(errorHandler);

export default app;
