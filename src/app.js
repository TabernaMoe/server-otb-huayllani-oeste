import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.middlewares.js';
import IndexRoutes from './routes/index.routes.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import SwaggerParser from '@apidevtools/swagger-parser';

const swaggerDocument = await SwaggerParser.bundle('./src/docs/swagger.yml');

const app = express();
// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API funcionando',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', IndexRoutes);

app.use(errorHandler);

export default app;
