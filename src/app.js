import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

export default app;
